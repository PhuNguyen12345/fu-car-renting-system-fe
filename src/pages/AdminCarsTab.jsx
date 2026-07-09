import { Plus, Search, Edit, X, CloudUpload, Trash2, MapPin } from "lucide-react"
import { useState, useEffect } from "react"
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

const AVAILABLE_FEATURES = ['Điều hòa nhiệt độ', 'Camera lùi', 'Bluetooth/USB', 'Ghế da cao cấp', 'Màn hình cảm ứng', 'Cảm biến va chạm', 'Cửa sổ trời', 'Hệ thống định vị GPS'];

const mockCars = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&q=80&w=300&h=200',
    name: 'Mercedes-Benz GLE',
    plate: '30A-123.45',
    price: '1.500.000 đ',
    status: 'available',
    location: 'Chi nhánh Cầu Giấy (Hà Nội)'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&q=80&w=300&h=200',
    name: 'Tesla Model S',
    plate: '51F-888.88',
    price: '2.000.000 đ',
    status: 'rented',
    location: 'Chi nhánh Quận 1 (TP.HCM)'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=300&h=200',
    name: 'BMW X5',
    plate: '29C-999.99',
    price: '1.800.000 đ',
    status: 'maintenance',
    location: 'Chi nhánh Lê Chân (Hải Phòng)'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=300&h=200',
    name: 'Audi A6',
    plate: '43A-567.89',
    price: '1.200.000 đ',
    status: 'available',
    location: 'Chi nhánh Hoàn Kiếm (Hà Nội)'
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
    case 'locked_pending':
      return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">Khoá (Pending)</span>
    default:
      return null
  }
}

const getCloudinarySignature = async () => {
  const token = localStorage.getItem('token') || ''; // REPLACE with actual token logic
  const response = await fetch("http://localhost:8080/api/v1/admin/cars/cloudinary-signature", {
      headers: {
          "Authorization": `Bearer ${token}`
      }
  });
  return await response.json(); 
};

const uploadImageToCloudinary = async (file) => {
  try {
    const signData = await getCloudinarySignature();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", signData.apiKey);
    formData.append("timestamp", signData.timestamp);
    formData.append("signature", signData.signature);
    formData.append("folder", signData.folder); 

    const uploadUrl = `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`;
    const response = await fetch(uploadUrl, { method: "POST", body: formData });
    const data = await response.json();
    
    return data.secure_url;
  } catch (error) {
    console.error("Lỗi upload ảnh:", error);
    alert("Upload ảnh thất bại!");
    return null;
  }
};

