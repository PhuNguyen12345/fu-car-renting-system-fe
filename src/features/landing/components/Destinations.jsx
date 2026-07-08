import { ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

export function Destinations() {
  const destinations = [
    {
      id: 1,
      title: "Khám phá thiên nhiên Hồ Ba Bể",
      subtitle: "Cuối tuần cùng anh trai",
      image: "https://images.pexels.com/photos/1519192/pexels-photo-1519192.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      vehicleIdea: "Recommended: Premium SUV"
    },
    {
      id: 2,
      title: "Chuyến dạo quanh phố cổ",
      subtitle: "Trải nghiệm văn hóa & ẩm thực",
      image: "https://images.pexels.com/photos/1191377/pexels-photo-1191377.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      vehicleIdea: "Recommended: Luxury Sedan"
    }
  ]

  return (
    <div className="bg-white py-24">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Destination & Road Trip Inspiration</h2>
            <p className="text-lg text-muted-foreground">
              Don't just rent a car, book an experience. Discover perfect pairings of beautiful destinations and the ideal vehicles for the journey.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {destinations.map(dest => (
            <Link key={dest.id} to="/cars" className="group relative h-[400px] rounded-2xl overflow-hidden cursor-pointer block">
              <img 
                src={dest.image} 
                alt={dest.title} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col justify-end">
                <span className="inline-block px-3 py-1 bg-fpt-blue/20 text-fpt-teal border border-fpt-teal/30 backdrop-blur-md rounded-full text-xs font-semibold mb-4 w-fit">
                  {dest.vehicleIdea}
                </span>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{dest.title}</h3>
                <div className="flex items-center justify-between">
                  <p className="text-gray-300 text-lg">{dest.subtitle}</p>
                  <ArrowRight className="text-white w-6 h-6 transform translate-x-0 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
