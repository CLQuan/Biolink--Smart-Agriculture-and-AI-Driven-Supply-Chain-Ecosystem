import React, { useState } from 'react'
import {
  AlertCircle, AlertTriangle, Info, CheckCircle, Bell,
  Clock, Thermometer, Truck, Cpu, Wifi, Filter,
  ChevronDown, X,
} from 'lucide-react'
import AlertBadge from '../components/AlertBadge'
import StatusBadge from '../components/StatusBadge'

type Severity = 'Critical' | 'Warning' | 'Info'
type AlertStatus = 'Open' | 'Acknowledged' | 'Resolved'
type AlertType = 'Temperature' | 'Route Delay' | 'Grade Rejection' | 'Sync Failure' | 'System'

interface Alert {
  id: number
  type: AlertType
  severity: Severity
  status: AlertStatus
  message: string
  detail: string
  affected: string
  time: string
  date: string
}

const allAlerts: Alert[] = [
  {
    id: 1, type: 'Temperature', severity: 'Critical', status: 'Open',
    message: 'Temperature threshold exceeded — Crate BL-2041',
    detail: 'Cold chain temp rose to 8.1°C (max 5°C). Immediate action required.',
    affected: 'CRT-0041 · Driver Ahmad Razali · WXY-1234',
    time: '09:14 AM', date: '2025-06-04',
  },
  {
    id: 2, type: 'Route Delay', severity: 'Warning', status: 'Acknowledged',
    message: 'Route delay detected — Cameron→Johor, Driver Rajan Kumar',
    detail: 'Vehicle stopped for 22 minutes at KL-Seremban interchange. ETA pushed by 45 minutes.',
    affected: 'Driver Rajan Kumar · WMN-4321 · BL-2037',
    time: '09:02 AM', date: '2025-06-04',
  },
  {
    id: 3, type: 'Grade Rejection', severity: 'Warning', status: 'Open',
    message: 'Batch BL-1032 rejected — Grade C spinach',
    detail: 'AI grading confidence 61%. Wilting detected in 40% of crate volume. Rejected by Zenxin QC.',
    affected: 'BL-1032 · Agrotech Highlands · Zenxin Johor',
    time: '08:47 AM', date: '2025-06-04',
  },
  {
    id: 4, type: 'Sync Failure', severity: 'Info', status: 'Resolved',
    message: 'BLE sensor SN-0034 missed 3 heartbeats',
    detail: 'Sensor temporarily out of Bluetooth range. Auto-reconnected after vehicle stop.',
    affected: 'SN-0034 · CRT-0039 · Driver David Tan',
    time: '08:30 AM', date: '2025-06-04',
  },
  {
    id: 5, type: 'Temperature', severity: 'Info', status: 'Resolved',
    message: 'Temperature spike resolved — Crate BL-1088',
    detail: 'Temperature returned to normal range (3.9°C) after 8-minute deviation. No product impact.',
    affected: 'CRT-0088 · Driver Lee Wei Lun · SGP-8899',
    time: '08:15 AM', date: '2025-06-04',
  },
  {
    id: 6, type: 'Temperature', severity: 'Critical', status: 'Acknowledged',
    message: 'Multiple sensors report high humidity — Truck JHB-5678',
    detail: 'Humidity reading at 96% in cargo hold. Condenser unit check required.',
    affected: 'CRT-0038, CRT-0039 · Driver David Tan · JHB-5678',
    time: '07:55 AM', date: '2025-06-04',
  },
  {
    id: 7, type: 'Grade Rejection', severity: 'Warning', status: 'Resolved',
    message: 'Partial rejection — BL-2030 Choy Sum (6 crates)',
    detail: '6 of 14 crates rejected at Johor hub. AI confidence 55.8%. Credit note CNT-2030 issued.',
    affected: 'BL-2030 · Agrotech Highlands · Zenxin Johor',
    time: '07:30 AM', date: '2025-06-04',
  },
  {
    id: 8, type: 'Sync Failure', severity: 'Info', status: 'Open',
    message: 'Gateway offline — Cameron Packing Hub sensor node',
    detail: 'BLE gateway GW-CAM-02 has not sent telemetry for 9 minutes.',
    affected: 'GW-CAM-02 · Cameron Packing Hub',
    time: '07:12 AM', date: '2025-06-04',
  },
  {
    id: 9, type: 'Route Delay', severity: 'Info', status: 'Resolved',
    message: 'Vehicle WXY-1234 departed 15 min late',
    detail: 'Loading completed at 09:15 AM instead of 09:00 AM. ETA adjusted accordingly.',
    affected: 'Driver Ahmad Razali · WXY-1234 · BL-2041',
    time: '06:45 AM', date: '2025-06-04',
  },
  {
    id: 10, type: 'System', severity: 'Info', status: 'Resolved',
    message: 'AI grading model updated to v2.3.1',
    detail: 'Model accuracy improved by 1.2%. Kailan and Choy Sum precision enhanced.',
    affected: 'BioLink AI Engine',
    time: '06:00 AM', date: '2025-06-04',
  },
]