export function AdminCarsTab() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editCar, setEditCar] = useState(null)
  const [thumbnailMode, setThumbnailMode] = useState('url')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false)
  const [galleryItems, setGalleryItems] = useState([])
  const [selectedFeatures, setSelectedFeatures] = useState([])

  useEffect(() => {
    if (editCar) {
      setThumbnailMode('url')
      setThumbnailUrl(editCar.image || '')
      setGalleryItems([])
      setSelectedFeatures(editCar.features || [])
    } else {
      setThumbnailMode('url')
      setThumbnailUrl('')
      setGalleryItems([])
      setSelectedFeatures([])
    }
    setIsUploadingThumbnail(false)
  }, [editCar, isAddModalOpen])

  const handleFeatureToggle = (feature) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    )
  }

  const handleAddGalleryItem = () => {
    setGalleryItems([...galleryItems, { mode: 'url', value: '', isUploading: false }])
  }

  const handleUpdateGalleryItemMode = (index, mode) => {
    const newItems = [...galleryItems]
    newItems[index].mode = mode
    newItems[index].value = ''
    newItems[index].isUploading = false
    setGalleryItems(newItems)
  }

  const handleUpdateGalleryItemValue = (index, value) => {
    const newItems = [...galleryItems]
    newItems[index].value = value
    setGalleryItems(newItems)
  }

  const handleGalleryFileUpload = async (index, file) => {
    if (!file) return;
    const newItems = [...galleryItems]
    newItems[index].isUploading = true
    setGalleryItems(newItems)

    const url = await uploadImageToCloudinary(file);
    
    setGalleryItems(prevItems => {
      const updated = [...prevItems]
      if (url) updated[index].value = url
      updated[index].isUploading = false
      return updated
    })
  }

  const handleRemoveGalleryItem = (index) => {
    setGalleryItems(galleryItems.filter((_, i) => i !== index))
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {
      name: formData.get('name'),
      plate: formData.get('plate'),
      price: formData.get('price'),
      location: formData.get('location'),
      status: formData.get('status'),
      thumbnailUrl: thumbnailUrl,
      galleryUrls: galleryItems.map(item => item.value).filter(url => url !== ''),
      features: selectedFeatures,
    }
    console.log("Submitting payload to POST /api/v1/admin/cars:", payload);
    // TODO: Perform actual fetch request here
    
    setIsAddModalOpen(false);
    setEditCar(null);
  }

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
          <option value="locked_pending">Khoá (Pending)</option>
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
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-1 font-medium">
                    <MapPin className="w-3.5 h-3.5" />
                    {car.location || 'Chưa cập nhật'}
                  </div>
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
                    <button 
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                      title="Khoá xe (Xóa mềm)"
                    >
                      <Trash2 className="w-4 h-4" />
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
          <div className="w-full max-w-2xl max-h-[90vh] flex flex-col bg-white rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-200 shrink-0 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-bold text-slate-800">
                {editCar ? 'Cập nhật thông tin xe' : 'Thêm xe mới'}
              </h2>
              <button 
                onClick={() => { setIsAddModalOpen(false); setEditCar(null); }}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 overflow-y-auto flex-1 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tên xe</label>
                  <input 
                    type="text" 
                    name="name"
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
                      name="plate"
                      defaultValue={editCar?.plate || ''}
                      placeholder="VD: 30A-123.45" 
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-medium" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Giá thuê/ngày</label>
                    <input 
                      type="text" 
                      name="price"
                      defaultValue={editCar?.price || ''}
                      placeholder="VD: 1.000.000 đ" 
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-medium" 
                    />
                  </div>
                </div>
                {/* Image Section */}
              <div className="space-y-4">
                {/* Thumbnail Section */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-sm font-semibold text-slate-700">Ảnh đại diện (Thumbnail) *</label>
                    <div className="bg-slate-100 p-0.5 rounded-lg flex items-center">
                      <button 
                        type="button"
                        onClick={() => setThumbnailMode('url')}
                        className={`text-xs px-3 py-1 rounded-md transition-all ${
                          thumbnailMode === 'url' ? 'bg-white shadow-sm text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-700 font-medium'
                        }`}
                      >
                        Nhập URL
                      </button>
                      <button 
                        type="button"
                        onClick={() => setThumbnailMode('file')}
                        className={`text-xs px-3 py-1 rounded-md transition-all ${
                          thumbnailMode === 'file' ? 'bg-white shadow-sm text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-700 font-medium'
                        }`}
                      >
                        Tải lên
                      </button>
                    </div>
                  </div>
                  {thumbnailMode === 'url' ? (
                    <input 
                      type="text" 
                      value={thumbnailUrl}
                      onChange={(e) => setThumbnailUrl(e.target.value)}
                      placeholder="https://..." 
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-medium mb-2" 
                    />
                  ) : (
                    <div className="relative mb-2">
                      <input 
                        type="file" 
                        accept="image/*"
                        disabled={isUploadingThumbnail}
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setIsUploadingThumbnail(true);
                            const url = await uploadImageToCloudinary(file);
                            if (url) setThumbnailUrl(url);
                            setIsUploadingThumbnail(false);
                          }
                        }}
                        className={`absolute inset-0 w-full h-full opacity-0 z-10 ${isUploadingThumbnail ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      />
                      <div className={`w-full px-4 py-2.5 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center gap-2 transition-colors ${isUploadingThumbnail ? 'opacity-70' : 'hover:bg-slate-100'}`}>
                        <CloudUpload className={`w-5 h-5 ${isUploadingThumbnail ? 'text-blue-500 animate-pulse' : 'text-slate-400'}`} />
                        <span className="text-sm font-medium text-slate-600">
                          {isUploadingThumbnail ? 'Đang tải lên...' : 'Chọn file từ máy tính'}
                        </span>
                      </div>
                    </div>
                  )}
                  <div className="w-24 h-16 rounded-md overflow-hidden border border-slate-200 flex items-center justify-center bg-slate-100">
                    {thumbnailUrl ? (
                      <img src={thumbnailUrl} alt="Thumbnail preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">Trống</span>
                    )}
                  </div>
                </div>

                {/* Gallery Section */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Ảnh phụ (Gallery)</label>
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-2">
                    {galleryItems.map((item, index) => (
                      <div key={index} className="flex gap-2">
                        <div className="flex-1 flex flex-col gap-1.5 p-2 bg-slate-50 rounded-lg border border-slate-100">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-semibold text-slate-500">Ảnh {index + 1}</span>
                            <div className="bg-slate-200/70 p-0.5 rounded flex items-center">
                              <button 
                                type="button"
                                onClick={() => handleUpdateGalleryItemMode(index, 'url')}
                                className={`text-[10px] px-2 py-0.5 rounded transition-all ${
                                  item.mode === 'url' ? 'bg-white shadow-sm text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-700'
                                }`}
                              >
                                Nhập URL
                              </button>
                              <button 
                                type="button"
                                onClick={() => handleUpdateGalleryItemMode(index, 'file')}
                                className={`text-[10px] px-2 py-0.5 rounded transition-all ${
                                  item.mode === 'file' ? 'bg-white shadow-sm text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-700'
                                }`}
                              >
                                Tải lên
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            {item.mode === 'url' ? (
                              <input 
                                type="text" 
                                value={item.value}
                                onChange={(e) => handleUpdateGalleryItemValue(index, e.target.value)}
                                placeholder="https://..." 
                                className="flex-1 px-3 py-2 rounded-md border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-medium" 
                              />
                            ) : (
                              <div className="relative flex-1">
                                <input 
                                  type="file" 
                                  accept="image/*"
                                  disabled={item.isUploading}
                                  onChange={(e) => handleGalleryFileUpload(index, e.target.files[0])}
                                  className={`absolute inset-0 w-full h-full opacity-0 z-10 ${item.isUploading ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                                />
                                <div className={`w-full h-full min-h-[38px] rounded-md border-2 border-dashed border-slate-300 bg-white flex items-center justify-center gap-1.5 transition-colors ${item.isUploading ? 'opacity-70' : 'hover:bg-slate-50'}`}>
                                  <CloudUpload className={`w-4 h-4 ${item.isUploading ? 'text-blue-500 animate-pulse' : 'text-slate-400'}`} />
                                  <span className="text-xs font-medium text-slate-600">
                                    {item.isUploading ? 'Đang tải...' : (item.value ? 'Đổi file' : 'Chọn file')}
                                  </span>
                                </div>
                              </div>
                            )}
                            
                            <div className="w-[38px] h-[38px] rounded overflow-hidden border border-slate-200 flex-shrink-0 bg-white flex items-center justify-center">
                              {item.value ? (
                                <img src={item.value} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <span className="text-[9px] text-slate-300 font-medium">Trống</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <button 
                          type="button"
                          onClick={() => handleRemoveGalleryItem(index)}
                          className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0 self-center"
                          title="Xóa"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button 
                    type="button"
                    onClick={handleAddGalleryItem}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1 mt-2"
                  >
                    <Plus className="w-4 h-4" />
                    Thêm ảnh phụ
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Chi nhánh *</label>
                  <select 
                    name="location"
                    defaultValue={editCar?.location || 'Chi nhánh Cầu Giấy (Hà Nội)'}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm bg-white font-medium cursor-pointer"
                  >
                    <option value="Chi nhánh Cầu Giấy (Hà Nội)">Chi nhánh Cầu Giấy (Hà Nội)</option>
                    <option value="Chi nhánh Hoàn Kiếm (Hà Nội)">Chi nhánh Hoàn Kiếm (Hà Nội)</option>
                    <option value="Chi nhánh Lê Chân (Hải Phòng)">Chi nhánh Lê Chân (Hải Phòng)</option>
                    <option value="Chi nhánh Quận 1 (TP.HCM)">Chi nhánh Quận 1 (TP.HCM)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Trạng thái</label>
                  <select 
                    name="status"
                    defaultValue={editCar?.status || 'available'}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm bg-white font-medium cursor-pointer"
                  >
                    <option value="available">Đang rảnh</option>
                    <option value="rented">Đang thuê</option>
                    <option value="maintenance">Bảo trì</option>
                    <option value="locked_pending">Khoá (Pending)</option>
                  </select>
                </div>
              </div>

              {/* Amenities Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tiện nghi có sẵn</label>
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 p-4 border border-slate-200 rounded-lg bg-slate-50">
                  {AVAILABLE_FEATURES.map((feature) => (
                    <label key={feature} className="flex items-center space-x-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={selectedFeatures.includes(feature)}
                        onChange={() => handleFeatureToggle(feature)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" 
                      />
                      <span className="text-sm font-medium text-gray-700">{feature}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3 shrink-0 rounded-b-xl">
              <button 
                type="button"
                onClick={() => { setIsAddModalOpen(false); setEditCar(null); }}
                className="px-4 py-2 rounded-lg font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Hủy
              </button>
              <button 
                type="submit"
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm transition-all"
              >
                {editCar ? 'Lưu thay đổi' : 'Thêm xe'}
              </button>
            </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
