import { Search, Car, Lock, Unlock, Eye, X, Mail, Phone, MapPin, CalendarDays, FileText, MessageSquare, EyeOff } from "lucide-react"
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

const mockUsers = [
  {
    id: '#USR-001',
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@gmail.com',
    phone: '0987654321',
    cccd: '031098123899',
    address: '123 Đường Láng, Đống Đa, Hà Nội',
    joinedDate: '10/01/2026',
    totalBookings: 12,
    totalSpent: '45.000.000 đ',
    status: 'active',
    note: 'Khách VIP, thường xuyên thuê xe dài ngày.'
  },
  {
    id: '#USR-002',
    name: 'Trần Thị B',
    email: 'tranthib@gmail.com',
    phone: '0912345678',
    cccd: '031099222333',
    address: '45 Lê Lợi, Quận 1, TP.HCM',
    joinedDate: '15/03/2026',
    totalBookings: 2,
    totalSpent: '3.000.000 đ',
    status: 'active',
    note: ''
  },
  {
    id: '#USR-003',
    name: 'Lê Văn C',
    email: 'levanc@gmail.com',
    phone: '0909090909',
    cccd: '001088444555',
    address: '88 Trần Phú, Hải Châu, Đà Nẵng',
    joinedDate: '05/05/2026',
    totalBookings: 5,
    totalSpent: '16.600.000 đ',
    status: 'locked',
    note: 'Khóa tài khoản do tranh chấp hỏng hóc xe ngày 20/06. Đang chờ giải quyết bồi thường.'
  },
  {
    id: '#USR-004',
    name: 'Phạm Thị D',
    email: 'phamthid@gmail.com',
    phone: '0988888888',
    cccd: '034091888999',
    address: 'KĐT EcoPark, Hưng Yên',
    joinedDate: '01/07/2026',
    totalBookings: 0,
    totalSpent: '0 đ',
    status: 'active',
    note: ''
  }
]

const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

const getStatusBadge = (status) => {
  if (status === 'active') {
    return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm">Hoạt động</span>
  }
  return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200 shadow-sm">Đã khóa</span>
}

export function AdminUsersTab() {
  const [viewUser, setViewUser] = useState(null)
  const [showId, setShowId] = useState(false)

  const handleCloseModal = () => {
    setViewUser(null)
    setShowId(false)
  }

  return (
    <div className="flex flex-col gap-2 p-2">
      {/* Header */}
      <h1 className="text-2xl font-bold text-slate-800 mb-4">Danh sách khách hàng</h1>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm theo tên, email, SĐT..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-medium text-slate-700 placeholder:text-slate-400 shadow-sm"
          />
        </div>
        <select className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm sm:w-48 cursor-pointer">
          <option value="all">Tất cả</option>
          <option value="active">Đang hoạt động</option>
          <option value="locked">Đã khóa</option>
        </select>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-xs tracking-wider">
            <tr>
              <th scope="col" className="px-6 py-4 rounded-tl-xl">Khách hàng</th>
              <th scope="col" className="px-6 py-4">Số điện thoại</th>
              <th scope="col" className="px-6 py-4">Lịch sử thuê</th>
              <th scope="col" className="px-6 py-4">Tổng chi tiêu</th>
              <th scope="col" className="px-6 py-4">Trạng thái</th>
              <th scope="col" className="px-6 py-4 text-right rounded-tr-xl">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockUsers.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold shadow-sm">
                      {getInitials(user.name)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-base">{user.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 font-semibold text-slate-700">
                  {user.phone}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 font-bold text-slate-800 text-sm">
                    <Car className="w-4 h-4 text-blue-500" />
                    {user.totalBookings} chuyến
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-emerald-600 text-sm">
                  {user.totalSpent}
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(user.status)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button 
                      onClick={() => setViewUser(user)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                      title="Xem chi tiết"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    {user.status === 'active' ? (
                      <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Khóa tài khoản">
                        <Lock className="w-5 h-5" />
                      </button>
                    ) : (
                      <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Mở khóa tài khoản">
                        <Unlock className="w-5 h-5" />
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
                Hiển thị <span className="font-semibold text-slate-900">1</span> đến <span className="font-semibold text-slate-900">4</span> trong số <span className="font-semibold text-slate-900">1,248</span> kết quả
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
                    <PaginationLink href="#" className="text-slate-500 hover:text-blue-600 hover:bg-blue-50 border-transparent hover:border-blue-200 cursor-pointer transition-colors">3</PaginationLink>
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

      {/* Modal Xem chi tiết Khách hàng */}
      {viewUser && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold shadow-sm text-lg border border-blue-200">
                  {getInitials(viewUser.name)}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{viewUser.name}</h2>
                  <div className="mt-1">{getStatusBadge(viewUser.status)}</div>
                </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Contact Info */}
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Hồ sơ cá nhân
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-slate-700">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        <Mail className="w-4 h-4 text-slate-500" />
                      </div>
                      <span className="font-medium text-sm">{viewUser.email}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-700">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        <Phone className="w-4 h-4 text-slate-500" />
                      </div>
                      <span className="font-medium text-sm">{viewUser.phone}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-700">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-slate-500" />
                      </div>
                      <div className="flex items-center gap-2 font-medium text-sm">
                        <span>CCCD: {showId ? viewUser.cccd : `${viewUser.cccd.substring(0, 3)} *** *** ${viewUser.cccd.substring(9)}`}</span>
                        <button 
                          onClick={() => setShowId(!showId)} 
                          className="text-slate-400 hover:text-blue-600 transition-colors"
                        >
                          {showId ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-slate-700">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                        <MapPin className="w-4 h-4 text-slate-500" />
                      </div>
                      <span className="font-medium text-sm pt-1.5 leading-relaxed">{viewUser.address}</span>
                    </div>
                  </div>
                </div>

                {/* Activity Stats */}
                <div>
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Car className="w-4 h-4" /> Hoạt động
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                      <p className="text-slate-500 text-xs font-semibold mb-1">CHUYẾN ĐI</p>
                      <p className="text-2xl font-bold text-blue-700">{viewUser.totalBookings}</p>
                    </div>
                    <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
                      <p className="text-slate-500 text-xs font-semibold mb-1">TỔNG CHI</p>
                      <p className="text-lg font-bold text-emerald-700 mt-1">{viewUser.totalSpent}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 text-sm text-slate-500 font-medium bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <CalendarDays className="w-4 h-4" />
                    <span>Tham gia: {viewUser.joinedDate}</span>
                  </div>
                </div>

                {/* Admin Notes */}
                <div className="md:col-span-2">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" /> Ghi chú nội bộ & Lý do khóa (nếu có)
                  </h3>
                  <textarea 
                    defaultValue={viewUser.note}
                    placeholder="Ghi chú về khách hàng, thái độ, sự cố, lý do khóa tài khoản..."
                    className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-medium text-slate-700 placeholder:text-slate-400 min-h-[100px]"
                  />
                  <p className="text-xs text-slate-400 mt-2 italic">* Các ghi chú này chỉ Admin mới có thể xem được.</p>
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
              {viewUser.status === 'locked' ? (
                <button 
                  onClick={handleCloseModal}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-sm transition-all flex items-center gap-2"
                >
                  <Unlock className="w-4 h-4" /> Mở khóa tài khoản
                </button>
              ) : (
                <button 
                  onClick={handleCloseModal}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold shadow-sm transition-all flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" /> Khóa tài khoản
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
