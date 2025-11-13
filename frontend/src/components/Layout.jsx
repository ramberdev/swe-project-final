import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Layout.css'

const Layout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isOwner = user?.Role === 'owner' || user?.role === 'supplier_owner'
  const isManager = user?.Role === 'manager' || user?.role === 'supplier_manager'
  const isSupplier = isOwner || isManager || user?.Role === 'sales_representative' || user?.role === 'supplier_sales'

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-brand">
          <Link to="/dashboard">SCP Platform</Link>
        </div>
        <div className="navbar-menu">
          <Link to="/dashboard">Dashboard</Link>
          {isSupplier && (
            <>
              <Link to="/links">Link Management</Link>
              <Link to="/products">Catalog</Link>
              <Link to="/orders">Orders</Link>
              <Link to="/complaints">Complaints</Link>
              <Link to="/chat">Chat</Link>
              {isOwner && <Link to="/users">User Management</Link>}
            </>
          )}
        </div>
        <div className="navbar-user">
          <span>{user?.Name || user?.Email}</span>
          <span className="role-badge">{user?.Role}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout

