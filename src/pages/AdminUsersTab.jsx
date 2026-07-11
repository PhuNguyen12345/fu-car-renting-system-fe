import { Search, Car, Lock, Unlock, Eye, X, Mail, Phone, MapPin, CalendarDays, FileText, ExternalLink, EyeOff, Loader2 } from "lucide-react"
import { useState, useEffect, useMemo } from "react"
import { createPortal } from "react-dom"
import { customerService } from "@/services/customerService"

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

const getStatusBadge = (status) => {
  if (status === 'ACTIVE') {
    return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm">Hoạt động</span>
  }
  return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200 shadow-sm">Đã khóa</span>
}

export function AdminUsersTab() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const [viewUser, setViewUser] = useState(null)
  const [showId, setShowId] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)

  const [searchKeyword, setSearchKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const data = await customerService.getAdminCustomers()
      setUsers(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchSearch = user.fullName?.toLowerCase().includes(searchKeyword.toLowerCase()) || 
                          user.email?.toLowerCase().includes(searchKeyword.toLowerCase()) || 
                          user.phone?.includes(searchKeyword);
      
      const matchStatus = statusFilter === 'all' || 
                          (statusFilter === 'active' && user.status === 'ACTIVE') ||
                          (statusFilter === 'locked' && user.status !== 'ACTIVE');

      return matchSearch && matchStatus;
    });
  }, [users, searchKeyword, statusFilter]);

  const handleCloseModal = () => {
    setViewUser(null)
    setShowId(false)
    setPreviewImage(null)
  }

  const handleToggleLock = async (user) => {
    const isLocked = user.status !== 'ACTIVE';
    const actionName = isLocked ? 'mở khóa' : 'khóa';
    if (confirm(`Bạn có chắc chắn muốn ${actionName} tài khoản ${user.fullName}?`)) {
      try {
        if (isLocked) {
          await customerService.restoreCustomer(user.id)
        } else {
          await customerService.banCustomer(user.id)
        }
        alert(`Đã ${actionName} thành công`)
        fetchUsers()
        if (viewUser && viewUser.id === user.id) {
          setViewUser({ ...viewUser, status: isLocked ? 'ACTIVE' : 'BANNED' })
        }
      } catch (err) {
        alert('Lỗi: ' + err.message)
      }
    }
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
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="Tìm theo tên, email, SĐT..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-medium text-slate-700 placeholder:text-slate-400 shadow-sm"
          />
        </div>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm sm:w-48 cursor-pointer"
        >
          <option value="all">Tất cả</option>
          <option value="active">Đang hoạt động</option>
          <option value="locked">Đã khóa</option>
        </select>
      </div>

      {/* Data Table */}
      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-xs tracking-wider">
              <tr>
                <th scope="col" className="px-6 py-4 rounded-tl-xl">Khách hàng</th>
                <th scope="col" className="px-6 py-4">Số điện thoại</th>
                <th scope="col" className="px-6 py-4">CCCD</th>
                <th scope="col" className="px-6 py-4">Trạng thái</th>
                <th scope="col" className="px-6 py-4 text-right rounded-tr-xl">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold shadow-sm overflow-hidden border border-blue-200">
                        {user.avatarUrl ? (
                          <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
                        ) : (
                          getInitials(user.fullName)
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-base">{user.fullName}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-700">
                    {user.phone || 'Chưa cập nhật'}
                  </td>
                  <td className="px-6 py-4 font-semibold text-slate-700">
                    {user.cccd || 'Chưa cập nhật'}
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
                      {user.status === 'ACTIVE' ? (
                        <button 
                          onClick={() => handleToggleLock(user)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                          title="Khóa tài khoản"
                        >
                          <Lock className="w-5 h-5" />
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleToggleLock(user)}
                          className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" 
                          title="Mở khóa tài khoản"
                        >
                          <Unlock className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-slate-500">
                    Không tìm thấy khách hàng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Simple Footer/Pagination Summary */}
          <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-4">
            <p className="text-sm text-slate-500">
              Tổng cộng <span className="font-semibold text-slate-900">{filteredUsers.length}</span> kết quả
            </p>
          </div>
        </div>
      )}

      {/* Modal Xem chi tiết Khách hàng */}
      {viewUser && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold shadow-sm text-lg border border-blue-200 overflow-hidden">
                  {viewUser.avatarUrl ? (
                    <img src={viewUser.avatarUrl} alt={viewUser.fullName} className="w-full h-full object-cover" />
                  ) : (
                    getInitials(viewUser.fullName)
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">{viewUser.fullName}</h2>
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
                <div className="md:col-span-2">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4" /> Hồ sơ cá nhân
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <span className="font-medium text-sm">{viewUser.phone || 'Chưa cập nhật'}</span>
                      </div>
                      <div className="flex items-start gap-3 text-slate-700">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                          <MapPin className="w-4 h-4 text-slate-500" />
                        </div>
                        <span className="font-medium text-sm pt-1.5 leading-relaxed">{viewUser.address || 'Chưa cập nhật'}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-slate-700">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-slate-500" />
                        </div>
                        <div className="flex items-center gap-2 font-medium text-sm">
                          <span>CCCD: {showId ? (viewUser.cccd || 'N/A') : (viewUser.cccd ? `${viewUser.cccd.substring(0, 3)} *** *** ${viewUser.cccd.substring(9)}` : 'N/A')}</span>
                          {viewUser.cccd && (
                            <button 
                              onClick={() => setShowId(!showId)} 
                              className="text-slate-400 hover:text-blue-600 transition-colors"
                            >
                              {showId ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          )}
                          {viewUser.cccdUrl && (
                            <button 
                              onClick={() => setPreviewImage(viewUser.cccdUrl)} 
                              className="text-blue-500 hover:text-blue-700 transition-colors ml-1 p-1 rounded-md hover:bg-blue-50"
                              title="Xem ảnh chụp"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-slate-700">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-slate-500" />
                        </div>
                        <div className="flex items-center gap-2 font-medium text-sm">
                          <span>GPLX: {showId ? (viewUser.gplxNumber || 'N/A') : (viewUser.gplxNumber ? `${viewUser.gplxNumber.substring(0, 3)} *** *** ${viewUser.gplxNumber.substring(9)}` : 'N/A')}</span>
                          {viewUser.gplxNumber && (
                            <button 
                              onClick={() => setShowId(!showId)} 
                              className="text-slate-400 hover:text-blue-600 transition-colors"
                            >
                              {showId ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          )}
                          {viewUser.gplxUrl && (
                            <button 
                              onClick={() => setPreviewImage(viewUser.gplxUrl)} 
                              className="text-blue-500 hover:text-blue-700 transition-colors ml-1 p-1 rounded-md hover:bg-blue-50"
                              title="Xem ảnh chụp"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-slate-700">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                          <CalendarDays className="w-4 h-4 text-slate-500" />
                        </div>
                        <span className="font-medium text-sm">NS: {viewUser.dateOfBirth || 'Chưa cập nhật'}</span>
                      </div>
                    </div>
                  </div>
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
              {viewUser.status !== 'ACTIVE' ? (
                <button 
                  onClick={() => handleToggleLock(viewUser)}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold shadow-sm transition-all flex items-center gap-2"
                >
                  <Unlock className="w-4 h-4" /> Mở khóa tài khoản
                </button>
              ) : (
                <button 
                  onClick={() => handleToggleLock(viewUser)}
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

      {/* Modal Preview Ảnh */}
      {previewImage && createPortal(
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setPreviewImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-slate-300 transition-colors p-2"
            >
              <X className="w-8 h-8" />
            </button>
            <img 
              src={previewImage} 
              alt="Preview" 
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl" 
            />
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
