import React, { useState } from 'react'
import {
  MapPin, Package, CheckCircle, Truck, Warehouse, Globe,
  ChevronRight, Clock, TrendingUp, AlertTriangle, BarChart2,
  Leaf,
} from 'lucide-react'
import StatusBadge from '../components/StatusBadge'

// Supply chain flow steps
const flowSteps = [
  {
    id: 1,
    label: 'Cameron Highlands Farm',
    sublabel: 'Origin',
    icon: Leaf,
    status: 'Active',
    timestamp: '06:00 AM',
    color: 'bg-[#2D5A1B]',
    lightColor: 'bg-[#2D5A1B]/10',
    textColor: 'text-[#2D5A1B]',
    borderColor: 'border-[#2D5A1B]/30',
    detail: '12 farms active',
  },
  {
    id: 2,
    label: 'Quality Check',
    sublabel: 'AI Grading',
    icon: CheckCircle,
    status: 'Processing',
    timestamp: '07:30 AM',
    color: 'bg-blue-600',
    lightColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    detail: '12 batches pending',
  },
  {
    id: 3,
    label: 'Packing Hub',
    sublabel: 'Cameron Hub',
    icon: Package,
    status: 'Active',
    timestamp: '08:15 AM',
    color: 'bg-purple-600',
    lightColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
    detail: '18 crates packed',
  },
  {
    id: 4,
    label: 'In Transit',
    sublabel: 'Road Logistics',
    icon: Truck,
    status: 'En Route',
    timestamp: '09:00 AM',
    color: 'bg-[#FF8F00]',
    lightColor: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
    detail: '7 drivers active',
  },
  {
    id: 5,
    label: 'Johor Hub',
    sublabel: 'Distribution',
    icon: Warehouse,
    status: 'Active',
    timestamp: '01:30 PM',
    color: 'bg-teal-600',
    lightColor: 'bg-teal-50',
    textColor: 'text-teal-700',
    borderColor: 'border-teal-200',
    detail: 'Zenxin Organic',
  },
  {
    id: 6,
    label: 'Singapore Hub',
    sublabel: 'Final Destination',
    icon: Globe,
    status: 'Active',
    timestamp: '04:00 PM',
    color: 'bg-red-600',
    lightColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
    detail: 'Zenxin Singapore',
  },
]

// Active shipments mock
const activeShipments = [
  { id: 'BL-2041', supplier: 'Lim Farm — Block A', grade: 'Grade A', crates: 24, route: 'Cameron→Johor', status: 'In Transit', eta: '11:30 AM' },
  { id: 'BL-2040', supplier: 'Green Valley Organics', grade: 'Grade A', crates: 18, route: 'Cameron→Johor', status: 'In Transit', eta: '11:45 AM' },
  { id: 'BL-2039', supplier: 'Highland Fresh Co.', grade: 'Grade B', crates: 12, route: 'Cameron→Singapore', status: 'In Transit', eta: '02:00 PM' },
  { id: 'BL-2038', supplier: 'Tanah Tinggi Farm', grade: 'Grade A', crates: 30, route: 'Johor→Singapore', status: 'In Transit', eta: '12:30 PM' },
  { id: 'BL-2037', supplier: 'Agrotech Highlands', grade: 'Grade B', crates: 8, route: 'Cameron→Johor', status: 'Delayed', eta: '02:45 PM' },
  { id: 'BL-2036', supplier: 'Organic Roots Sdn Bhd', grade: 'Grade A', crates: 22, route: 'Cameron→Singapore', status: 'Approved', eta: 'Completed' },
]

// Timeline milestones for selected shipment
const timelineMilestones: Record<string, Array<{ time: string; event: string; location: string; done: boolean }>> = {
  'BL-2041': [
    { time: '06:15 AM', event: 'Harvested & Collected', location: 'Lim Farm, Block A, Cameron Highlands', done: true },
    { time: '07:20 AM', event: 'AI Quality Check — Grade A (Conf: 97.3%)', location: 'Cameron Packing Hub', done: true },
    { time: '08:10 AM', event: 'Crates Packed & Sealed', location: 'Cameron Cold Storage Hub', done: true },
    { time: '08:45 AM', event: 'Loaded onto Truck WXY-1234', location: 'Loading Bay 2, Cameron Hub', done: true },
    { time: '09:00 AM', event: 'Departed Cameron Highlands', location: 'Route E1/E2 Expressway', done: true },
    { time: '11:30 AM', event: 'Expected Arrival at Johor Hub', location: 'Zenxin Organic, Johor Bahru', done: false },
  ],
}

