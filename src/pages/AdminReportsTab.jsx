import { Download, Calendar, TrendingUp, ChevronDown, Check, X } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { format } from "date-fns"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts"

const mockDataMap = {
  'Năm nay': [
    { name: 'Th1', total: 120000000 },
    { name: 'Th2', total: 150000000 },
    { name: 'Th3', total: 180000000 },
    { name: 'Th4', total: 160000000 },
    { name: 'Th5', total: 210000000 },
    { name: 'Th6', total: 250000000 },
    { name: 'Th7', total: 320000000 },
    { name: 'Th8', total: 280000000 },
    { name: 'Th9', total: 190000000 },
    { name: 'Th10', total: 200000000 },
    { name: 'Th11', total: 230000000 },
    { name: 'Th12', total: 290000000 },
  ],
  'Quý này': [
    { name: 'Tháng 7', total: 320000000 },
    { name: 'Tháng 8', total: 280000000 },
    { name: 'Tháng 9', total: 190000000 },
  ],
  'Tháng này': [
    { name: 'Tuần 1', total: 85000000 },
    { name: 'Tuần 2', total: 60000000 },
    { name: 'Tuần 3', total: 95000000 },
    { name: 'Tuần 4', total: 80000000 },
  ],
  'Tùy chỉnh...': [
    { name: '15/07', total: 12000000 },
    { name: '16/07', total: 15000000 },
    { name: '17/07', total: 18000000 },
    { name: '18/07', total: 9000000 },
  ]
}

const dateRanges = {
  'Năm nay': '01/01/2026 - 31/12/2026',
  'Quý này': '01/07/2026 - 30/09/2026',
  'Tháng này': '01/07/2026 - 31/07/2026',
  'Tùy chỉnh...': 'Tùy chỉnh khoảng thời gian',
}

const brandData = [
  { name: 'VinFast', value: 40 },
  { name: 'Mercedes-Benz', value: 30 },
  { name: 'Mazda', value: 20 },
  { name: 'Khác', value: 10 },
]
const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#64748b']

const topCars = [
  {
    id: 1,
    name: 'Mercedes-Benz GLE',
    image: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&q=80&w=200&h=120',
    trips: 45,
    revenue: '135.000.000 đ'
  },
  {
    id: 2,
    name: 'VinFast VF8',
    image: 'https://images.unsplash.com/photo-1698242858178-5e4c9c22ed08?auto=format&fit=crop&q=80&w=200&h=120',
    trips: 82,
    revenue: '98.000.000 đ'
  },
  {
    id: 3,
    name: 'Mazda 3',
    image: 'https://images.unsplash.com/photo-1549117621-e034057dc6be?auto=format&fit=crop&q=80&w=200&h=120',
    trips: 120,
    revenue: '85.500.000 đ'
  }
]

export function AdminReportsTab() {
  const [reportPeriod, setReportPeriod] = useState('Năm nay')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isCustomPickerOpen, setIsCustomPickerOpen] = useState(false)
  const [customDates, setCustomDates] = useState({
    from: '2026-07-01',
    to: '2026-07-31'
  })
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="flex flex-col gap-6 p-2">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Báo cáo & Phân tích doanh thu</h1>
          <p className="text-sm text-slate-500 mt-1">Tổng quan tình hình kinh doanh của hệ thống</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-colors shadow-sm">
          <Download className="w-4 h-4" />
          Xuất báo cáo (Excel/CSV)
        </button>
      </div>

      {/* Date Filter */}
      <div className="relative max-w-sm" ref={dropdownRef}>
        <div 
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-sm cursor-pointer hover:bg-slate-50 hover:border-slate-300 transition-all group"
        >
          <Calendar className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Thời gian: {reportPeriod}</p>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </div>
            <p className="text-sm font-bold text-slate-700">
              {reportPeriod === 'Tùy chỉnh...' && customDates.from && customDates.to 
                ? `${format(new Date(customDates.from), 'dd/MM/yyyy')} - ${format(new Date(customDates.to), 'dd/MM/yyyy')}`
                : dateRanges[reportPeriod]}
            </p>
          </div>
        </div>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute top-full mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            {Object.keys(mockDataMap).map((period) => (
              <button
                key={period}
                onClick={() => {
                  setReportPeriod(period)
                  setIsDropdownOpen(false)
                  if (period === 'Tùy chỉnh...') {
                    setIsCustomPickerOpen(true)
                  }
                }}
                className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-colors ${
                  reportPeriod === period 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {period}
                {reportPeriod === period && <Check className="w-4 h-4" />}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Bar Chart */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-teal-600" /> Doanh thu theo tháng
        </h2>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={mockDataMap[reportPeriod]} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }} 
                tickFormatter={(value) => `${value / 1000000}M`}
                dx={-10}
              />
              <Tooltip 
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                formatter={(value) => [`${value.toLocaleString('vi-VN')} đ`, 'Doanh thu']}
              />
              <Bar dataKey="total" fill="#0d9488" radius={[6, 6, 0, 0]} maxBarSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Pie Chart */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Tỷ trọng theo hãng xe</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={brandData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {brandData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Tỷ trọng']}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Cars List */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-6">Top 3 xe doanh thu cao nhất</h2>
          <div className="space-y-4">
            {topCars.map((car, index) => (
              <div key={car.id} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:border-blue-100 hover:shadow-md transition-all group">
                <div className="relative shrink-0">
                  <img src={car.image} alt={car.name} className="w-24 h-16 object-cover rounded-lg shadow-sm" />
                  <div className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-slate-800 text-white font-bold text-xs flex items-center justify-center border-2 border-white shadow-sm">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 truncate group-hover:text-blue-700 transition-colors">{car.name}</h3>
                  <p className="text-sm text-slate-500">{car.trips} chuyến đi hoàn thành</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-emerald-600">{car.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Simple Date Range Picker Modal */}
      {isCustomPickerOpen && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm relative overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-800">Tùy chỉnh thời gian</h2>
              <button 
                onClick={() => setIsCustomPickerOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-6">
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Doanh thu từ ngày
                  </label>
                  <input 
                    type="date" 
                    value={customDates.from}
                    onChange={(e) => setCustomDates({ ...customDates, from: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Đến ngày
                  </label>
                  <input 
                    type="date" 
                    value={customDates.to}
                    onChange={(e) => setCustomDates({ ...customDates, to: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all" 
                  />
                </div>
              </div>
            </div>
            
            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button 
                onClick={() => setIsCustomPickerOpen(false)}
                className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-200 font-medium transition-colors"
              >
                Hủy
              </button>
              <button 
                onClick={() => setIsCustomPickerOpen(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-sm transition-all"
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  )
}
