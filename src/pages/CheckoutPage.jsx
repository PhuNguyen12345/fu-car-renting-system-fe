import { useState, useEffect } from "react"
import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { carService } from "@/services/carService"
import { customerService } from "@/services/customerService"
import { rentingService } from "@/services/rentingService"
import { Button } from "@/components/ui/button"
import { ChevronLeft, CheckCircle2, CreditCard, Wallet, Banknote, ShieldCheck, QrCode, Timer, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

export function CheckoutPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  const fromStr = searchParams.get('from')
  const toStr = searchParams.get('to')
  
  const from = fromStr ? new Date(fromStr) : null;
  const to = toStr ? new Date(toStr) : null;
  
  const days = (from && to) ? Math.max(1, Math.ceil((to.getTime() - from.getTime()) / (1000 * 3600 * 24))) : 0;

  const [car, setCar] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [pickupLocation, setPickupLocation] = useState('')
  const [dropoffLocation, setDropoffLocation] = useState('')
  const [customerNote, setCustomerNote] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('VNPAY')
  
  const [isQrModalOpen, setIsQrModalOpen] = useState(false)
  const [createdBookingId, setCreatedBookingId] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carData, userData] = await Promise.all([
          carService.getPublicCarDetail(id),
          customerService.getMyProfile()
        ])
        setCar(carData)
        setCurrentUser(userData)
        setPickupLocation(carData.locationName || 'Tại cửa hàng')
        setDropoffLocation(carData.locationName || 'Tại cửa hàng')
      } catch (error) {
        console.error("Error fetching data:", error)
        alert("Lỗi khi tải thông tin. Vui lòng thử lại sau.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="bg-[#F8F9FA] min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!car || !currentUser) return <div className="p-8 text-center">Không tìm thấy thông tin xe hoặc người dùng!</div>

  const rentCost = car.pricePerDay * days;
  const serviceFee = rentCost * 0.1;
  const totalCost = rentCost + serviceFee;
  
  const isFullPayment = paymentMethod !== 'CASH';
  const amountToPay = isFullPayment ? totalCost : Math.round(totalCost * 0.3);
  const remainingAmount = totalCost - amountToPay;

  const handleConfirmBooking = async () => {
    if (!from || !to) {
      alert("Vui lòng chọn ngày giờ thuê hợp lệ.");
      return;
    }
    if (!currentUser.fullName || !currentUser.phone || !currentUser.cccd || !currentUser.gplxNumber) {
      alert("Hồ sơ cá nhân chưa đầy đủ (Tên, SĐT, CCCD, GPLX). Vui lòng cập nhật hồ sơ trước khi thuê xe.");
      return;
    }

    setIsSubmitting(true)
    try {
      const payload = {
        carId: id,
        startDate: format(from, "yyyy-MM-dd'T'HH:mm:ss"),
        endDate: format(to, "yyyy-MM-dd'T'HH:mm:ss"),
        pickupLocation: pickupLocation || 'Tại cửa hàng',
        dropoffLocation: dropoffLocation || 'Tại cửa hàng',
        renterName: currentUser.fullName,
        renterPhone: currentUser.phone,
        renterCccd: currentUser.cccd,
        renterLicense: currentUser.gplxNumber,
        customerNote: customerNote || '',
        paymentMethod
      }
      
      const bookingRes = await rentingService.createBooking(payload)
      setCreatedBookingId(bookingRes.id)
      
      if (paymentMethod === 'TRANSFER') {
        const payosRes = await rentingService.createPaymentLink(bookingRes.id)
        if (payosRes.data && payosRes.data.checkoutUrl) {
          window.location.href = payosRes.data.checkoutUrl;
        } else {
          alert('Không thể tạo link thanh toán PayOS');
        }
      } else {
        // CASH or other mocks
        setIsQrModalOpen(true)
      }
    } catch (err) {
      console.error(err)
      alert("Đặt xe thất bại: " + (err.response?.data?.message || err.message))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleMockSuccess = async () => {
    if (!createdBookingId) return;
    
    try {
      if (isFullPayment) {
        await rentingService.payFull(createdBookingId);
      } else {
        await rentingService.payDeposit(createdBookingId);
      }
      setIsQrModalOpen(false)
      navigate('/booking-success')
    } catch (err) {
      console.error(err)
      alert("Thanh toán thất bại: " + (err.response?.data?.message || err.message))
    }
  }

  const getPaymentName = () => {
    if (paymentMethod === 'VNPAY') return 'VNPay'
    if (paymentMethod === 'MOMO') return 'Ví MoMo'
    if (paymentMethod === 'TRANSFER') return 'Chuyển khoản'
    if (paymentMethod === 'CASH') return 'Tiền mặt (Cọc 30%)'
    return ''
  }

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-3">
        <div className="container mx-auto px-4">
          <button onClick={() => navigate(-1)} className="inline-flex items-center text-sm font-semibold text-gray-600 hover:text-fpt-blue hover:bg-fpt-blue/10 px-4 py-2 rounded-xl transition-all">
            <ChevronLeft className="w-4 h-4 mr-1" /> Quay lại chi tiết xe
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-8 pb-16">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Xác nhận đặt xe</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column (User Info & Payment) */}
          <div className="w-full lg:w-[60%] space-y-8">
            {/* Section 1: User Info */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                Thông tin người thuê
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Họ và tên</label>
                  <div className="relative">
                    <input type="text" readOnly value={currentUser.fullName || ''} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 font-medium focus:outline-none" />
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 absolute right-4 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại</label>
                  <div className="relative">
                    <input type="text" readOnly value={currentUser.phone || ''} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 font-medium focus:outline-none" />
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 absolute right-4 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Căn cước công dân</label>
                    <div className="relative">
                      <input type="text" readOnly value={currentUser.cccd || ''} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 font-medium focus:outline-none" />
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 absolute right-4 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Số Giấy phép lái xe (GPLX)</label>
                    <div className="relative">
                      <input type="text" readOnly value={currentUser.gplxNumber || ''} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 font-medium focus:outline-none" />
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 absolute right-4 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Địa điểm nhận xe *</label>
                    <input 
                      type="text" 
                      value={pickupLocation} 
                      onChange={e => setPickupLocation(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 font-medium focus:outline-none focus:border-fpt-blue focus:ring-1 focus:ring-fpt-blue transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Địa điểm trả xe *</label>
                    <input 
                      type="text" 
                      value={dropoffLocation} 
                      onChange={e => setDropoffLocation(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 font-medium focus:outline-none focus:border-fpt-blue focus:ring-1 focus:ring-fpt-blue transition-all" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 mt-2">Ghi chú (Tùy chọn)</label>
                  <textarea 
                    rows="3" 
                    placeholder="Ghi chú thêm cho chủ xe..." 
                    value={customerNote}
                    onChange={e => setCustomerNote(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:border-fpt-blue focus:ring-1 focus:ring-fpt-blue transition-colors"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Section 2: Payment Methods */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Phương thức thanh toán</h3>
              <div className="space-y-3">
                
                <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'VNPAY' ? 'border-fpt-blue bg-blue-50/50' : 'border-gray-100 hover:border-gray-200 bg-white'}`} onClick={() => setPaymentMethod('VNPAY')}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-gray-800">Chuyển khoản VNPay</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'VNPAY' ? 'border-fpt-blue' : 'border-gray-300'}`}>
                    {paymentMethod === 'VNPAY' && <div className="w-2.5 h-2.5 rounded-full bg-fpt-blue" />}
                  </div>
                </label>
                
                <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'MOMO' ? 'border-fpt-blue bg-blue-50/50' : 'border-gray-100 hover:border-gray-200 bg-white'}`} onClick={() => setPaymentMethod('MOMO')}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-gray-800">Ví MoMo</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'MOMO' ? 'border-fpt-blue' : 'border-gray-300'}`}>
                    {paymentMethod === 'MOMO' && <div className="w-2.5 h-2.5 rounded-full bg-fpt-blue" />}
                  </div>
                </label>
                
                <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'TRANSFER' ? 'border-fpt-blue bg-blue-50/50' : 'border-gray-100 hover:border-gray-200 bg-white'}`} onClick={() => setPaymentMethod('TRANSFER')}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-gray-800">Chuyển khoản trực tiếp</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'TRANSFER' ? 'border-fpt-blue' : 'border-gray-300'}`}>
                    {paymentMethod === 'TRANSFER' && <div className="w-2.5 h-2.5 rounded-full bg-fpt-blue" />}
                  </div>
                </label>

                <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'CASH' ? 'border-fpt-blue bg-blue-50/50' : 'border-gray-100 hover:border-gray-200 bg-white'}`} onClick={() => setPaymentMethod('CASH')}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-800">Tiền mặt</span>
                      <span className="text-xs text-gray-500">Thanh toán cọc 30%</span>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'CASH' ? 'border-fpt-blue' : 'border-gray-300'}`}>
                    {paymentMethod === 'CASH' && <div className="w-2.5 h-2.5 rounded-full bg-fpt-blue" />}
                  </div>
                </label>

              </div>
            </div>
          </div>

          {/* Right Column (Order Summary) */}
          <div className="w-full lg:w-[40%]">
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Chi tiết thanh toán</h3>
              
              <div className="flex gap-4 mb-6 pb-6 border-b border-gray-100">
                <img 
                  src={car.images && car.images.length > 0 ? (typeof car.images[0] === 'string' ? car.images[0] : car.images[0].url) : 'https://placehold.co/100x100?text=Car'} 
                  className="w-24 h-24 object-cover rounded-xl shadow-sm" 
                  alt={car.name} 
                />
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-lg mb-1">{car.name}</h4>
                  <p className="text-sm text-gray-500 font-medium mb-1">{car.category || car.type}</p>
                  <p className="text-sm font-semibold text-fpt-blue">{car.pricePerDay?.toLocaleString('vi-VN')} ₫ / ngày</p>
                </div>
              </div>

              <div className="mb-6 pb-6 border-b border-gray-100">
                <div className="grid grid-cols-2 gap-4 text-sm font-medium">
                  <div>
                    <p className="text-gray-500 mb-1">Nhận xe</p>
                    <p className="text-gray-900 font-semibold">{from ? format(from, 'HH:mm - dd/MM/yyyy') : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Trả xe</p>
                    <p className="text-gray-900 font-semibold">{to ? format(to, 'HH:mm - dd/MM/yyyy') : 'N/A'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center text-sm text-gray-600 font-medium">
                  <span>Giá thuê ({days} ngày)</span>
                  <span>{rentCost.toLocaleString('vi-VN')} ₫</span>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600 font-medium">
                  <span>Phí dịch vụ (10%)</span>
                  <span>{serviceFee.toLocaleString('vi-VN')} ₫</span>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5 mb-6 space-y-4">
                <div className="flex justify-between items-center text-gray-600">
                  <span>Tổng cộng</span>
                  <span className="font-medium">{totalCost.toLocaleString('vi-VN')} ₫</span>
                </div>
                <div className="flex justify-between items-center font-bold border-t border-gray-200 pt-3">
                  <span className="text-gray-800">{isFullPayment ? 'Thanh toán toàn bộ' : 'Thanh toán cọc (30%)'}</span>
                  <span className="text-blue-600 text-lg">{amountToPay.toLocaleString('vi-VN')} ₫</span>
                </div>
                {!isFullPayment && (
                  <div className="flex justify-between items-center text-sm text-gray-500 pt-3 border-t border-gray-200">
                    <span>Thanh toán nốt khi nhận xe</span>
                    <span>{remainingAmount.toLocaleString('vi-VN')} ₫</span>
                  </div>
                )}
              </div>

              <Button 
                onClick={handleConfirmBooking} 
                disabled={isSubmitting || !from || !to}
                className="w-full h-14 rounded-xl text-lg font-bold bg-fpt-blue hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-1 flex items-center justify-center disabled:opacity-70 disabled:hover:translate-y-0"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                Thanh toán {isFullPayment ? 'toàn bộ' : 'cọc'} {amountToPay.toLocaleString('vi-VN')} ₫
              </Button>
            </div>
          </div>

        </div>
      </div>

      {/* QR Payment Modal */}
      <Dialog open={isQrModalOpen} onOpenChange={setIsQrModalOpen}>
        <DialogContent className="sm:max-w-sm bg-white rounded-3xl p-6 border-0 shadow-2xl">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-bold text-center text-gray-900">
              Thanh toán qua {getPaymentName()}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center">
            {paymentMethod !== 'CASH' ? (
              <>
                <div className="w-48 h-48 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-200 mb-6">
                  <QrCode className="w-16 h-16 text-slate-300" />
                </div>
                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-full font-medium text-sm mb-6">
                  <Timer className="w-4 h-4" />
                  Mã QR sẽ hết hạn sau 14:59
                </div>
              </>
            ) : (
              <div className="mb-6 text-center text-gray-600 font-medium">
                Vui lòng chuẩn bị số tiền mặt tương ứng để thanh toán cọc khi nhận xe hoặc làm thủ tục.
              </div>
            )}
            
            <p className="text-sm text-gray-500 font-medium mb-1">Số tiền cần thanh toán</p>
            <p className="text-3xl font-bold text-fpt-blue mb-8">{amountToPay.toLocaleString('vi-VN')} ₫</p>
            
            <Button onClick={handleMockSuccess} className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-md transition-all hover:-translate-y-0.5">
              Mô phỏng thanh toán (Demo)
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
