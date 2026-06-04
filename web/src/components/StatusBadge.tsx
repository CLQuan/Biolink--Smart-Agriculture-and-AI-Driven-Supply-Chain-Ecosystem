import React from 'react'

interface StatusBadgeProps {
  status: string
  size?: 'sm' | 'md'
}

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  // Delivery / route
  'En Route': { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' },
  'Delivered': { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
  'Idle': { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
  'Delayed': { bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500' },
  // Inventory
  'Pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500' },
  'Approved': { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
  'Rejected': { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
  'In Transit': { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' },
  'Processing': { bg: 'bg-purple-100', text: 'text-purple-800', dot: 'bg-purple-500' },
  'Arrived': { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
  // Alert
  'Critical': { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' },
  'Warning': { bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500' },
  'Info': { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' },
  // Alert actions
  'Open': { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500' },
  'Acknowledged': { bg: 'bg-amber-100', text: 'text-amber-800', dot: 'bg-amber-500' },
  'Resolved': { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
  // Grades
  'Grade A': { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
  'Grade B': { bg: 'bg-blue-100', text: 'text-blue-800', dot: 'bg-blue-500' },
  'Grade C': { bg: 'bg-orange-100', text: 'text-orange-800', dot: 'bg-orange-500' },
  'Active': { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
  'Inactive': { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' }
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1'

  return (
    <span className={`inline-flex items-center gap-1.5 ${config.bg} ${config.text} font-semibold rounded-full ${sizeClass}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {status}
    </span>
  )
}

export default StatusBadge
