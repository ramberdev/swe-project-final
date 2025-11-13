import { useEffect, useState } from 'react'
import api from '../services/api'
import './ProductManagement.css'

const ProductManagement = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    unit: '',
    min_order_quantity: '',
    image_url: '',
    is_available: true,
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await api.get('/products')
      setProducts(response.data || [])
    } catch (error) {
      console.error('Failed to fetch products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingProduct) {
        await api.patch(`/products/${editingProduct.product_id || editingProduct.ProductID}`, formData)
      } else {
        await api.post('/products', formData)
      }
      setShowModal(false)
      setEditingProduct(null)
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        unit: '',
        min_order_quantity: '',
        image_url: '',
        is_available: true,
      })
      fetchProducts()
    } catch (error) {
      console.error('Failed to save product:', error)
      alert('Failed to save product')
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name || product.Name || '',
      description: product.description || product.Description || '',
      price: product.price || product.Price || '',
      stock: product.stock || product.Stock || '',
      unit: product.unit || product.Unit || '',
      min_order_quantity: product.min_order_quantity || product.MinOrderQuantity || '',
      image_url: product.image_url || product.ImageURL || '',
      is_available: product.is_available ?? product.IsAvailable ?? true,
    })
    setShowModal(true)
  }

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return
    }
    try {
      await api.delete(`/products/${productId}`)
      fetchProducts()
    } catch (error) {
      console.error('Failed to delete product:', error)
      alert('Failed to delete product')
    }
  }

  const openNewProductModal = () => {
    setEditingProduct(null)
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      unit: '',
      min_order_quantity: '',
      image_url: '',
      is_available: true,
    })
    setShowModal(true)
  }

  if (loading) {
    return <div className="page-loading">Loading products...</div>
  }

  return (
    <div className="product-management">
      <div className="page-header">
        <h1>Product Catalog Management</h1>
        <button className="btn-primary" onClick={openNewProductModal}>
          + Add New Product
        </button>
      </div>

      <div className="products-grid">
        {products.length === 0 ? (
          <div className="no-data">No products found. Add your first product!</div>
        ) : (
          products.map((product) => (
            <div key={product.product_id || product.ProductID} className="product-card">
              {product.image_url || product.ImageURL ? (
                <img
                  src={product.image_url || product.ImageURL}
                  alt={product.name || product.Name}
                  className="product-image"
                />
              ) : (
                <div className="product-image-placeholder">No Image</div>
              )}
              <div className="product-info">
                <h3>{product.name || product.Name}</h3>
                <p className="product-description">
                  {product.description || product.Description || 'No description'}
                </p>
                <div className="product-details">
                  <div className="detail-item">
                    <span className="label">Price:</span>
                    <span className="value">${product.price || product.Price}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Stock:</span>
                    <span className={`value ${(product.stock || product.Stock) < 10 ? 'low-stock' : ''}`}>
                      {product.stock || product.Stock} {product.unit || product.Unit}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Min Order:</span>
                    <span className="value">{product.min_order_quantity || product.MinOrderQuantity}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">Status:</span>
                    <span className={`status-badge ${(product.is_available ?? product.IsAvailable) ? 'available' : 'unavailable'}`}>
                      {(product.is_available ?? product.IsAvailable) ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                </div>
                <div className="product-actions">
                  <button className="btn-edit" onClick={() => handleEdit(product)}>
                    Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDelete(product.product_id || product.ProductID)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Stock *</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Unit *</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    placeholder="kg, lb, piece, etc."
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Min Order Quantity *</label>
                  <input
                    type="number"
                    value={formData.min_order_quantity}
                    onChange={(e) => setFormData({ ...formData, min_order_quantity: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.is_available}
                    onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                  />
                  Available
                </label>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingProduct ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductManagement

