import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProduct, updateProduct } from '../../services/api'
import { toast } from 'react-toastify'

function ProductEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', sku: '', price: '', quantity: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      const res = await getProduct(id)
      const p = res.data
      setForm({ name: p.name, sku: p.sku, price: String(p.price), quantity: String(p.quantity) })
    } catch (err) {
      toast.error('Product not found')
      navigate('/products')
    } finally {
      setLoading(false)
    }
  }

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.sku.trim()) errs.sku = 'SKU is required'
    if (!form.price || parseFloat(form.price) < 0) errs.price = 'Valid price is required'
    if (form.quantity === '' || parseInt(form.quantity) < 0) errs.quantity = 'Valid quantity is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    try {
      await updateProduct(id, {
        name: form.name.trim(),
        sku: form.sku.trim(),
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity),
      })
      toast.success('Product updated successfully')
      navigate('/products')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to update product')
    }
  }

  if (loading) return <div className="loading">Loading...</div>

  return (
    <div className="form-container">
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          {errors.name && <div className="error">{errors.name}</div>}
        </div>
        <div className="form-group">
          <label>SKU / Code</label>
          <input
            type="text"
            value={form.sku}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
          />
          {errors.sku && <div className="error">{errors.sku}</div>}
        </div>
        <div className="form-group">
          <label>Price ($)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          {errors.price && <div className="error">{errors.price}</div>}
        </div>
        <div className="form-group">
          <label>Quantity in Stock</label>
          <input
            type="number"
            min="0"
            value={form.quantity}
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          />
          {errors.quantity && <div className="error">{errors.quantity}</div>}
        </div>
        <button type="submit" className="btn btn-primary" style={{ marginRight: '1rem' }}>Update Product</button>
        <button type="button" className="btn btn-secondary" onClick={() => navigate('/products')}>Cancel</button>
      </form>
    </div>
  )
}

export default ProductEdit
