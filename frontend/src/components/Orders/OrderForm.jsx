import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProducts, getCustomers, createOrder } from '../../services/api'
import { toast } from 'react-toastify'

function OrderForm() {
  const navigate = useNavigate()
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])
  const [customerId, setCustomerId] = useState('')
  const [items, setItems] = useState([{ product_id: '', quantity: '' }])
  const [errors, setErrors] = useState({})

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [custRes, prodRes] = await Promise.all([getCustomers(), getProducts()])
      setCustomers(custRes.data)
      setProducts(prodRes.data)
    } catch (err) {
      toast.error('Failed to load data')
    }
  }

  const addItem = () => {
    setItems([...items, { product_id: '', quantity: '' }])
  }

  const removeItem = (index) => {
    if (items.length === 1) return
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index, field, value) => {
    const updated = [...items]
    updated[index][field] = value
    setItems(updated)
  }

  const validate = () => {
    const errs = {}
    if (!customerId) errs.customer = 'Select a customer'
    items.forEach((item, i) => {
      if (!item.product_id) errs[`item_${i}_product`] = 'Select a product'
      if (!item.quantity || parseInt(item.quantity) <= 0) errs[`item_${i}_quantity`] = 'Quantity must be > 0'
    })
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    try {
      await createOrder({
        customer_id: parseInt(customerId),
        items: items.map((item) => ({
          product_id: parseInt(item.product_id),
          quantity: parseInt(item.quantity),
        })),
      })
      toast.success('Order created successfully')
      navigate('/orders')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to create order')
    }
  }

  return (
    <div className="form-container" style={{ maxWidth: '700px' }}>
      <h2>Create New Order</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Customer</label>
          <select value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
            <option value="">Select a customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>{c.name} ({c.email})</option>
            ))}
          </select>
          {errors.customer && <div className="error">{errors.customer}</div>}
        </div>

        <div className="order-items">
          <h3 style={{ marginBottom: '1rem' }}>Order Items</h3>
          {items.map((item, index) => (
            <div key={index} className="order-item-row">
              <div className="form-group">
                <label>Product</label>
                <select
                  value={item.product_id}
                  onChange={(e) => updateItem(index, 'product_id', e.target.value)}
                >
                  <option value="">Select product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Stock: {p.quantity}, ${p.price})
                    </option>
                  ))}
                </select>
                {errors[`item_${index}_product`] && <div className="error">{errors[`item_${index}_product`]}</div>}
              </div>
              <div className="form-group" style={{ maxWidth: '120px' }}>
                <label>Qty</label>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                  placeholder="0"
                />
                {errors[`item_${index}_quantity`] && <div className="error">{errors[`item_${index}_quantity`]}</div>}
              </div>
              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => removeItem(index)}
                style={{ alignSelf: 'center', marginTop: '1.2rem' }}
              >
                ✕
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-secondary btn-sm" onClick={addItem}>
            + Add Item
          </button>
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <button type="submit" className="btn btn-primary">Place Order</button>
        </div>
      </form>
    </div>
  )
}

export default OrderForm
