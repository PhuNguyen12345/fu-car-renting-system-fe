import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { mockCars } from "@/data/mockCars"
import { Button } from "@/components/ui/button"
import { ChevronLeft, CheckCircle2, CreditCard, Wallet, Banknote, ShieldCheck, QrCode, Timer } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const currentUser = { name: 'Nguyễn An Phú', phone: '0987654321', cccd: '001202001234' }

export function CheckoutPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const car = mockCars.find(c => c.id === parseInt(id))
  
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [isQrModalOpen, setIsQrModalOpen] = useState(false)

  if (!car) return <div className="p-8 text-center">Không tìm thấy xe!</div>

  const days = 3;
  const rentCost = car.pricePerDay * days;
  const serviceFee = rentCost * 0.1;
  const totalCost = rentCost + serviceFee;

  const handleConfirmBooking = () => {
    if (paymentMethod === 'cod') {
      navigate('/booking-success')
    } else {
      setIsQrModalOpen(true)
    }
  }

  const handleMockSuccess = () => {
    setIsQrModalOpen(false)
    navigate('/booking-success')
  }

  const getPaymentName = () => {
    if (paymentMethod === 'vnpay') return 'VNPay'
    if (paymentMethod === 'momo') return 'Ví MoMo'
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
                    <input type="text" readOnly value={currentUser.name} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 font-medium focus:outline-none" />
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 absolute right-4 top-1/2 -translate-y-1/2" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại</label>
                    <div className="relative">
                      <input type="text" readOnly value={currentUser.phone} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 font-medium focus:outline-none" />
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 absolute right-4 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Căn cước công dân</label>
                    <div className="relative">
                      <input type="text" readOnly value={currentUser.cccd} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-700 font-medium focus:outline-none" />
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 absolute right-4 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 mt-2">Ghi chú (Tùy chọn)</label>
                  <textarea rows="3" placeholder="Ghi chú thêm cho chủ xe..." className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-700 focus:outline-none focus:border-fpt-blue transition-colors"></textarea>
                </div>
              </div>
            </div>

            {/* Section 2: Payment Methods */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Phương thức thanh toán</h3>
              <div className="space-y-3">
                
                <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'vnpay' ? 'border-fpt-blue bg-blue-50/50' : 'border-gray-100 hover:border-gray-200 bg-white'}`} onClick={() => setPaymentMethod('vnpay')}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-gray-800">Chuyển khoản VNPay</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'vnpay' ? 'border-fpt-blue' : 'border-gray-300'}`}>
                    {paymentMethod === 'vnpay' && <div className="w-2.5 h-2.5 rounded-full bg-fpt-blue" />}
                  </div>
                </label>
                
                <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'momo' ? 'border-fpt-blue bg-blue-50/50' : 'border-gray-100 hover:border-gray-200 bg-white'}`} onClick={() => setPaymentMethod('momo')}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-gray-800">Ví MoMo</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'momo' ? 'border-fpt-blue' : 'border-gray-300'}`}>
                    {paymentMethod === 'momo' && <div className="w-2.5 h-2.5 rounded-full bg-fpt-blue" />}
                  </div>
                </label>

                <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-fpt-blue bg-blue-50/50' : 'border-gray-100 hover:border-gray-200 bg-white'}`} onClick={() => setPaymentMethod('cod')}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <Banknote className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-gray-800">Thanh toán khi nhận xe</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-fpt-blue' : 'border-gray-300'}`}>
                    {paymentMethod === 'cod' && <div className="w-2.5 h-2.5 rounded-full bg-fpt-blue" />}
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
                <img src={car.image || (car.images && car.images[0])} className="w-24 h-24 object-cover rounded-xl shadow-sm" alt={car.name} />
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-lg mb-1">{car.name}</h4>
                  <p className="text-sm text-gray-500 font-medium mb-1">{car.category}</p>
                  <p className="text-sm font-semibold text-fpt-blue">{car.pricePerDay.toLocaleString('vi-VN')} ₫ / ngày</p>
                </div>
              </div>

              <div className="mb-6 pb-6 border-b border-gray-100">
                <div className="grid grid-cols-2 gap-4 text-sm font-medium">
                  <div>
                    <p className="text-gray-500 mb-1">Nhận xe</p>
                    <p className="text-gray-900 font-semibold">10:00 - 15/07/2026</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Trả xe</p>
                    <p className="text-gray-900 font-semibold">10:00 - 18/07/2026</p>
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

              <div className="bg-gray-50 rounded-2xl p-5 mb-6">
                <div className="flex justify-between items-center font-bold text-lg">
                  <span className="text-gray-900">Tổng cộng</span>
                  <span className="text-fpt-blue">{totalCost.toLocaleString('vi-VN')} ₫</span>
                </div>
              </div>

              <Button onClick={handleConfirmBooking} className="w-full h-14 rounded-xl text-lg font-bold bg-fpt-blue hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
                Xác nhận Đặt xe
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
            <div className="w-48 h-48 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-200 mb-6">
              <QrCode className="w-16 h-16 text-slate-300" />
            </div>
            
            <p className="text-sm text-gray-500 font-medium mb-1">Số tiền cần thanh toán</p>
            <p className="text-3xl font-bold text-fpt-blue mb-6">{totalCost.toLocaleString('vi-VN')} ₫</p>
            
            <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-full font-medium text-sm mb-8">
              <Timer className="w-4 h-4" />
              Mã QR sẽ hết hạn sau 14:59
            </div>

            <Button onClick={handleMockSuccess} className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl shadow-md transition-all hover:-translate-y-0.5">
              Mô phỏng thanh toán (Demo)
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
