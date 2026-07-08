import { MapPin, Car, Key } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      icon: <MapPin className="w-10 h-10 text-fpt-blue group-hover:text-blue-700 transition-colors duration-300" />,
      title: "Chọn địa điểm và ngày thuê",
      description: "Chọn địa điểm và ngày thuê xe dễ dàng."
    },
    {
      icon: <Car className="w-10 h-10 text-fpt-blue group-hover:text-blue-700 transition-colors duration-300" />,
      title: "Chọn xe của bạn",
      description: "Tham khảo các dòng xe của chúng tôi."
    },
    {
      icon: <Key className="w-10 h-10 text-fpt-blue group-hover:text-blue-700 transition-colors duration-300" />,
      title: "Nhận xe và bắt đầu hành trình",
      description: "Nhận chìa khóa và bắt đầu hành trình của bạn."
    }
  ]

  return (
    <div className="bg-white py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Cách thức hoạt động</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Thuê xe chưa bao giờ dễ dàng đến thế. Chỉ cần làm theo 3 bước đơn giản và bạn sẽ được vi vu trên đường ngay lập tức.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop Only) */}
          <div className="hidden md:block absolute top-14 left-[16%] right-[16%] h-[2px] border-t-2 border-dashed border-gray-200 z-0" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group relative z-10">
                <div className="w-28 h-28 rounded-full bg-white border-4 border-fpt-blue/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-lg group-hover:border-fpt-blue/20 transition-all duration-300">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
