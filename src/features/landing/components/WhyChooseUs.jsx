import { ShieldCheck, CalendarX, Headset } from "lucide-react"

export function WhyChooseUs() {
  const benefits = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-white" />,
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1000&auto=format&fit=crop", // Payment / Clear pricing
      title: "Giá cả minh bạch",
      description: "Giá cả minh bạch từ đầu đến cuối. Những gì bạn thấy là những gì bạn trả."
    },
    {
      icon: <CalendarX className="w-6 h-6 text-white" />,
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1000&auto=format&fit=crop", // Planning / Calendar
      title: "Hủy miễn phí",
      description: "Thay đổi kế hoạch? Hủy miễn phí lên đến 24 giờ trước khi nhận xe."
    },
    {
      icon: <Headset className="w-6 h-6 text-white" />,
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1000&auto=format&fit=crop", // Support team
      title: "Hỗ trợ khẩn cấp 24/7",
      description: "Lái xe an tâm với đội ngũ hỗ trợ luôn sẵn sàng chỉ cách bạn một cuộc gọi."
    }
  ]

  return (
    <section 
      className="relative py-24 bg-fixed bg-center bg-cover"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop')" }} // Premium car fleet background
    >
      {/* Heavy dark overlay for subtle texture */}
      <div className="absolute inset-0 bg-slate-950/85 backdrop-blur-[2px]"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Vì sao bạn nên chọn chúng tôi?</h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Chúng tôi ưu tiên trải nghiệm của bạn hơn hết, đảm bảo một hành trình suôn sẻ và đáng tin cậy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {benefits.map((benefit, idx) => (
            <div 
              key={idx} 
              className="group flex flex-col rounded-xl overflow-hidden hover:-translate-y-2 transition-transform duration-300 hover:shadow-2xl hover:shadow-blue-500/20 border border-slate-800 bg-slate-900"
            >
              {/* Top Half: Image */}
              <div className="h-52 w-full overflow-hidden">
                <img 
                  src={benefit.image} 
                  alt={benefit.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                />
              </div>

              {/* Bottom Half: Content */}
              <div className="bg-slate-900 p-8 pt-10 flex-1 flex flex-col relative rounded-b-xl">
                {/* Floating Icon Badge */}
                <div className="bg-fpt-blue w-14 h-14 rounded-full flex items-center justify-center absolute -top-7 right-8 border-4 border-slate-900 shadow-lg">
                  {benefit.icon}
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-white">{benefit.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
