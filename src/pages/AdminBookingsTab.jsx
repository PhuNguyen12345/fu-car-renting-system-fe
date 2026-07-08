import { Search, Calendar, CheckCircle, XCircle, Eye, EyeOff, X, User, Car, FileText, MapPin, MessageSquare } from "lucide-react"
import { useState } from "react"
import { createPortal } from "react-dom"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const mockBookings = [
  {
    id: '#FPT-1001',
    customer: 'Nguyễn Văn A',
    phone: '0987654321',
    cccd: '031098123899',
    car: 'Mercedes-Benz GLE',
    dates: '15/07/2026 - 18/07/2026',
    pickup: '123 Đường Láng, HN',
    dropoff: 'Tự đem trả tại bãi',
    paymentMethod: 'Chuyển khoản',
    deposit: '5.000.000 đ',
    remaining: '6.550.000 đ',
    total: '11.550.000 đ',
    status: 'pending',
    note: 'Khách quen, cần giao xe đúng giờ'
  },
  {
    id: '#FPT-1002',
    customer: 'Trần Thị B',
    phone: '0912345678',
    cccd: '031099222333',
    car: 'VinFast VF8',
    dates: '10/07/2026 - 12/07/2026',
    pickup: 'Khu công nghệ cao Hòa Lạc',
    dropoff: 'Tự đem trả tại bãi',
    paymentMethod: 'Chuyển khoản',
    deposit: '1.000.000 đ',
    remaining: '2.000.000 đ',
    total: '3.000.000 đ',
    status: 'active',
    note: ''
  },
  {
    id: '#FPT-1003',
    customer: 'Lê Văn C',
    phone: '0909090909',
    cccd: '001088444555',
    car: 'Tesla Model S',
    dates: '01/07/2026 - 03/07/2026',
    pickup: 'Sân bay Nội Bài',
    dropoff: 'Sân bay Nội Bài',
    paymentMethod: 'Thẻ tín dụng',
    deposit: '3.000.000 đ',
    remaining: '3.600.000 đ',
    total: '6.600.000 đ',
    status: 'completed',
    note: 'Khách hàng VIP'
  },
  {
    id: '#FPT-1004',
    customer: 'Phạm Thị D',
    phone: '0988888888',
    cccd: '034091888999',
    car: 'Mazda 3',
    dates: '05/07/2026 - 06/07/2026',
    pickup: '123 Đường Láng, HN',
    dropoff: '123 Đường Láng, HN',
    paymentMethod: 'Tiền mặt',
    deposit: '0 đ',
    remaining: '1.200.000 đ',
    total: '1.200.000 đ',
    status: 'cancelled',
    note: 'Khách hủy do bận việc đột xuất'
  }
]

const getStatusBadge = (status) => {
  switch (status) {
    case 'pending':
      return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 border border-yellow-200 shadow-sm">Chờ duyệt</span>
    case 'active':
      return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200 shadow-sm">Đang chạy</span>
    case 'completed':
      return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200 shadow-sm">Hoàn thành</span>
    case 'cancelled':
      return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200 shadow-sm">Đã hủy</span>
    default:
      return null
  }
}

