import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Mail, MailCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import logo from "@/assets/FPTCarRental_BG_Removed.png"

export function ForgotPasswordPage() {
  const [isSent, setIsSent] = useState(false)
  const [email, setEmail] = useState('')

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-slate-50 p-4">
      <div className="absolute top-6 left-6 md:top-10 md:left-10 z-10">
        <Link to="/" className="flex items-center hover:scale-105 transition-transform relative h-12 w-[200px] md:w-[240px]">
          <img 
            src={logo} 
            alt="FPT Car Renting" 
            className="absolute top-1/2 left-0 -translate-y-1/2 w-[240px] md:w-[280px] max-w-none object-contain -ml-4 drop-shadow-sm" 
          /> 
        </Link>
      </div>

      <div className="w-full max-w-md mx-auto p-8 bg-white rounded-2xl border border-slate-200 shadow-sm animate-in fade-in zoom-in-95 duration-300">
        {!isSent ? (
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-slate-900 mb-3">Quên mật khẩu</h1>
              <p className="text-sm text-slate-500 leading-relaxed">
                Nhập email liên kết với tài khoản của bạn và chúng tôi sẽ gửi liên kết để đặt lại mật khẩu.
              </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setIsSent(true); }} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input 
                    type="email" 
                    placeholder="example@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-fpt-blue focus:ring-1 focus:ring-fpt-blue transition-all placeholder:text-slate-400 font-medium" 
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-12 bg-fpt-blue hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all hover:-translate-y-0.5">
                Gửi liên kết đặt lại
              </Button>
            </form>

            <div className="mt-8 flex justify-center">
              <Link to="/auth" className="flex items-center text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại đăng nhập
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-2">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center shadow-sm border border-green-100">
                <MailCheck className="text-green-500 w-10 h-10" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-slate-900 mb-3">Kiểm tra hộp thư của bạn</h1>
            <p className="text-slate-500 mb-8 leading-relaxed">
              Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email <span className="font-bold text-slate-800">{email || 'phuna@fpt.edu.vn'}</span>. Vui lòng kiểm tra cả thư rác (spam) nếu không thấy.
            </p>

            <Link to="/auth" className="block w-full">
              <Button className="w-full h-12 bg-fpt-blue hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all hover:-translate-y-0.5">
                Quay lại đăng nhập
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
