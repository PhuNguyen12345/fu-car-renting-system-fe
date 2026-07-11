import { NavLink, Outlet, Navigate } from "react-router-dom"
import { User, Lock, Camera, Loader2 } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { customerService } from "@/services/customerService"

export function AdminProfilePage() {
  const token = localStorage.getItem('token')
  if (!token) {
    return <Navigate to="/admin/login" replace />
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
      console.error("Lỗi lấy thông tin admin:", err)
    }
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file && user) {
      setIsUploadingAvatar(true);
      try {
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
    { name: 'Hồ sơ cá nhân', path: '/admin/profile', exact: true, icon: User },
    { name: 'Đổi mật khẩu', path: '/admin/profile/security', exact: false, icon: Lock },
  ]

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto w-full">
      {/* Left Column (Sidebar Navigation) */}
      <div className="w-full md:w-1/4 h-fit space-y-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div 
            className="relative group cursor-pointer w-12 h-12 rounded-full overflow-hidden shrink-0 flex items-center justify-center bg-teal-100 text-teal-700 font-bold text-lg"
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploadingAvatar ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : user?.avatarUrl ? (
              <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="uppercase">{user?.fullName ? user.fullName.charAt(0) : "A"}</span>
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
            <p className="font-bold text-slate-900">{user?.fullName || "Admin"}</p>
          </div>
        </div>

        <nav className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink 
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-teal-50 text-teal-700 font-medium' 
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
  )
}
