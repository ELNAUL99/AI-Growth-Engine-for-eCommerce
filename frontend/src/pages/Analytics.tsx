import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, 
  Trophy, 
  GitCompare,
  TrendingUp,
  Target,
  Users,
  MousePointer,
  Eye
} from 'lucide-react'
import { getMetrics, getABTests, getPerformance } from '../services/api'
import { DashboardMetrics, ABBTestResult, PerformanceData } from '../types'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

const COLORS = ['#0ea5e9', '#d946ef', '#10b981', '#f59e0b', '#8b5cf6', '#f43f5e']

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function Analytics() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [abTests, setAbTests] = useState<ABBTestResult[]>([])
  const [performance, setPerformance] = useState<PerformanceData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [metricsRes, abRes, perfRes] = await Promise.all([
          getMetrics(),
          getABTests(),
          getPerformance()
        ])
        setMetrics(metricsRes.data.data)
        setAbTests(abRes.data.data)
        setPerformance(perfRes.data.data)
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [])

  const contentTypeData = metrics?.contentByType 
    ? Object.entries(metrics.contentByType).map(([name, value]) => ({
        name: name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        value
      }))
    : []

  const radarData = metrics?.topPerformingContent?.slice(0, 5).map(c => ({
    name: c.type.replace('_', ' '),
    ctr: c.performance.ctr,
    engagement: c.performance.engagement,
    conversion: c.performance.conversion,
  })) || []

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
        <p className="text-slate-400">Deep insights into AI-generated content performance</p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Impressions', value: metrics?.topPerformingContent?.reduce((sum, c) => sum + c.performance.impressions, 0).toLocaleString() || '0', icon: Eye, color: 'primary' },
          { label: 'Total Clicks', value: metrics?.topPerformingContent?.reduce((sum, c) => sum + c.performance.clicks, 0).toLocaleString() || '0', icon: MousePointer, color: 'accent' },
          { label: 'Avg Conversion', value: `${metrics?.avgEngagement || 0}%`, icon: Target, color: 'emerald' },
          { label: 'Active Workflows', value: metrics?.recentWorkflows?.filter(w => w.status === 'running').length || 0, icon: Users, color: 'amber' },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="stat-card">
              <Icon className={`w-5 h-5 text-${stat.color}-400 mb-3`} />
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-xs text-slate-400">{stat.label}</div>
            </div>
          )
        })}
      </motion.div>

      {/* Charts Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Content Distribution */}
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Content Distribution</h3>
              <p className="text-sm text-slate-400">Generated content by type</p>
            </div>
            <BarChart3 className="w-5 h-5 text-primary-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={contentTypeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#475569" fontSize={11} angle={-20} textAnchor="end" height={60} />
                <YAxis stroke="#475569" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Content Type Pie */}
        <div className="glass-panel p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Content Mix</h3>
              <p className="text-sm text-slate-400">Breakdown by content type</p>
            </div>
            <Target className="w-5 h-5 text-accent-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={contentTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {contentTypeData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {contentTypeData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-xs text-slate-400">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Performance Radar */}
      {radarData.length > 0 && (
        <motion.div variants={itemVariants} className="glass-panel p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Performance Radar</h3>
              <p className="text-sm text-slate-400">CTR vs Engagement vs Conversion across content types</p>
            </div>
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <PolarRadiusAxis stroke="#475569" fontSize={10} />
                <Radar name="CTR" dataKey="ctr" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.2} />
                <Radar name="Engagement" dataKey="engagement" stroke="#d946ef" fill="#d946ef" fillOpacity={0.2} />
                <Radar name="Conversion" dataKey="conversion" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      )}

      {/* A/B Test Results */}
      <motion.div variants={itemVariants}>
        <div className="flex items-center gap-2 mb-4">
          <GitCompare className="w-5 h-5 text-accent-400" />
          <h3 className="text-lg font-semibold text-white">A/B Test Results</h3>
        </div>

        {abTests.length === 0 ? (
          <div className="glass-panel p-8 text-center text-slate-500">
            No A/B tests completed yet. Add products to generate test data.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {abTests.map((test, index) => (
              <motion.div
                key={test.contentId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-panel p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Trophy className={`w-5 h-5 ${test.winner === 'A' ? 'text-primary-400' : test.winner === 'B' ? 'text-accent-400' : 'text-slate-500'}`} />
                    <span className="font-semibold text-white">
                      {test.variationA.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                  <span className={`badge-${test.winner === 'A' ? 'primary' : test.winner === 'B' ? 'accent' : 'warning'}`}>
                    Winner: {test.winner}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  {/* Variation A */}
                  <div className={`p-4 rounded-xl border ${
                    test.winner === 'A' ? 'border-primary-500/30 bg-primary-500/5' : 'border-slate-800 bg-slate-900/30'
                  }`}>
                    <div className="text-xs text-slate-500 mb-2">Variation A</div>
                    <div className="text-lg font-bold text-white mb-1">
                      {(test.variationA.performance.ctr * test.variationA.performance.engagement).toFixed(1)}
                    </div>
                    <div className="text-xs text-slate-400">
                      CTR: {test.variationA.performance.ctr}% | Eng: {test.variationA.performance.engagement}%
                    </div>
                  </div>

                  {/* Variation B */}
                  <div className={`p-4 rounded-xl border ${
                    test.winner === 'B' ? 'border-accent-500/30 bg-accent-500/5' : 'border-slate-800 bg-slate-900/30'
                  }`}>
                    <div className="text-xs text-slate-500 mb-2">Variation B</div>
                    <div className="text-lg font-bold text-white mb-1">
                      {(test.variationB.performance.ctr * test.variationB.performance.engagement).toFixed(1)}
                    </div>
                    <div className="text-xs text-slate-400">
                      CTR: {test.variationB.performance.ctr}% | Eng: {test.variationB.performance.engagement}%
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Confidence:</span>
                    <span className="font-medium text-white">{test.confidence}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Improvement:</span>
                    <span className={`font-medium ${test.improvement > 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {test.improvement > 0 ? '+' : ''}{test.improvement}%
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
