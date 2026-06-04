import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import { Bell, Menu, Leaf, ChevronDown } from 'lucide-react'

const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard Overview',
  '/supply-chain': 'Supply Chain Monitor',
  '/inventory': 'Inventory Management',
  '/drivers': 'Drivers & Routes',
  '/alerts': 'Alerts & Notifications',
  '/reports': 'Reports & Analytics',
  '/settings': 'System Settings',
}

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const pageTitle = pageTitles[location.pathname] || 'BioLink Dashboard'

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F0E8]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Top Header Bar */}
        <header className="bg-white border-b border-[#D4C9B0] px-4 lg:px-6 py-3 flex items-center justify-between shrink-0 shadow-sm">
          {/* Left: hamburger + title */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-[#F5F0E8] text-[#2C1A0E] transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            {/* BioLink logo for header */}
            <div className="hidden lg:flex items-center gap-2 mr-4">
              <div className="w-7 h-7 bg-[#2D5A1B] rounded-lg flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-[#2D5A1B] text-sm">BioLink</span>
            </div>
            <div className="hidden sm:block w-px h-5 bg-[#D4C9B0]" />
            <div>
              <h2 className="font-semibold text-[#2C1A0E] text-sm sm:text-base">{pageTitle}</h2>
              <p className="text-xs text-gray-400 hidden sm:block">Smart Agriculture &amp; Supply Chain</p>
            </div>
          </div>

          {/* Right: notifications + user */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live indicator */}
            <div className="hidden sm:flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-3 py-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-green-700">Live</span>
            </div>

            {/* Notification bell */}
            <button className="relative p-2 rounded-xl hover:bg-[#F5F0E8] text-[#2C1A0E] transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center leading-none">
                3
              </span>
            </button>

            {/* User avatar */}
            <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-[#F5F0E8] transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2D5A1B] to-[#8BC34A] flex items-center justify-center text-white font-bold text-sm">
                A
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-[#2C1A0E] leading-none">Admin User</p>
                <p className="text-xs text-gray-400 mt-0.5">HQ Admin</p>
              </div>
              <ChevronDown className="w-3 h-3 text-gray-400 hidden sm:block" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
