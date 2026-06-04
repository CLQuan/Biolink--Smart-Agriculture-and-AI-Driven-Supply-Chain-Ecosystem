import React from 'react'
import { AlertTriangle, Info, AlertCircle, CheckCircle } from 'lucide-react'

interface AlertBadgeProps {
  severity: 'Critical' | 'Warning' | 'Info' | 'Resolved'
  showIcon?: boolean
}

const AlertBadge: React.FC<AlertBadgeProps> = ({ severity, showIcon = true }) => {
  const configs = {
    Critical: {
      bg: 'bg-red-100',
      text: 'text-red-800',
      border: 'border-red-200',
      Icon: AlertCircle,
    },
    Warning: {
      bg: 'bg-amber-100',
      text: 'text-amber-800',
      border: 'border-amber-200',
      Icon: AlertTriangle,
    },
    Info: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      border: 'border-blue-200',
      Icon: Info,
    },
    Resolved: {
      bg: 'bg-green-100',
      text: 'text-green-800',
      border: 'border-green-200',
      Icon: CheckCircle,
    },
  }

  const config = configs[severity]
  const Icon = config.Icon

  return (
    <span className={`inline-flex items-center gap-1 ${config.bg} ${config.text} border ${config.border} text-xs font-semibold px-2.5 py-0.5 rounded-full`}>
      {showIcon && <Icon className="w-3 h-3" />}
      {severity}
    </span>
  )
}

export default AlertBadge
