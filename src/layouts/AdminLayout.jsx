import { Outlet, NavLink, Link } from "react-router-dom"
import { Car, LayoutDashboard, ClipboardList, Users, BarChart3, Search, Bell } from "lucide-react"
import logo from "@/assets/FPTCarRental_BG_Removed.png"

export function AdminLayout() {
  const menuItems = [
    { name: "Tổng quan", icon: LayoutDashboard, path: "/admin" },
    { name: "Quản lý xe", icon: Car, path: "/admin/cars" },
    { name: "Đơn đặt xe", icon: ClipboardList, path: "/admin/bookings" },
    { name: "Khách hàng", icon: Users, path: "/admin/users" },
    { name: "Báo cáo doanh thu", icon: BarChart3, path: "/admin/reports" },
  ]

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900">
      {/* Glassmorphism Sidebar */}
      <aside className="w-64 bg-white/5 backdrop-blur-xl border-r border-white/10 text-slate-200 flex flex-col sticky top-0 h-screen overflow-y-auto z-20 shadow-2xl">
        {/* Brand */}
        <div className="flex flex-col items-center justify-center pt-8 pb-6 border-b border-white/10 mb-4 mx-4">
          <Link to="/admin" className="flex flex-col items-center hover:scale-105 transition-transform relative h-12 w-full">
            <img 
              src={logo} 
              alt="FPT Car Admin" 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] max-w-none object-contain brightness-0 invert drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]" 
            />
          </Link>
          <span className="text-xs font-bold tracking-widest text-teal-400 uppercase mt-4 drop-shadow-md">Admin Page</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 mx-2 my-1 rounded-xl transition-all font-medium ${
                  isActive
                    ? "bg-white/20 text-white shadow-lg border border-white/10"
                    : "hover:bg-white/10 hover:text-white text-slate-300 border border-transparent"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Right Column Layout */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Glassmorphism Topbar */}
        <header className="h-20 bg-white/5 backdrop-blur-md border-b border-white/10 px-8 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm nhanh..."
                className="w-full pl-11 pr-4 py-2 rounded-full border border-white/10 bg-black/20 text-white placeholder-slate-400 focus:bg-black/30 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500 transition-all text-sm font-medium shadow-inner"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-6">
            <button className="text-slate-300 hover:text-white relative transition-colors hover:scale-105">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-slate-800"></span>
            </button>
            <div className="h-8 w-px bg-white/10"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="w-10 h-10 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-sm group-hover:bg-teal-500/30 transition-colors border border-teal-500/30 shadow-[0_0_10px_rgba(20,184,166,0.2)]">
                A
              </div>
              <span className="font-semibold text-sm text-slate-200 group-hover:text-white transition-colors tracking-wide">Admin</span>
            </div>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="flex-1 flex flex-col bg-slate-50 mt-4 mr-4 mb-4 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-500 relative z-0 border border-slate-200/50">
          <div className="p-6 md:p-8 overflow-y-auto flex-1">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
