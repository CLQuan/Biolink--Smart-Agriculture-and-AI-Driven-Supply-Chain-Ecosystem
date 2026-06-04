import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Network,
  Package,
  Truck,
  Bell,
  BarChart3,
  Settings,
  LogOut,
  Leaf,
  ChevronRight,
} from 'lucide-react'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/supply-chain', label: 'Supply Chain', icon: Network },
  { path: '/inventory', label: 'Inventory', icon: Package },
  { path: '/drivers', label: 'Drivers & Routes', icon: Truck },
  { path: '/alerts', label: 'Alerts', icon: Bell, badge: 3 },
  { path: '/reports', label: 'Reports', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings },
]

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate('/login')
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 z-30 flex flex-col
          bg-gradient-to-b from-[#1A3A0F] via-[#2D5A1B] to-[#1A3A0F]
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="px-5 py-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#8BC34A] rounded-xl flex items-center justify-center shadow-lg">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg leading-none">BioLink</h1>
              <p className="text-[#8BC34A] text-xs mt-0.5 leading-tight">Smart Agriculture</p>
            </div>
          </div>
        </div>

        {/* Role indicator */}
        <div className="px-5 py-3 border-b border-white/10">
          <div className="bg-white/10 rounded-lg px-3 py-2 flex items-center justify-between">
            <div>
              <p className="text-white/60 text-xs">Logged in as</p>
              <p className="text-white text-sm font-semibold">HQ Admin</p>
            </div>
            <div className="w-2 h-2 bg-[#8BC34A] rounded-full animate-pulse" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <p className="text-white/30 text-xs font-semibold uppercase tracking-widest mb-3 px-3">
            Main Menu
          </p>
          <ul className="space-y-0.5">
            {navItems.map(({ path, label, icon: Icon, badge }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  onClick={() => onClose()}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative
                    ${isActive
                      ? 'bg-[#8BC34A]/20 text-white border border-[#8BC34A]/30'
                      : 'text-white/60 hover:text-white hover:bg-white/10'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-[#8BC34A]/30' : 'group-hover:bg-white/10'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium flex-1">{label}</span>
                      {badge && (
                        <span className="bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                          {badge}
                        </span>
                      )}
                      {isActive && (
                        <ChevronRight className="w-3 h-3 text-[#8BC34A]" />
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User profile */}
        <div className="px-3 py-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#8BC34A] flex items-center justify-center text-white font-bold text-sm">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">Admin User</p>
              <p className="text-white/40 text-xs truncate">admin@biolink.my</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-red-500/20 transition-all duration-200 group"
          >
            <div className="p-1.5 rounded-lg group-hover:bg-red-500/20">
              <LogOut className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
