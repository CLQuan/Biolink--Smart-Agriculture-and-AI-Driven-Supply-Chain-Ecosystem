import React from 'react'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts'
import {
  Layers, Truck, Cpu, AlertTriangle, CheckCircle,
  Clock, ArrowUpRight, Leaf,
} from 'lucide-react'
import StatCard from '../components/StatCard'
import AlertBadge from '../components/AlertBadge'
import StatusBadge from '../components/StatusBadge'

// Mock Data
const harvestVolumeData = [
  { day: 'Mon', gradeA: 340, gradeB: 120 },
  { day: 'Tue', gradeA: 410, gradeB: 155 },
  { day: 'Wed', gradeA: 380, gradeB: 140 },
  { day: 'Thu', gradeA: 460, gradeB: 180 },
  { day: 'Fri', gradeA: 520, gradeB: 210 },
  { day: 'Sat', gradeA: 490, gradeB: 195 },
  { day: 'Sun', gradeA: 305, gradeB: 98 },
]

const deliveryRouteData = [
  { month: 'Jan', johor: 42, singapore: 28 },
  { month: 'Feb', johor: 38, singapore: 31 },
  { month: 'Mar', johor: 55, singapore: 40 },
  { month: 'Apr', johor: 49, singapore: 35 },
  { month: 'May', johor: 63, singapore: 48 },
  { month: 'Jun', johor: 58, singapore: 52 },
]

const recentAlerts = [
  { id: 1, type: 'Temperature', message: 'Crate BL-2041 temp exceeded 8°C threshold', time: '09:14', severity: 'Critical' as const, status: 'Open' },
  { id: 2, type: 'Route Delay', message: 'Driver Ahmad delayed on KL-Singapore highway', time: '09:02', severity: 'Warning' as const, status: 'Acknowledged' },
  { id: 3, type: 'Grade Rejection', message: 'Batch BL-1032 spinach rejected — Grade C', time: '08:47', severity: 'Warning' as const, status: 'Open' },
  { id: 4, type: 'BLE Sync', message: 'Sensor SN-0034 missed 3 consecutive heartbeats', time: '08:30', severity: 'Info' as const, status: 'Resolved' },
  { id: 5, type: 'Temperature', message: 'Crate BL-1088 stabilised within range', time: '08:15', severity: 'Info' as const, status: 'Resolved' },
]

