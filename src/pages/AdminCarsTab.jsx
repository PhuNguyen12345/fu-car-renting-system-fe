import { Plus, Search, Edit, X, CloudUpload } from "lucide-react"
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

const mockCars = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&q=80&w=300&h=200',
    name: 'Mercedes-Benz GLE',
    plate: '30A-123.45',
    price: '1.500.000 đ',
    status: 'available',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=300&h=200',
    name: 'Tesla Model S',
    plate: '51F-888.88',
    price: '2.000.000 đ',
    status: 'rented',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=300&h=200',
    name: 'BMW X5',
    plate: '29C-999.99',
    price: '1.800.000 đ',
    status: 'maintenance',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=300&h=200',
    name: 'Audi A6',
    plate: '43A-567.89',
    price: '1.200.000 đ',
    status: 'available',
  }
]

const getStatusBadge = (status) => {
  switch (status) {
    case 'available':
      return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">Đang rảnh</span>
    case 'rented':
      return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 border border-yellow-200">Đang thuê</span>
    case 'maintenance':
      return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">Bảo trì</span>
    default:
      return null
  }
}

export function AdminCarsTab() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editCar, setEditCar] = useState(null)
  const [imageMode, setImageMode] = useState('url')

  return (
    <div className="flex flex-col gap-2 p-2">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-slate-800">Danh sách xe</h1>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-semibold shadow-sm transition-all hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          Thêm xe mới
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên xe, biển số..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-medium text-slate-700 placeholder:text-slate-400 shadow-sm"
          />
        </div>
        <select className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm sm:w-48 cursor-pointer">
          <option value="all">Tất cả</option>
          <option value="available">Đang rảnh</option>
          <option value="rented">Đang thuê</option>
          <option value="maintenance">Bảo trì</option>
        </select>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-200 uppercase text-xs tracking-wider">
            <tr>
              <th scope="col" className="px-6 py-4 rounded-tl-xl">Hình ảnh</th>
              <th scope="col" className="px-6 py-4">Tên xe & Biển số</th>
              <th scope="col" className="px-6 py-4">Giá thuê/ngày</th>
              <th scope="col" className="px-6 py-4">Trạng thái</th>
              <th scope="col" className="px-6 py-4 text-right rounded-tr-xl">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockCars.map((car) => (
              <tr key={car.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <img src={car.image} alt={car.name} className="w-16 h-12 object-cover rounded-md border border-slate-200 shadow-sm" />
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900 text-base">{car.name}</div>
                  <div className="text-xs font-semibold text-slate-500 mt-0.5">{car.plate}</div>
                </td>
                <td className="px-6 py-4 font-semibold text-slate-700">
                  {car.price}
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(car.status)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => setEditCar(car)}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                      title="Chỉnh sửa"
                    >
                      <Edit className="w-4 h-4" />
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
                Hiển thị <span className="font-semibold text-slate-900">1</span> đến <span className="font-semibold text-slate-900">4</span> trong số <span className="font-semibold text-slate-900">48</span> kết quả
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

      {/* Modal Thêm / Sửa Xe */}
      {(isAddModalOpen || editCar) && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800">
                {editCar ? 'Cập nhật thông tin xe' : 'Thêm xe mới'}
              </h2>
              <button 
                onClick={() => { setIsAddModalOpen(false); setEditCar(null); setImageMode('url'); }}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tên xe</label>
                <input 
                  type="text" 
                  defaultValue={editCar?.name || ''}
                  placeholder="VD: VinFast VF8" 
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-medium" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Biển số</label>
                  <input 
                    type="text" 
                    defaultValue={editCar?.plate || ''}
                    placeholder="VD: 30A-123.45" 
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-medium" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Giá thuê/ngày</label>
                  <input 
                    type="text" 
                    defaultValue={editCar?.price || ''}
                    placeholder="VD: 1.000.000 đ" 
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-medium" 
                  />
                </div>
              </div>
              <div className="min-h-[120px]">
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-semibold text-slate-700">Hình ảnh xe</label>
                  <div className="bg-slate-100 p-1 rounded-lg flex items-center gap-1">
                    <button 
                      onClick={() => setImageMode('url')}
                      className={`text-xs px-3 py-1.5 rounded transition-all ${
                        imageMode === 'url' 
                          ? 'bg-white shadow-sm text-blue-600 font-semibold' 
                          : 'text-slate-500 hover:text-slate-700 font-medium'
                      }`}
                    >
                      Nhập URL
                    </button>
                    <button 
                      onClick={() => setImageMode('file')}
                      className={`text-xs px-3 py-1.5 rounded transition-all ${
                        imageMode === 'file' 
                          ? 'bg-white shadow-sm text-blue-600 font-semibold' 
                          : 'text-slate-500 hover:text-slate-700 font-medium'
                      }`}
                    >
                      Tải lên
                    </button>
                  </div>
                </div>

                {imageMode === 'url' ? (
                  <div className="animate-in fade-in duration-200">
                    <input 
                      type="text" 
                      defaultValue={editCar?.image || ''}
                      placeholder="https://..." 
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-medium" 
                    />
                  </div>
                ) : (
                  <div className="animate-in fade-in duration-200">
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors group">
                      <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <CloudUpload className="w-5 h-5 text-blue-500" />
                      </div>
                      <p className="text-sm font-semibold text-slate-700">Nhấn để chọn file</p>
                      <p className="text-xs text-slate-400 mt-1">Định dạng JPG, PNG (Tối đa 5MB)</p>
                    </div>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Trạng thái</label>
                <select 
                  defaultValue={editCar?.status || 'available'}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm bg-white font-medium cursor-pointer"
                >
                  <option value="available">Đang rảnh</option>
                  <option value="rented">Đang thuê</option>
                  <option value="maintenance">Bảo trì</option>
                </select>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button 
                onClick={() => { setIsAddModalOpen(false); setEditCar(null); setImageMode('url'); }}
                className="px-4 py-2 rounded-lg font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Hủy
              </button>
              <button 
                onClick={() => { setIsAddModalOpen(false); setEditCar(null); setImageMode('url'); }}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm transition-all"
              >
                {editCar ? 'Lưu thay đổi' : 'Thêm xe'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
