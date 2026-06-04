import React from 'react'
import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  color: 'green' | 'amber' | 'blue' | 'red' | 'purple'
  trend?: { value: number; label: string }
}

const colorMap = {
  green: {
    iconBg: 'bg-green-100',
    iconColor: 'text-green-700',
    valueBg: 'from-green-600 to-[#4A8C2A]',
    trendColor: 'text-green-600',
    borderAccent: 'border-l-green-500',
  },
  amber: {
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-700',
    valueBg: 'from-amber-600 to-amber-500',
    trendColor: 'text-amber-600',
    borderAccent: 'border-l-amber-500',
  },
  blue: {
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-700',
    valueBg: 'from-blue-600 to-blue-500',
    trendColor: 'text-blue-600',
    borderAccent: 'border-l-blue-500',
  },
  red: {
    iconBg: 'bg-red-100',
    iconColor: 'text-red-700',
    valueBg: 'from-red-600 to-red-500',
    trendColor: 'text-red-600',
    borderAccent: 'border-l-red-500',
  },
  purple: {
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-700',
    valueBg: 'from-purple-600 to-purple-500',
    trendColor: 'text-purple-600',
    borderAccent: 'border-l-purple-500',
  },
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon: Icon, color, trend }) => {
  const colors = colorMap[color]

  return (
    <div className={`card p-5 border-l-4 ${colors.borderAccent} hover:shadow-md transition-shadow duration-200`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <p className={`text-3xl font-extrabold bg-gradient-to-r ${colors.valueBg} bg-clip-text text-transparent`}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${colors.trendColor}`}>
              <span>{trend.value > 0 ? '↑' : '↓'} {Math.abs(trend.value)}%</span>
              <span className="text-gray-400">{trend.label}</span>
            </div>
          )}
        </div>
        <div className={`${colors.iconBg} ${colors.iconColor} p-3 rounded-xl`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
}

export default StatCard
