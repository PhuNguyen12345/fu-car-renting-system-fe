import { Star, CheckCircle } from "lucide-react"

export function Testimonials() {
  const reviews = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      role: "Business Traveler",
      text: "The process was incredibly smooth. I booked a Mercedes for a business trip, and it was in pristine condition. No hidden fees at all!",
      rating: 5
    },
    {
      id: 2,
      name: "Trần Thị B",
      role: "Family Vacation",
      text: "We rented an SUV for our trip to Da Lat. The 24/7 support gave us great peace of mind. Highly recommend their services.",
      rating: 5
    },
    {
      id: 3,
      name: "Lê Hoàng C",
      role: "Weekend Explorer",
      text: "Best car rental experience I've had. The free cancellation policy saved me when my plans changed at the last minute.",
      rating: 5
    }
  ]

  return (
    <div className="bg-[#F8F9FA] py-24 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Được tin tưởng bởi hàng ngàn khách hàng</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Đừng chỉ nghe lời chúng tôi nói. Hãy đọc những đánh giá của khách hàng hài lòng về trải nghiệm của họ.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map(review => (
            <div key={review.id} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex flex-col">
              <div className="flex space-x-1 mb-6">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 italic mb-8 flex-grow">"{review.text}"</p>
              
              <div className="flex items-center mt-auto">
                <div className="w-12 h-12 rounded-full bg-fpt-blue/10 flex items-center justify-center text-fpt-blue font-bold text-lg mr-4 flex-shrink-0">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center">
                    <h4 className="font-bold text-gray-900 mr-2">{review.name}</h4>
                    <span className="flex items-center text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Đã xác minh
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{review.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
