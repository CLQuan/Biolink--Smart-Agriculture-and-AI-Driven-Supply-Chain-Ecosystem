import React, { useState } from 'react'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { Package, Filter, Search, Cpu, ChevronDown } from 'lucide-react'
import StatusBadge from '../components/StatusBadge'

// Mock batch data
const mockBatches = [
  { id: 'BL-2041', farm: 'Lim Farm', crop: 'Lettuce', grade: 'Grade A', weight: 142.5, status: 'Approved', confidence: 97.3, date: '2025-06-04' },
  { id: 'BL-2040', farm: 'Green Valley Organics', crop: 'Spinach', grade: 'Grade A', weight: 98.0, status: 'Approved', confidence: 94.8, date: '2025-06-04' },
  { id: 'BL-2039', farm: 'Highland Fresh Co.', crop: 'Kailan', grade: 'Grade B', weight: 76.2, status: 'Approved', confidence: 81.5, date: '2025-06-04' },
  { id: 'BL-2038', farm: 'Tanah Tinggi Farm', crop: 'Choy Sum', grade: 'Grade A', weight: 210.0, status: 'In Transit', confidence: 96.1, date: '2025-06-04' },
  { id: 'BL-2037', farm: 'Agrotech Highlands', crop: 'Spinach', grade: 'Grade B', weight: 58.8, status: 'Pending', confidence: 78.9, date: '2025-06-04' },
  { id: 'BL-2036', farm: 'Organic Roots Sdn Bhd', crop: 'Lettuce', grade: 'Grade A', weight: 168.3, status: 'Approved', confidence: 98.2, date: '2025-06-03' },
  { id: 'BL-2035', farm: 'Lim Farm', crop: 'Kailan', grade: 'Grade C', weight: 44.1, status: 'Rejected', confidence: 61.0, date: '2025-06-03' },
  { id: 'BL-2034', farm: 'Sunrise Organics', crop: 'Choy Sum', grade: 'Grade A', weight: 124.7, status: 'Approved', confidence: 95.5, date: '2025-06-03' },
  { id: 'BL-2033', farm: 'Green Valley Organics', crop: 'Lettuce', grade: 'Grade B', weight: 87.5, status: 'Approved', confidence: 82.3, date: '2025-06-03' },
  { id: 'BL-2032', farm: 'Highland Fresh Co.', crop: 'Spinach', grade: 'Grade A', weight: 153.0, status: 'Approved', confidence: 93.7, date: '2025-06-03' },
  { id: 'BL-2031', farm: 'Tanah Tinggi Farm', crop: 'Kailan', grade: 'Grade B', weight: 67.4, status: 'Pending', confidence: 75.1, date: '2025-06-02' },
  { id: 'BL-2030', farm: 'Agrotech Highlands', crop: 'Choy Sum', grade: 'Grade C', weight: 31.8, status: 'Rejected', confidence: 55.8, date: '2025-06-02' },
  { id: 'BL-2029', farm: 'Organic Roots Sdn Bhd', crop: 'Lettuce', grade: 'Grade A', weight: 190.0, status: 'Approved', confidence: 97.9, date: '2025-06-02' },
  { id: 'BL-2028', farm: 'Sunrise Organics', crop: 'Spinach', grade: 'Grade A', weight: 118.6, status: 'In Transit', confidence: 91.4, date: '2025-06-02' },
]

const gradeDistribution = [
  { name: 'Grade A', value: 68, color: '#2D5A1B' },
  { name: 'Grade B', value: 24, color: '#8BC34A' },
  { name: 'Grade C', value: 8, color: '#FF8F00' },
]

const farms = ['All Farms', 'Lim Farm', 'Green Valley Organics', 'Highland Fresh Co.', 'Tanah Tinggi Farm', 'Agrotech Highlands', 'Organic Roots Sdn Bhd', 'Sunrise Organics']
const grades = ['All Grades', 'Grade A', 'Grade B', 'Grade C']
const statuses = ['All Status', 'Approved', 'Pending', 'Rejected', 'In Transit']

