import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { carService } from "@/services/carService"
import { CarCard } from "@/components/common/CarCard"
import { Search, Filter, MapPin, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"

import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { formatVND } from "@/lib/utils"

export function CarListingPage() {
  const locationParams = useLocation()
  const searchParams = new URLSearchParams(locationParams.search)
  const initialCity = searchParams.get("city") || ""
  const initialStartDate = searchParams.get("startDate")
  const initialEndDate = searchParams.get("endDate")

  const [searchTerm, setSearchTerm] = useState("")
  const [searchCity, setSearchCity] = useState(initialCity)
  const [selectedCategory, setSelectedCategory] = useState("Tất cả")
  const [currentPage, setCurrentPage] = useState(1)
  const [priceRange, setPriceRange] = useState([0, 10000000]) // Min 0, Max 10 million VND
  const [sliderValue, setSliderValue] = useState([0, 10000000]) // UI state
  const [transmission, setTransmission] = useState("Tất cả")
  const [cars, setCars] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [selectedClasses, setSelectedClasses] = useState([])
  
  const [dateRange, setDateRange] = useState({
    from: initialStartDate ? new Date(initialStartDate) : new Date(),
    to: initialEndDate ? new Date(initialEndDate) : new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000)
  })
  const [tempLocation, setTempLocation] = useState(searchCity)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const ITEMS_PER_PAGE = 10

  const categories = ["Tất cả", "Sedan", "SUV", "Xe Mui Trần", "Xe Thể Thao", "Coupe", "Hatchback"]

  useEffect(() => {
    fetchCars()
  }, [currentPage, searchTerm, searchCity, selectedCategory, priceRange, transmission])

  const fetchCars = async () => {
    setLoading(true)
    try {
      const params = {
        page: currentPage - 1,
        size: ITEMS_PER_PAGE,
      }
      if (searchTerm) params.keyword = searchTerm;
      if (searchCity) params.city = searchCity;
      if (selectedCategory !== "Tất cả") {
        // Map category to uppercase format or specific backend constants
        const typeMap = {
          "Sedan": "SEDAN",
          "SUV": "SUV",
          "Xe Mui Trần": "CONVERTIBLE",
          "Xe Thể Thao": "SPORT",
          "Coupe": "COUPE",
          "Hatchback": "HATCHBACK"
        };
        params.type = typeMap[selectedCategory] || selectedCategory.toUpperCase();
      }
      if (transmission !== "Tất cả") {
        // Map transmission to backend constants
        params.transmission = transmission === "Tự động" ? "AUTO" : "MANUAL";
      }
      params.minPrice = priceRange[0];
      params.maxPrice = priceRange[1];

      const res = await carService.getPublicCars(params);
      setCars(res.content);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error("Error fetching cars:", err);
    } finally {
      setLoading(false);
    }
  }

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, searchCity, selectedCategory, priceRange, transmission, selectedClasses])

  // Debounce slider updates to prevent UI lag while dragging
  useEffect(() => {
    const handler = setTimeout(() => {
      setPriceRange(sliderValue)
    }, 300)
    return () => clearTimeout(handler)
  }, [sliderValue])

  const handleClearFilters = () => {
    setSearchTerm("")
    setSelectedCategory("Tất cả")
    setPriceRange([0, 10000000])
    setSliderValue([0, 10000000])
    setTransmission("Tất cả")
    setSelectedClasses([])
  }

  return (
    <div className="bg-[#F8F9FA] min-h-[calc(100vh-80px)] pt-8 pb-24">
      <div className="container mx-auto px-4 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 lg:w-72 flex-shrink-0">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-28">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Filter className="w-5 h-5 text-fpt-blue" />
              Bộ Lọc
            </h2>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Tìm kiếm</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Tìm kiếm xe..." 
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-fpt-blue focus:ring-1 focus:ring-fpt-blue transition-colors text-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <hr className="my-6 border-gray-100" />

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-4">Kiểu dáng</label>
              <div className="space-y-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === cat 
                        ? "bg-fpt-blue/10 text-fpt-blue font-semibold" 
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <hr className="my-6 border-gray-100" />

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-4">Hạng xe</label>
              <div className="flex flex-col gap-3">
                {["Phổ thông", "Trung cấp", "Hạng sang"].map(carClass => (
                  <div key={carClass} className="flex items-center space-x-3 cursor-pointer group">
                    <Checkbox 
                      id={`class-${carClass}`} 
                      checked={selectedClasses.includes(carClass)}
                      onCheckedChange={(checked) => {
                        setSelectedClasses(prev => 
                          checked 
                            ? [...prev, carClass]
                            : prev.filter(c => c !== carClass)
                        )
                      }}
                    />
                    <label 
                      htmlFor={`class-${carClass}`}
                      className="text-sm text-gray-600 cursor-pointer font-medium select-none flex-1 group-hover:text-fpt-blue transition-colors"
                    >
                      {carClass}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <hr className="my-6 border-gray-100" />

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-4 flex justify-between">
                <span>Khoảng giá / Ngày</span>
                <span className="text-fpt-blue">{formatVND(sliderValue[0])} - {formatVND(sliderValue[1])}</span>
              </label>
              <Slider
                value={sliderValue}
                max={10000000}
                step={500000}
                onValueChange={(val) => setSliderValue(val.value || val || [0, 10000000])}
                className="w-full cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2 font-medium">
                <span>0 ₫</span>
                <span>10 Tr+</span>
              </div>
            </div>

            <hr className="my-6 border-gray-100" />

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-4">Hộp số</label>
              <RadioGroup value={transmission} onValueChange={setTransmission} className="space-y-3">
                <div className="flex items-center space-x-3 cursor-pointer">
                  <RadioGroupItem value="Tất cả" id="trans-all" />
                  <label htmlFor="trans-all" className="text-sm text-gray-600 cursor-pointer font-medium select-none flex-1">Tất cả</label>
                </div>
                <div className="flex items-center space-x-3 cursor-pointer">
                  <RadioGroupItem value="Tự động" id="trans-auto" />
                  <label htmlFor="trans-auto" className="text-sm text-gray-600 cursor-pointer font-medium select-none flex-1">Tự động</label>
                </div>
                <div className="flex items-center space-x-3 cursor-pointer">
                  <RadioGroupItem value="Số sàn" id="trans-manual" />
                  <label htmlFor="trans-manual" className="text-sm text-gray-600 cursor-pointer font-medium select-none flex-1">Số sàn</label>
                </div>
              </RadioGroup>
            </div>
            
            <Button 
              onClick={handleClearFilters}
              variant="outline" 
              className="w-full mt-2"
            >
              Xóa Bộ Lọc
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-6 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Danh sách xe</h1>
              <p className="text-muted-foreground">Tìm chiếc xe hoàn hảo cho hành trình tiếp theo của bạn.</p>
            </div>
          </div>

          {/* Search Summary Bar */}
          <div className="bg-white rounded-xl shadow-sm p-4 mb-8 flex flex-col md:flex-row justify-between items-center gap-4 border border-gray-100">
            <div className="flex items-center gap-4 text-sm font-medium text-gray-700 flex-wrap justify-center">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-fpt-blue" />
                <span>{searchCity || "Tất cả địa điểm"}</span>
              </div>
              <div className="hidden sm:block w-px h-6 bg-gray-200"></div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-fpt-blue" />
                <span>
                  {dateRange?.from ? format(dateRange.from, "dd/MM/yyyy") : "Bắt đầu"} - {dateRange?.to ? format(dateRange.to, "dd/MM/yyyy") : "Kết thúc"}
                </span>
              </div>
            </div>

            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors border border-fpt-blue text-fpt-blue hover:bg-fpt-blue hover:text-white h-10 px-4 py-2">
                Thay đổi tìm kiếm
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <div className="flex flex-col space-y-4 p-4 bg-white rounded-lg shadow-xl border border-gray-100 min-w-[320px]">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Địa điểm nhận xe</label>
                    <select 
                      value={tempLocation} 
                      onChange={(e) => setTempLocation(e.target.value)}
                      className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Tất cả địa điểm</option>
                      <option value="Hà Nội">Hà Nội</option>
                      <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                      <option value="Đà Nẵng">Đà Nẵng</option>
                      <option value="Hải Phòng">Hải Phòng</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Thời gian thuê</label>
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={setDateRange}
                      numberOfMonths={1}
                      className="rounded-md border border-gray-100 shadow-sm p-2 w-full flex justify-center"
                    />
                  </div>

                  <button 
                    onClick={() => {
                      setSearchCity(tempLocation)
                      setIsPopoverOpen(false)
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition-colors"
                  >
                    Áp dụng
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <p className="text-gray-500 font-medium">Đang tải danh sách xe...</p>
            </div>
          ) : cars.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {cars.map(car => (
                  <CarCard key={car.id} car={car} dateRange={dateRange} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 0 && (
                <div className="flex justify-center items-center space-x-2 mt-10 mb-6 w-full">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    Trang trước
                  </button>
                  <span className="text-sm font-medium text-gray-700 px-4">
                    Trang {currentPage} / {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    Trang sau
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-500 text-lg mb-4">Không tìm thấy xe nào phù hợp với tiêu chí của bạn.</p>
              <Button 
                onClick={handleClearFilters}
                className="bg-fpt-blue text-white font-semibold hover:bg-blue-700"
              >
                Xóa tất cả bộ lọc
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
