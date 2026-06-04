import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Leaf, Eye, EyeOff, ArrowRight, Shield } from 'lucide-react'

const Login: React.FC = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      navigate('/dashboard')
    }, 800)
  }

  return (
    <div className="min-h-screen flex bg-[#F5F0E8] relative overflow-hidden">
      {/* Background decorative elements */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 80%, #2D5A1B 0%, transparent 40%),
            radial-gradient(circle at 80% 20%, #8BC34A 0%, transparent 40%),
            radial-gradient(circle at 50% 50%, #4A8C2A 0%, transparent 60%)
          `,
        }}
      />

      {/* Leaf pattern background */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232D5A1B' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Left panel — hero */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 bg-gradient-to-br from-[#1A3A0F] via-[#2D5A1B] to-[#4A8C2A] overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-48 translate-x-24" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#8BC34A]/10 rounded-full translate-y-40 -translate-x-20" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-[#FF8F00]/5 rounded-full -translate-x-1/2 -translate-y-1/2" />

        {/* Top logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#8BC34A] rounded-2xl flex items-center justify-center shadow-xl">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-white font-extrabold text-2xl leading-none">BioLink</h1>
              <p className="text-[#8BC34A] text-xs font-medium tracking-wide">Smart Agriculture</p>
            </div>
          </div>
        </div>

        {/* Center content */}
        <div className="relative z-10">
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 bg-white/10 text-[#8BC34A] text-xs font-semibold px-3 py-1.5 rounded-full border border-white/20">
              <span className="w-1.5 h-1.5 bg-[#8BC34A] rounded-full animate-pulse" />
              AI-Driven Supply Chain
            </span>
          </div>
          <h2 className="text-white text-5xl font-extrabold leading-tight mb-4">
            From Farm<br />
            <span className="text-[#8BC34A]">to Table,</span><br />
            Tracked.
          </h2>
          <p className="text-white/70 text-lg leading-relaxed max-w-sm">
            Connecting Cameron Highlands farmers to Johor and Singapore hubs with AI-powered quality grading and real-time supply chain visibility.
          </p>

          {/* Feature highlights */}
          <div className="mt-8 grid grid-cols-2 gap-3">
            {[
              { icon: '🌿', label: 'AI Quality Grading' },
              { icon: '📦', label: 'Live Batch Tracking' },
              { icon: '🚛', label: 'Route Monitoring' },
              { icon: '📊', label: 'Supply Analytics' },
            ].map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2.5 border border-white/10">
                <span className="text-lg">{icon}</span>
                <span className="text-white/80 text-sm font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="relative z-10">
          <p className="text-white/50 text-sm italic">
            "From Farm to Table, Tracked Every Step"
          </p>
          <div className="flex items-center gap-6 mt-3">
            <div className="text-center">
              <p className="text-white font-bold text-xl">94%</p>
              <p className="text-white/50 text-xs">On-time Rate</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <p className="text-white font-bold text-xl">3.2%</p>
              <p className="text-white/50 text-xs">Rejection Rate</p>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div className="text-center">
              <p className="text-white font-bold text-xl">38%</p>
              <p className="text-white/50 text-xs">Less Paperwork</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-10 h-10 bg-[#2D5A1B] rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-[#2D5A1B] font-extrabold text-xl leading-none">BioLink</h1>
              <p className="text-[#4A8C2A] text-xs">Smart Agriculture &amp; Supply Chain</p>
            </div>
          </div>

          {/* Form card */}
          <div className="card p-8 shadow-xl">
            <div className="mb-7">
              <h3 className="text-2xl font-extrabold text-[#2C1A0E] mb-1">Welcome back</h3>
              <p className="text-gray-500 text-sm">Sign in to the admin dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-[#2C1A0E] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@biolink.my"
                  className="input-field"
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-[#2C1A0E] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field pr-11"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Role selector */}
              <div>
                <label className="block text-sm font-semibold text-[#2C1A0E] mb-1.5">
                  Login Role
                </label>
                <select className="input-field appearance-none cursor-pointer">
                  <option>HQ Admin</option>
                  <option>Warehouse Supervisor</option>
                </select>
              </div>

              {/* Forgot password */}
              <div className="flex justify-end">
                <button type="button" className="text-xs text-[#4A8C2A] hover:text-[#2D5A1B] font-medium transition-colors">
                  Forgot password?
                </button>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#2D5A1B] to-[#4A8C2A] hover:from-[#1A3A0F] hover:to-[#2D5A1B] text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Demo credentials hint */}
            <div className="mt-6 p-3 bg-[#F5F0E8] rounded-xl border border-[#D4C9B0]">
              <div className="flex items-start gap-2">
                <Shield className="w-4 h-4 text-[#4A8C2A] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-[#2C1A0E] mb-0.5">Demo Access</p>
                  <p className="text-xs text-gray-500">Use any credentials to access the dashboard. This is a demo environment.</p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-6">
            BioLink Smart Agriculture &amp; AI-Driven Supply Chain Ecosystem<br />
            &copy; 2025 BioLink Technologies. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
