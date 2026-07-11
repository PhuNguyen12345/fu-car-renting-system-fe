import { useRef } from "react"
import { CarCard } from "@/components/common/CarCard"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { carService } from "@/services/carService"

export function FeaturedFleet() {
  const scrollContainerRef = useRef(null)
  const [featuredCars, setFeaturedCars] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const res = await carService.getPublicCars({ page: 0, size: 8 })
        setFeaturedCars(res.content)
      } catch (err) {
        console.error("Lỗi tải xe nổi bật:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchCars()
  }, [])

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  return (
    <div className="bg-[#F8F9FA] py-20">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Dàn xe nổi bật</h2>
            <p className="text-muted-foreground text-lg">Trải nghiệm những chiếc xe tốt nhất với mức giá cạnh tranh nhất.</p>
          </div>
          <Button variant="ghost" className="text-fpt-blue hover:text-fpt-blue/80 hover:bg-fpt-blue/10 font-semibold hidden md:flex" asChild>
            <Link to="/cars">
              Xem tất cả <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
        
        <div className="relative group">
          {/* Left Navigation Button */}
          <button 
            onClick={() => scroll('left')}
            className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center text-gray-700 hover:text-fpt-blue"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Scrollable Container */}
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {loading ? (
              <div className="w-full text-center py-10 text-gray-500 font-medium">Đang tải danh sách xe...</div>
            ) : featuredCars.length > 0 ? (
              featuredCars.map(car => (
                <div key={car.id} className="flex-none w-full md:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] snap-start">
                  <CarCard car={car} />
                </div>
              ))
            ) : (
              <div className="w-full text-center py-10 text-gray-500 font-medium">Chưa có xe nào.</div>
            )}
          </div>

          {/* Right Navigation Button */}
          <button 
            onClick={() => scroll('right')}
            className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-50 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center text-gray-700 hover:text-fpt-blue"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
        
        <div className="mt-8 flex justify-center md:hidden">
           <Button variant="outline" className="text-fpt-blue border-fpt-blue hover:bg-fpt-blue hover:text-white" asChild>
            <Link to="/cars">
              Xem tất cả
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