export function AdminBookingsTab() {
  const [viewBooking, setViewBooking] = useState(null)
  const [showId, setShowId] = useState(false)

  const handleCloseModal = () => {
    setViewBooking(null)
    setShowId(false)
  }

  return (
    <div className="flex flex-col gap-2 p-2">
      {/* Header */}
      <h1 className="text-2xl font-bold text-slate-800 mb-4">Quản lý đơn đặt xe</h1>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm theo mã đơn hoặc tên khách hàng..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-medium text-slate-700 placeholder:text-slate-400 shadow-sm"
          />
        </div>
        <select className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm sm:w-48 cursor-pointer">
          <option value="all">Tất cả</option>
          <option value="pending">Chờ duyệt</option>
          <option value="active">Đang chạy</option>
          <option value="completed">Hoàn thành</option>
          <option value="cancelled">Đã hủy</option>
        </select>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-xs tracking-wider">
            <tr>
              <th scope="col" className="px-6 py-4 rounded-tl-xl">Mã đơn</th>
              <th scope="col" className="px-6 py-4">Khách hàng</th>
              <th scope="col" className="px-6 py-4">Xe & Thời gian</th>
              <th scope="col" className="px-6 py-4">Tổng tiền</th>
              <th scope="col" className="px-6 py-4">Trạng thái</th>
              <th scope="col" className="px-6 py-4 text-right rounded-tr-xl">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockBookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-800 text-base">{booking.id}</td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-900">{booking.customer}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{booking.phone}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-800 text-sm">{booking.car}</div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                    {booking.dates}
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-slate-900 text-sm">
                  {booking.total}
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(booking.status)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    {booking.status === 'pending' ? (
                      <>
                        <button className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors hover:scale-110" title="Duyệt đơn">
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors hover:scale-110" title="Từ chối">
                          <XCircle className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => setViewBooking(booking)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                        title="Xem chi tiết"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-4">
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Hiển thị <span className="font-semibold text-slate-900">1</span> đến <span className="font-semibold text-slate-900">4</span> trong số <span className="font-semibold text-slate-900">12</span> kết quả
              </p>
            </div>
            <div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" text="Trước" className="text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" isActive className="bg-blue-600 text-white hover:bg-blue-700 hover:text-white border-blue-600 cursor-pointer shadow-sm">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#" className="text-slate-500 hover:text-blue-600 hover:bg-blue-50 border-transparent hover:border-blue-200 cursor-pointer transition-colors">2</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis className="text-slate-400" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" text="Sau" className="text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Xem chi tiết */}
      {viewBooking && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-slate-800">Chi tiết đơn {viewBooking.id}</h2>
                {getStatusBadge(viewBooking.status)}
              </div>
              <button 
                onClick={handleCloseModal}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Info Block 1 */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <User className="w-4 h-4" /> Khách hàng
                    </h3>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                      <p className="font-bold text-slate-900 text-lg mb-1">{viewBooking.customer}</p>
                      <p className="text-slate-600 text-sm font-medium">SĐT: {viewBooking.phone}</p>
                      <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                        <span>CCCD: {showId ? viewBooking.cccd : `${viewBooking.cccd.substring(0, 3)} *** *** ${viewBooking.cccd.substring(9)}`}</span>
                        <button 
                          onClick={() => setShowId(!showId)} 
                          className="text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          {showId ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info Block 2 */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Car className="w-4 h-4" /> Phương tiện & Địa điểm
                    </h3>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                      <div>
                        <p className="font-bold text-slate-900 text-lg mb-1">{viewBooking.car}</p>
                        <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <span>{viewBooking.dates}</span>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-slate-200 space-y-2">
                        <div className="flex items-start gap-2 text-sm text-slate-600">
                          <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span><span className="font-semibold text-slate-700">Nhận xe:</span> {viewBooking.pickup}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-slate-600">
                          <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                          <span><span className="font-semibold text-slate-700">Trả xe:</span> {viewBooking.dropoff}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pricing Block */}
                <div className="md:col-span-2">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Thanh toán
                  </h3>
                  <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div>
                      <p className="text-slate-500 text-xs font-semibold mb-1">HÌNH THỨC</p>
                      <p className="text-slate-800 font-medium">{viewBooking.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs font-semibold mb-1">ĐÃ CỌC</p>
                      <p className="text-emerald-600 font-bold">{viewBooking.deposit}</p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-slate-500 text-xs font-semibold mb-1">CÒN LẠI</p>
                      <p className="text-2xl font-bold text-red-500">{viewBooking.remaining}</p>
                      <p className="text-xs text-slate-500 font-medium mt-1">Tổng: {viewBooking.total}</p>
                    </div>
                  </div>
                </div>

                {/* Admin Notes */}
                <div className="md:col-span-2">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" /> Ghi chú của Admin
                  </h3>
                  <textarea 
                    defaultValue={viewBooking.note}
                    placeholder="Thêm ghi chú nội bộ..."
                    className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-medium text-slate-700 placeholder:text-slate-400 min-h-[80px]"
                  />
                </div>

              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50 shrink-0">
              <button 
                onClick={handleCloseModal}
                className="px-6 py-2 rounded-lg font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Đóng
              </button>
              {viewBooking.status === 'active' && (
                <button 
                  onClick={handleCloseModal}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-sm transition-all"
                >
                  Xác nhận trả xe
                </button>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
