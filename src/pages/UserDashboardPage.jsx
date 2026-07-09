import { NavLink, Outlet } from "react-router-dom"
import { User, ClipboardList, Lock, Camera, Loader2 } from "lucide-react"
import { useState, useRef } from "react"

const getCloudinarySignature = async () => {
  const token = localStorage.getItem('token') || ''; 
  const response = await fetch("http://localhost:8080/api/v1/customers/cloudinary-signature", {
      headers: {
          "Authorization": `Bearer ${token}`
      }
  });
  return await response.json(); 
};

const uploadImageToCloudinary = async (file) => {
  try {
    const signData = await getCloudinarySignature();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", signData.apiKey);
    formData.append("timestamp", signData.timestamp);
    formData.append("signature", signData.signature);
    formData.append("folder", signData.folder); 

    const uploadUrl = `https://api.cloudinary.com/v1_1/${signData.cloudName}/image/upload`;
    const response = await fetch(uploadUrl, { method: "POST", body: formData });
    const data = await response.json();
    
    return data.secure_url;
  } catch (error) {
    console.error("Lỗi upload ảnh:", error);
    alert("Upload ảnh thất bại!");
    return null;
  }
};

export function UserDashboardPage() {
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const fileInputRef = useRef(null)

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploadingAvatar(true);
      const url = await uploadImageToCloudinary(file);
      if (url) {
        setAvatarUrl(url);
      }
      setIsUploadingAvatar(false);
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
              ) : avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                "AP"
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
