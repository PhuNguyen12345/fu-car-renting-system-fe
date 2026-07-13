import { Calendar, Phone, Clock, FileText, RefreshCcw, Loader2, CreditCard } from "lucide-react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { rentingService } from "@/services/rentingService"
import { carService } from "@/services/carService"
import { format, differenceInDays } from "date-fns"
import { formatVND } from "@/lib/utils"

export function UserBookingsTab() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [currentPage, statusFilter]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      // 1. Fetch rentals from backend
      const res = await rentingService.getMyRentals(currentPage - 1, 10);
      let data = res.content;

      // 2. Local filtering (since backend doesn't support status param yet)
      if (statusFilter !== 'ALL') {
        const filterMap = {
          'PENDING': ['INITIATED', 'CONFIRMED'],
          'ACTIVE': ['APPROVED', 'ACTIVE'],
          'COMPLETED': ['COMPLETED'],
          'CANCELLED': ['CANCELLED_DUE_TO_CUSTOMER', 'CANCELLED_DUE_TO_CAR']
        };
        const allowedStatuses = filterMap[statusFilter] || [];
        data = data.filter(b => allowedStatuses.includes(b.bookingStatus));
      }

      // 3. Enrich with car details
      const enrichedBookings = await Promise.all(
        data.map(async (booking) => {
          try {
            const carDetail = await carService.getPublicCarDetail(booking.carId);
            const days = differenceInDays(new Date(booking.endDate), new Date(booking.startDate)) || 1;
            
            return {
              ...booking,
              carName: carDetail.name,
              image: carDetail.images?.[0]?.url || "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop",
              days: days
            };
          } catch (err) {
            console.error("Lỗi khi tải thông tin xe cho booking", booking.id);
            return {
              ...booking,
              carName: "Xe không xác định",
              image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop",
              days: differenceInDays(new Date(booking.endDate), new Date(booking.startDate)) || 1
            };
          }
        })
      );

      setBookings(enrichedBookings);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error("Lỗi khi tải danh sách đơn thuê:", err);
      alert("Không thể tải danh sách đơn thuê");
    } finally {
      setLoading(false);
    }
  };

  const getStatusDisplay = (status) => {
    switch(status) {
      case 'INITIATED': return 'Khởi tạo';
      case 'CONFIRMED': return 'Đã xác nhận cọc';
      case 'APPROVED': return 'Đã duyệt';
      case 'ACTIVE': return 'Đang chạy';
      case 'COMPLETED': return 'Đã hoàn thành';
      case 'CANCELLED_DUE_TO_CUSTOMER': return 'Đã hủy (Bởi bạn)';
      case 'CANCELLED_DUE_TO_CAR': return 'Đã hủy (Hệ thống)';
      default: return status;
    }
  };

  const getStatusStyle = (status) => {
    if (['INITIATED', 'CONFIRMED'].includes(status)) {
      return 'bg-yellow-50 text-yellow-700 border-yellow-200'
    }
    if (['COMPLETED'].includes(status)) {
      return 'bg-green-50 text-green-700 border-green-200'
    }
    if (['APPROVED', 'ACTIVE'].includes(status)) {
      return 'bg-blue-50 text-blue-700 border-blue-200'
    }
    if (['CANCELLED_DUE_TO_CUSTOMER', 'CANCELLED_DUE_TO_CAR'].includes(status)) {
      return 'bg-red-50 text-red-700 border-red-200'
    }
    return 'bg-slate-50 text-slate-700 border-slate-200'
  };

  const handleCancelOrder = async (orderId) => {
    try {
      await rentingService.cancelBooking(orderId);
      alert("Hủy đơn thuê xe thành công!");
      fetchBookings(); // Refresh danh sách
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Không thể hủy đơn thuê.");
    }
  };

  const handleSyncPayment = async (bookingId) => {
    setIsSyncing(true);
    try {
      await rentingService.syncPayment(bookingId);
      alert("Đã cập nhật trạng thái thanh toán mới nhất!");
      fetchBookings();
    } catch (err) {
      alert("Lỗi đồng bộ: " + (err.response?.data?.message || err.message));
    } finally {
      setIsSyncing(false);
    }
  }

  const handleRetryPayment = async (bookingId) => {
    try {
      const payosRes = await rentingService.createPaymentLink(bookingId);
      if (payosRes.data && payosRes.data.checkoutUrl) {
        window.location.href = payosRes.data.checkoutUrl;
      } else {
        alert('Không thể tạo link thanh toán PayOS');
      }
    } catch (err) {
      alert("Lỗi khi tạo link thanh toán: " + (err.response?.data?.message || err.message));
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Lịch sử thuê xe</h2>
        <p className="text-slate-500">Xem và quản lý các chuyến đi của bạn.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {[
          { key: 'ALL', label: 'Tất cả' },
          { key: 'PENDING', label: 'Đang chờ duyệt' },
          { key: 'ACTIVE', label: 'Đang chạy' },
          { key: 'COMPLETED', label: 'Đã hoàn thành' },
          { key: 'CANCELLED', label: 'Đã hủy' }
        ].map((status) => (
          <button
            key={status.key}
            onClick={() => {
              setStatusFilter(status.key);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
              statusFilter === status.key
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {status.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {loading ? (
          <div className="text-center py-10 text-gray-500">Đang tải danh sách...</div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <p className="text-slate-500">Chưa có chuyến đi nào phù hợp với bộ lọc.</p>
          </div>
        ) : bookings.map((booking) => (
          <Dialog key={booking.id}>
            <DialogTrigger asChild>
              <div className="flex flex-col md:flex-row gap-4 p-4 border border-slate-200 rounded-xl items-center hover:shadow-md transition-all hover:-translate-y-0.5 bg-white cursor-pointer group">
                <img 
                  src={booking.image} 
                  alt={booking.carName} 
                  className="w-full md:w-32 h-24 object-cover rounded-lg group-hover:opacity-90 transition-opacity"
                />
                
                <div className="flex flex-col flex-1 w-full text-center md:text-left gap-1.5">
                  <h3 className="font-bold text-slate-900 text-lg group-hover:text-fpt-blue transition-colors">{booking.carName}</h3>
                  <div className="flex items-center justify-center md:justify-start text-sm text-slate-500 gap-1.5 font-medium">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(booking.startDate), "dd/MM/yyyy")} - {format(new Date(booking.endDate), "dd/MM/yyyy")}
                  </div>
                  <p className="text-fpt-blue font-bold mt-1">{formatVND(booking.totalAmount)}</p>
                </div>

                <div className="w-full md:w-auto flex justify-center md:justify-end md:ml-auto shrink-0 mt-2 md:mt-0">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusStyle(booking.bookingStatus)}`}>
                    {getStatusDisplay(booking.bookingStatus)}
                  </span>
                </div>
              </div>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px] bg-white rounded-3xl p-0 overflow-hidden border-0 shadow-2xl">
              <div className="p-6 pb-2">
                <DialogHeader className="mb-6">
                  <div className="flex justify-between items-start">
                    <div className="text-left">
                      <DialogTitle className="text-xl font-bold text-slate-900">Chi tiết đơn thuê</DialogTitle>
                      <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                        <FileText className="w-4 h-4" />
                        Mã đơn: <span className="font-semibold text-slate-700">#{booking.id}</span>
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(booking.bookingStatus)}`}>
                      {getStatusDisplay(booking.bookingStatus)}
                    </span>
                  </div>
                </DialogHeader>

                {/* Car Info Box */}
                <div className="flex gap-4 items-center bg-slate-50 border border-slate-100 p-4 rounded-xl mb-6">
                  <img src={booking.image} alt={booking.carName} className="w-20 h-20 object-cover rounded-lg shadow-sm" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg leading-tight mb-1">{booking.carName}</h4>
                    <p className="text-sm text-slate-500 font-medium">{booking.days} ngày thuê</p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="mb-8 px-2">
                  <div className="flex gap-4 items-start relative z-10 pb-8">
                    <div className="relative flex flex-col items-center shrink-0">
                      <div className="w-7 h-7 rounded-full bg-blue-100 text-fpt-blue flex items-center justify-center border-4 border-white shadow-sm relative z-10">
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                      <div className="absolute top-7 bottom-[-32px] left-1/2 -translate-x-1/2 w-0.5 bg-slate-200"></div>
                    </div>
                    <div className="flex flex-col gap-1 mt-0.5">
                      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Nhận xe</p>
                      <p className="text-sm font-bold text-slate-900">{format(new Date(booking.startDate), "HH:mm - dd/MM/yyyy")}</p>
                      <p className="text-sm text-slate-700 leading-tight">Địa chỉ: {booking.pickupLocation}</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start relative z-10">
                    <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center shrink-0 border-4 border-white shadow-sm">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col gap-1 mt-0.5">
                      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Trả xe</p>
                      <p className="text-sm font-bold text-slate-900">{format(new Date(booking.endDate), "HH:mm - dd/MM/yyyy")}</p>
                      <p className="text-sm text-slate-700 leading-tight">Địa chỉ: {booking.dropoffLocation}</p>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="border-t-2 border-dashed border-slate-200 pt-6 pb-4 space-y-3">
                  <div className="flex justify-between items-center text-sm font-medium text-slate-600">
                    <span>Giá thuê ({booking.days} ngày)</span>
                    <span>{formatVND(booking.totalAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-medium text-slate-600">
                    <span>Đã thanh toán (Cọc / Toàn bộ)</span>
                    <span className="text-green-600">{formatVND(booking.paymentStatus === 'FULLY_PAID' ? booking.totalAmount : (booking.paymentStatus !== 'UNPAID' ? booking.depositAmount : 0))}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-medium text-slate-600">
                    <span>Hình thức</span>
                    <span className="font-bold">{booking.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-slate-100 mt-2">
                    <span className="font-bold text-slate-900 text-base">Tổng giá trị đơn</span>
                    <span className="font-bold text-xl text-fpt-blue">{formatVND(booking.totalAmount)}</span>
                  </div>

                  {booking.paymentStatus === 'UNPAID' && booking.paymentMethod !== 'CASH' && (
                    <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-orange-800">Chưa thanh toán trực tuyến</p>
                        <p className="text-xs text-orange-600 mt-1">Nếu bạn đã chuyển khoản, vui lòng bấm Cập nhật.</p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <Button 
                          onClick={() => handleRetryPayment(booking.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm w-full sm:w-auto"
                        >
                          <CreditCard className="w-4 h-4 mr-2" />
                          Thanh toán ngay
                        </Button>
                        <Button 
                          onClick={() => handleSyncPayment(booking.id)}
                          disabled={isSyncing}
                          className="bg-orange-500 hover:bg-orange-600 text-white shadow-sm w-full sm:w-auto"
                        >
                          {isSyncing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCcw className="w-4 h-4 mr-2" />}
                          Cập nhật
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
              
              {/* Footer */}
              <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-between items-center w-full mt-2">
                <div>
                  {(booking.bookingStatus === 'INITIATED' || booking.bookingStatus === 'CONFIRMED') && (
                    <button
                      onClick={() => {
                        if (window.confirm('Bạn có chắc chắn muốn hủy yêu cầu thuê xe này không?')) {
                          handleCancelOrder(booking.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 font-medium px-4 py-2 rounded-md transition-colors"
                    >
                      Hủy đơn
                    </button>
                  )}
                </div>
                <Button variant="outline" className="h-11 px-6 rounded-xl border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-colors">
                  <Phone className="w-4 h-4 mr-2" />
                  Liên hệ hỗ trợ
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>

      <div className="flex justify-center items-center space-x-2 mt-6">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Trang trước
        </button>
        <span className="text-sm font-medium text-gray-700">
          Trang {currentPage} / {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Trang sau
        </button>
      </div>
    </div>
  )
}
