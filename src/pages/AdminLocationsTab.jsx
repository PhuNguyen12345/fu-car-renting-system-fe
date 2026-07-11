import { Plus, Edit, Trash2, X, MapPin, Loader2 } from "lucide-react"
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { carService } from "@/services/carService"

export function AdminLocationsTab() {
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editLocation, setEditLocation] = useState(null)

  const [name, setName] = useState('')
  const [city, setCity] = useState('Hà Nội')
  const [address, setAddress] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchLocations = async () => {
    setLoading(true)
    try {
      const data = await carService.getAdminLocations()
      setLocations(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLocations()
  }, [])

  useEffect(() => {
    if (editLocation) {
      setName(editLocation.name || '')
      setCity(editLocation.city || 'Hà Nội')
      setAddress(editLocation.address || '')
    } else {
      setName('')
      setCity('Hà Nội')
      setAddress('')
    }
  }, [editLocation, isAddModalOpen])

  const handleDelete = async (id) => {
    if (confirm("Bạn có chắc chắn muốn xóa chi nhánh này?")) {
      try {
        await carService.deleteLocation(id)
        alert('Xóa thành công')
        fetchLocations()
      } catch (err) {
        alert('Lỗi khi xóa: ' + err.message)
      }
    }
  }

  const handleSubmit = async () => {
    if (!name.trim() || !city.trim() || !address.trim()) {
      alert("Vui lòng điền đầy đủ thông tin (Tên, Thành phố, Địa chỉ)")
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        name,
        city,
        address
      }

      if (editLocation) {
        await carService.updateLocation(editLocation.id, payload)
        alert('Cập nhật chi nhánh thành công')
      } else {
        await carService.createLocation(payload)
        alert('Thêm chi nhánh thành công')
      }

      setIsAddModalOpen(false)
      setEditLocation(null)
      fetchLocations()
    } catch (err) {
      alert('Có lỗi xảy ra: ' + err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-2 p-2">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Quản lý chi nhánh</h1>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-semibold shadow-sm transition-all hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          Thêm chi nhánh
        </button>
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
                <th scope="col" className="px-6 py-4 rounded-tl-xl">Tên chi nhánh</th>
                <th scope="col" className="px-6 py-4">Thành phố</th>
                <th scope="col" className="px-6 py-4">Địa chỉ chi tiết</th>
                <th scope="col" className="px-6 py-4 text-right rounded-tr-xl">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {locations.map((location) => (
                <tr key={location.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900 text-base">{location.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200 inline-flex items-center gap-1.5">
                      <MapPin className="w-3 h-3" />
                      {location.city}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">
                    {location.address}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setEditLocation(location)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(location.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {locations.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-8 text-slate-500">
                    Chưa có chi nhánh nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Thêm / Sửa Chi nhánh */}
      {(isAddModalOpen || editLocation) && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800">
                {editLocation ? 'Cập nhật chi nhánh' : 'Thêm chi nhánh mới'}
              </h2>
              <button 
                onClick={() => { setIsAddModalOpen(false); setEditLocation(null); }}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                disabled={isSubmitting}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tên chi nhánh *</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="VD: Chi nhánh Hoàn Kiếm" 
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-medium" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Thành phố / Tỉnh *</label>
                <select 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm bg-white font-medium cursor-pointer"
                >
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Hải Phòng">Hải Phòng</option>
                  <option value="Cần Thơ">Cần Thơ</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Địa chỉ chi tiết *</label>
                <textarea 
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="VD: Số 1, Phố Vọng, Hai Bà Trưng, Hà Nội" 
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-medium resize-none" 
                />
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button 
                onClick={() => { setIsAddModalOpen(false); setEditLocation(null); }}
                className="px-4 py-2 rounded-lg font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
                disabled={isSubmitting}
              >
                Hủy
              </button>
              <button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm transition-all flex items-center gap-2 disabled:opacity-70"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {editLocation ? 'Lưu thay đổi' : 'Thêm chi nhánh'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
