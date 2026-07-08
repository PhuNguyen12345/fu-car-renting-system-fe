import { ShieldCheck, Zap, HeartHandshake } from "lucide-react"
import { Link } from "react-router-dom"

export function AboutPage() {
  return (
    <div className="animate-in fade-in duration-500 relative overflow-hidden">
      {/* Floating Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse pointer-events-none"></div>

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-blue-50 to-white text-center px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 animate-in slide-in-from-bottom-8 fade-in duration-700">Hành trình của FPT Car Renting</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto animate-in slide-in-from-bottom-8 fade-in duration-700 delay-150 fill-mode-backwards">
            Nền tảng kết nối những chuyến đi, được xây dựng với đam mê công nghệ và khát khao mang lại trải nghiệm thuê xe minh bạch, tiện lợi nhất.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-12 max-w-6xl mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group p-6 bg-white border border-slate-100 rounded-xl shadow-sm text-center flex flex-col items-center hover:-translate-y-2 hover:shadow-xl transition-all duration-300 cursor-pointer">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <ShieldCheck className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Minh bạch</h3>
            <p className="text-slate-600 leading-relaxed">
              Giá cả niêm yết rõ ràng, không phí ẩn. Thông tin xe và chủ xe được xác thực 100%.
            </p>
          </div>

          <div className="group p-6 bg-white border border-slate-100 rounded-xl shadow-sm text-center flex flex-col items-center hover:-translate-y-2 hover:shadow-xl transition-all duration-300 cursor-pointer">
            <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center mb-4">
              <Zap className="w-8 h-8 text-yellow-500 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Nhanh chóng</h3>
            <p className="text-slate-600 leading-relaxed">
              Thao tác đặt xe chỉ trong 3 bước. Phê duyệt tự động, nhận xe linh hoạt.
            </p>
          </div>

          <div className="group p-6 bg-white border border-slate-100 rounded-xl shadow-sm text-center flex flex-col items-center hover:-translate-y-2 hover:shadow-xl transition-all duration-300 cursor-pointer">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
              <HeartHandshake className="w-8 h-8 text-green-500 group-hover:scale-110 transition-transform" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Đồng hành</h3>
            <p className="text-slate-600 leading-relaxed">
              Hỗ trợ khách hàng 24/7 trong suốt hành trình. An tâm trên mọi nẻo đường.
            </p>
          </div>
        </div>
      </section>

      {/* The Team */}
      <section className="py-16 bg-white px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-8">Đội ngũ phát triển</h2>
          
          <div className="max-w-xl mx-auto bg-slate-50 border border-slate-100 rounded-2xl p-8 text-center shadow-sm">
            <div className="w-24 h-24 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full text-3xl font-bold mx-auto mb-4">
              AP
            </div>
            <h3 className="text-xl font-bold text-slate-900">Nguyễn An Phú</h3>
            <p className="text-fpt-blue font-semibold mb-4">Lead Developer</p>
            <p className="text-slate-600 leading-relaxed">
              Sinh viên năm 3 chuyên ngành Kỹ thuật Phần mềm, Đại học FPT. FPT Car Renting không chỉ là một dự án đồ án, mà còn là tâm huyết ứng dụng các công nghệ hiện đại (React, Spring Boot) vào giải quyết bài toán thực tế.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-16 pt-4 relative z-10">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 px-6 text-center rounded-2xl max-w-5xl mx-auto shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-6">Sẵn sàng cho chuyến đi tiếp theo?</h2>
            <Link 
              to="/cars" 
              className="bg-white text-blue-600 font-bold py-3 px-8 rounded-lg hover:bg-slate-50 transition-all inline-block shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]"
            >
              Khám phá xe ngay
            </Link>
          </div>
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        </div>
      </section>
    </div>
  )
}
