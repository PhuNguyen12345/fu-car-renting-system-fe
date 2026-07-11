import { Search, Calendar, CheckCircle, XCircle, Eye, EyeOff, X, User, Car, FileText, MapPin, MessageSquare, ExternalLink } from "lucide-react"
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { format, differenceInDays } from "date-fns"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { rentingService } from "@/services/rentingService"
import { carService } from "@/services/carService"
import { formatVND } from "@/lib/utils"

const getStatusBadge = (status) => {
  switch (status) {
    case 'INITIATED':
      return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200 shadow-sm">Khởi tạo</span>
    case 'CONFIRMED':
      return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 border border-yellow-200 shadow-sm">Chờ duyệt</span>
    case 'APPROVED':
      return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm">Đã duyệt (Chờ giao xe)</span>
    case 'ACTIVE':
      return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200 shadow-sm">Đang chạy</span>
    case 'COMPLETED':
      return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200 shadow-sm">Hoàn thành</span>
    case 'CANCELLED_DUE_TO_CUSTOMER':
      return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200 shadow-sm">Khách hủy</span>
    case 'CANCELLED_DUE_TO_CAR':
      return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600 border border-red-200 shadow-sm">Từ chối / Lỗi</span>
    default:
      return null
  }
}

export function AdminBookingsTab() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [statusFilter, setStatusFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const [viewBooking, setViewBooking] = useState(null)
  const [showId, setShowId] = useState(false)
  const [previewImageUrl, setPreviewImageUrl] = useState(null)
  
  // Reject reason state
  const [rejectReason, setRejectReason] = useState('')

  useEffect(() => {
    fetchBookings()
  }, [currentPage])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const res = await rentingService.getAllRentals(currentPage - 1, 10)
      let data = res.content
      setTotalPages(res.totalPages)

      // Enrich with car details
      const enrichedBookings = await Promise.all(
        data.map(async (booking) => {
          try {
            const carDetail = await carService.getPublicCarDetail(booking.carId)
            const days = differenceInDays(new Date(booking.endDate), new Date(booking.startDate)) || 1
            return {
              ...booking,
              carName: carDetail.name,
              days: days
            }
          } catch (err) {
            return {
              ...booking,
              carName: "Xe không xác định",
              days: differenceInDays(new Date(booking.endDate), new Date(booking.startDate)) || 1
            }
          }
        })
      )
      setBookings(enrichedBookings)
    } catch (error) {
      console.error(error)
      alert("Không thể tải danh sách đơn đặt xe")
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (action, id, payload = null) => {
    try {
      if (action === 'approve') await rentingService.approveBooking(id)
      else if (action === 'reject') await rentingService.rejectBooking(id, payload)
      else if (action === 'handover') await rentingService.handoverBooking(id)
      else if (action === 'receive') await rentingService.receiveBooking(id)
      
      alert("Thao tác thành công!")
      if (viewBooking) setViewBooking(null)
      fetchBookings()
    } catch (err) {
      alert("Lỗi thao tác: " + (err.response?.data?.message || err.message))
    }
  }

  const filteredBookings = bookings.filter(b => {
    if (statusFilter !== 'all') {
      const map = {
        pending: ['INITIATED', 'CONFIRMED'],
        active: ['APPROVED', 'ACTIVE'],
        completed: ['COMPLETED'],
        cancelled: ['CANCELLED_DUE_TO_CUSTOMER', 'CANCELLED_DUE_TO_CAR']
      }
      if (!map[statusFilter].includes(b.bookingStatus)) return false
    }
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      if (!b.id.toLowerCase().includes(term) && !b.renterName.toLowerCase().includes(term)) return false
    }
    return true
  })

  const handleCloseModal = () => {
    setViewBooking(null)
    setShowId(false)
    setRejectReason('')
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-medium text-slate-700 placeholder:text-slate-400 shadow-sm"
          />
        </div>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm sm:w-48 cursor-pointer"
        >
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
            {loading ? (
              <tr><td colSpan="6" className="text-center py-8 text-gray-500">Đang tải dữ liệu...</td></tr>
            ) : filteredBookings.length === 0 ? (
              <tr><td colSpan="6" className="text-center py-8 text-gray-500">Không có đơn đặt xe nào</td></tr>
            ) : filteredBookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-bold text-slate-800 text-base">{booking.id}</td>
                <td className="px-6 py-4">
                  <div className="font-semibold text-slate-900">{booking.renterName}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{booking.renterPhone}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-800 text-sm">{booking.carName}</div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-500" />
                    {format(new Date(booking.startDate), 'dd/MM/yyyy')} - {format(new Date(booking.endDate), 'dd/MM/yyyy')}
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-slate-900 text-sm">
                  {formatVND(booking.totalAmount)}
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(booking.bookingStatus)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    {booking.bookingStatus === 'CONFIRMED' && (
                      <>
                        <button onClick={() => {
                          if (window.confirm("Xác nhận duyệt đơn này?")) handleAction('approve', booking.id)
                        }} className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors hover:scale-110" title="Duyệt đơn">
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button onClick={() => {
                          const note = window.prompt("Nhập lý do từ chối (Admin Note):")
                          if (note !== null) handleAction('reject', booking.id, note)
                        }} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors hover:scale-110" title="Từ chối">
                          <XCircle className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    
                    <button 
                      onClick={() => setViewBooking(booking)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                      title="Xem chi tiết"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
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
                Hiển thị trang <span className="font-semibold text-slate-900">{currentPage}</span> / <span className="font-semibold text-slate-900">{totalPages || 1}</span>
              </p>
            </div>
            <div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className="text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer" 
                    />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink isActive className="bg-blue-600 text-white hover:bg-blue-700 hover:text-white border-blue-600 cursor-pointer shadow-sm">{currentPage}</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className="text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer" 
                    />
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
                {getStatusBadge(viewBooking.bookingStatus)}
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
                      <p className="font-bold text-slate-900 text-lg mb-1">{viewBooking.renterName}</p>
                      <p className="text-slate-600 text-sm font-medium">SĐT: {viewBooking.renterPhone}</p>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                          <span>CCCD: {showId ? viewBooking.renterCccd : `${viewBooking.renterCccd?.substring(0, 3)} *** *** ${viewBooking.renterCccd?.substring(viewBooking.renterCccd?.length - 3)}`}</span>
                          <button 
                            onClick={() => setShowId(!showId)} 
                            className="text-slate-400 hover:text-blue-600 transition-colors"
                            title={showId ? "Ẩn CCCD" : "Hiện CCCD"}
                          >
                            {showId ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                          <span>GPLX: {showId ? viewBooking.renterLicense : `${viewBooking.renterLicense?.substring(0, 3)} *** *** ${viewBooking.renterLicense?.substring(viewBooking.renterLicense?.length - 3)}`}</span>
                          <button 
                            onClick={() => setShowId(!showId)} 
                            className="text-slate-400 hover:text-blue-600 transition-colors"
                            title={showId ? "Ẩn GPLX" : "Hiện GPLX"}
                          >
                            {showId ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {viewBooking.customerNote && (
                          <div className="mt-2 text-sm text-slate-700 bg-white p-2 border border-slate-200 rounded-lg">
                            <span className="font-semibold text-slate-500 text-xs uppercase">Ghi chú từ khách:</span>
                            <p className="mt-1">{viewBooking.customerNote}</p>
                          </div>
                        )}
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
                        <p className="font-bold text-slate-900 text-lg mb-1">{viewBooking.carName}</p>
                        <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <span>{format(new Date(viewBooking.startDate), 'HH:mm dd/MM/yyyy')} - {format(new Date(viewBooking.endDate), 'HH:mm dd/MM/yyyy')}</span>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-slate-200 space-y-2">
                        <div className="flex items-start gap-2 text-sm text-slate-600">
                          <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span><span className="font-semibold text-slate-700">Nhận xe:</span> {viewBooking.pickupLocation}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm text-slate-600">
                          <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                          <span><span className="font-semibold text-slate-700">Trả xe:</span> {viewBooking.dropoffLocation}</span>
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
                      <p className="text-slate-500 text-[10px] uppercase font-bold mt-1">Trạng thái: {viewBooking.paymentStatus}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs font-semibold mb-1">ĐÃ THANH TOÁN</p>
                      <p className="text-emerald-600 font-bold">{formatVND(viewBooking.paymentStatus === 'FULLY_PAID' ? viewBooking.totalAmount : (viewBooking.paymentStatus !== 'UNPAID' ? viewBooking.depositAmount : 0))}</p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-slate-500 text-xs font-semibold mb-1">CÒN LẠI THU TIỀN MẶT</p>
                      <p className="text-2xl font-bold text-red-500">{formatVND(viewBooking.paymentStatus === 'FULLY_PAID' ? 0 : (viewBooking.totalAmount - (viewBooking.paymentStatus !== 'UNPAID' ? viewBooking.depositAmount : 0)))}</p>
                      <p className="text-xs text-slate-500 font-medium mt-1">Tổng: {formatVND(viewBooking.totalAmount)}</p>
                    </div>
                  </div>
                </div>

                {/* Admin Notes */}
                <div className="md:col-span-2">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" /> Ghi chú của Admin (Khi từ chối)
                  </h3>
                  <textarea 
                    value={rejectReason || viewBooking.adminNote || ''}
                    onChange={(e) => setRejectReason(e.target.value)}
                    disabled={viewBooking.bookingStatus !== 'CONFIRMED'}
                    placeholder={viewBooking.bookingStatus === 'CONFIRMED' ? "Nhập lý do nếu muốn từ chối đơn này..." : "Không có ghi chú"}
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
              
              {viewBooking.bookingStatus === 'CONFIRMED' && (
                <>
                  <button 
                    onClick={() => {
                      if (!rejectReason) return alert('Vui lòng nhập lý do từ chối (Admin Note)')
                      handleAction('reject', viewBooking.id, rejectReason)
                    }}
                    className="px-6 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg font-semibold transition-all"
                  >
                    Từ chối đơn
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm("Xác nhận đã thu đủ tiền và duyệt đơn này?")) handleAction('approve', viewBooking.id)
                    }}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm transition-all flex flex-col items-center leading-tight"
                  >
                    <span>Duyệt đơn</span>
                    <span className="text-[10px] font-normal opacity-80">(Xác nhận đã thu đủ tiền)</span>
                  </button>
                </>
              )}

              {viewBooking.bookingStatus === 'APPROVED' && (
                <button 
                  onClick={() => {
                    if (window.confirm("Xác nhận bàn giao xe cho khách?")) handleAction('handover', viewBooking.id)
                  }}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-sm transition-all"
                >
                  Xác nhận Bàn Giao Xe
                </button>
              )}

              {viewBooking.bookingStatus === 'ACTIVE' && (
                <button 
                  onClick={() => {
                    if (window.confirm("Khách đã trả xe? Xác nhận thu tiền mặt và kết thúc đơn?")) handleAction('receive', viewBooking.id)
                  }}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow-sm transition-all"
                >
                  Xác nhận Trả Xe
                </button>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Image Preview Modal */}
      {previewImageUrl && createPortal(
        <div 
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewImageUrl(null)}
        >
          <button 
            className="fixed top-4 right-4 text-white hover:text-gray-300 z-[10000] p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
            onClick={() => setPreviewImageUrl(null)}
          >
            <X className="w-6 h-6" />
          </button>
          
          <div onClick={(e) => e.stopPropagation()}>
            <img 
              src={previewImageUrl} 
              alt="Preview" 
              className="max-w-full max-h-[90vh] object-contain rounded-md shadow-2xl" 
            />
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
