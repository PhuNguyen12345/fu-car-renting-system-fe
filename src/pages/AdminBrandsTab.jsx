import { Plus, Edit, Trash2, X, CloudUpload } from "lucide-react"
import { useState, useEffect } from "react"
import { createPortal } from "react-dom"

const mockBrands = [
  { id: 1, name: 'Toyota', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Toyota_carlogo.svg', carCount: 15 },
  { id: 2, name: 'Mercedes-Benz', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Logo.svg', carCount: 8 },
  { id: 3, name: 'BMW', logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg', carCount: 12 },
]

export function AdminBrandsTab() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editBrand, setEditBrand] = useState(null)
  
  const [logoMode, setLogoMode] = useState('url')
  const [logoUrl, setLogoUrl] = useState('')

  useEffect(() => {
    if (editBrand) {
      setLogoMode('url')
      setLogoUrl(editBrand.logoUrl || '')
    } else {
      setLogoMode('url')
      setLogoUrl('')
    }
  }, [editBrand, isAddModalOpen])

  return (
    <div className="flex flex-col gap-2 p-2">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Quản lý hãng xe</h1>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-semibold shadow-sm transition-all hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          Thêm hãng xe
        </button>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockBrands.map((brand) => (
          <div key={brand.id} className="bg-white border border-slate-200 rounded-xl shadow-sm p-5 flex flex-col hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full border border-slate-100 flex items-center justify-center p-2">
                <img src={brand.logoUrl} alt={brand.name} className="w-full h-full object-contain" />
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setEditBrand(brand)}
                  className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Chỉnh sửa"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Xóa"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">{brand.name}</h3>
              <p className="text-sm font-medium text-slate-500 mt-1">{brand.carCount} xe</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {(isAddModalOpen || editBrand) && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800">
                {editBrand ? 'Cập nhật hãng xe' : 'Thêm hãng xe mới'}
              </h2>
              <button 
                onClick={() => { setIsAddModalOpen(false); setEditBrand(null); }}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tên hãng xe *</label>
                <input 
                  type="text" 
                  defaultValue={editBrand?.name || ''}
                  placeholder="VD: BMW" 
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-medium" 
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-semibold text-slate-700">Logo hãng xe</label>
                  <div className="bg-slate-100 p-0.5 rounded-lg flex items-center">
                    <button 
                      type="button"
                      onClick={() => setLogoMode('url')}
                      className={`text-xs px-3 py-1 rounded-md transition-all ${
                        logoMode === 'url' ? 'bg-white shadow-sm text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-700 font-medium'
                      }`}
                    >
                      Nhập URL
                    </button>
                    <button 
                      type="button"
                      onClick={() => setLogoMode('file')}
                      className={`text-xs px-3 py-1 rounded-md transition-all ${
                        logoMode === 'file' ? 'bg-white shadow-sm text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-700 font-medium'
                      }`}
                    >
                      Tải lên
                    </button>
                  </div>
                </div>
                {logoMode === 'url' ? (
                  <input 
                    type="text" 
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="https://..." 
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-medium mb-2" 
                  />
                ) : (
                  <div className="relative mb-2">
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) setLogoUrl(URL.createObjectURL(file));
                      }}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    />
                    <div className="w-full px-4 py-2.5 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center gap-2 hover:bg-slate-100 transition-colors">
                      <CloudUpload className="w-5 h-5 text-slate-400" />
                      <span className="text-sm font-medium text-slate-600">Chọn file từ máy tính</span>
                    </div>
                  </div>
                )}
                <div className="w-16 h-16 rounded-full overflow-hidden border border-slate-200 flex items-center justify-center bg-slate-50 p-2">
                  {logoUrl ? (
                    <img src={logoUrl} alt="Logo preview" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-[10px] text-slate-400 font-medium">Trống</span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button 
                onClick={() => { setIsAddModalOpen(false); setEditBrand(null); }}
                className="px-4 py-2 rounded-lg font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Hủy
              </button>
              <button 
                onClick={() => { setIsAddModalOpen(false); setEditBrand(null); }}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm transition-all"
              >
                {editBrand ? 'Lưu thay đổi' : 'Thêm hãng xe'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
