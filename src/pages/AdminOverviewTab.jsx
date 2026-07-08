import { DollarSign, ClipboardList, Car, Users } from "lucide-react"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { useState } from "react"

const chartData = {
  last7Days: [
    { name: 'T2', total: 15000000 },
    { name: 'T3', total: 22000000 },
    { name: 'T4', total: 18000000 },
    { name: 'T5', total: 30000000 },
    { name: 'T6', total: 28000000 },
    { name: 'T7', total: 45000000 },
    { name: 'CN', total: 50000000 },
  ],
  last30Days: [
    { name: 'Tuần 1', total: 110000000 },
    { name: 'Tuần 2', total: 145000000 },
    { name: 'Tuần 3', total: 120000000 },
    { name: 'Tuần 4', total: 180000000 },
  ],
  thisYear: [
    { name: 'Th1', total: 450000000 },
    { name: 'Th2', total: 380000000 },
    { name: 'Th3', total: 520000000 },
    { name: 'Th4', total: 610000000 },
    { name: 'Th5', total: 590000000 },
    { name: 'Th6', total: 720000000 },
    { name: 'Th7', total: 850000000 },
    { name: 'Th8', total: 650000000 },
    { name: 'Th9', total: 540000000 },
    { name: 'Th10', total: 480000000 },
    { name: 'Th11', total: 510000000 },
    { name: 'Th12', total: 680000000 },
  ]
}

const recentBookings = [
  { id: '#FPT-8899', customer: 'Nguyễn An Phú', car: 'Mercedes-Benz GLE', date: '08/07/2026', status: 'Chờ duyệt' },
  { id: '#FPT-8898', customer: 'Trần Bình', car: 'Tesla Model S', date: '07/07/2026', status: 'Đã xác nhận' },
  { id: '#FPT-8897', customer: 'Lê Hoa', car: 'BMW X5', date: '07/07/2026', status: 'Chờ duyệt' },
  { id: '#FPT-8896', customer: 'Phạm Minh', car: 'Audi A6', date: '06/07/2026', status: 'Đã xác nhận' },
]

export function AdminOverviewTab() {
  const [timeRange, setTimeRange] = useState('last7Days')

  const formatTooltipLabel = (label) => {
    if (timeRange === 'last7Days') {
      return label === 'CN' ? 'Chủ Nhật' : `Thứ ${label.replace('T', '')}`
    }
    if (timeRange === 'thisYear') {
      return `Tháng ${label.replace('Th', '')}`
    }
    return label
  }

  return (
    <div className="flex flex-col gap-6 p-2">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Tổng quan hệ thống</h1>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
            <DollarSign className="w-7 h-7 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Doanh thu tháng này</p>
            <p className="text-xl font-bold text-slate-800 mt-1">125.500.000 đ</p>
            <p className="text-xs text-emerald-600 font-medium mt-1">+15% so với tháng trước</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center shrink-0">
            <ClipboardList className="w-7 h-7 text-teal-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Đơn đang chờ duyệt</p>
            <p className="text-xl font-bold text-slate-800 mt-1">12</p>
            <p className="text-xs text-red-500 font-medium mt-1">Cần xử lý ngay</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
            <Car className="w-7 h-7 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Xe đang hoạt động</p>
            <p className="text-xl font-bold text-slate-800 mt-1">24 / 50</p>
            <p className="text-xs text-slate-500 font-medium mt-1">Tỷ lệ đặt thành công 48%</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center shrink-0">
            <Users className="w-7 h-7 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Khách hàng mới</p>
            <p className="text-xl font-bold text-slate-800 mt-1">156</p>
            <p className="text-xs text-purple-600 font-medium mt-1">+20 người so với tháng trước</p>
          </div>
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-lg font-semibold text-slate-800">Thống kê doanh thu</h2>
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all cursor-pointer"
          >
            <option value="last7Days">7 ngày qua</option>
            <option value="last30Days">30 ngày qua</option>
            <option value="thisYear">Năm nay</option>
          </select>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData[timeRange]} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f766e" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0f766e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis 
                stroke="#94a3b8" 
                fontSize={12} 
                tickLine={false} 
                axisLine={false} 
                tickFormatter={(value) => `${value / 1000000}tr`}
              />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <Tooltip 
                formatter={(value) => [new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value), 'Tổng doanh thu']}
                labelFormatter={formatTooltipLabel}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
              />
              <Area type="monotone" dataKey="total" stroke="#0f766e" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mt-2">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Đơn đặt xe mới nhất</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-slate-500">
            <thead className="text-xs text-slate-700 uppercase bg-slate-50 border-y border-slate-200">
              <tr>
                <th scope="col" className="px-6 py-3 font-semibold">Mã Đơn</th>
                <th scope="col" className="px-6 py-3 font-semibold">Khách hàng</th>
                <th scope="col" className="px-6 py-3 font-semibold">Xe thuê</th>
                <th scope="col" className="px-6 py-3 font-semibold">Ngày tạo</th>
                <th scope="col" className="px-6 py-3 font-semibold">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((booking, index) => (
                <tr key={index} className="bg-white border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{booking.id}</td>
                  <td className="px-6 py-4">{booking.customer}</td>
                  <td className="px-6 py-4 font-medium">{booking.car}</td>
                  <td className="px-6 py-4">{booking.date}</td>
                  <td className="px-6 py-4">
                    {booking.status === 'Chờ duyệt' ? (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-700 border border-yellow-200">
                        {booking.status}
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                        {booking.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
