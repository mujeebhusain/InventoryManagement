import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createCustomer } from '../../services/api'
import { toast } from 'react-toastify'

function CustomerForm() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Name is required'
    if (!form.email.trim()) errs.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email format'
    if (!form.phone.trim()) errs.phone = 'Phone is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    try {
      await createCustomer({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      })
      toast.success('Customer created successfully')
      navigate('/customers')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to create customer')
    }
  }

  return (
    <div className="form-container">
      <h2>Add New Customer</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Enter full name"
          />
          {errors.name && <div className="error">{errors.name}</div>}
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Enter email"
          />
          {errors.email && <div className="error">{errors.email}</div>}
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="text"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="Enter phone number"
          />
          {errors.phone && <div className="error">{errors.phone}</div>}
        </div>
        <button type="submit" className="btn btn-primary">Create Customer</button>
      </form>
    </div>
  )
}

export default CustomerForm
