import React, { useState } from 'react'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import {
  BarChart3, Download, CheckCircle, FileText, Leaf,
  TrendingUp, TrendingDown, Award, ChevronUp, ChevronDown,
} from 'lucide-react'
import StatusBadge from '../components/StatusBadge'

// Mock data
const weeklyTrendData = [
  { week: 'Wk 1', accepted: 48, rejected: 2, creditNotes: 1 },
  { week: 'Wk 2', accepted: 52, rejected: 3, creditNotes: 2 },
  { week: 'Wk 3', accepted: 61, rejected: 1, creditNotes: 0 },
  { week: 'Wk 4', accepted: 55, rejected: 4, creditNotes: 1 },
  { week: 'Wk 5', accepted: 67, rejected: 2, creditNotes: 2 },
  { week: 'Wk 6', accepted: 70, rejected: 1, creditNotes: 0 },
]

const rejectionLog = [
  { id: 'BL-2030', supplier: 'Agrotech Highlands', crop: 'Choy Sum', reason: 'Wilting — Grade C (AI: 55.8%)', date: '2025-06-04', creditNote: 'CNT-2030' },
  { id: 'BL-2035', supplier: 'Lim Farm', crop: 'Kailan', reason: 'Discolouration — Grade C (AI: 61.0%)', date: '2025-06-03', creditNote: 'CNT-2035' },
  { id: 'BL-1032', supplier: 'Agrotech Highlands', crop: 'Spinach', reason: 'Wilting — partial rejection (40%)', date: '2025-06-04', creditNote: 'CNT-1032' },
  { id: 'BL-1018', supplier: 'Highland Fresh Co.', crop: 'Lettuce', reason: 'Overweight batch — grading mismatch', date: '2025-06-01', creditNote: 'CNT-1018' },
]

const supplierPerformance = [
  { rank: 1, supplier: 'Organic Roots Sdn Bhd', batches: 28, accepted: 28, rejected: 0, acceptance: 100.0, avgGrade: 'Grade A', trend: 'up' },
  { rank: 2, supplier: 'Sunrise Organics', batches: 24, accepted: 24, rejected: 0, acceptance: 100.0, avgGrade: 'Grade A', trend: 'up' },
  { rank: 3, supplier: 'Lim Farm', batches: 32, accepted: 31, rejected: 1, acceptance: 96.9, avgGrade: 'Grade A', trend: 'stable' },
  { rank: 4, supplier: 'Green Valley Organics', batches: 27, accepted: 26, rejected: 1, acceptance: 96.3, avgGrade: 'Grade A/B', trend: 'up' },
  { rank: 5, supplier: 'Highland Fresh Co.', batches: 22, accepted: 21, rejected: 1, acceptance: 95.5, avgGrade: 'Grade B', trend: 'stable' },
  { rank: 6, supplier: 'Tanah Tinggi Farm', batches: 18, accepted: 17, rejected: 1, acceptance: 94.4, avgGrade: 'Grade A/B', trend: 'down' },
  { rank: 7, supplier: 'Agrotech Highlands', batches: 20, accepted: 17, rejected: 3, acceptance: 85.0, avgGrade: 'Grade B/C', trend: 'down' },
]

const monthlyVolumeData = [
  { month: 'Jan', volume: 420, revenue: 68000 },
  { month: 'Feb', revenue: 72000, volume: 448 },
  { month: 'Mar', volume: 512, revenue: 81000 },
  { month: 'Apr', volume: 485, revenue: 77000 },
  { month: 'May', volume: 560, revenue: 89500 },
  { month: 'Jun', volume: 353, revenue: 56800 },
]

const summaryStats = [
  {
    label: 'Acceptance Rate',
    value: '96.8%',
    sub: 'Last 30 days',
    icon: CheckCircle,
    color: 'text-green-700',
    bg: 'bg-green-50',
    border: 'border-green-200',
    trend: '+1.2%',
    trendUp: true,
  },
  {
    label: 'Credit Notes Issued',
    value: '4',
    sub: 'This month',
    icon: FileText,
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    trend: '-2 vs last month',
    trendUp: true,
  },
  {
    label: 'Paperwork Reduction',
    value: '38%',
    sub: 'vs manual process',
    icon: Leaf,
    color: 'text-[#2D5A1B]',
    bg: 'bg-green-50',
    border: 'border-green-200',
    trend: 'Digital adoption',
    trendUp: true,
  },
  {
    label: 'Total Batches',
    value: '171',
    sub: 'Last 30 days',
    icon: BarChart3,
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    trend: '+23 vs last month',
    trendUp: true,
  },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#D4C9B0] rounded-xl shadow-lg p-3">
        <p className="text-xs font-bold text-[#2C1A0E] mb-1">{label}</p>
        {payload.map((p: any) => (
          <p key={p.name} className="text-xs" style={{ color: p.color }}>
            {p.name}: <span className="font-bold">{p.value}</span>
          </p>
        ))}
      </div>
    )
  }
  return null
}

