import { NavLink, Outlet } from "react-router-dom"
import { User, ClipboardList, Lock } from "lucide-react"

export function UserDashboardPage() {
  const navItems = [
    { name: 'Hồ sơ cá nhân', path: '/dashboard/profile', icon: User },
    { name: 'Lịch sử thuê xe', path: '/dashboard/bookings', icon: ClipboardList },
    { name: 'Đổi mật khẩu', path: '/dashboard/security', icon: Lock },
  ]

  return (
    <div className="bg-[#F8F9FA] min-h-[calc(100vh-80px)]">
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        
        {/* Left Column (Sidebar Navigation) */}
        <div className="w-full md:w-1/4 sticky top-24 h-fit space-y-6 z-10">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-700 font-bold flex items-center justify-center rounded-full text-lg">
              AP
            </div>
            <div>
              <p className="text-sm text-slate-500">Xin chào,</p>
              <p className="font-bold text-slate-900">Nguyễn An Phú</p>
            </div>
          </div>

          <nav className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink 
                key={item.path}
                to={item.path}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-blue-50 text-blue-700 font-medium' 
                      : 'hover:bg-slate-100 text-slate-600'
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Right Column (Content Area) */}
        <div className="w-full md:w-3/4 bg-white p-6 md:p-8 rounded-xl border border-slate-200 shadow-sm min-h-[400px]">
          <Outlet />
        </div>

      </div>
    </div>
  )
}
