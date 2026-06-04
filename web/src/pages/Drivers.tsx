import React, { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts'
import {
  Truck, Thermometer, Droplets, MapPin, Clock, Wifi, User,
  ChevronRight, Activity,
} from 'lucide-react'
import StatusBadge from '../components/StatusBadge'

// Mock driver data
const drivers = [
  {
    id: 'DRV-001',
    name: 'Ahmad Razali',
    vehicle: 'WXY-1234',
    vehicleType: 'Refrigerated Van',
    route: 'Cameron → Johor Hub',
    eta: '11:30 AM',
    status: 'En Route',
    progress: 62,
    temp: 4.2,
    humidity: 88,
    lastSync: '2 min ago',
    batches: 'BL-2041, BL-2040',
    phone: '+60-11-2345-6789',
  },
  {
    id: 'DRV-002',
    name: 'David Tan',
    vehicle: 'JHB-5678',
    vehicleType: 'Cold Storage Truck',
    route: 'Johor Hub → Singapore',
    eta: '12:45 PM',
    status: 'En Route',
    progress: 38,
    temp: 3.8,
    humidity: 86,
    lastSync: '1 min ago',
    batches: 'BL-2038',
    phone: '+60-12-8765-4321',
  },
  {
    id: 'DRV-003',
    name: 'Rajan Kumar',
    vehicle: 'WMN-4321',
    vehicleType: 'Refrigerated Van',
    route: 'Cameron → Johor Hub',
    eta: '02:45 PM',
    status: 'Delayed',
    progress: 41,
    temp: 5.9,
    humidity: 84,
    lastSync: '5 min ago',
    batches: 'BL-2037',
    phone: '+60-10-5555-7788',
  },
  {
    id: 'DRV-004',
    name: 'Lee Wei Lun',
    vehicle: 'SGP-8899',
    vehicleType: 'Cold Storage Truck',
    route: 'Packing Hub → Johor',
    eta: '03:00 PM',
    status: 'En Route',
    progress: 19,
    temp: 4.0,
    humidity: 87,
    lastSync: '3 min ago',
    batches: 'BL-2042, BL-2043',
    phone: '+65-9-1234-5678',
  },
  {
    id: 'DRV-005',
    name: 'Farouk Hassan',
    vehicle: 'WKL-2222',
    vehicleType: 'Refrigerated Van',
    route: 'Cameron → Packing Hub',
    eta: 'Completed',
    status: 'Delivered',
    progress: 100,
    temp: 4.5,
    humidity: 89,
    lastSync: '12 min ago',
    batches: 'BL-2036',
    phone: '+60-11-9988-7766',
  },
  {
    id: 'DRV-006',
    name: 'Muthu Selvam',
    vehicle: 'WPJ-3456',
    vehicleType: 'Refrigerated Van',
    route: 'Unassigned',
    eta: '—',
    status: 'Idle',
    progress: 0,
    temp: null,
    humidity: null,
    lastSync: '18 min ago',
    batches: '—',
    phone: '+60-10-3344-5566',
  },
]

// BLE sensor telemetry
const sensorReadings = [
  { driverId: 'DRV-001', crateId: 'CRT-0041', temp: 4.2, humidity: 88, battery: 87, rssi: -62, timestamp: '09:28 AM' },
  { driverId: 'DRV-001', crateId: 'CRT-0040', temp: 4.4, humidity: 87, battery: 91, rssi: -58, timestamp: '09:28 AM' },
  { driverId: 'DRV-002', crateId: 'CRT-0038', temp: 3.8, humidity: 86, battery: 72, rssi: -71, timestamp: '09:27 AM' },
  { driverId: 'DRV-003', crateId: 'CRT-0037', temp: 5.9, humidity: 84, battery: 65, rssi: -69, timestamp: '09:23 AM' },
  { driverId: 'DRV-004', crateId: 'CRT-0042', temp: 4.0, humidity: 87, battery: 95, rssi: -55, timestamp: '09:25 AM' },
  { driverId: 'DRV-004', crateId: 'CRT-0043', temp: 4.1, humidity: 88, battery: 94, rssi: -57, timestamp: '09:25 AM' },
]

// Temperature telemetry chart data
const tempChartData: Record<string, Array<{ time: string; temp: number }>> = {
  'DRV-001': [
    { time: '06:00', temp: 4.8 }, { time: '06:30', temp: 4.5 }, { time: '07:00', temp: 4.3 },
    { time: '07:30', temp: 4.1 }, { time: '08:00', temp: 4.2 }, { time: '08:30', temp: 4.4 },
    { time: '09:00', temp: 4.2 }, { time: '09:30', temp: 4.2 },
  ],
  'DRV-002': [
    { time: '06:00', temp: 3.9 }, { time: '06:30', temp: 3.8 }, { time: '07:00', temp: 3.7 },
    { time: '07:30', temp: 3.9 }, { time: '08:00', temp: 4.0 }, { time: '08:30', temp: 3.8 },
    { time: '09:00', temp: 3.8 }, { time: '09:30', temp: 3.8 },
  ],
  'DRV-003': [
    { time: '06:00', temp: 4.2 }, { time: '06:30', temp: 4.5 }, { time: '07:00', temp: 5.0 },
    { time: '07:30', temp: 5.5 }, { time: '08:00', temp: 6.1 }, { time: '08:30', temp: 5.8 },
    { time: '09:00', temp: 5.9 }, { time: '09:30', temp: 5.9 },
  ],
  'DRV-004': [
    { time: '06:00', temp: 4.5 }, { time: '06:30', temp: 4.3 }, { time: '07:00', temp: 4.2 },
    { time: '07:30', temp: 4.0 }, { time: '08:00', temp: 4.1 }, { time: '08:30', temp: 4.0 },
    { time: '09:00', temp: 4.0 }, { time: '09:30', temp: 4.0 },
  ],
  'DRV-005': [
    { time: '06:00', temp: 4.6 }, { time: '06:30', temp: 4.4 }, { time: '07:00', temp: 4.5 },
    { time: '07:30', temp: 4.3 }, { time: '08:00', temp: 4.4 }, { time: '08:30', temp: 4.5 },
    { time: '09:00', temp: 4.5 }, { time: '09:30', temp: 4.5 },
  ],
}

const TempTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-[#D4C9B0] rounded-xl shadow-lg p-2.5">
        <p className="text-xs font-semibold text-[#2C1A0E]">{label}</p>
        <p className="text-xs text-blue-600 font-bold">{payload[0].value}°C</p>
      </div>
    )
  }
  return null
}