const Reports: React.FC = () => {
  const [sortField, setSortField] = useState<'acceptance' | 'batches' | 'rank'>('rank')
  const [sortAsc, setSortAsc] = useState(true)

  const sorted = [...supplierPerformance].sort((a, b) => {
    const va = a[sortField]
    const vb = b[sortField]
    return sortAsc ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1)
  })

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) setSortAsc(!sortAsc)
    else { setSortField(field); setSortAsc(false) }
  }

  const SortIcon = ({ field }: { field: typeof sortField }) =>
    sortField === field ? (
      sortAsc ? <ChevronUp className="w-3 h-3 inline" /> : <ChevronDown className="w-3 h-3 inline" />
    ) : <span className="w-3 h-3 inline-block" />

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-5 h-5 text-[#4A8C2A]" />
            <span className="text-sm text-[#4A8C2A] font-semibold">Analytics &amp; Reporting</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#2C1A0E]">Reports</h1>
          <p className="text-gray-500 text-sm mt-0.5">Supply chain performance, acceptance rates, and supplier rankings</p>
        </div>
        <button className="btn-primary flex items-center gap-2 shrink-0">
          <Download className="w-4 h-4" />
          <span className="hidden sm:inline">Export Report</span>
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {summaryStats.map(stat => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className={`card p-4 ${stat.bg} border ${stat.border}`}>
              <div className="flex items-start justify-between mb-2">
                <Icon className={`w-5 h-5 ${stat.color}`} />
                <span className={`text-xs font-semibold ${stat.trendUp ? 'text-green-600' : 'text-red-600'} flex items-center gap-0.5`}>
                  {stat.trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                </span>
              </div>
              <p className={`text-2xl font-extrabold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs font-medium text-gray-600 mt-0.5">{stat.label}</p>
              <p className="text-xs text-gray-400">{stat.sub}</p>
              <p className={`text-xs font-semibold mt-1 ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>{stat.trend}</p>
            </div>
          )
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Weekly acceptance/rejection trend */}
        <div className="card p-5">
          <div className="mb-4">
            <h3 className="font-bold text-[#2C1A0E]">Weekly Acceptance Trend</h3>
            <p className="text-xs text-gray-400">Accepted vs rejected batches per week</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyTrendData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }} barGap={3}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE0" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="accepted" name="Accepted" fill="#2D5A1B" radius={[4, 4, 0, 0]} />
              <Bar dataKey="rejected" name="Rejected" fill="#DC2626" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly volume trend */}
        <div className="card p-5">
          <div className="mb-4">
            <h3 className="font-bold text-[#2C1A0E]">Monthly Delivery Volume</h3>
            <p className="text-xs text-gray-400">Total crates delivered per month</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyVolumeData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="volume"
                name="Crates"
                stroke="#4A8C2A"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#4A8C2A', strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row: rejection log + supplier performance */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Rejection log */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-[#D4C9B0]">
            <h3 className="font-bold text-[#2C1A0E]">Rejection Log</h3>
            <p className="text-xs text-gray-400">Rejected batches with credit note references</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F5F0E8]/70">
                  {['Batch ID', 'Supplier', 'Crop', 'Reason', 'Date', 'Credit Note'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F0E8]">
                {rejectionLog.map(row => (
                  <tr key={row.id} className="hover:bg-[#F5F0E8]/40 transition-colors">
                    <td className="px-4 py-3 text-xs font-mono font-bold text-[#2D5A1B]">{row.id}</td>
                    <td className="px-4 py-3 text-xs font-medium text-[#2C1A0E]">{row.supplier}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{row.crop}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 max-w-[160px]">
                      <span className="line-clamp-2">{row.reason}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{row.date}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-lg">
                        {row.creditNote}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Supplier performance */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-[#D4C9B0]">
            <h3 className="font-bold text-[#2C1A0E]">Supplier Performance</h3>
            <p className="text-xs text-gray-400">Ranked by acceptance rate — last 30 days</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F5F0E8]/70">
                  <th
                    className="text-left text-xs font-semibold text-gray-500 px-4 py-3 cursor-pointer hover:text-[#2D5A1B]"
                    onClick={() => handleSort('rank')}
                  >
                    Rank <SortIcon field="rank" />
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">Supplier</th>
                  <th
                    className="text-left text-xs font-semibold text-gray-500 px-3 py-3 cursor-pointer hover:text-[#2D5A1B]"
                    onClick={() => handleSort('batches')}
                  >
                    Batches <SortIcon field="batches" />
                  </th>
                  <th
                    className="text-left text-xs font-semibold text-gray-500 px-4 py-3 cursor-pointer hover:text-[#2D5A1B]"
                    onClick={() => handleSort('acceptance')}
                  >
                    Accept% <SortIcon field="acceptance" />
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 px-3 py-3">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F0E8]">
                {sorted.map(row => (
                  <tr key={row.rank} className="hover:bg-[#F5F0E8]/40 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        {row.rank <= 3 && (
                          <Award className={`w-4 h-4 ${row.rank === 1 ? 'text-yellow-500' : row.rank === 2 ? 'text-gray-400' : 'text-amber-700'}`} />
                        )}
                        <span className="text-xs font-bold text-[#2C1A0E]">#{row.rank}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <p className="text-xs font-semibold text-[#2C1A0E]">{row.supplier}</p>
                      <p className="text-xs text-gray-400">{row.rejected} rejections</p>
                    </td>
                    <td className="px-3 py-3 text-xs text-gray-600">{row.batches}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-14 h-1.5 bg-[#F5F0E8] rounded-full">
                          <div
                            className="h-1.5 rounded-full"
                            style={{
                              width: `${row.acceptance}%`,
                              backgroundColor: row.acceptance >= 95 ? '#2D5A1B' : row.acceptance >= 90 ? '#FF8F00' : '#DC2626',
                            }}
                          />
                        </div>
                        <span className={`text-xs font-bold ${row.acceptance >= 95 ? 'text-green-700' : row.acceptance >= 90 ? 'text-amber-700' : 'text-red-700'}`}>
                          {row.acceptance}%
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      {row.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
                      {row.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
                      {row.trend === 'stable' && <span className="text-xs text-gray-400">—</span>}
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

export default Reports
