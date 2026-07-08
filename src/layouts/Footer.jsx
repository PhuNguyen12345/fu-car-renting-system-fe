import { Link } from "react-router-dom"
import logo from "@/assets/FPTCarRental_BG_Removed.png"

export function Footer() {
  return (
    <footer className="bg-[#F8F9FA] border-t border-gray-200 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2 flex flex-col justify-start">
            <Link to="/" className="flex items-center relative h-12 w-[200px] md:w-[240px] mb-6">
              <img 
                src={logo} 
                alt="FPT Car Renting" 
                className="absolute top-1/2 left-0 -translate-y-1/2 w-[240px] md:w-[280px] max-w-none object-contain -ml-4 pointer-events-none" 
              />
            </Link>
            <p className="text-sm text-muted-foreground">
              © 2026 FPT Car Renting System. All rights reserved.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-gray-900">Công ty</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-fpt-blue">Về chúng tôi</Link></li>
              <li><Link to="/contact" className="hover:text-fpt-blue">Liên hệ</Link></li>
              <li><Link to="/careers" className="hover:text-fpt-blue">Tuyển dụng</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-gray-900">Dịch vụ</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/fleet" className="hover:text-fpt-blue">Dàn xe</Link></li>
              <li><Link to="/long-term" className="hover:text-fpt-blue">Thuê dài hạn</Link></li>
              <li><Link to="/corporate" className="hover:text-fpt-blue">Tài khoản doanh nghiệp</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
