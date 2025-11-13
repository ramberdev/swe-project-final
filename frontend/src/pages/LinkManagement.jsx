import { useEffect, useState } from 'react'
import api from '../services/api'
import './LinkManagement.css'

const LinkManagement = () => {
  const [links, setLinks] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, pending, approved, removed, blocked

  useEffect(() => {
    fetchLinks()
  }, [])

  const fetchLinks = async () => {
    try {
      const response = await api.get('/links')
      setLinks(response.data || [])
    } catch (error) {
      console.error('Failed to fetch links:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateLinkStatus = async (linkId, newStatus) => {
    try {
      await api.patch(`/links/${linkId}`, { status: newStatus })
      fetchLinks()
    } catch (error) {
      console.error('Failed to update link:', error)
      alert('Failed to update link status')
    }
  }

  const filteredLinks = links.filter((link) => {
    if (filter === 'all') return true
    return link.status?.toLowerCase() === filter.toLowerCase()
  })

  const getStatusBadgeClass = (status) => {
    const statusLower = status?.toLowerCase()
    if (statusLower === 'approved') return 'status-approved'
    if (statusLower === 'pending') return 'status-pending'
    if (statusLower === 'removed') return 'status-removed'
    if (statusLower === 'blocked') return 'status-blocked'
    return ''
  }

  if (loading) {
    return <div className="page-loading">Loading links...</div>
  }

  return (
    <div className="link-management">
      <div className="page-header">
        <h1>Link Management</h1>
        <div className="filter-tabs">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={filter === 'pending' ? 'active' : ''}
            onClick={() => setFilter('pending')}
          >
            Pending
          </button>
          <button
            className={filter === 'approved' ? 'active' : ''}
            onClick={() => setFilter('approved')}
          >
            Approved
          </button>
          <button
            className={filter === 'removed' ? 'active' : ''}
            onClick={() => setFilter('removed')}
          >
            Removed
          </button>
          <button
            className={filter === 'blocked' ? 'active' : ''}
            onClick={() => setFilter('blocked')}
          >
            Blocked
          </button>
        </div>
      </div>

      <div className="links-table-container">
        <table className="links-table">
          <thead>
            <tr>
              <th>Link ID</th>
              <th>Consumer ID</th>
              <th>Supplier ID</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Approved At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLinks.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">
                  No links found
                </td>
              </tr>
            ) : (
              filteredLinks.map((link) => (
                <tr key={link.link_id || link.LinkID}>
                  <td>{link.link_id || link.LinkID}</td>
                  <td>{link.consumer_id || link.ConsumerID}</td>
                  <td>{link.supplier_id || link.SupplierID}</td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(link.status || link.Status)}`}>
                      {link.status || link.Status}
                    </span>
                  </td>
                  <td>{new Date(link.created_at || link.CreatedAt).toLocaleDateString()}</td>
                  <td>
                    {link.approved_at || link.ApprovedAt
                      ? new Date(link.approved_at || link.ApprovedAt).toLocaleDateString()
                      : '-'}
                  </td>
                  <td>
                    <div className="action-buttons">
                      {(link.status || link.Status)?.toLowerCase() === 'pending' && (
                        <>
                          <button
                            className="btn-approve"
                            onClick={() => updateLinkStatus(link.link_id || link.LinkID, 'approved')}
                          >
                            Approve
                          </button>
                          <button
                            className="btn-reject"
                            onClick={() => updateLinkStatus(link.link_id || link.LinkID, 'removed')}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {(link.status || link.Status)?.toLowerCase() === 'approved' && (
                        <>
                          <button
                            className="btn-remove"
                            onClick={() => updateLinkStatus(link.link_id || link.LinkID, 'removed')}
                          >
                            Remove
                          </button>
                          <button
                            className="btn-block"
                            onClick={() => updateLinkStatus(link.link_id || link.LinkID, 'blocked')}
                          >
                            Block
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default LinkManagement

