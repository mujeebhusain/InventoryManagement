import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCustomers, deleteCustomer } from '../../services/api'
import { toast } from 'react-toastify'

function CustomerList() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const res = await getCustomers()
      setCustomers(res.data)
    } catch (err) {
      toast.error('Failed to fetch customers')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete customer "${name}"?`)) return
    try {
      await deleteCustomer(id)
      toast.success('Customer deleted')
      setCustomers(customers.filter((c) => c.id !== id))
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to delete customer')
    }
  }

  if (loading) return <div className="loading">Loading customers...</div>

  return (
    <div className="table-container">
      <div className="page-header">
        <h2>Customers</h2>
        <Link to="/customers/new" className="btn btn-primary">+ Add Customer</Link>
      </div>
      {customers.length === 0 ? (
        <div className="empty-state">No customers found. Add your first customer!</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(customer.id, customer.name)}>
                    Delete
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

export default CustomerList
