import { Link, useNavigate } from "react-router-dom"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import logo from "@/assets/FPTCarRental_BG_Removed.png"

export function AuthPage() {
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    localStorage.setItem('mockUser', 'true')
    navigate('/')
  }
  return (
    <div className="min-h-screen flex w-full">
      {/* Left Column - Hidden on Mobile */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gray-900">
        <img 
          src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?q=80&w=2070&auto=format&fit=crop" 
          alt="Premium Car" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/40 to-black/30"></div>
        
        <div className="absolute top-8 left-12">
          <Link to="/" className="flex items-center hover:scale-105 transition-transform">
            <img src={logo} alt="FPT Car Renting" className="w-[240px] object-contain brightness-0 invert drop-shadow-md" />
          </Link>
        </div>
        
        <div className="absolute bottom-16 left-12 right-12 text-white">
          <h2 className="text-4xl font-bold mb-4 drop-shadow-lg leading-tight">Hành trình đẳng cấp bắt đầu từ đây.</h2>
          <p className="text-lg text-gray-200 drop-shadow-md max-w-lg">Trải nghiệm dịch vụ thuê xe tự lái chuyên nghiệp, thủ tục nhanh chóng, giá cả minh bạch.</p>
        </div>
      </div>

      {/* Right Column - Forms */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center px-8 sm:px-16 xl:px-24 py-12 relative overflow-y-auto h-screen">
        <div className="w-full max-w-sm mx-auto">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-10 flex justify-center">
            <Link to="/">
              <img src={logo} alt="FPT Car Renting" className="w-[200px] object-contain" />
            </Link>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2 w-full">Chào mừng trở lại!</h1>
            <p className="text-sm text-slate-500 w-full">Vui lòng đăng nhập để tiếp tục quản lý hành trình của bạn.</p>
          </div>

          <Tabs defaultValue="login" className="w-full flex flex-col">
            <TabsList className="flex w-full max-w-sm bg-slate-100 p-1.5 rounded-xl mx-auto mb-8">
              <TabsTrigger 
                value="login" 
                className="flex-1 flex items-center justify-center py-2.5 text-sm transition-all duration-200 rounded-lg text-slate-500 font-medium hover:text-slate-700 hover:bg-slate-200/50 data-[active]:bg-white data-[active]:shadow-sm data-[active]:text-blue-600 data-[active]:font-bold data-[active]:hover:bg-white"
              >
                Đăng nhập
              </TabsTrigger>
              <TabsTrigger 
                value="register" 
                className="flex-1 flex items-center justify-center py-2.5 text-sm transition-all duration-200 rounded-lg text-slate-500 font-medium hover:text-slate-700 hover:bg-slate-200/50 data-[active]:bg-white data-[active]:shadow-sm data-[active]:text-blue-600 data-[active]:font-bold data-[active]:hover:bg-white"
              >
                Đăng ký
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-6 mt-0 animate-in fade-in zoom-in-95 duration-200">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                    <input required type="email" placeholder="example@email.com" className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-fpt-blue focus:ring-1 focus:ring-fpt-blue transition-all placeholder:text-slate-400 font-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mật khẩu</label>
                    <input required type="password" placeholder="Nhập mật khẩu" className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-fpt-blue focus:ring-1 focus:ring-fpt-blue transition-all placeholder:text-slate-400 font-medium" />
                    <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 mt-2 text-right block font-semibold transition-colors">Quên mật khẩu?</Link>
                  </div>
                </div>

                <Button type="submit" className="w-full h-12 bg-fpt-blue hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all hover:-translate-y-0.5">
                  Đăng nhập
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="space-y-6 mt-0 animate-in fade-in zoom-in-95 duration-200">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Họ và tên</label>
                  <input type="text" placeholder="Nguyễn Văn A" className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-fpt-blue focus:ring-1 focus:ring-fpt-blue transition-all placeholder:text-slate-400 font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email</label>
                  <input type="email" placeholder="example@email.com" className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-fpt-blue focus:ring-1 focus:ring-fpt-blue transition-all placeholder:text-slate-400 font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mật khẩu</label>
                  <input type="password" placeholder="Tạo mật khẩu (ít nhất 8 ký tự)" className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-fpt-blue focus:ring-1 focus:ring-fpt-blue transition-all placeholder:text-slate-400 font-medium" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Xác nhận mật khẩu</label>
                  <input type="password" placeholder="Nhập lại mật khẩu" className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:border-fpt-blue focus:ring-1 focus:ring-fpt-blue transition-all placeholder:text-slate-400 font-medium" />
                </div>
              </div>

              <Button className="w-full h-12 bg-fpt-blue hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all hover:-translate-y-0.5">
                Đăng ký
              </Button>
            </TabsContent>
          </Tabs>

          {/* Social Login */}
          <div className="mt-8 relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500 font-medium">Hoặc tiếp tục với</span>
            </div>
          </div>

          <div className="mt-6">
            <Button variant="outline" className="w-full h-12 border-slate-300 hover:bg-slate-50 font-bold text-slate-700 rounded-xl transition-colors">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Đăng nhập bằng Google
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
