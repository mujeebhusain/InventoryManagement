import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getOrder } from '../../services/api'
import { toast } from 'react-toastify'

function OrderDetails() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrder()
  }, [id])

  const fetchOrder = async () => {
    try {
      const res = await getOrder(id)
      setOrder(res.data)
    } catch (err) {
      toast.error('Order not found')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading order details...</div>
  if (!order) return <div className="empty-state">Order not found</div>

  return (
    <div className="table-container">
      <div className="page-header">
        <h2>Order #{order.id}</h2>
        <Link to="/orders" className="btn btn-secondary">← Back to Orders</Link>
      </div>
      <div style={{ marginBottom: '1.5rem' }}>
        <p><strong>Customer ID:</strong> {order.customer_id}</p>
        <p><strong>Status:</strong> <span className="badge badge-success">{order.status}</span></p>
        <p><strong>Total Amount:</strong> ${order.total_amount.toFixed(2)}</p>
        <p><strong>Date:</strong> {new Date(order.created_at).toLocaleString()}</p>
      </div>
      <h3 style={{ marginBottom: '1rem' }}>Items</h3>
      <table>
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Quantity</th>
            <th>Unit Price</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item.id}>
              <td>{item.product_id}</td>
              <td>{item.quantity}</td>
              <td>${item.unit_price.toFixed(2)}</td>
              <td>${(item.unit_price * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default OrderDetails
