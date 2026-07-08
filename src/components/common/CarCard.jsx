import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Fuel, DoorOpen } from "lucide-react"
import { formatVND } from "@/lib/utils"
import { useNavigate } from "react-router-dom"

export function CarCard({ car }) {
  const navigate = useNavigate();
  
  return (
    <Card 
      onClick={() => navigate(`/cars/${car.id}`)}
      className="overflow-hidden group hover:shadow-lg transition-all duration-300 border-none bg-white rounded-xl cursor-pointer"
    >
      <CardHeader className="p-0 relative h-56 overflow-hidden bg-[#F8F9FA] flex items-center justify-center">
        {car.image ? (
          <img 
            src={car.image} 
            alt={car.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="text-gray-400">Không có ảnh</div>
        )}
        <Badge className="absolute top-4 right-4 bg-white/90 text-black hover:bg-white shadow-sm backdrop-blur-md font-semibold text-sm py-1 px-3">
          {formatVND(car.pricePerDay)}/ngày
        </Badge>
      </CardHeader>
      
      <CardContent className="p-5">
        <h3 className="text-xl font-bold mb-1 text-gray-900">{car.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-1 mb-5">
          {car.description || "Trải nghiệm đẳng cấp tốt nhất."}
        </p>
        
        <div className="flex items-center justify-between text-sm text-gray-600 font-medium">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-fpt-teal" />
            <span>{car.seats || 4} Chỗ</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Fuel className="w-4 h-4 text-fpt-teal" />
            <span>{car.fuelType || "Xăng"}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <DoorOpen className="w-4 h-4 text-fpt-teal" />
            <span>{car.doors || 4} Cửa</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-5 pt-0">
        <Button className="w-full bg-white text-fpt-blue border-2 border-fpt-blue hover:bg-fpt-blue hover:text-white transition-colors font-semibold">
          Thuê Ngay
        </Button>
      </CardFooter>
    </Card>
  )
}
