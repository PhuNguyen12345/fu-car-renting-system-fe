import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export function UserSecurityTab() {
  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Đổi mật khẩu</h2>
        <p className="text-slate-500">Cập nhật mật khẩu để bảo vệ tài khoản của bạn.</p>
      </div>

      <div className="max-w-md flex flex-col gap-5 pt-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Mật khẩu hiện tại</label>
          <input 
            type="password" 
            placeholder="Nhập mật khẩu hiện tại"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-fpt-blue focus:ring-1 focus:ring-fpt-blue transition-all font-medium text-slate-900 placeholder:text-slate-400" 
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Mật khẩu mới</label>
          <input 
            type="password" 
            placeholder="Nhập mật khẩu mới"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-fpt-blue focus:ring-1 focus:ring-fpt-blue transition-all font-medium text-slate-900 placeholder:text-slate-400" 
          />
          <p className="text-xs text-slate-400 mt-2 font-medium">Mật khẩu phải dài ít nhất 8 ký tự</p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Xác nhận mật khẩu mới</label>
          <input 
            type="password" 
            placeholder="Nhập lại mật khẩu mới"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-fpt-blue focus:ring-1 focus:ring-fpt-blue transition-all font-medium text-slate-900 placeholder:text-slate-400" 
          />
        </div>

        <div className="pt-2">
          <Button className="w-full h-12 bg-fpt-blue hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all hover:-translate-y-0.5">
            Cập nhật mật khẩu
          </Button>
          <Link to="/forgot-password" className="text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors cursor-pointer mt-3 block text-center">
            Quên mật khẩu?
          </Link>
        </div>
      </div>
    </div>
  )
}
