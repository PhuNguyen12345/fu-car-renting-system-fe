import { Mail, Lock } from "lucide-react"
import { useNavigate } from "react-router-dom"
import logo from "@/assets/FPTCarRental_BG_Removed.png"

export function AdminLoginPage() {
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    // Mock login success, redirect to admin dashboard
    navigate('/admin')
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background Image - Premium Car */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=2560&auto=format&fit=crop")',
        }}
      >
        <div className="absolute inset-0 bg-slate-900/75 backdrop-blur-sm"></div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-500 border-t-4 border-slate-900">
        
        <div className="p-8 sm:p-10">
          {/* Card Header (Logo & Welcome) */}
          <div className="flex flex-col items-center justify-center">
            {/* Logo */}
            <div className="flex justify-center mb-1 w-full relative h-16">
              <img 
                src={logo} 
                alt="FPT Car Renting System" 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 max-w-none object-contain drop-shadow-sm" 
              />
            </div>
            
            <span className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase mt-2 text-center block">
              Admin Portal
            </span>

            <h2 className="text-2xl font-extrabold text-slate-900 text-center mt-8 mb-2">
              Chào mừng trở lại!
            </h2>
            <p className="text-sm text-slate-500 text-center mb-8">
              Vui lòng đăng nhập để truy cập hệ thống quản trị.
            </p>
          </div>

          {/* Form Inputs & Button */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="admin@fpt.edu.vn"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-slate-800 transition-all text-sm font-medium text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-slate-800 transition-all text-sm font-medium text-slate-900"
                />
              </div>
              <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-800 text-right block mt-2 transition-colors">
                Quên mật khẩu?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl transition-colors mt-6 shadow-md"
            >
              Đăng nhập
            </button>
          </form>

        </div>
      </div>
    </div>
  )
}
