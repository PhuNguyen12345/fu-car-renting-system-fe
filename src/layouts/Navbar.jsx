import { Link, NavLink, useNavigate } from "react-router-dom"
import { useState, useEffect, useRef } from "react"
import { customerService } from "@/services/customerService"
import { Button } from "@/components/ui/button"
import { LogIn, UserPlus, LayoutDashboard, Settings, LogOut, ChevronDown } from "lucide-react"
import logo from "@/assets/FPTCarRental_BG_Removed.png"

export function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()
  const dropdownRef = useRef(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsLoggedIn(true)
      customerService.getMyProfile()
        .then(res => setUser(res))
        .catch(err => {
          console.error("Failed to fetch profile", err)
          handleLogout()
        })
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userId')
    setIsLoggedIn(false)
    setUser(null)
    setIsDropdownOpen(false)
    window.location.href = '/'
  }
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center relative h-12 w-[200px] md:w-[240px]">
            <img 
              src={logo} 
              alt="FPT Car Renting" 
              className="absolute top-1/2 left-0 -translate-y-1/2 w-[240px] md:w-[280px] max-w-none object-contain -ml-4 pointer-events-none" 
            />
          </Link>
        </div>

        <nav className="hidden md:flex gap-8">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `text-base font-medium transition-colors relative py-1 ${isActive ? 'text-fpt-blue' : 'text-gray-600 hover:text-fpt-blue'} 
               after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-fpt-blue 
               after:transition-transform after:duration-300 ${isActive ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'}`
            }
          >
            Trang chủ
          </NavLink>
          <NavLink 
            to="/cars" 
            className={({ isActive }) => 
              `text-base font-medium transition-colors relative py-1 ${isActive ? 'text-fpt-blue' : 'text-gray-600 hover:text-fpt-blue'} 
               after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-fpt-blue 
               after:transition-transform after:duration-300 ${isActive ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'}`
            }
          >
            Thuê xe
          </NavLink>
          <NavLink 
            to="/about" 
            className={({ isActive }) => 
              `text-base font-medium transition-colors relative py-1 ${isActive ? 'text-fpt-blue' : 'text-gray-600 hover:text-fpt-blue'} 
               after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-fpt-blue 
               after:transition-transform after:duration-300 ${isActive ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'}`
            }
          >
            Về chúng tôi
          </NavLink>
        </nav>

        <div className="flex items-center gap-4">
          {!isLoggedIn ? (
            <>
              <Link 
                to="/auth" 
                className="hidden sm:flex items-center justify-center h-11 px-8 min-w-[130px] rounded-full text-base font-semibold text-gray-700 hover:text-fpt-blue hover:bg-fpt-blue/5 transition-all"
              >
                <LogIn className="w-5 h-5 mr-2 shrink-0" />
                <span>Đăng nhập</span>
              </Link>
              <Link 
                to="/auth" 
                className="flex items-center justify-center h-11 px-8 min-w-[150px] rounded-full bg-fpt-blue hover:bg-blue-700 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all text-base font-semibold"
              >
                <UserPlus className="w-5 h-5 mr-2 shrink-0" />
                <span>Đăng ký</span>
              </Link>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 hover:bg-slate-50 p-1.5 pr-3 rounded-full transition-colors border border-transparent hover:border-slate-200"
              >
                <div className="w-9 h-9 bg-blue-100 text-fpt-blue font-bold flex items-center justify-center rounded-full text-sm shrink-0 uppercase overflow-hidden">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    user?.fullName ? user.fullName.charAt(0) : "U"
                  )}
                </div>
                <ChevronDown className="w-4 h-4 text-slate-500 hidden sm:block" />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-100 py-2 animate-in fade-in zoom-in-95 duration-200 z-50">
                  <div className="px-4 py-3 border-b border-slate-100 mb-2">
                    <p className="text-sm font-bold text-slate-900">{user?.fullName || "User"}</p>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{user?.email || ""}</p>
                  </div>
                  
                  <Link 
                    to="/dashboard" 
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-fpt-blue transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard của tôi
                  </Link>
                  <Link 
                    to="/dashboard/profile" 
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-fpt-blue transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                    Cài đặt
                  </Link>
                  
                  <div className="h-px bg-slate-100 my-2"></div>
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
