import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getOrders, deleteOrder } from '../../services/api'
import { toast } from 'react-toastify'

function OrderList() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await getOrders()
      setOrders(res.data)
    } catch (err) {
      toast.error('Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm(`Cancel order #${id}?`)) return
    try {
      await deleteOrder(id)
      toast.success('Order cancelled')
      setOrders(orders.filter((o) => o.id !== id))
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to cancel order')
    }
  }

  if (loading) return <div className="loading">Loading orders...</div>

  return (
    <div className="table-container">
      <div className="page-header">
        <h2>Orders</h2>
        <Link to="/orders/new" className="btn btn-primary">+ New Order</Link>
      </div>
      {orders.length === 0 ? (
        <div className="empty-state">No orders found. Create your first order!</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer ID</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>#{order.id}</td>
                <td>{order.customer_id}</td>
                <td>${order.total_amount.toFixed(2)}</td>
                <td><span className="badge badge-success">{order.status}</span></td>
                <td>{new Date(order.created_at).toLocaleDateString()}</td>
                <td>
                  <Link to={`/orders/${order.id}`} className="btn btn-secondary btn-sm" style={{ marginRight: '0.5rem' }}>
                    View
                  </Link>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(order.id)}>
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default OrderList
