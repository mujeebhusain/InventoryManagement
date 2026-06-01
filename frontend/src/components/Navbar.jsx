import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const location = useLocation()

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo">📦 Inventory Manager</Link>
        <ul className="nav-links">
          <li><Link to="/" className={isActive('/') && location.pathname === '/' ? 'active' : ''}>Dashboard</Link></li>
          <li><Link to="/products" className={isActive('/products') ? 'active' : ''}>Products</Link></li>
          <li><Link to="/customers" className={isActive('/customers') ? 'active' : ''}>Customers</Link></li>
          <li><Link to="/orders" className={isActive('/orders') ? 'active' : ''}>Orders</Link></li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