const activeRoutes = [
  { driver: 'Ahmad Razali', vehicle: 'WXY-1234', route: 'Cameron → Johor Hub', eta: '11:30 AM', status: 'En Route' },
  { driver: 'David Tan', vehicle: 'JHB-5678', route: 'Johor Hub → Singapore', eta: '12:45 PM', status: 'En Route' },
  { driver: 'Rajan Kumar', vehicle: 'WMN-4321', route: 'Cameron → Johor Hub', eta: '02:10 PM', status: 'Delayed' },
  { driver: 'Lee Wei Lun', vehicle: 'SGP-8899', route: 'Packing Hub → Johor', eta: '03:00 PM', status: 'En Route' },
  { driver: 'Farouk Hassan', vehicle: 'WKL-2222', route: 'Cameron → Packing Hub', eta: 'Completed', status: 'Delivered' },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#D4C9B0] rounded-xl shadow-lg p-3">
        <p className="text-xs font-semibold text-[#2C1A0E] mb-1">{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.name} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: <span className="font-bold">{entry.value}</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

const Dashboard: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Page intro */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Leaf className="w-5 h-5 text-[#4A8C2A]" />
            <span className="text-sm text-[#4A8C2A] font-semibold">Live Overview</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#2C1A0E]">Good morning, Admin</h1>
          <p className="text-gray-500 text-sm mt-0.5">Wednesday, 4 June 2025 — Cameron Highlands operations are running</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-white border border-[#D4C9B0] rounded-xl px-4 py-2 shadow-sm">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-sm font-medium text-[#2C1A0E]">System Operational</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Active Batches"
          value={24}
          subtitle="Across all farms"
          icon={Layers}
          color="green"
          trend={{ value: 12, label: 'vs yesterday' }}
        />
        <StatCard
          title="Routes In Transit"
          value={7}
          subtitle="4 Cameron→Johor, 3 Johor→SG"
          icon={Truck}
          color="amber"
          trend={{ value: 2, label: 'active today' }}
        />
        <StatCard
          title="Pending AI Grades"
          value={12}
          subtitle="Awaiting quality check"
          icon={Cpu}
          color="blue"
          trend={{ value: -3, label: 'vs yesterday' }}
        />
        <StatCard
          title="Alerts Today"
          value={3}
          subtitle="1 critical, 2 warnings"
          icon={AlertTriangle}
          color="red"
          trend={{ value: -1, label: 'vs yesterday' }}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Line chart — weekly harvest volumes */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-[#2C1A0E] text-base">Weekly Harvest Volume</h3>
              <p className="text-xs text-gray-400">Crates collected per day — current week</p>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#2D5A1B] inline-block rounded" />
                Grade A
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 bg-[#8BC34A] inline-block rounded" />
                Grade B
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={harvestVolumeData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE0" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="gradeA"
                name="Grade A"
                stroke="#2D5A1B"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#2D5A1B', strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="gradeB"
                name="Grade B"
                stroke="#8BC34A"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#8BC34A', strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar chart — monthly deliveries by route */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-[#2C1A0E] text-base">Monthly Deliveries by Route</h3>
              <p className="text-xs text-gray-400">Completed deliveries per month</p>
            </div>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-[#2D5A1B] inline-block rounded-sm" />
                Cameron→Johor
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-[#FF8F00] inline-block rounded-sm" />
                Cameron→SG
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={deliveryRouteData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE0" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="johor" name="Cameron→Johor" fill="#2D5A1B" radius={[4, 4, 0, 0]} />
              <Bar dataKey="singapore" name="Cameron→SG" fill="#FF8F00" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row — alerts + active routes */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-[#D4C9B0] flex items-center justify-between">
            <div>
              <h3 className="font-bold text-[#2C1A0E]">Recent Alerts</h3>
              <p className="text-xs text-gray-400">Last 5 system alerts</p>
            </div>
            <button className="text-xs text-[#4A8C2A] font-semibold hover:text-[#2D5A1B] flex items-center gap-1 transition-colors">
              View All <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="divide-y divide-[#F5F0E8]">
            {recentAlerts.map(alert => (
              <div key={alert.id} className="px-5 py-3.5 hover:bg-[#F5F0E8]/50 transition-colors">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-semibold text-[#2C1A0E]">{alert.type}</span>
                      <AlertBadge severity={alert.severity} showIcon={false} />
                    </div>
                    <p className="text-xs text-gray-500 truncate">{alert.message}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                      <Clock className="w-3 h-3" />
                      {alert.time}
                    </div>
                    <StatusBadge status={alert.status} size="sm" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Routes */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-[#D4C9B0] flex items-center justify-between">
            <div>
              <h3 className="font-bold text-[#2C1A0E]">Active Routes</h3>
              <p className="text-xs text-gray-400">Current driver assignments</p>
            </div>
            <button className="text-xs text-[#4A8C2A] font-semibold hover:text-[#2D5A1B] flex items-center gap-1 transition-colors">
              View All <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F5F0E8]/70">
                  <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Driver</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">Route</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">ETA</th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F0E8]">
                {activeRoutes.map((route, idx) => (
                  <tr key={idx} className="hover:bg-[#F5F0E8]/50 transition-colors">
                    <td className="px-5 py-3">
                      <div>
                        <p className="text-xs font-semibold text-[#2C1A0E]">{route.driver}</p>
                        <p className="text-xs text-gray-400">{route.vehicle}</p>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <p className="text-xs text-gray-600 max-w-[130px] leading-relaxed">{route.route}</p>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-xs font-medium text-[#2C1A0E]">{route.eta}</span>
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={route.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
