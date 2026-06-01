import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createProduct } from '../../services/api'
import { toast } from 'react-toastify'

function ProductForm() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', sku: '', price: '', quantity: '' })
  const [errors, setErrors] = useState({})

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
      await createProduct({
        name: form.name.trim(),
        sku: form.sku.trim(),
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity),
      })
      toast.success('Product created successfully')
      navigate('/products')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to create product')
    }
  }

  return (
    <div className="form-container">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Product Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Enter product name"
          />
          {errors.name && <div className="error">{errors.name}</div>}
        </div>
        <div className="form-group">
          <label>SKU / Code</label>
          <input
            type="text"
            value={form.sku}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
            placeholder="Enter unique SKU"
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
            placeholder="0.00"
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
            placeholder="0"
          />
          {errors.quantity && <div className="error">{errors.quantity}</div>}
        </div>
        <button type="submit" className="btn btn-primary">Create Product</button>
      </form>
    </div>
  )
}

export default ProductForm