const supplyStats = [
  { label: 'On-Time Rate', value: '94%', sub: 'Last 30 days', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200' },
  { label: 'Avg Transit Time', value: '7.2 hrs', sub: 'Cameron→Johor', icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
  { label: 'Rejection Rate', value: '3.2%', sub: 'Grade C / Rejected', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
  { label: 'Throughput Today', value: '142 crates', sub: '6 active routes', icon: BarChart2, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' },
]

const SupplyChain: React.FC = () => {
  const [selectedShipment, setSelectedShipment] = useState<string>('BL-2041')

  const timeline = timelineMilestones[selectedShipment] || timelineMilestones['BL-2041']

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-5 h-5 text-[#4A8C2A]" />
          <span className="text-sm text-[#4A8C2A] font-semibold">End-to-End Visibility</span>
        </div>
        <h1 className="text-2xl font-extrabold text-[#2C1A0E]">Supply Chain Monitor</h1>
        <p className="text-gray-500 text-sm mt-0.5">Real-time flow from Cameron Highlands farms to distribution hubs</p>
      </div>

      {/* Supply Chain Flow Diagram */}
      <div className="card p-5 sm:p-6">
        <h3 className="font-bold text-[#2C1A0E] mb-5">Supply Chain Flow</h3>
        {/* Desktop: horizontal flow */}
        <div className="hidden md:flex items-center gap-0">
          {flowSteps.map((step, idx) => {
            const Icon = step.icon
            return (
              <React.Fragment key={step.id}>
                <div className={`flex-1 ${step.lightColor} ${step.borderColor} border rounded-2xl p-4 text-center min-w-0 hover:shadow-md transition-shadow cursor-default`}>
                  <div className={`w-10 h-10 ${step.color} rounded-xl flex items-center justify-center mx-auto mb-2 shadow`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className={`text-xs font-bold ${step.textColor} leading-tight mb-0.5`}>{step.label}</p>
                  <p className="text-xs text-gray-400 mb-2">{step.sublabel}</p>
                  <div className={`text-xs font-semibold ${step.textColor} bg-white rounded-lg px-2 py-1 border ${step.borderColor}`}>
                    {step.detail}
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5 flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3" />{step.timestamp}
                  </p>
                </div>
                {idx < flowSteps.length - 1 && (
                  <div className="flex items-center px-1 shrink-0">
                    <div className="h-0.5 w-5 bg-[#D4C9B0]" />
                    <ChevronRight className="w-4 h-4 text-[#D4C9B0]" />
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div>
        {/* Mobile: vertical flow */}
        <div className="flex flex-col gap-2 md:hidden">
          {flowSteps.map((step, idx) => {
            const Icon = step.icon
            return (
              <div key={step.id} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 ${step.color} rounded-xl flex items-center justify-center shadow shrink-0`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  {idx < flowSteps.length - 1 && (
                    <div className="w-0.5 h-5 bg-[#D4C9B0] mt-1" />
                  )}
                </div>
                <div className={`flex-1 ${step.lightColor} border ${step.borderColor} rounded-xl p-3 mb-1`}>
                  <p className={`text-xs font-bold ${step.textColor}`}>{step.label}</p>
                  <p className="text-xs text-gray-400">{step.sublabel} · {step.detail}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{step.timestamp}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {supplyStats.map(stat => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className={`card p-4 ${stat.bg} border ${stat.border}`}>
              <div className="flex items-start gap-3">
                <Icon className={`w-5 h-5 ${stat.color} mt-0.5 shrink-0`} />
                <div>
                  <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
                  <p className={`text-xl font-extrabold ${stat.color} leading-tight`}>{stat.value}</p>
                  <p className="text-xs text-gray-400">{stat.sub}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Active Shipments + Timeline */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Active shipments table */}
        <div className="xl:col-span-2 card overflow-hidden">
          <div className="px-5 py-4 border-b border-[#D4C9B0]">
            <h3 className="font-bold text-[#2C1A0E]">Active Shipments</h3>
            <p className="text-xs text-gray-400">Click a row to view route timeline</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F5F0E8]/70">
                  {['Batch ID', 'Supplier', 'Grade', 'Crates', 'Route', 'ETA', 'Status'].map(h => (
                    <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F0E8]">
                {activeShipments.map(s => (
                  <tr
                    key={s.id}
                    onClick={() => setSelectedShipment(s.id)}
                    className={`cursor-pointer transition-colors hover:bg-[#F5F0E8]/60 ${selectedShipment === s.id ? 'bg-[#2D5A1B]/5 border-l-2 border-l-[#2D5A1B]' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono font-bold text-[#2D5A1B]">{s.id}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-[#2C1A0E] font-medium">{s.supplier}</span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={s.grade} size="sm" />
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-semibold text-[#2C1A0E]">{s.crates}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-gray-500 whitespace-nowrap">{s.route}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs font-medium text-[#2C1A0E]">{s.eta}</span>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={s.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Route Timeline */}
        <div className="card overflow-hidden">
          <div className="px-5 py-4 border-b border-[#D4C9B0]">
            <h3 className="font-bold text-[#2C1A0E]">Route Timeline</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs font-mono font-bold text-[#2D5A1B]">{selectedShipment}</span>
              <StatusBadge status="In Transit" size="sm" />
            </div>
          </div>
          <div className="p-5">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-4 top-5 bottom-5 w-0.5 bg-[#D4C9B0]" />
              <div className="space-y-5">
                {timeline.map((milestone, idx) => (
                  <div key={idx} className="flex gap-4 relative">
                    {/* Dot */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 shadow-sm border-2 ${milestone.done ? 'bg-[#2D5A1B] border-[#2D5A1B]' : 'bg-white border-[#D4C9B0]'}`}>
                      {milestone.done ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : (
                        <Clock className="w-4 h-4 text-[#D4C9B0]" />
                      )}
                    </div>
                    <div className="flex-1 pb-1">
                      <p className={`text-xs font-semibold leading-tight ${milestone.done ? 'text-[#2C1A0E]' : 'text-gray-400'}`}>
                        {milestone.event}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span className="line-clamp-1">{milestone.location}</span>
                      </p>
                      <p className="text-xs text-[#4A8C2A] font-medium mt-0.5">{milestone.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SupplyChain
