import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Package, Sparkles, Loader2, Check, X } from 'lucide-react'
import { getProducts, createProduct } from '../services/api'
import { ProductInput } from '../types'

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function Products() {
  const [products, setProducts] = useState<ProductInput[]>([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    targetAudience: '',
    brandVoice: 'casual' as const,
  })

  useEffect(() => {
    fetchProducts()
    const interval = setInterval(fetchProducts, 3000)
    return () => clearInterval(interval)
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await getProducts()
      setProducts(res.data.data)
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await createProduct({
        name: formData.name,
        description: formData.description,
        category: formData.category || 'General',
        price: parseFloat(formData.price) || 0,
        targetAudience: formData.targetAudience || 'General consumers',
        brandVoice: formData.brandVoice,
      })

      setSuccess(true)
      setFormData({ name: '', description: '', category: '', price: '', targetAudience: '', brandVoice: 'casual' })
      fetchProducts()

      setTimeout(() => {
        setSuccess(false)
        setShowForm(false)
      }, 2000)
    } catch (error) {
      console.error('Failed to create product:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const brandVoices = [
    { value: 'professional', label: 'Professional', desc: 'Formal, authoritative tone' },
    { value: 'casual', label: 'Casual', desc: 'Friendly, conversational tone' },
    { value: 'playful', label: 'Playful', desc: 'Fun, energetic tone' },
    { value: 'luxury', label: 'Luxury', desc: 'Sophisticated, premium tone' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
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
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Products</h1>
          <p className="text-slate-400">Manage your products and trigger AI content generation</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Cancel' : 'Add Product'}
        </button>
      </motion.div>

      {/* Add Product Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-panel p-8 glow-primary">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary-400" />
                New Product
              </h2>

              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center justify-center py-12 gap-3 text-emerald-400"
                >
                  <Check className="w-6 h-6" />
                  <span className="text-lg font-semibold">Product created! AI generation started...</span>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Product Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="input-field"
                        placeholder="e.g., Organic Green Tea"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
                      <input
                        type="text"
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                        className="input-field"
                        placeholder="e.g., Beverages"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Description *</label>
                    <textarea
                      required
                      rows={3}
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      className="input-field resize-none"
                      placeholder="Describe your product, its benefits, and key features..."
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Price ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                        className="input-field"
                        placeholder="29.99"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Target Audience</label>
                      <input
                        type="text"
                        value={formData.targetAudience}
                        onChange={e => setFormData({ ...formData, targetAudience: e.target.value })}
                        className="input-field"
                        placeholder="e.g., Health-conscious millennials"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-3">Brand Voice</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {brandVoices.map((voice) => (
                        <button
                          key={voice.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, brandVoice: voice.value as any })}
                          className={`p-4 rounded-xl border transition-all duration-200 text-left
                            ${formData.brandVoice === voice.value 
                              ? 'border-primary-500/50 bg-primary-500/10' 
                              : 'border-slate-700 bg-slate-900/50 hover:border-slate-600'
                            }`}
                        >
                          <div className="font-medium text-white text-sm">{voice.label}</div>
                          <div className="text-xs text-slate-500 mt-1">{voice.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary flex items-center gap-2 min-w-[180px] justify-center"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          Generate Content
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Products Grid */}
      <motion.div variants={itemVariants}>
        <h3 className="text-lg font-semibold text-white mb-4">
          Your Products ({products.length})
        </h3>

        {products.length === 0 ? (
          <div className="glass-panel p-12 text-center">
            <Package className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-300 mb-2">No products yet</h3>
            <p className="text-slate-500">Add your first product to start generating AI marketing content</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-panel p-6 hover:border-primary-500/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-accent-500/20 flex items-center justify-center">
                    <Package className="w-6 h-6 text-primary-400" />
                  </div>
                  <span className="badge-primary">{product.brandVoice}</span>
                </div>

                <h4 className="font-semibold text-white mb-1">{product.name}</h4>
                <p className="text-sm text-slate-400 mb-3 line-clamp-2">{product.description}</p>

                <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                  <span>{product.category}</span>
                  {product.price > 0 && <span className="text-emerald-400 font-medium">${product.price}</span>}
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Sparkles className="w-3 h-3 text-accent-400" />
                  <span>Target: {product.targetAudience}</span>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-800/50 text-xs text-slate-500">
                  Added {new Date(product.createdAt).toLocaleDateString()}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
