import { useEffect, useState } from 'react'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import './UserManagement.css'

const UserManagement = () => {
  const { user } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'supplier_manager',
  })

  useEffect(() => {
    if (user?.Role === 'owner') {
      fetchUsers()
    }
  }, [user])

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users')
      // Filter to show only supplier staff (managers and sales reps)
      const supplierStaff = (response.data || []).filter(
        (u) => u.role === 'supplier_manager' || u.role === 'supplier_sales' || u.role === 'sales_representative'
      )
      setUsers(supplierStaff)
    } catch (error) {
      console.error('Failed to fetch users:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/users', formData)
      setShowModal(false)
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        role: 'supplier_manager',
      })
      fetchUsers()
    } catch (error) {
      console.error('Failed to create user:', error)
      alert('Failed to create user')
    }
  }

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return
    }
    try {
      await api.delete(`/users/${userId}`)
      fetchUsers()
    } catch (error) {
      console.error('Failed to delete user:', error)
      alert('Failed to delete user')
    }
  }

  if (user?.Role !== 'owner') {
    return (
      <div className="unauthorized">
        <h2>Unauthorized</h2>
        <p>Only Owners can access user management.</p>
      </div>
    )
  }

  if (loading) {
    return <div className="page-loading">Loading users...</div>
  }

  return (
    <div className="user-management">
      <div className="page-header">
        <h1>User Management</h1>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          + Add New User
        </button>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">
                  No users found. Create your first user!
                </td>
              </tr>
            ) : (
              users.map((userItem) => (
                <tr key={userItem.user_id || userItem.UserID}>
                  <td>{userItem.name || userItem.Name}</td>
                  <td>{userItem.email || userItem.Email}</td>
                  <td>{userItem.phone || userItem.Phone || '-'}</td>
                  <td>
                    <span className="role-badge">
                      {userItem.role || userItem.Role}
                    </span>
                  </td>
                  <td>
                    {new Date(userItem.created_at || userItem.CreatedAt).toLocaleDateString()}
                  </td>
                  <td>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(userItem.user_id || userItem.UserID)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add New User</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Password *</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                />
              </div>

              <div className="form-group">
                <label>Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  required
                >
                  <option value="supplier_manager">Manager</option>
                  <option value="supplier_sales">Sales Representative</option>
                  <option value="sales_representative">Sales Representative (Alt)</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagement

