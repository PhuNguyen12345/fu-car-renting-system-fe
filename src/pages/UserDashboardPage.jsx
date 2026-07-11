import { NavLink, Outlet, Navigate } from "react-router-dom"
import { User, ClipboardList, Lock, Camera, Loader2 } from "lucide-react"
import { useState, useRef, useEffect } from "react"

import { customerService } from "@/services/customerService"

export function UserDashboardPage() {
  const token = localStorage.getItem('token')
  if (!token) {
    return <Navigate to="/auth" replace />
  }

  const [user, setUser] = useState(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const data = await customerService.getMyProfile()
      setUser(data)
    } catch (err) {
      console.error("Lỗi lấy thông tin user:", err)
    }
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file && user) {
      setIsUploadingAvatar(true);
      try {
        // Upload to Cloudinary using existing service method pattern
        const sigData = await customerService.getCloudinarySignature();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('signature', sigData.signature);
        formData.append('timestamp', sigData.timestamp);
        formData.append('api_key', sigData.apiKey);
        formData.append('folder', sigData.folder);

        const res = await fetch(`https://api.cloudinary.com/v1_1/${sigData.cloudName}/image/upload`, {
          method: 'POST',
          body: formData
        });
        const uploadData = await res.json();
        
        if (uploadData.secure_url) {
          // Save to backend
          const updatedUser = { ...user, avatarUrl: uploadData.secure_url }
          await customerService.updateMyProfile(updatedUser)
          setUser(updatedUser)
        }
      } catch (err) {
        console.error("Lỗi đổi avatar:", err)
        alert("Có lỗi khi đổi ảnh đại diện")
      } finally {
        setIsUploadingAvatar(false);
      }
    }
  }

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
            <div 
              className="relative group cursor-pointer w-12 h-12 rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-blue-100 text-blue-700 font-bold text-lg"
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploadingAvatar ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : user?.avatarUrl ? (
                <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="uppercase">{user?.fullName ? user.fullName.charAt(0) : "U"}</span>
              )}
              {!isUploadingAvatar && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-full">
                  <Camera className="w-4 h-4 text-white" />
                </div>
              )}
              <input 
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
            <div>
              <p className="text-sm text-slate-500">Xin chào,</p>
              <p className="font-bold text-slate-900">{user?.fullName || "Khách"}</p>
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
