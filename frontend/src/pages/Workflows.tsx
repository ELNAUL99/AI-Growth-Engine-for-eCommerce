import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Workflow, 
  CheckCircle2, 
  Circle, 
  Loader2, 
  XCircle,
  Clock,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react'
import { getWorkflows } from '../services/api'
import { WorkflowRun, WorkflowStep } from '../types'

const stepIcons: Record<string, string> = {
  'Validate Product Input': '✅',
  'Generate Ad Script': '🎬',
  'Generate Product Description': '📝',
  'Generate SEO Blog Post': '📰',
  'Generate Ad Headlines': '🎯',
  'Generate Social Media Posts': '📱',
  'Generate Email Sequence': '📧',
  'Store Content in Database': '💾',
  'Run A/B Test Simulation': '🧪',
}

const statusConfig = {
  pending: { color: 'text-slate-500', bg: 'bg-slate-800', icon: Circle },
  running: { color: 'text-primary-400', bg: 'bg-primary-500/10', icon: Loader2 },
  completed: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: CheckCircle2 },
  failed: { color: 'text-rose-400', bg: 'bg-rose-500/10', icon: XCircle },
}

export default function Workflows() {
  const [workflows, setWorkflows] = useState<WorkflowRun[]>([])
  const [expandedWorkflow, setExpandedWorkflow] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWorkflows()
    const interval = setInterval(fetchWorkflows, 2000)
    return () => clearInterval(interval)
  }, [])

  const fetchWorkflows = async () => {
    try {
      const res = await getWorkflows()
      setWorkflows(res.data.data)
    } catch (error) {
      console.error('Failed to fetch workflows:', error)
    } finally {
      setLoading(false)
    }
  }

  const getProgress = (workflow: WorkflowRun) => {
    const completed = workflow.steps.filter(s => s.status === 'completed').length
    return (completed / workflow.steps.length) * 100
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Workflows</h1>
        <p className="text-slate-400">AI content generation pipeline execution logs</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: workflows.length, color: 'primary' },
          { label: 'Running', value: workflows.filter(w => w.status === 'running').length, color: 'amber' },
          { label: 'Completed', value: workflows.filter(w => w.status === 'completed').length, color: 'emerald' },
          { label: 'Failed', value: workflows.filter(w => w.status === 'failed').length, color: 'rose' },
        ].map((stat) => (
          <div key={stat.label} className="stat-card">
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-slate-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Workflows List */}
      {workflows.length === 0 ? (
        <div className="glass-panel p-12 text-center">
          <Workflow className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-300 mb-2">No workflows yet</h3>
          <p className="text-slate-500">Add a product to trigger the AI content generation pipeline</p>
        </div>
      ) : (
        <div className="space-y-4">
          {workflows.map((workflow) => {
            const isExpanded = expandedWorkflow === workflow.id
            const progress = getProgress(workflow)

            return (
              <motion.div
                key={workflow.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel overflow-hidden"
              >
                {/* Workflow Header */}
                <div 
                  className="p-6 cursor-pointer hover:bg-slate-800/30 transition-colors"
                  onClick={() => setExpandedWorkflow(isExpanded ? null : workflow.id)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        workflow.status === 'completed' ? 'bg-emerald-500/10' :
                        workflow.status === 'running' ? 'bg-primary-500/10' :
                        'bg-rose-500/10'
                      }`}>
                        {workflow.status === 'running' ? (
                          <Loader2 className="w-5 h-5 text-primary-400 animate-spin" />
                        ) : workflow.status === 'completed' ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-rose-400" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm text-slate-300">{workflow.id.slice(0, 12)}...</span>
                          <span className={`badge-${
                            workflow.status === 'completed' ? 'success' :
                            workflow.status === 'running' ? 'primary' : 'warning'
                          }`}>
                            {workflow.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(workflow.startedAt).toLocaleString()}
                          </span>
                          {workflow.completedAt && (
                            <span>
                              → {new Date(workflow.completedAt).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right hidden sm:block">
                        <div className="text-sm font-medium text-white">{Math.round(progress)}%</div>
                        <div className="text-xs text-slate-500">
                          {workflow.steps.filter(s => s.status === 'completed').length}/{workflow.steps.length} steps
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${
                        workflow.status === 'completed' ? 'bg-emerald-500' :
                        workflow.status === 'running' ? 'bg-primary-500' :
                        'bg-rose-500'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {/* Expanded Steps */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6">
                        <div className="border-t border-slate-800/50 pt-4">
                          <h4 className="text-sm font-medium text-slate-300 mb-4">Pipeline Steps</h4>
                          <div className="space-y-3">
                            {workflow.steps.map((step, index) => {
                              const config = statusConfig[step.status]
                              const Icon = config.icon
                              const isLast = index === workflow.steps.length - 1

                              return (
                                <div key={step.id} className="flex items-start gap-4">
                                  {/* Connector Line */}
                                  <div className="flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.bg}`}>
                                      <Icon className={`w-4 h-4 ${config.color} ${step.status === 'running' ? 'animate-spin' : ''}`} />
                                    </div>
                                    {!isLast && (
                                      <div className={`w-0.5 h-8 ${
                                        step.status === 'completed' ? 'bg-emerald-500/30' : 'bg-slate-800'
                                      }`} />
                                    )}
                                  </div>

                                  {/* Step Content */}
                                  <div className="flex-1 pt-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-lg">{stepIcons[step.name] || '⚙️'}</span>
                                      <span className={`text-sm font-medium ${
                                        step.status === 'completed' ? 'text-emerald-300' :
                                        step.status === 'running' ? 'text-primary-300' :
                                        step.status === 'failed' ? 'text-rose-300' :
                                        'text-slate-500'
                                      }`}>
                                        {step.name}
                                      </span>
                                    </div>

                                    {step.output && (
                                      <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                                        <ArrowRight className="w-3 h-3" />
                                        {step.output}
                                      </p>
                                    )}

                                    {step.error && (
                                      <p className="text-xs text-rose-400 mt-1">{step.error}</p>
                                    )}

                                    {step.duration > 0 && (
                                      <p className="text-xs text-slate-600 mt-1">
                                        Duration: {(step.duration / 1000).toFixed(1)}s
                                      </p>
                                    )}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
