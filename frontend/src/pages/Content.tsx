import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, 
  Copy, 
  Check, 
  Eye, 
  MousePointer, 
  TrendingUp,
  Send,
  Archive,
  Filter,
  Search,
  ChevronDown,
  X
} from 'lucide-react'
import { getContent, publishContent, archiveContent } from '../services/api'
import { GeneratedContent } from '../types'

const contentTypeLabels: Record<string, { label: string; color: string; icon: string }> = {
  ad_script: { label: 'Ad Script', color: 'primary', icon: '🎬' },
  product_description: { label: 'Product Description', color: 'accent', icon: '📝' },
  seo_blog: { label: 'SEO Blog', color: 'emerald', icon: '📰' },
  ad_headlines: { label: 'Ad Headlines', color: 'amber', icon: '🎯' },
  social_post: { label: 'Social Post', color: 'purple', icon: '📱' },
  email_sequence: { label: 'Email Sequence', color: 'rose', icon: '📧' },
}

const statusColors = {
  generated: 'badge-primary',
  published: 'badge-success',
  archived: 'badge-warning',
}

export default function Content() {
  const [content, setContent] = useState<GeneratedContent[]>([])
  const [filteredContent, setFilteredContent] = useState<GeneratedContent[]>([])
  const [selectedContent, setSelectedContent] = useState<GeneratedContent | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContent()
    const interval = setInterval(fetchContent, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let filtered = content

    if (filterType !== 'all') {
      filtered = filtered.filter(c => c.type === filterType)
    }
    if (filterStatus !== 'all') {
      filtered = filtered.filter(c => c.status === filterStatus)
    }
    if (searchQuery) {
      filtered = filtered.filter(c => 
        c.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.metadata.keywords.some(k => k.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    setFilteredContent(filtered)
  }, [content, filterType, filterStatus, searchQuery])

  const fetchContent = async () => {
    try {
      const res = await getContent()
      setContent(res.data.data)
    } catch (error) {
      console.error('Failed to fetch content:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handlePublish = async (id: string) => {
    try {
      await publishContent(id)
      fetchContent()
    } catch (error) {
      console.error('Failed to publish:', error)
    }
  }

  const handleArchive = async (id: string) => {
    try {
      await archiveContent(id)
      fetchContent()
    } catch (error) {
      console.error('Failed to archive:', error)
    }
  }

  const contentTypes = ['all', ...Object.keys(contentTypeLabels)]
  const statusTypes = ['all', 'generated', 'published', 'archived']

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Generated Content</h1>
          <p className="text-slate-400">AI-generated marketing content across all channels</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-400">{filteredContent.length} items</span>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-panel p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search content or keywords..."
              className="input-field pl-10"
            />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="select-field pl-10 pr-10 min-w-[180px]"
            >
              <option value="all">All Types</option>
              {Object.entries(contentTypeLabels).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="select-field pl-10 pr-10 min-w-[160px]"
            >
              <option value="all">All Status</option>
              <option value="generated">Generated</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      {filteredContent.length === 0 ? (
        <div className="glass-panel p-12 text-center">
          <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-300 mb-2">No content yet</h3>
          <p className="text-slate-500">Add a product to generate AI marketing content</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredContent.map((item) => {
            const typeInfo = contentTypeLabels[item.type] || { label: item.type, color: 'primary', icon: '📄' }
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel p-5 hover:border-slate-600 transition-all duration-300 flex flex-col"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{typeInfo.icon}</span>
                    <span className={`badge-${typeInfo.color}`}>{typeInfo.label}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`badge-${statusColors[item.status]}`}>{item.status}</span>
                    <span className="text-xs text-slate-500 ml-1">Var {item.variation}</span>
                  </div>
                </div>

                {/* Content Preview */}
                <div 
                  className="flex-1 text-sm text-slate-300 line-clamp-4 mb-4 cursor-pointer hover:text-slate-200 transition-colors"
                  onClick={() => setSelectedContent(item)}
                >
                  {item.content}
                </div>

                {/* Metadata */}
                <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                  <span>{item.metadata.wordCount} words</span>
                  <span>•</span>
                  <span>{item.metadata.estimatedReadTime} min read</span>
                  <span>•</span>
                  <span className="text-primary-400">{item.metadata.tone}</span>
                </div>

                {/* Keywords */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {item.metadata.keywords.slice(0, 4).map((kw, i) => (
                    <span key={i} className="px-2 py-0.5 text-xs rounded-md bg-slate-800 text-slate-400">
                      {kw}
                    </span>
                  ))}
                </div>

                {/* Performance */}
                <div className="grid grid-cols-3 gap-2 mb-4 p-3 rounded-xl bg-slate-900/50">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-emerald-400 text-xs mb-1">
                      <MousePointer className="w-3 h-3" />
                      CTR
                    </div>
                    <div className="text-sm font-semibold text-white">{item.performance.ctr}%</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-primary-400 text-xs mb-1">
                      <Eye className="w-3 h-3" />
                      Eng
                    </div>
                    <div className="text-sm font-semibold text-white">{item.performance.engagement}%</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-accent-400 text-xs mb-1">
                      <TrendingUp className="w-3 h-3" />
                      Conv
                    </div>
                    <div className="text-sm font-semibold text-white">{item.performance.conversion}%</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(item.content, item.id)}
                    className="flex-1 btn-secondary flex items-center justify-center gap-2 text-sm py-2"
                  >
                    {copiedId === item.id ? (
                      <><Check className="w-4 h-4 text-emerald-400" /> Copied</>
                    ) : (
                      <><Copy className="w-4 h-4" /> Copy</>
                    )}
                  </button>

                  {item.status === 'generated' && (
                    <button
                      onClick={() => handlePublish(item.id)}
                      className="flex-1 btn-primary flex items-center justify-center gap-2 text-sm py-2"
                    >
                      <Send className="w-4 h-4" /> Publish
                    </button>
                  )}

                  {item.status === 'published' && (
                    <button
                      onClick={() => handleArchive(item.id)}
                      className="flex-1 btn-secondary flex items-center justify-center gap-2 text-sm py-2"
                    >
                      <Archive className="w-4 h-4" /> Archive
                    </button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Content Detail Modal */}
      <AnimatePresence>
        {selectedContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedContent(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="glass-panel w-full max-w-2xl max-h-[80vh] overflow-auto glow-primary"
            >
              <div className="sticky top-0 bg-slate-900/95 backdrop-blur-xl p-6 border-b border-slate-800/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {contentTypeLabels[selectedContent.type]?.icon || '📄'}
                  </span>
                  <div>
                    <h3 className="font-semibold text-white">
                      {contentTypeLabels[selectedContent.type]?.label || selectedContent.type}
                    </h3>
                    <span className="text-xs text-slate-400">Variation {selectedContent.variation}</span>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedContent(null)}
                  className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="prose prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-slate-300 font-mono leading-relaxed bg-slate-900/50 p-4 rounded-xl">
                    {selectedContent.content}
                  </pre>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900/50">
                    <div className="text-xs text-slate-500 mb-2">Keywords</div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedContent.metadata.keywords.map((kw, i) => (
                        <span key={i} className="badge-primary">{kw}</span>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-900/50">
                    <div className="text-xs text-slate-500 mb-2">Performance</div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">CTR</span>
                        <span className="text-emerald-400 font-medium">{selectedContent.performance.ctr}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Engagement</span>
                        <span className="text-primary-400 font-medium">{selectedContent.performance.engagement}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Conversion</span>
                        <span className="text-accent-400 font-medium">{selectedContent.performance.conversion}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Impressions</span>
                        <span className="text-white font-medium">{selectedContent.performance.impressions.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
