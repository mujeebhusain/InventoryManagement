import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Navbar from './components/Navbar'
import Dashboard from './components/Dashboard'
import ProductList from './components/Products/ProductList'
import ProductForm from './components/Products/ProductForm'
import ProductEdit from './components/Products/ProductEdit'
import CustomerList from './components/Customers/CustomerList'
import CustomerForm from './components/Customers/CustomerForm'
import OrderList from './components/Orders/OrderList'
import OrderForm from './components/Orders/OrderForm'
import OrderDetails from './components/Orders/OrderDetails'

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/new" element={<ProductForm />} />
            <Route path="/products/edit/:id" element={<ProductEdit />} />
            <Route path="/customers" element={<CustomerList />} />
            <Route path="/customers/new" element={<CustomerForm />} />
            <Route path="/orders" element={<OrderList />} />
            <Route path="/orders/new" element={<OrderForm />} />
            <Route path="/orders/:id" element={<OrderDetails />} />
          </Routes>
        </main>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
  )
}

export default App