const cropIcons: Record<string, string> = {
  Lettuce: '🥬',
  Spinach: '🌿',
  Kailan: '🥦',
  'Choy Sum': '🌱',
}

const confidenceColor = (conf: number) => {
  if (conf >= 90) return 'text-green-700 bg-green-50'
  if (conf >= 75) return 'text-amber-700 bg-amber-50'
  return 'text-red-700 bg-red-50'
}

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#D4C9B0] rounded-xl shadow-lg p-3">
        <p className="text-xs font-bold text-[#2C1A0E]">{payload[0].name}</p>
        <p className="text-xs text-gray-500">{payload[0].value}% of batches</p>
      </div>
    )
  }
  return null
}

const Inventory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGrade, setSelectedGrade] = useState('All Grades')
  const [selectedFarm, setSelectedFarm] = useState('All Farms')
  const [selectedStatus, setSelectedStatus] = useState('All Status')

  const filtered = mockBatches.filter(b => {
    const matchGrade = selectedGrade === 'All Grades' || b.grade === selectedGrade
    const matchFarm = selectedFarm === 'All Farms' || b.farm === selectedFarm
    const matchStatus = selectedStatus === 'All Status' || b.status === selectedStatus
    const matchSearch = !searchQuery || b.id.toLowerCase().includes(searchQuery.toLowerCase()) || b.farm.toLowerCase().includes(searchQuery.toLowerCase()) || b.crop.toLowerCase().includes(searchQuery.toLowerCase())
    return matchGrade && matchFarm && matchStatus && matchSearch
  })

  const totals = {
    approved: mockBatches.filter(b => b.status === 'Approved').length,
    pending: mockBatches.filter(b => b.status === 'Pending').length,
    rejected: mockBatches.filter(b => b.status === 'Rejected').length,
    totalWeight: mockBatches.reduce((sum, b) => sum + b.weight, 0).toFixed(1),
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Package className="w-5 h-5 text-[#4A8C2A]" />
          <span className="text-sm text-[#4A8C2A] font-semibold">Batch Management</span>
        </div>
        <h1 className="text-2xl font-extrabold text-[#2C1A0E]">Inventory</h1>
        <p className="text-gray-500 text-sm mt-0.5">All crop batches with AI grading results and quality status</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-4 border-l-4 border-l-green-500">
          <p className="text-xs text-gray-500 font-medium">Approved</p>
          <p className="text-2xl font-extrabold text-green-700">{totals.approved}</p>
        </div>
        <div className="card p-4 border-l-4 border-l-yellow-400">
          <p className="text-xs text-gray-500 font-medium">Pending AI Check</p>
          <p className="text-2xl font-extrabold text-yellow-700">{totals.pending}</p>
        </div>
        <div className="card p-4 border-l-4 border-l-red-500">
          <p className="text-xs text-gray-500 font-medium">Rejected</p>
          <p className="text-2xl font-extrabold text-red-700">{totals.rejected}</p>
        </div>
        <div className="card p-4 border-l-4 border-l-[#2D5A1B]">
          <p className="text-xs text-gray-500 font-medium">Total Weight (kg)</p>
          <p className="text-2xl font-extrabold text-[#2D5A1B]">{totals.totalWeight}</p>
        </div>
      </div>

      {/* Main content: table + pie chart */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Inventory section */}
        <div className="xl:col-span-2 space-y-4">
          {/* Filters */}
          <div className="card p-4">
            <div className="flex flex-wrap gap-3">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search batch ID, farm, or crop..."
                  className="input-field pl-9 text-sm"
                />
              </div>
              {/* Grade filter */}
              <div className="relative">
                <select
                  value={selectedGrade}
                  onChange={e => setSelectedGrade(e.target.value)}
                  className="input-field appearance-none pr-8 text-sm cursor-pointer"
                >
                  {grades.map(g => <option key={g}>{g}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              {/* Farm filter */}
              <div className="relative">
                <select
                  value={selectedFarm}
                  onChange={e => setSelectedFarm(e.target.value)}
                  className="input-field appearance-none pr-8 text-sm cursor-pointer"
                >
                  {farms.map(f => <option key={f}>{f}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              {/* Status filter */}
              <div className="relative">
                <select
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value)}
                  className="input-field appearance-none pr-8 text-sm cursor-pointer"
                >
                  {statuses.map(s => <option key={s}>{s}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
              <div className="flex items-center gap-1 text-xs text-gray-400">
                <Filter className="w-3 h-3" />
                {filtered.length} results
              </div>
            </div>
          </div>

          {/* Inventory Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filtered.map(batch => (
              <div key={batch.id} className="card p-4 hover:shadow-md transition-shadow cursor-default">
                {/* Card header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{cropIcons[batch.crop] || '🌾'}</span>
                    <div>
                      <p className="text-xs font-mono font-bold text-[#2D5A1B]">{batch.id}</p>
                      <p className="text-xs text-gray-500">{batch.date}</p>
                    </div>
                  </div>
                  <StatusBadge status={batch.status} size="sm" />
                </div>
                {/* Details */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Farm</span>
                    <span className="text-xs font-semibold text-[#2C1A0E] text-right max-w-[60%]">{batch.farm}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Crop</span>
                    <span className="text-xs font-semibold text-[#2C1A0E]">{batch.crop}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Weight</span>
                    <span className="text-xs font-semibold text-[#2C1A0E]">{batch.weight} kg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Grade</span>
                    <StatusBadge status={batch.grade} size="sm" />
                  </div>
                </div>
                {/* AI Confidence */}
                <div className="mt-3 pt-3 border-t border-[#F5F0E8]">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Cpu className="w-3 h-3" />
                      AI Confidence
                    </div>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${confidenceColor(batch.confidence)}`}>
                      {batch.confidence}%
                    </span>
                  </div>
                  <div className="w-full bg-[#F5F0E8] rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full transition-all"
                      style={{
                        width: `${batch.confidence}%`,
                        backgroundColor: batch.confidence >= 90 ? '#2D5A1B' : batch.confidence >= 75 ? '#FF8F00' : '#DC2626',
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="sm:col-span-2 card p-8 text-center">
                <p className="text-gray-400 font-medium">No batches found matching your filters</p>
              </div>
            )}
          </div>
        </div>

        {/* Grade Distribution Pie */}
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-bold text-[#2C1A0E] mb-1">Grade Distribution</h3>
            <p className="text-xs text-gray-400 mb-4">All batches — last 7 days</p>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={gradeDistribution}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {gradeDistribution.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 mt-2">
              {gradeDistribution.map(g => (
                <div key={g.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: g.color }} />
                    <span className="text-xs font-medium text-[#2C1A0E]">{g.name}</span>
                  </div>
                  <span className="text-xs font-bold text-[#2C1A0E]">{g.value}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Crop breakdown */}
          <div className="card p-5">
            <h3 className="font-bold text-[#2C1A0E] mb-3">Crop Breakdown</h3>
            {['Lettuce', 'Spinach', 'Kailan', 'Choy Sum'].map(crop => {
              const count = mockBatches.filter(b => b.crop === crop).length
              const pct = Math.round((count / mockBatches.length) * 100)
              return (
                <div key={crop} className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{cropIcons[crop]}</span>
                      <span className="text-xs font-medium text-[#2C1A0E]">{crop}</span>
                    </div>
                    <span className="text-xs text-gray-500">{count} batches ({pct}%)</span>
                  </div>
                  <div className="w-full bg-[#F5F0E8] rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-[#2D5A1B] to-[#8BC34A]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Inventory
