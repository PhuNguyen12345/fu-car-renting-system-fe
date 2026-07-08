import { Link } from "react-router-dom"
import { CheckCircle, ClipboardList } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BookingSuccessPage() {
  return (
    <div className="bg-[#F8F9FA] min-h-[calc(100vh-80px)] flex flex-col items-center justify-center">
      <div className="flex flex-col items-center justify-center text-center px-4 max-w-md w-full py-16">
        <CheckCircle className="text-green-500 w-24 h-24 mb-6" strokeWidth={1.5} />
        
        <h1 className="text-3xl font-bold text-slate-900 mb-3">
          Đặt xe thành công!
        </h1>
        
        <p className="text-slate-500 mb-10 leading-relaxed text-[15px]">
          Cảm ơn bạn đã tin tưởng sử dụng dịch vụ. Mã đơn hàng của bạn là <span className="font-semibold text-slate-700">#FPT-8899</span>.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Link to="/" className="w-full flex-1 order-2 sm:order-1">
            <Button variant="outline" className="w-full h-12 border-slate-300 text-slate-700 font-semibold hover:bg-slate-50 rounded-xl transition-all">
              Về trang chủ
            </Button>
          </Link>
          
          <Link to="/dashboard/bookings" className="w-full flex-1 order-1 sm:order-2">
            <Button className="w-full h-12 bg-[#0066FF] hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition-all hover:-translate-y-0.5">
              <ClipboardList className="w-5 h-5 mr-2" />
              Quản lý đơn thuê
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
