import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getProducts, deleteProduct } from '../../services/api'
import { toast } from 'react-toastify'

function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await getProducts()
      setProducts(res.data)
    } catch (err) {
      toast.error('Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete product "${name}"?`)) return
    try {
      await deleteProduct(id)
      toast.success('Product deleted')
      setProducts(products.filter((p) => p.id !== id))
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to delete product')
    }
  }

  if (loading) return <div className="loading">Loading products...</div>

  return (
    <div className="table-container">
      <div className="page-header">
        <h2>Products</h2>
        <Link to="/products/new" className="btn btn-primary">+ Add Product</Link>
      </div>
      {products.length === 0 ? (
        <div className="empty-state">No products found. Add your first product!</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>SKU</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td><code>{product.sku}</code></td>
                <td>${product.price.toFixed(2)}</td>
                <td>
                  <span className={`badge ${product.quantity <= 10 ? 'badge-danger' : 'badge-success'}`}>
                    {product.quantity}
                  </span>
                </td>
                <td>
                  <Link to={`/products/edit/${product.id}`} className="btn btn-secondary btn-sm" style={{ marginRight: '0.5rem' }}>
                    Edit
                  </Link>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(product.id, product.name)}>
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

export default ProductList
