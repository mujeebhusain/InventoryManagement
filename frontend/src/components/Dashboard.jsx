import { useState, useEffect } from 'react'
import { getDashboard } from '../services/api'

function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const res = await getDashboard()
      setData(res.data)
    } catch (err) {
      console.error('Failed to fetch dashboard data', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="loading">Loading dashboard...</div>

  return (
    <div>
      <h2 style={{ marginBottom: '1.5rem', color: '#1a237e' }}>Dashboard</h2>
      <div className="dashboard">
        <div className="stat-card">
          <h3>Total Products</h3>
          <div className="stat-value">{data?.total_products || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Total Customers</h3>
          <div className="stat-value">{data?.total_customers || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Total Orders</h3>
          <div className="stat-value">{data?.total_orders || 0}</div>
        </div>
        <div className="stat-card">
          <h3>Low Stock Items</h3>
          <div className="stat-value" style={{ color: '#d32f2f' }}>
            {data?.low_stock_products?.length || 0}
          </div>
        </div>
      </div>

      {data?.low_stock_products?.length > 0 && (
        <div className="low-stock-section">
          <h3>⚠️ Low Stock Products (≤ 10 units)</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>SKU</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {data.low_stock_products.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.sku}</td>
                  <td><span className="badge badge-danger">{p.quantity}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Dashboard
