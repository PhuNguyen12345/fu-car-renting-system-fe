import { Link, useParams, useNavigate } from "react-router-dom"
import { mockCars } from "@/data/mockCars"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"

const mockReviews = [
  {
    name: "Hoàng Trần",
    date: "Tháng 6, 2026",
    rating: 5,
    comment: "Xe chạy rất đầm và êm, chuyến đi cao tốc Hà Nội - Hải Phòng cuối tuần cực kỳ thoải mái. Chắc chắn sẽ thuê lại!",
    mockImage: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=2070&auto=format&fit=crop"
  },
  {
    name: "Tuấn Anh",
    date: "Tháng 5, 2026",
    rating: 4,
    comment: "Thủ tục giao nhận xe nhanh chóng, chủ xe nhiệt tình hỗ trợ. Xe sạch sẽ và bảo dưỡng tốt, điều hòa mát lạnh. Tuy nhiên xe hơi hao xăng một chút.",
    mockImage: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop"
  },
  {
    name: "Minh Trang",
    date: "Tháng 4, 2026",
    rating: 5,
    comment: "Rất ưng ý với không gian nội thất rộng rãi của xe. Rất phù hợp cho chuyến du lịch cùng gia đình 4 người.",
    mockImage: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2070&auto=format&fit=crop"
  },
  {
    name: "Đức Kiên",
    date: "Tháng 3, 2026",
    rating: 5,
    comment: "Xe mới, nội thất đẹp và sạch sẽ. Động cơ mạnh mẽ, vượt đèo rất nhẹ nhàng.",
    mockImage: "https://images.unsplash.com/photo-1503376249781-44675f922712?q=80&w=2070&auto=format&fit=crop"
  },
  {
    name: "Lê Phương",
    date: "Tháng 2, 2026",
    rating: 4,
    comment: "Xe chạy êm, cách âm tốt. Phù hợp đi lại trong phố. Giá thuê hợp lý.",
    mockImage: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2070&auto=format&fit=crop"
  },
  {
    name: "Quốc Đạt",
    date: "Tháng 1, 2026",
    rating: 5,
    comment: "Trải nghiệm tuyệt vời. Chủ xe giao xe đúng giờ, nhiệt tình hướng dẫn các tính năng trên xe.",
    mockImage: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=2070&auto=format&fit=crop"
  }
]
import { Button } from "@/components/ui/button"
import { Users, Fuel, DoorOpen, Settings, CheckCircle2, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Star, ShieldCheck } from "lucide-react"
import { useState, useMemo, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, differenceInDays } from "date-fns"

