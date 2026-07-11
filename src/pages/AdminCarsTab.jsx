import { Plus, Search, Edit, X, CloudUpload, Trash2, MapPin, Loader2, RotateCcw } from "lucide-react"
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
import { carService } from "@/services/carService"

const AVAILABLE_FEATURES = ['Điều hòa nhiệt độ', 'Camera lùi', 'Bluetooth/USB', 'Ghế da cao cấp', 'Màn hình cảm ứng', 'Cảm biến va chạm', 'Cửa sổ trời', 'Hệ thống định vị GPS'];

const getStatusBadge = (status) => {
  switch (status) {
    case 'AVAILABLE':
      return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200">Đang rảnh</span>
    case 'RENTED':
      return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700 border border-yellow-200">Đang thuê</span>
    case 'MAINTENANCE':
      return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">Bảo trì</span>
    case 'UNAVAILABLE':
      return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">Khoá</span>
    default:
      return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200">{status}</span>
  }
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

export function AdminCarsTab() {
  const [cars, setCars] = useState([])
  const [locations, setLocations] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)

  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [totalElements, setTotalElements] = useState(0)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editCar, setEditCar] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [thumbnailMode, setThumbnailMode] = useState('url')
  const [thumbnailUrl, setThumbnailUrl] = useState('')
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false)
  const [galleryItems, setGalleryItems] = useState([])
  const [selectedFeatures, setSelectedFeatures] = useState([])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [carsRes, locRes, brandsRes] = await Promise.all([
        carService.getAdminCars({
          page,
          size: 10,
          keyword: searchKeyword || undefined,
          status: filterStatus !== 'all' ? filterStatus : undefined
        }),
        carService.getLocations(),
        carService.getBrands()
      ]);
      setCars(carsRes.content || [])
      setTotalPages(carsRes.totalPages || 1)
      setTotalElements(carsRes.totalElements || 0)
      setLocations(locRes)
      setBrands(brandsRes)
    } catch (err) {
      console.error("Lỗi lấy dữ liệu", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [page, searchKeyword, filterStatus])

  useEffect(() => {
    if (editCar) {
      setThumbnailMode('url')
      const primaryImg = editCar.images?.find(img => img.isPrimary)?.url || editCar.thumbnailUrl || ''
      setThumbnailUrl(primaryImg)

      const galleryUrls = editCar.images?.filter(img => !img.isPrimary).map(img => img.url) || editCar.galleryUrls || []
      setGalleryItems(galleryUrls.map(url => ({ mode: 'url', value: url, isUploading: false })))
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

    try {
      const sigData = await carService.getCloudinarySignature();
      const formData = new FormData();
      formData.append('file', file);
      formData.append('signature', sigData.signature);
      formData.append('timestamp', sigData.timestamp);
      formData.append('api_key', sigData.apiKey);
      formData.append('folder', sigData.folder);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`, {
        method: 'POST',
        body: formData
      });
      const uploadData = await res.json();

      setGalleryItems(prevItems => {
        const updated = [...prevItems]
        if (uploadData.secure_url) updated[index].value = uploadData.secure_url
        updated[index].isUploading = false
        return updated
      })
    } catch (err) {
      console.error(err);
      alert("Tải ảnh thất bại")
      setGalleryItems(prevItems => {
        const updated = [...prevItems]
        updated[index].isUploading = false
        return updated
      })
    }
  }

  const handleRemoveGalleryItem = (index) => {
    setGalleryItems(galleryItems.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = {
      name: formData.get('name'),
      licensePlate: formData.get('licensePlate'),
      pricePerDay: Number(formData.get('pricePerDay')),
      locationId: formData.get('locationId'),
      brandId: formData.get('brandId'),
      type: formData.get('type'),
      seats: Number(formData.get('seats')),
      transmission: formData.get('transmission'),
      fuelType: formData.get('fuelType'),
      fuelConsumption: formData.get('fuelConsumption'),
      description: formData.get('description'),
      status: formData.get('status') || 'AVAILABLE',
      thumbnailUrl: thumbnailUrl,
      galleryUrls: galleryItems.map(item => item.value).filter(url => url !== ''),
      features: selectedFeatures,
    }

    setIsSubmitting(true)
    try {
      if (editCar) {
        await carService.updateCar(editCar.id, payload)
        alert('Cập nhật xe thành công!')
      } else {
        await carService.createCar(payload)
        alert('Thêm xe thành công!')
      }
      setIsAddModalOpen(false)
      setEditCar(null)
      fetchData()
    } catch (err) {
      alert('Có lỗi xảy ra: ' + (err.response?.data?.message || err.message))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (confirm("Bạn có chắc chắn muốn khoá/xoá xe này?")) {
      try {
        await carService.deleteCar(id);
        alert('Đã khoá xe');
        fetchData();
      } catch (err) {
        alert('Có lỗi xảy ra: ' + err.message);
      }
    }
  }

  const handleRestore = async (id) => {
    if (confirm("Bạn có chắc chắn muốn khôi phục (mở khoá) xe này?")) {
      try {
        await carService.restoreCar(id);
        alert('Đã khôi phục xe');
        fetchData();
      } catch (err) {
        alert('Có lỗi xảy ra: ' + err.message);
      }
    }
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
            value={searchKeyword}
            onChange={(e) => {
              setSearchKeyword(e.target.value);
              setPage(0);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-medium text-slate-700 placeholder:text-slate-400 shadow-sm"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setPage(0);
          }}
          className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm sm:w-48 cursor-pointer"
        >
          <option value="all">Tất cả</option>
          <option value="AVAILABLE">Đang rảnh</option>
          <option value="RENTED">Đang thuê</option>
          <option value="MAINTENANCE">Bảo trì</option>
          <option value="UNAVAILABLE">Khoá</option>
        </select>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto bg-white border border-slate-200 rounded-xl shadow-sm relative min-h-[300px]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm z-10">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        ) : null}
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
            {cars.map((car) => (
              <tr key={car.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <img src={car.imageUrl || 'https://placehold.co/300x200'} alt={car.name} className="w-16 h-12 object-cover rounded-md border border-slate-200 shadow-sm" />
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900 text-base">{car.name}</div>
                  <div className="text-xs font-semibold text-slate-500 mt-0.5">{car.licensePlate || 'Chưa cập nhật'}</div>
                  <div className="flex items-center gap-1 text-xs text-slate-500 mt-1 font-medium">
                    <MapPin className="w-3.5 h-3.5" />
                    {car.locationName || 'Chưa cập nhật'}
                  </div>
                </td>
                <td className="px-6 py-4 font-semibold text-slate-700">
                  {formatCurrency(car.pricePerDay)}
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(car.status)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={async () => {
                        try {
                          const detail = await carService.getAdminCarDetail(car.id);
                          setEditCar(detail);
                        } catch (err) {
                          console.error(err);
                          alert("Không lấy được thông tin chi tiết xe");
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    {car.status !== 'UNAVAILABLE' ? (
                      <button
                        onClick={() => handleDelete(car.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Khoá xe (Xóa mềm)"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleRestore(car.id)}
                        className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        title="Khôi phục xe"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {cars.length === 0 && !loading && (
              <tr>
                <td colSpan="5" className="text-center py-8 text-slate-500">
                  Không tìm thấy xe nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-white px-6 py-4">
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-500">
                Hiển thị <span className="font-semibold text-slate-900">{cars.length > 0 ? page * 10 + 1 : 0}</span> đến <span className="font-semibold text-slate-900">{page * 10 + cars.length}</span> trong số <span className="font-semibold text-slate-900">{totalElements}</span> kết quả
              </p>
            </div>
            <div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage(Math.max(0, page - 1))}
                      className={`text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer ${page === 0 ? 'opacity-50 pointer-events-none' : ''}`}
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        onClick={() => setPage(i)}
                        isActive={page === i}
                        className={`cursor-pointer ${page === i ? 'bg-blue-600 text-white hover:bg-blue-700 hover:text-white border-blue-600 shadow-sm' : 'text-slate-500 hover:text-blue-600 hover:bg-blue-50 border-transparent hover:border-blue-200 transition-colors'}`}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
                      className={`text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer ${page >= totalPages - 1 ? 'opacity-50 pointer-events-none' : ''}`}
                    />
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
          <div className="w-full max-w-4xl max-h-[90vh] flex flex-col bg-white rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
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
              <div className="p-6 overflow-y-auto flex-1 space-y-6">

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Tên xe *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      defaultValue={editCar?.name || ''}
                      placeholder="VD: VinFast VF8"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Thương hiệu *</label>
                    <select
                      name="brandId"
                      required
                      defaultValue={editCar?.brandId || ''}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm bg-white font-medium cursor-pointer"
                    >
                      <option value="">Chọn thương hiệu</option>
                      {brands.map(brand => (
                        <option key={brand.id} value={brand.id}>{brand.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Biển số *</label>
                    <input
                      type="text"
                      name="licensePlate"
                      required
                      defaultValue={editCar?.licensePlate || ''}
                      placeholder="VD: 30A-123.45"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Giá thuê/ngày *</label>
                    <input
                      type="number"
                      name="pricePerDay"
                      required
                      defaultValue={editCar?.pricePerDay || ''}
                      placeholder="VD: 1000000"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kiểu dáng *</label>
                    <select
                      name="type"
                      required
                      defaultValue={editCar?.type || 'SEDAN'}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm bg-white font-medium cursor-pointer"
                    >
                      <option value="SEDAN">Sedan</option>
                      <option value="SUV">SUV</option>
                      <option value="HATCHBACK">Hatchback</option>
                      <option value="CUV">CUV</option>
                      <option value="MPV">MPV</option>
                      <option value="PICKUP">Bán tải</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Số ghế *</label>
                    <input
                      type="number"
                      name="seats"
                      required
                      defaultValue={editCar?.seats || 5}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Truyền động *</label>
                    <select
                      name="transmission"
                      required
                      defaultValue={editCar?.transmission || 'AUTO'}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm bg-white font-medium cursor-pointer"
                    >
                      <option value="AUTO">Tự động</option>
                      <option value="MANUAL">Số sàn</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nhiên liệu *</label>
                    <select
                      name="fuelType"
                      required
                      defaultValue={editCar?.fuelType || 'GASOLINE'}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm bg-white font-medium cursor-pointer"
                    >
                      <option value="GASOLINE">Xăng</option>
                      <option value="DIESEL">Dầu Diesel</option>
                      <option value="ELECTRIC">Điện</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mức tiêu thụ</label>
                    <input
                      type="text"
                      name="fuelConsumption"
                      defaultValue={editCar?.fuelConsumption || ''}
                      placeholder="VD: 7 L/100km"
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mô tả</label>
                  <textarea
                    name="description"
                    defaultValue={editCar?.description || ''}
                    rows="3"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm font-medium"
                  ></textarea>
                </div>

                {/* Image Section */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Thumbnail Section */}
                  <div>
                    <div className="flex justify-between items-center mb-1.5">
                      <label className="block text-sm font-semibold text-slate-700">Ảnh đại diện (Thumbnail) *</label>
                      <div className="bg-slate-100 p-0.5 rounded-lg flex items-center">
                        <button
                          type="button"
                          onClick={() => setThumbnailMode('url')}
                          className={`text-xs px-3 py-1 rounded-md transition-all ${thumbnailMode === 'url' ? 'bg-white shadow-sm text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-700 font-medium'
                            }`}
                        >
                          Nhập URL
                        </button>
                        <button
                          type="button"
                          onClick={() => setThumbnailMode('file')}
                          className={`text-xs px-3 py-1 rounded-md transition-all ${thumbnailMode === 'file' ? 'bg-white shadow-sm text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-700 font-medium'
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
                              try {
                                const sigData = await carService.getCloudinarySignature();
                                const formData = new FormData();
                                formData.append('file', file);
                                formData.append('signature', sigData.signature);
                                formData.append('timestamp', sigData.timestamp);
                                formData.append('api_key', sigData.apiKey);
                                formData.append('folder', sigData.folder);

                                const res = await fetch(`https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`, {
                                  method: 'POST',
                                  body: formData
                                });
                                const uploadData = await res.json();
                                if (uploadData.secure_url) setThumbnailUrl(uploadData.secure_url);
                              } catch (err) {
                                alert("Tải ảnh thất bại")
                              } finally {
                                setIsUploadingThumbnail(false);
                              }
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
                    <div className="w-32 h-20 rounded-md overflow-hidden border border-slate-200 flex items-center justify-center bg-slate-100 mt-2">
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
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                      {galleryItems.map((item, index) => (
                        <div key={index} className="flex gap-2">
                          <div className="flex-1 flex flex-col gap-1.5 p-2 bg-slate-50 rounded-lg border border-slate-100">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-semibold text-slate-500">Ảnh {index + 1}</span>
                              <div className="bg-slate-200/70 p-0.5 rounded flex items-center">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateGalleryItemMode(index, 'url')}
                                  className={`text-[10px] px-2 py-0.5 rounded transition-all ${item.mode === 'url' ? 'bg-white shadow-sm text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-700'
                                    }`}
                                >
                                  Nhập URL
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateGalleryItemMode(index, 'file')}
                                  className={`text-[10px] px-2 py-0.5 rounded transition-all ${item.mode === 'file' ? 'bg-white shadow-sm text-blue-600 font-semibold' : 'text-slate-500 hover:text-slate-700'
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
                      name="locationId"
                      required
                      defaultValue={editCar?.locationId || ''}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm bg-white font-medium cursor-pointer"
                    >
                      <option value="">Chọn chi nhánh</option>
                      {locations.map(loc => (
                        <option key={loc.id} value={loc.id}>{loc.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Trạng thái</label>
                    <select
                      name="status"
                      defaultValue={editCar?.status || 'AVAILABLE'}
                      disabled={editCar?.status === 'RENTED'}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm bg-white font-medium cursor-pointer disabled:bg-slate-100 disabled:cursor-not-allowed"
                    >
                      <option value="AVAILABLE">Đang rảnh</option>
                      <option value="RENTED" disabled>Đang thuê (Tự động)</option>
                      <option value="MAINTENANCE">Bảo trì</option>
                      <option value="UNAVAILABLE">Khoá</option>
                    </select>
                    {editCar?.status === 'RENTED' && (
                      <p className="text-[10px] text-red-500 mt-1 font-semibold">Xe đang có đơn thuê, không thể tự đổi trạng thái.</p>
                    )}
                  </div>
                </div>

                {/* Amenities Section */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Tiện nghi có sẵn</label>
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
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
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
