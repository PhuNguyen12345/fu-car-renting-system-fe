import { Calendar, Phone, Clock, FileText } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function UserBookingsTab() {
  const mockBookings = [
    {
      id: 'FPT-8899',
      carName: 'Mercedes-Benz GLE',
      date: '15/07/2026 - 18/07/2026',
      pickupTime: '10:00 - 15/07/2026',
      returnTime: '10:00 - 18/07/2026',
      days: 3,
      rentCost: '10.500.000',
      serviceFee: '1.050.000',
      total: '11.550.000 đ',
      status: 'Đang chờ duyệt',
      image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?q=80&w=2115&auto=format&fit=crop'
    },
    {
      id: 'FPT-8800',
      carName: 'Tesla Model S',
      date: '01/06/2026 - 03/06/2026',
      pickupTime: '10:00 - 01/06/2026',
      returnTime: '10:00 - 03/06/2026',
      days: 2,
      rentCost: '6.000.000',
      serviceFee: '600.000',
      total: '6.600.000 đ',
      status: 'Đã hoàn thành',
      image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070&auto=format&fit=crop'
    }
  ]

  const getStatusStyle = (status) => {
    if (status === 'Đang chờ duyệt') {
      return 'bg-yellow-50 text-yellow-700 border-yellow-200'
    }
    if (status === 'Đã hoàn thành') {
      return 'bg-green-50 text-green-700 border-green-200'
    }
    return 'bg-slate-50 text-slate-700 border-slate-200'
  }

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Lịch sử thuê xe</h2>
        <p className="text-slate-500">Xem và quản lý các chuyến đi của bạn.</p>
      </div>

      <div className="flex flex-col gap-4">
        {mockBookings.map((booking) => (
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
                    {booking.date}
                  </div>
                  <p className="text-fpt-blue font-bold mt-1">{booking.total}</p>
                </div>

                <div className="w-full md:w-auto flex justify-center md:justify-end md:ml-auto shrink-0 mt-2 md:mt-0">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusStyle(booking.status)}`}>
                    {booking.status}
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
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(booking.status)}`}>
                      {booking.status}
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
                      <p className="text-sm font-bold text-slate-900">{booking.pickupTime}</p>
                      <p className="text-sm text-slate-500 mt-1">Hình thức: Tự đến lấy</p>
                      <p className="text-sm text-slate-700 leading-tight">Địa chỉ: 123 Đường Láng, Đống Đa, Hà Nội</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start relative z-10">
                    <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center shrink-0 border-4 border-white shadow-sm">
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col gap-1 mt-0.5">
                      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Trả xe</p>
                      <p className="text-sm font-bold text-slate-900">{booking.returnTime}</p>
                      <p className="text-sm text-slate-500 mt-1">Hình thức: Tự đến lấy</p>
                      <p className="text-sm text-slate-700 leading-tight">Địa chỉ: 123 Đường Láng, Đống Đa, Hà Nội</p>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="border-t-2 border-dashed border-slate-200 pt-6 pb-4 space-y-3">
                  <div className="flex justify-between items-center text-sm font-medium text-slate-600">
                    <span>Giá thuê ({booking.days} ngày)</span>
                    <span>{booking.rentCost} đ</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-medium text-slate-600">
                    <span>Phí dịch vụ (10%)</span>
                    <span>{booking.serviceFee} đ</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-slate-100 mt-2">
                    <span className="font-bold text-slate-900 text-base">Tổng thanh toán</span>
                    <span className="font-bold text-xl text-fpt-blue">{booking.total}</span>
                  </div>
                </div>

              </div>
              
              {/* Footer */}
              <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex justify-end gap-3 mt-2">
                <Button variant="outline" className="h-11 px-6 rounded-xl border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-colors">
                  <Phone className="w-4 h-4 mr-2" />
                  Liên hệ hỗ trợ
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        ))}
      </div>
    </div>
  )
}
