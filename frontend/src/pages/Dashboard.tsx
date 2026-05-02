import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  Eye, 
  MousePointer, 
  Package, 
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react'
import { getMetrics, getPerformance } from '../services/api'
import { DashboardMetrics, PerformanceData } from '../types'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [performance, setPerformance] = useState<PerformanceData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricsRes, perfRes] = await Promise.all([
          getMetrics(),
          getPerformance()
        ])
        setMetrics(metricsRes.data.data)
        setPerformance(perfRes.data.data)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()

    // Refresh every 5 seconds
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    )
  }

  const stats = [
    { 
      label: 'Total Products', 
      value: metrics?.totalProducts || 0, 
      icon: Package, 
      change: '+12%',
      trend: 'up' as const,
      color: 'primary'
    },
    { 
      label: 'Content Pieces', 
      value: metrics?.totalContentPieces || 0, 
      icon: FileText, 
      change: '+28%',
      trend: 'up' as const,
      color: 'accent'
    },
    { 
      label: 'Avg CTR', 
      value: `${metrics?.avgCTR || 0}%`, 
      icon: MousePointer, 
      change: '+5.2%',
      trend: 'up' as const,
      color: 'emerald'
    },
    { 
      label: 'Avg Engagement', 
      value: `${metrics?.avgEngagement || 0}%`, 
      icon: Eye, 
      change: '-2.1%',
      trend: 'down' as const,
      color: 'amber'
    },
  ]

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400">AI-powered marketing pipeline overview</p>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="stat-card glow-primary">
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl bg-${stat.color}-500/10`}>
                  <Icon className={`w-5 h-5 text-${stat.color}-400`} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === 'up' ? 'text-emerald-400' : 'text-rose-400'
                }`}>
                  {stat.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {stat.change}
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </div>
          )
        })}
      </motion.div>

      {/* Charts Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Chart */}
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Performance Trends</h3>
              <p className="text-sm text-slate-400">CTR & Engagement over time</p>
            </div>
            <Activity className="w-5 h-5 text-primary-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performance}>
                <defs>
                  <linearGradient id="ctrGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#475569" fontSize={12} tickFormatter={(val) => val.slice(5)} />
                <YAxis stroke="#475569" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Area type="monotone" dataKey="ctr" stroke="#0ea5e9" fill="url(#ctrGradient)" strokeWidth={2} name="CTR %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Impressions Chart */}
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Traffic Overview</h3>
              <p className="text-sm text-slate-400">Impressions & Clicks</p>
            </div>
            <TrendingUp className="w-5 h-5 text-accent-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#475569" fontSize={12} tickFormatter={(val) => val.slice(5)} />
                <YAxis stroke="#475569" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Line type="monotone" dataKey="impressions" stroke="#d946ef" strokeWidth={2} dot={false} name="Impressions" />
                <Line type="monotone" dataKey="clicks" stroke="#0ea5e9" strokeWidth={2} dot={false} name="Clicks" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>

      {/* Top Performing Content */}
      <motion.div variants={itemVariants}>
        <h3 className="text-lg font-semibold text-white mb-4">Top Performing Content</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics?.topPerformingContent?.map((content, index) => (
            <motion.div
              key={content.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="content-card"
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`badge-${content.type === 'ad_script' ? 'primary' : content.type === 'seo_blog' ? 'accent' : 'success'}`}>
                  {content.type.replace('_', ' ')}
                </span>
                <span className="text-xs text-slate-500">Var {content.variation}</span>
              </div>
              <p className="text-sm text-slate-300 line-clamp-3 mb-4">{content.content.substring(0, 120)}...</p>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1 text-emerald-400">
                  <TrendingUp className="w-3 h-3" />
                  {content.performance.ctr}% CTR
                </div>
                <div className="flex items-center gap-1 text-primary-400">
                  <Eye className="w-3 h-3" />
                  {content.performance.engagement}% Eng
                </div>
              </div>
            </motion.div>
          )) || (
            <div className="col-span-full text-center py-12 text-slate-500">
              No content generated yet. Add a product to get started!
            </div>
          )}
        </div>
      </motion.div>

      {/* Recent Workflows */}
      <motion.div variants={itemVariants}>
        <h3 className="text-lg font-semibold text-white mb-4">Recent Workflows</h3>
        <div className="glass-panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-800/50">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Workflow ID</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Steps</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-slate-400 uppercase">Started</th>
                </tr>
              </thead>
              <tbody>
                {metrics?.recentWorkflows?.map((workflow) => (
                  <tr key={workflow.id} className="border-b border-slate-800/30 hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-slate-300">{workflow.id.slice(0, 8)}...</td>
                    <td className="px-6 py-4">
                      <span className={`badge-${
                        workflow.status === 'completed' ? 'success' : 
                        workflow.status === 'running' ? 'primary' : 'warning'
                      }`}>
                        {workflow.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-300">
                      {workflow.steps.filter(s => s.status === 'completed').length}/{workflow.steps.length} completed
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {new Date(workflow.startedAt).toLocaleString()}
                    </td>
                  </tr>
                )) || (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                      No workflows yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
