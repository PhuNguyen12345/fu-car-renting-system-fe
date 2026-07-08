import { UploadCloud } from "lucide-react"
import { Button } from "@/components/ui/button"

export function UserProfileTab() {
  const mockUser = {
    name: 'Nguyễn An Phú',
    dob: '2005-08-15',
    phone: '0987654321',
    email: 'phuna@fpt.edu.vn',
    cccd: '001202001234'
  }

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-200">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Hồ sơ cá nhân</h2>
        <p className="text-slate-500">Quản lý thông tin cá nhân và giấy tờ xác minh của bạn.</p>
      </div>

      {/* Basic Info Form */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Thông tin cơ bản</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Họ và tên</label>
            <input 
              type="text" 
              defaultValue={mockUser.name}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-fpt-blue focus:ring-1 focus:ring-fpt-blue transition-all font-medium text-slate-900" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Ngày sinh</label>
            <input 
              type="date" 
              defaultValue={mockUser.dob}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-fpt-blue focus:ring-1 focus:ring-fpt-blue transition-all font-medium text-slate-900" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Số điện thoại</label>
            <input 
              type="tel" 
              defaultValue={mockUser.phone}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-fpt-blue focus:ring-1 focus:ring-fpt-blue transition-all font-medium text-slate-900" 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
            <input 
              type="email" 
              defaultValue={mockUser.email}
              disabled
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed font-medium" 
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Số Căn cước công dân (CCCD) / Số GPLX</label>
            <input 
              type="text" 
              defaultValue={mockUser.cccd}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-fpt-blue focus:ring-1 focus:ring-fpt-blue transition-all font-medium text-slate-900" 
            />
          </div>
        </div>
      </div>

      {/* ID Verification */}
      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-2">Giấy tờ xác minh (CCCD / Bằng lái xe)</h3>
        
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 cursor-pointer transition-colors mt-4">
          <div className="w-14 h-14 bg-blue-50 text-fpt-blue rounded-full flex items-center justify-center mb-4">
            <UploadCloud className="w-7 h-7" />
          </div>
          <p className="font-bold text-slate-700 text-base mb-1">Nhấn để tải ảnh lên hoặc kéo thả vào đây</p>
          <p className="text-sm text-slate-400">Hỗ trợ định dạng JPG, PNG (Tối đa 5MB)</p>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end pt-6">
        <Button className="h-12 px-8 bg-fpt-blue hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all hover:-translate-y-0.5">
          Lưu thay đổi
        </Button>
      </div>
    </div>
  )
}
