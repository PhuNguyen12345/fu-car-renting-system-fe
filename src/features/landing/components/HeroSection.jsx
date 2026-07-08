import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { MapPin, Search } from "lucide-react"
import heroBg from "@/assets/hero_bg.png"

export function HeroSection() {
  return (
    <div className="relative w-full h-[600px] flex items-center justify-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-black/40" /> {/* Dark overlay for text readability */}
      </div>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center mt-[-80px]">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white text-center mb-4 tracking-tight drop-shadow-md">
          Tìm chiếc xe phù hợp với bạn
        </h1>
        <p className="text-lg md:text-xl text-white/90 text-center mb-12 drop-shadow-md font-medium">
          Trang web cho thuê xe tốt nhất Việt Nam
        </p>

        {/* Search Widget */}
        <div className="w-full max-w-5xl bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-4 md:p-6 animate-in fade-in slide-in-from-bottom-10 duration-700">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input 
                  placeholder="Pick-up Location" 
                  className="pl-10 h-12 bg-gray-50 border-gray-200 text-base rounded-xl focus-visible:ring-fpt-teal"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Input 
                type="date"
                placeholder="Pick-up date" 
                className="h-12 bg-gray-50 border-gray-200 text-base rounded-xl focus-visible:ring-fpt-teal text-gray-500"
              />
            </div>

            <div className="space-y-2">
              <Input 
                type="date"
                placeholder="Drop-off date" 
                className="h-12 bg-gray-50 border-gray-200 text-base rounded-xl focus-visible:ring-fpt-teal text-gray-500"
              />
            </div>

            <Button className="h-12 w-full bg-fpt-blue hover:bg-fpt-blue/90 text-white text-base rounded-xl shadow-md transition-all hover:shadow-lg">
              <Search className="w-5 h-5 mr-2" />
              Tìm kiếm
            </Button>
          </div>

          <div className="mt-4 flex items-center space-x-2 px-1">
            <Checkbox id="same-location" defaultChecked className="border-gray-300 data-[state=checked]:bg-fpt-blue data-[state=checked]:border-fpt-blue" />
            <label htmlFor="same-location" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-700">
              Trả xe tại địa điểm ban đầu
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}