export function CarDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const car = mockCars.find(c => c.id === parseInt(id))
  
  const carImages = car?.images || (car ? [
    car.image,
    "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop"
  ] : [])

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [activeReviewIndex, setActiveReviewIndex] = useState(null)
  const [activeFilter, setActiveFilter] = useState('Tất cả')
  
  const reviewsWithImages = useMemo(() => mockReviews.filter(r => r.mockImage), [])

  useEffect(() => {
    setCurrentImageIndex(0)
  }, [id])
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000)
  })

  const days = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return 0;
    const diff = differenceInDays(dateRange.to, dateRange.from);
    return diff > 0 ? diff : 1; // Minimum 1 day
  }, [dateRange]);

  const totalCost = days * (car?.pricePerDay || 0);

  const totalReviews = mockReviews.length;
  const averageRating = (mockReviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews).toFixed(1);
  const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  mockReviews.forEach(r => ratingCounts[r.rating]++);
  
  const ratingBars = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    val: Math.round((ratingCounts[stars] / totalReviews) * 100) || 0,
    text: `${Math.round((ratingCounts[stars] / totalReviews) * 100) || 0}%`
  }));

  if (!car) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Không tìm thấy xe!</h2>
        <p className="text-gray-500 mb-8">Chiếc xe bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        <Button onClick={() => navigate('/cars')} className="bg-fpt-blue text-white">Quay lại danh sách xe</Button>
      </div>
    )
  }

  return (
    <div className="bg-[#F8F9FA] min-h-screen pb-24">
      {/* Breadcrumb Header */}
      <div className="bg-white border-b border-gray-200 py-3">
        <div className="container mx-auto px-4">
          <Link 
            to="/cars"
            className="inline-flex items-center text-sm font-semibold text-gray-600 hover:text-fpt-blue hover:bg-fpt-blue/10 px-4 py-2 rounded-xl transition-all"
          >
            <ChevronLeft className="w-4 h-4 mr-1" /> Quay lại danh sách xe
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 pt-8 pb-16">
        <div className="flex flex-col lg:flex-row gap-8 mb-12">
          
          {/* Main Content (Left) */}
          <div className="w-full lg:w-2/3 space-y-8">
            {/* Image Gallery */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4">
              <div className="w-full relative overflow-hidden bg-gray-100 rounded-xl aspect-[16/9] group">
                <img 
                  src={carImages[currentImageIndex]} 
                  alt={car.name} 
                  className="w-full h-full object-cover rounded-xl transition-all duration-500 ease-in-out" 
                />
                
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full font-bold text-fpt-blue shadow-sm">
                  {car.category}
                </div>

                {/* Left/Right Buttons */}
                <button 
                  onClick={() => setCurrentImageIndex(prev => (prev === 0 ? carImages.length - 1 : prev - 1))}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-14 bg-white/90 hover:bg-white text-gray-600 hover:text-fpt-blue flex items-center justify-center shadow-md transition-all duration-300 rounded-sm opacity-0 group-hover:opacity-100"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={() => setCurrentImageIndex(prev => (prev === carImages.length - 1 ? 0 : prev + 1))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-14 bg-white/90 hover:bg-white text-gray-600 hover:text-fpt-blue flex items-center justify-center shadow-md transition-all duration-300 rounded-sm opacity-0 group-hover:opacity-100"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Image Counter Badge */}
                <div className="absolute bottom-4 right-4 bg-gray-900/70 text-white text-sm font-medium px-3 py-1 rounded-full backdrop-blur-sm">
                  {currentImageIndex + 1} / {carImages.length}
                </div>
              </div>

              {/* Centered Thumbnail Strip */}
              <div className="flex justify-center gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
                {carImages.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-16 h-12 rounded-sm overflow-hidden cursor-pointer flex-shrink-0 relative transition-all ${
                      currentImageIndex === index 
                        ? 'border-2 border-fpt-blue opacity-100 scale-105 shadow-sm' 
                        : 'opacity-50 hover:opacity-100 border border-gray-200'
                    }`}
                  >
                    <img 
                      src={img} 
                      alt={`${car.name} thumbnail ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Car Details Header */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-6">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">{car.name}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-500 font-medium">
                    <span className="flex items-center text-amber-500"><Star className="w-4 h-4 mr-1 fill-current" /> 4.9 (128 Đánh giá)</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span className="flex items-center text-emerald-600"><ShieldCheck className="w-4 h-4 mr-1" /> Xe đã kiểm định</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-lg leading-relaxed mb-8">{car.description}</p>

              <h3 className="text-xl font-bold text-gray-900 mb-6">Thông số kỹ thuật</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2">
                  <Users className="w-6 h-6 text-fpt-teal" />
                  <span className="text-sm font-semibold text-gray-700">{car.seats} Chỗ</span>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2">
                  <Settings className="w-6 h-6 text-fpt-teal" />
                  <span className="text-sm font-semibold text-gray-700">{car.transmission}</span>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2">
                  <Fuel className="w-6 h-6 text-fpt-teal" />
                  <span className="text-sm font-semibold text-gray-700">{car.fuelType}</span>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2">
                  <DoorOpen className="w-6 h-6 text-fpt-teal" />
                  <span className="text-sm font-semibold text-gray-700">{car.doors} Cửa</span>
                </div>
              </div>
            </div>

            {/* Features List */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
               <h3 className="text-xl font-bold text-gray-900 mb-6">Tiện nghi có sẵn</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {["Điều hòa nhiệt độ", "Màn hình cảm ứng", "Camera lùi", "Cảm biến va chạm", "Bluetooth/USB", "Cửa sổ trời", "Ghế da cao cấp", "Hệ thống định vị GPS"].map(feature => (
                    <div key={feature} className="flex items-center gap-3 text-gray-700 font-medium">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <span>{feature}</span>
                    </div>
                 ))}
               </div>
            </div>

            {/* Customer Reviews Section */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
               <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
                 <h3 className="text-xl font-bold text-gray-900">Đánh giá từ khách hàng</h3>
               </div>
               
               {/* Rating Summary Dashboard */}
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 border border-slate-200 rounded-2xl bg-slate-50/50 mb-8 shadow-sm">
                 <div className="flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-slate-200 pb-4 md:pb-0">
                   <div className="flex items-center gap-2 mb-2">
                     <span className="text-5xl font-extrabold text-gray-900">{averageRating}</span>
                     <div className="flex flex-col items-start justify-center">
                       <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Trên 5</span>
                     </div>
                   </div>
                   <p className="text-sm font-bold text-gray-800 mt-2">100% khách hài lòng</p>
                   <p className="text-xs text-gray-500 font-medium">{totalReviews} đánh giá</p>
                 </div>
                 
                 <div className="flex flex-col justify-center gap-2 px-2 border-b md:border-b-0 md:border-r border-slate-200 pb-4 md:pb-0">
                   {ratingBars.map((bar) => (
                     <div key={bar.stars} className="flex items-center gap-3">
                       <span className="text-sm font-bold text-gray-600 w-3">{bar.stars}</span>
                       <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                       <Progress value={bar.val} className="h-2 flex-1 bg-slate-200" />
                       <span className="text-xs font-semibold text-gray-500 w-8 text-right">{bar.text}</span>
                     </div>
                   ))}
                 </div>
                 
                 <div className="flex flex-col justify-center">
                   <div className="grid grid-cols-3 gap-2">
                     {reviewsWithImages.slice(0, 5).map((r, i) => (
                       <img onClick={() => setActiveReviewIndex(i)} key={i} src={r.mockImage} className="w-full aspect-square object-cover rounded-md shadow-sm cursor-pointer hover:opacity-90 transition-opacity" alt="Customer picture" />
                     ))}
                     {reviewsWithImages.length >= 6 && (
                       <div onClick={() => setActiveReviewIndex(5)} className="relative w-full aspect-square rounded-md overflow-hidden shadow-sm cursor-pointer group">
                         <img src={reviewsWithImages[5].mockImage} className="w-full h-full object-cover" alt="See more" />
                         <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white text-xs font-bold text-center p-1 group-hover:bg-black/80 transition-colors">
                           Xem {reviewsWithImages.length} ảnh
                         </div>
                       </div>
                     )}
                   </div>
                 </div>
               </div>

               {/* Review Filter Bar */}
               <div className="flex flex-wrap items-center justify-between gap-4 py-4 mb-2 border-b border-slate-200">
                 <div className="flex flex-wrap items-center gap-3">
                   <button 
                     onClick={() => setActiveFilter('Tất cả')}
                     className={`px-4 py-1.5 text-sm border rounded-full font-medium transition-colors ${
                       activeFilter === 'Tất cả' 
                         ? 'border-blue-500 text-blue-600 bg-blue-50' 
                         : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                     }`}
                   >
                     Tất cả
                   </button>
                   {[5, 4, 3, 2, 1].map(num => (
                     <button 
                       key={num}
                       onClick={() => setActiveFilter(num)}
                       className={`flex items-center gap-1 px-4 py-1.5 text-sm border rounded-full font-medium transition-colors ${
                         activeFilter === num 
                           ? 'border-blue-500 text-blue-600 bg-blue-50' 
                           : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                       }`}
                     >
                       {num} <Star className={`w-3.5 h-3.5 ${activeFilter === num ? 'fill-blue-500 text-blue-500' : 'fill-amber-400 text-amber-400'}`} />
                     </button>
                   ))}
                   <label className="flex items-center gap-2 cursor-pointer ml-2">
                     <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                     <span className="text-sm font-medium text-slate-700">Có hình ảnh ({reviewsWithImages.length})</span>
                   </label>
                 </div>
                 <div className="flex items-center gap-2">
                   <span className="text-sm text-slate-700 font-medium cursor-pointer flex items-center gap-1">
                     Xếp theo: Mới nhất <ChevronRight className="w-4 h-4 rotate-90" />
                   </span>
                 </div>
               </div>

               {/* Reviews List */}
               <div className="space-y-0">
                 {mockReviews.map((review, index) => (
                   <div key={index} className="py-6 border-b border-slate-100 last:border-0 flex flex-col md:flex-row gap-4">
                     <div className="flex-shrink-0 hidden md:block">
                       <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-lg shadow-sm border border-blue-200">
                         {review.name.charAt(0)}
                       </div>
                     </div>
                     <div className="flex-1">
                       <div className="flex items-center gap-3 mb-1">
                         <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm md:hidden">
                           {review.name.charAt(0)}
                         </div>
                         <h4 className="text-base font-bold text-gray-900">{review.name}</h4>
                         <span className="text-sm text-gray-500 font-medium">{review.date}</span>
                       </div>
                       <div className="flex items-center gap-1 mb-3">
                         {[...Array(review.rating)].map((_, i) => (
                           <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                         ))}
                       </div>
                       <p className="text-gray-700 leading-relaxed mb-4 font-medium">
                         "{review.comment}"
                       </p>
                       
                       {review.mockImage && (
                         <div 
                           onClick={() => {
                             const idx = reviewsWithImages.findIndex(r => r.name === review.name);
                             if (idx !== -1) setActiveReviewIndex(idx);
                           }}
                           className="inline-block relative rounded-lg overflow-hidden cursor-pointer group shadow-sm border border-gray-200 mt-2"
                         >
                           <img src={review.mockImage} className="w-24 h-24 object-cover transition-transform duration-300 group-hover:scale-110" alt="Review thumbnail" />
                           <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                         </div>
                       )}
                     </div>
                   </div>
                 ))}
               </div>
               
               {/* Action Buttons */}
               <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 pt-8 border-t border-gray-100">
                 <Button variant="outline" className="w-full sm:w-[220px] h-11 border-gray-400 text-gray-700 font-semibold hover:bg-gray-50 rounded-lg text-sm shadow-sm transition-all">
                   Xem thêm đánh giá
                 </Button>
                 <Button className="w-full sm:w-[220px] h-11 bg-[#0066FF] hover:bg-blue-700 text-white font-semibold rounded-lg text-sm shadow-sm transition-all">
                   Viết đánh giá
                 </Button>
               </div>
               
               {/* Standalone Dialog for Cross-Review Navigation */}
               <Dialog open={activeReviewIndex !== null} onOpenChange={(open) => !open && setActiveReviewIndex(null)}>
                 <DialogContent className="sm:max-w-5xl p-0 overflow-hidden bg-white rounded-2xl border-0 shadow-2xl w-[95vw] max-h-[90vh] flex flex-col">
                   {activeReviewIndex !== null && reviewsWithImages[activeReviewIndex] && (
                     <>
                       {/* Header */}
                       <div className="flex justify-between items-center p-4 border-b border-gray-100 shrink-0">
                         <div className="text-blue-500 font-medium text-sm cursor-pointer flex items-center hover:underline" onClick={() => setActiveReviewIndex(null)}>
                           <ChevronLeft className="w-4 h-4 mr-1" /> Xem tất cả ảnh
                         </div>
                       </div>
                       
                       {/* Navigation Arrows Positioned at the edges of the Dialog */}
                       <button 
                         onClick={(e) => { e.stopPropagation(); setActiveReviewIndex(prev => prev > 0 ? prev - 1 : reviewsWithImages.length - 1); }}
                         className="absolute left-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-700 hover:bg-gray-100 shadow-md border border-gray-200 transition-colors"
                       >
                         <ChevronLeft className="w-6 h-6" />
                       </button>
                       <button 
                         onClick={(e) => { e.stopPropagation(); setActiveReviewIndex(prev => prev < reviewsWithImages.length - 1 ? prev + 1 : 0); }}
                         className="absolute right-4 top-1/2 -translate-y-1/2 z-50 w-10 h-10 rounded-full bg-white flex items-center justify-center text-gray-700 hover:bg-gray-100 shadow-md border border-gray-200 transition-colors"
                       >
                         <ChevronRight className="w-6 h-6" />
                       </button>

                       {/* Body */}
                       <div className="flex flex-col md:flex-row flex-1 overflow-y-auto">
                         {/* Image Side - Clean, no internal arrows */}
                         <div className="w-full md:w-[55%] bg-white flex items-center justify-center p-6 md:p-8">
                           <img src={reviewsWithImages[activeReviewIndex].mockImage} className="w-full h-auto max-h-[70vh] object-contain rounded-xl shadow-sm border border-gray-100" alt="Full review picture" />
                         </div>
                         
                         {/* Content Side */}
                         <div className="w-full md:w-[45%] p-8 overflow-y-auto border-t md:border-t-0 md:border-l border-gray-100 bg-white">
                           <div className="flex items-center gap-3 mb-2">
                             <h4 className="text-[15px] font-bold text-gray-900">{reviewsWithImages[activeReviewIndex].name}</h4>
                             <div className="flex items-center text-emerald-600 text-[12px] font-medium gap-1">
                               <CheckCircle2 className="w-4 h-4" />
                               Đã đặt xe
                             </div>
                           </div>
                           <div className="flex items-center gap-1 mb-4">
                             {[...Array(reviewsWithImages[activeReviewIndex].rating)].map((_, i) => (
                               <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                             ))}
                           </div>
                           <p className="text-gray-800 leading-relaxed text-[15px] whitespace-pre-line">
                             {reviewsWithImages[activeReviewIndex].comment}
                           </p>
                           <p className="text-sm text-gray-400 mt-6 font-medium">{reviewsWithImages[activeReviewIndex].date}</p>
                         </div>
                       </div>
                     </>
                   )}
                 </DialogContent>
               </Dialog>
            </div>
          </div>

          {/* Booking Sidebar (Right) */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-gray-100 sticky top-28">
              <div className="mb-6 pb-6 border-b border-gray-100">
                <p className="text-sm text-gray-500 font-medium mb-1">Giá thuê</p>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold text-fpt-blue">{car.pricePerDay.toLocaleString('vi-VN')} ₫</span>
                  <span className="text-gray-500 font-medium mb-1">/ ngày</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Thời gian thuê</label>
                  <Popover>
                    <PopoverTrigger className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-xl hover:border-fpt-blue transition-colors text-left bg-gray-50 hover:bg-white text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5 text-fpt-blue" />
                        <span className="text-gray-700">
                          {dateRange?.from ? format(dateRange.from, "dd/MM/yyyy") : "Bắt đầu"} - {dateRange?.to ? format(dateRange.to, "dd/MM/yyyy") : "Kết thúc"}
                        </span>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="center">
                      <Calendar
                        mode="range"
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={1}
                        className="bg-white rounded-lg border shadow-lg p-4"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5 mb-8">
                <div className="flex justify-between items-center mb-3 text-sm text-gray-600 font-medium">
                  <span>Giá thuê ({days} ngày)</span>
                  <span>{(days * car.pricePerDay).toLocaleString('vi-VN')} ₫</span>
                </div>
                <div className="flex justify-between items-center mb-3 text-sm text-gray-600 font-medium">
                  <span>Phí dịch vụ (10%)</span>
                  <span>{(days * car.pricePerDay * 0.1).toLocaleString('vi-VN')} ₫</span>
                </div>
                <hr className="my-3 border-gray-200" />
                <div className="flex justify-between items-center font-bold text-lg">
                  <span className="text-gray-900">Tổng cộng</span>
                  <span className="text-fpt-blue">{(totalCost + totalCost * 0.1).toLocaleString('vi-VN')} ₫</span>
                </div>
              </div>

              <Button onClick={() => navigate(`/checkout/${car.id}`)} className="w-full h-14 rounded-xl text-lg font-bold bg-fpt-blue hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all hover:-translate-y-1">
                Tiếp tục đặt xe
              </Button>
              <p className="text-center text-xs text-gray-400 mt-4 font-medium">
                Bạn chưa bị trừ tiền ở bước này.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