const alertTypeIcons: Record<AlertType, React.FC<any>> = {
  Temperature: Thermometer,
  'Route Delay': Truck,
  'Grade Rejection': Cpu,
  'Sync Failure': Wifi,
  System: Bell,
}

const alertTypeColors: Record<AlertType, string> = {
  Temperature: 'bg-red-50 text-red-700 border-red-200',
  'Route Delay': 'bg-amber-50 text-amber-700 border-amber-200',
  'Grade Rejection': 'bg-purple-50 text-purple-700 border-purple-200',
  'Sync Failure': 'bg-blue-50 text-blue-700 border-blue-200',
  System: 'bg-gray-50 text-gray-700 border-gray-200',
}

const severityBorderLeft: Record<Severity, string> = {
  Critical: 'border-l-red-500',
  Warning: 'border-l-amber-500',
  Info: 'border-l-blue-400',
}

const Alerts: React.FC = () => {
  const [filterSeverity, setFilterSeverity] = useState<'All' | Severity>('All')
  const [filterType, setFilterType] = useState<'All' | AlertType>('All')
  const [filterStatus, setFilterStatus] = useState<'All' | AlertStatus>('All')
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [statuses, setStatuses] = useState<Record<number, AlertStatus>>(
    Object.fromEntries(allAlerts.map(a => [a.id, a.status]))
  )

  const filtered = allAlerts.filter(a => {
    return (
      (filterSeverity === 'All' || a.severity === filterSeverity) &&
      (filterType === 'All' || a.type === filterType) &&
      (filterStatus === 'All' || statuses[a.id] === filterStatus)
    )
  })

  const criticalCount = allAlerts.filter(a => a.severity === 'Critical').length
  const warningCount = allAlerts.filter(a => a.severity === 'Warning').length
  const infoCount = allAlerts.filter(a => a.severity === 'Info').length

  const handleAcknowledge = (id: number) => {
    setStatuses(prev => ({ ...prev, [id]: 'Acknowledged' }))
  }

  const handleResolve = (id: number) => {
    setStatuses(prev => ({ ...prev, [id]: 'Resolved' }))
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Bell className="w-5 h-5 text-[#4A8C2A]" />
          <span className="text-sm text-[#4A8C2A] font-semibold">System Notifications</span>
        </div>
        <h1 className="text-2xl font-extrabold text-[#2C1A0E]">Alerts &amp; Notifications</h1>
        <p className="text-gray-500 text-sm mt-0.5">Real-time alerts for temperature, delays, quality, and system events</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card p-4 bg-red-50 border border-red-200">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-xs font-medium text-red-600">Critical</span>
          </div>
          <p className="text-2xl font-extrabold text-red-700">{criticalCount}</p>
          <p className="text-xs text-red-500">today</p>
        </div>
        <div className="card p-4 bg-amber-50 border border-amber-200">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-medium text-amber-600">Warnings</span>
          </div>
          <p className="text-2xl font-extrabold text-amber-700">{warningCount}</p>
          <p className="text-xs text-amber-500">today</p>
        </div>
        <div className="card p-4 bg-blue-50 border border-blue-200">
          <div className="flex items-center gap-2 mb-1">
            <Info className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-medium text-blue-600">Info</span>
          </div>
          <p className="text-2xl font-extrabold text-blue-700">{infoCount}</p>
          <p className="text-xs text-blue-500">today</p>
        </div>
        <div className="card p-4 bg-green-50 border border-green-200">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-xs font-medium text-green-600">Resolved</span>
          </div>
          <p className="text-2xl font-extrabold text-green-700">
            {Object.values(statuses).filter(s => s === 'Resolved').length}
          </p>
          <p className="text-xs text-green-500">today</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
            <Filter className="w-3.5 h-3.5" />
            Filters:
          </div>
          {/* Severity */}
          <div className="relative">
            <select
              value={filterSeverity}
              onChange={e => setFilterSeverity(e.target.value as any)}
              className="input-field appearance-none pr-7 text-xs py-1.5 cursor-pointer"
            >
              <option value="All">All Severities</option>
              <option>Critical</option>
              <option>Warning</option>
              <option>Info</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
          </div>
          {/* Type */}
          <div className="relative">
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value as any)}
              className="input-field appearance-none pr-7 text-xs py-1.5 cursor-pointer"
            >
              <option value="All">All Types</option>
              <option>Temperature</option>
              <option>Route Delay</option>
              <option>Grade Rejection</option>
              <option>Sync Failure</option>
              <option>System</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
          </div>
          {/* Status */}
          <div className="relative">
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as any)}
              className="input-field appearance-none pr-7 text-xs py-1.5 cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option>Open</option>
              <option>Acknowledged</option>
              <option>Resolved</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
          </div>
          <span className="text-xs text-gray-400 ml-auto">{filtered.length} alerts</span>
          {(filterSeverity !== 'All' || filterType !== 'All' || filterStatus !== 'All') && (
            <button
              onClick={() => { setFilterSeverity('All'); setFilterType('All'); setFilterStatus('All') }}
              className="flex items-center gap-1 text-xs text-[#4A8C2A] font-medium hover:text-[#2D5A1B]"
            >
              <X className="w-3 h-3" /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Alert Feed */}
      <div className="space-y-2">
        {filtered.length === 0 && (
          <div className="card p-8 text-center">
            <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-2" />
            <p className="text-gray-500 font-medium">No alerts match your filters</p>
          </div>
        )}
        {filtered.map(alert => {
          const Icon = alertTypeIcons[alert.type]
          const isExpanded = expandedId === alert.id
          const currentStatus = statuses[alert.id]

          return (
            <div
              key={alert.id}
              className={`card border-l-4 ${severityBorderLeft[alert.severity]} ${currentStatus === 'Resolved' ? 'opacity-70' : ''} transition-all`}
            >
              {/* Main row */}
              <button
                className="w-full text-left px-5 py-4"
                onClick={() => setExpandedId(isExpanded ? null : alert.id)}
              >
                <div className="flex items-start gap-3">
                  {/* Type icon */}
                  <div className={`p-2 rounded-xl border shrink-0 ${alertTypeColors[alert.type]}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-0.5">
                      <span className="text-sm font-bold text-[#2C1A0E]">{alert.message}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <AlertBadge severity={alert.severity} showIcon={false} />
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border font-medium ${alertTypeColors[alert.type]}`}>
                        {alert.type}
                      </span>
                      <StatusBadge status={currentStatus} size="sm" />
                    </div>
                  </div>
                  {/* Time + expand */}
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock className="w-3 h-3" />
                      {alert.time}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </div>
              </button>

              {/* Expanded detail */}
              {isExpanded && (
                <div className="px-5 pb-4 border-t border-[#F5F0E8] pt-3">
                  <p className="text-xs text-gray-600 mb-3 leading-relaxed">{alert.detail}</p>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-gray-500 bg-[#F5F0E8] rounded-lg px-3 py-1.5">
                      <span className="font-semibold text-[#2C1A0E]">Affected: </span>{alert.affected}
                    </div>
                    <div className="flex items-center gap-2">
                      {currentStatus === 'Open' && (
                        <button
                          onClick={() => handleAcknowledge(alert.id)}
                          className="btn-secondary text-xs py-1.5 px-3"
                        >
                          Acknowledge
                        </button>
                      )}
                      {currentStatus !== 'Resolved' && (
                        <button
                          onClick={() => handleResolve(alert.id)}
                          className="btn-primary text-xs py-1.5 px-3"
                        >
                          Resolve
                        </button>
                      )}
                      {currentStatus === 'Resolved' && (
                        <span className="flex items-center gap-1 text-xs text-green-700 font-semibold">
                          <CheckCircle className="w-3.5 h-3.5" /> Resolved
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Alerts