const statusColorClass = (status: string) => {
  if (status === 'En Route') return 'border-l-blue-500'
  if (status === 'Delivered') return 'border-l-green-500'
  if (status === 'Delayed') return 'border-l-amber-500'
  return 'border-l-gray-300'
}

const Drivers: React.FC = () => {
  const [selectedDriver, setSelectedDriver] = useState(drivers[0])
  const chartData = tempChartData[selectedDriver.id] || tempChartData['DRV-001']
  const driverSensors = sensorReadings.filter(s => s.driverId === selectedDriver.id)

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Truck className="w-5 h-5 text-[#4A8C2A]" />
          <span className="text-sm text-[#4A8C2A] font-semibold">Fleet Management</span>
        </div>
        <h1 className="text-2xl font-extrabold text-[#2C1A0E]">Drivers &amp; Routes</h1>
        <p className="text-gray-500 text-sm mt-0.5">Live driver status, sensor telemetry, and route progress</p>
      </div>

      {/* Fleet summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'En Route', count: drivers.filter(d => d.status === 'En Route').length, color: 'text-blue-700 bg-blue-50 border-blue-200', dot: 'bg-blue-500' },
          { label: 'Delivered', count: drivers.filter(d => d.status === 'Delivered').length, color: 'text-green-700 bg-green-50 border-green-200', dot: 'bg-green-500' },
          { label: 'Delayed', count: drivers.filter(d => d.status === 'Delayed').length, color: 'text-amber-700 bg-amber-50 border-amber-200', dot: 'bg-amber-500' },
          { label: 'Idle', count: drivers.filter(d => d.status === 'Idle').length, color: 'text-gray-600 bg-gray-50 border-gray-200', dot: 'bg-gray-400' },
        ].map(s => (
          <div key={s.label} className={`card p-4 border ${s.color}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className={`w-2 h-2 rounded-full ${s.dot}`} />
              <span className="text-xs font-medium text-gray-500">{s.label}</span>
            </div>
            <p className="text-2xl font-extrabold text-[#2C1A0E]">{s.count}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Driver cards list */}
        <div className="space-y-3">
          <h3 className="font-bold text-[#2C1A0E] text-sm">All Drivers</h3>
          {drivers.map(driver => (
            <button
              key={driver.id}
              onClick={() => setSelectedDriver(driver)}
              className={`w-full text-left card p-4 border-l-4 ${statusColorClass(driver.status)} hover:shadow-md transition-shadow ${selectedDriver.id === driver.id ? 'ring-2 ring-[#4A8C2A] ring-offset-1' : ''}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2D5A1B] to-[#8BC34A] flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {driver.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#2C1A0E] leading-tight">{driver.name}</p>
                    <p className="text-xs text-gray-500">{driver.vehicle} · {driver.vehicleType.split(' ')[0]}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StatusBadge status={driver.status} size="sm" />
                  <ChevronRight className="w-3 h-3 text-gray-400" />
                </div>
              </div>
              {/* Route info */}
              <div className="mt-2.5 flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="truncate">{driver.route}</span>
              </div>
              {/* Progress bar */}
              {driver.progress > 0 && driver.status !== 'Idle' && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{driver.progress}%</span>
                  </div>
                  <div className="w-full bg-[#F5F0E8] rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${driver.status === 'Delayed' ? 'bg-amber-500' : 'bg-[#4A8C2A]'}`}
                      style={{ width: `${driver.progress}%` }}
                    />
                  </div>
                </div>
              )}
              {/* Sensor quick read */}
              {driver.temp !== null && (
                <div className="mt-2 flex gap-3">
                  <div className="flex items-center gap-1 text-xs text-blue-600">
                    <Thermometer className="w-3 h-3" />
                    {driver.temp}°C
                  </div>
                  <div className="flex items-center gap-1 text-xs text-teal-600">
                    <Droplets className="w-3 h-3" />
                    {driver.humidity}%
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Wifi className="w-3 h-3" />
                    {driver.lastSync}
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Driver detail panel */}
        <div className="xl:col-span-2 space-y-4">
          {/* Driver info card */}
          <div className="card p-5">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#2D5A1B] to-[#8BC34A] flex items-center justify-center text-white font-extrabold text-xl shadow-lg">
                  {selectedDriver.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-extrabold text-[#2C1A0E] text-lg leading-tight">{selectedDriver.name}</h3>
                  <p className="text-xs text-gray-500">{selectedDriver.id} · {selectedDriver.vehicleType}</p>
                  <p className="text-xs text-gray-400">{selectedDriver.phone}</p>
                </div>
              </div>
              <StatusBadge status={selectedDriver.status} />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-[#F5F0E8] rounded-xl p-3">
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1"><Truck className="w-3 h-3" /> Vehicle</div>
                <p className="text-sm font-bold text-[#2C1A0E]">{selectedDriver.vehicle}</p>
              </div>
              <div className="bg-[#F5F0E8] rounded-xl p-3">
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1"><MapPin className="w-3 h-3" /> Route</div>
                <p className="text-sm font-bold text-[#2C1A0E] leading-tight">{selectedDriver.route}</p>
              </div>
              <div className="bg-[#F5F0E8] rounded-xl p-3">
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1"><Clock className="w-3 h-3" /> ETA</div>
                <p className="text-sm font-bold text-[#2C1A0E]">{selectedDriver.eta}</p>
              </div>
              <div className="bg-[#F5F0E8] rounded-xl p-3">
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1"><Thermometer className="w-3 h-3" /> Temperature</div>
                <p className={`text-sm font-bold ${selectedDriver.temp && selectedDriver.temp > 5 ? 'text-amber-600' : 'text-blue-600'}`}>
                  {selectedDriver.temp !== null ? `${selectedDriver.temp}°C` : 'N/A'}
                </p>
              </div>
              <div className="bg-[#F5F0E8] rounded-xl p-3">
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1"><Droplets className="w-3 h-3" /> Humidity</div>
                <p className="text-sm font-bold text-teal-700">
                  {selectedDriver.humidity !== null ? `${selectedDriver.humidity}%` : 'N/A'}
                </p>
              </div>
              <div className="bg-[#F5F0E8] rounded-xl p-3">
                <div className="flex items-center gap-1 text-xs text-gray-500 mb-1"><User className="w-3 h-3" /> Batches</div>
                <p className="text-sm font-bold text-[#2C1A0E] text-xs">{selectedDriver.batches}</p>
              </div>
            </div>
          </div>

          {/* Temperature chart */}
          {selectedDriver.status !== 'Idle' && (
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-[#2C1A0E]">Cold Chain Temperature</h3>
                  <p className="text-xs text-gray-400">Today's readings — threshold: 5°C</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#4A8C2A] bg-green-50 px-2 py-1 rounded-full border border-green-200">
                  <Activity className="w-3 h-3" />
                  Live
                </div>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={chartData} margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0EBE0" />
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <YAxis domain={[2, 8]} tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                  <Tooltip content={<TempTooltip />} />
                  <ReferenceLine y={5} stroke="#DC2626" strokeDasharray="4 4" strokeWidth={1.5} label={{ value: 'Max 5°C', position: 'right', fontSize: 9, fill: '#DC2626' }} />
                  <Line
                    type="monotone"
                    dataKey="temp"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    dot={{ r: 3, fill: '#3B82F6', strokeWidth: 0 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* BLE sensor telemetry table */}
          <div className="card overflow-hidden">
            <div className="px-5 py-4 border-b border-[#D4C9B0]">
              <h3 className="font-bold text-[#2C1A0E]">BLE Sensor Telemetry</h3>
              <p className="text-xs text-gray-400">Latest crate sensor readings for {selectedDriver.name}</p>
            </div>
            {driverSensors.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#F5F0E8]/70">
                      {['Crate ID', 'Temperature', 'Humidity', 'Battery', 'RSSI', 'Timestamp'].map(h => (
                        <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F5F0E8]">
                    {driverSensors.map((s, idx) => (
                      <tr key={idx} className="hover:bg-[#F5F0E8]/40 transition-colors">
                        <td className="px-4 py-3 text-xs font-mono font-bold text-[#2D5A1B]">{s.crateId}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-bold ${s.temp > 5 ? 'text-red-600' : 'text-blue-600'}`}>
                            {s.temp}°C {s.temp > 5 && '⚠️'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs font-medium text-teal-700">{s.humidity}%</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <div className="w-12 h-1.5 bg-[#F5F0E8] rounded-full">
                              <div className="h-1.5 rounded-full bg-green-500" style={{ width: `${s.battery}%` }} />
                            </div>
                            <span className="text-xs text-gray-600">{s.battery}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">{s.rssi} dBm</td>
                        <td className="px-4 py-3 text-xs text-gray-500">{s.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-6 text-center">
                <Wifi className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No active sensor readings for this driver</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Drivers
