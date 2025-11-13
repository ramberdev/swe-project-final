import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import api from '../services/api'
import './Dashboard.css'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalLinks: 0,
    pendingLinks: 0,
    totalComplaints: 0,
    openComplaints: 0,
    totalProducts: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      // Fetch various stats
      const [ordersRes, linksRes, complaintsRes, productsRes] = await Promise.all([
        api.get('/orders').catch(() => ({ data: [] })),
        api.get('/links').catch(() => ({ data: [] })),
        api.get('/complaints').catch(() => ({ data: [] })),
        api.get('/products').catch(() => ({ data: [] })),
      ])

      const orders = ordersRes.data || []
      const links = linksRes.data || []
      const complaints = complaintsRes.data || []
      const products = productsRes.data || []

      setStats({
        totalOrders: orders.length,
        pendingOrders: orders.filter((o) => o.status === 'pending').length,
        totalLinks: links.length,
        pendingLinks: links.filter((l) => l.status === 'pending').length,
        totalComplaints: complaints.length,
        openComplaints: complaints.filter((c) => c.status === 'open').length,
        totalProducts: products.length,
      })
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>
  }

  return (
    <div className="dashboard">
      <h1>Welcome, {user?.Name || 'User'}!</h1>
      <p className="dashboard-subtitle">Here's an overview of your platform activity</p>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>{stats.totalOrders}</h3>
            <p>Total Orders</p>
            {stats.pendingOrders > 0 && (
              <span className="stat-badge">{stats.pendingOrders} pending</span>
            )}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🔗</div>
          <div className="stat-content">
            <h3>{stats.totalLinks}</h3>
            <p>Total Links</p>
            {stats.pendingLinks > 0 && (
              <span className="stat-badge">{stats.pendingLinks} pending</span>
            )}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-content">
            <h3>{stats.totalComplaints}</h3>
            <p>Total Complaints</p>
            {stats.openComplaints > 0 && (
              <span className="stat-badge alert">{stats.openComplaints} open</span>
            )}
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>{stats.totalProducts}</h3>
            <p>Products in Catalog</p>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          {(user?.Role === 'owner' || user?.Role === 'manager') && (
            <>
              <a href="/products" className="action-btn">
                Manage Catalog
              </a>
              <a href="/links" className="action-btn">
                Manage Links
              </a>
              <a href="/orders" className="action-btn">
                View Orders
              </a>
            </>
          )}
          {user?.Role === 'owner' && (
            <a href="/users" className="action-btn">
              Manage Users
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard

