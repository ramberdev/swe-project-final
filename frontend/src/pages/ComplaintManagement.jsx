import { useEffect, useState } from 'react'
import api from '../services/api'
import { useAuth } from '../contexts/AuthContext'
import './ComplaintManagement.css'

const ComplaintManagement = () => {
  const { user } = useAuth()
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [resolutionNotes, setResolutionNotes] = useState('')

  useEffect(() => {
    fetchComplaints()
  }, [])

  const fetchComplaints = async () => {
    try {
      const response = await api.get('/complaints')
      setComplaints(response.data || [])
    } catch (error) {
      console.error('Failed to fetch complaints:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateComplaintStatus = async (complaintId, status, notes = '') => {
    try {
      const updateData = { status }
      if (notes) {
        updateData.notes = notes
      }
      await api.patch(`/complaints/${complaintId}`, updateData, {
        params: { user_id: user?.UserID || user?.user_id },
      })
      fetchComplaints()
      setSelectedComplaint(null)
      setResolutionNotes('')
    } catch (error) {
      console.error('Failed to update complaint:', error)
      alert('Failed to update complaint status')
    }
  }

  const escalateComplaint = async (complaintId) => {
    try {
      await api.patch(`/complaints/${complaintId}`, { status: 'escalated' }, {
        params: { user_id: user?.UserID || user?.user_id },
      })
      fetchComplaints()
    } catch (error) {
      console.error('Failed to escalate complaint:', error)
      alert('Failed to escalate complaint')
    }
  }

  const resolveComplaint = () => {
    if (!resolutionNotes.trim()) {
      alert('Please provide resolution notes')
      return
    }
    updateComplaintStatus(
      selectedComplaint.complaint_id || selectedComplaint.ComplaintID,
      'resolved',
      resolutionNotes
    )
  }

  const getStatusBadgeClass = (status) => {
    const statusLower = status?.toLowerCase()
    if (statusLower === 'resolved') return 'status-resolved'
    if (statusLower === 'in_progress') return 'status-in-progress'
    if (statusLower === 'escalated') return 'status-escalated'
    if (statusLower === 'open') return 'status-open'
    return ''
  }

  const getPriorityBadgeClass = (priority) => {
    const priorityLower = priority?.toLowerCase()
    if (priorityLower === 'high') return 'priority-high'
    if (priorityLower === 'medium') return 'priority-medium'
    if (priorityLower === 'low') return 'priority-low'
    return ''
  }

  const filteredComplaints = complaints.filter((complaint) => {
    if (filter === 'all') return true
    return complaint.status?.toLowerCase() === filter.toLowerCase()
  })

  const isManager = user?.Role === 'manager' || user?.Role === 'owner'
  const isSales = user?.Role === 'sales_representative'

  if (loading) {
    return <div className="page-loading">Loading complaints...</div>
  }

  return (
    <div className="complaint-management">
      <div className="page-header">
        <h1>Complaint Management</h1>
        <div className="filter-tabs">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            className={filter === 'open' ? 'active' : ''}
            onClick={() => setFilter('open')}
          >
            Open
          </button>
          <button
            className={filter === 'in_progress' ? 'active' : ''}
            onClick={() => setFilter('in_progress')}
          >
            In Progress
          </button>
          <button
            className={filter === 'escalated' ? 'active' : ''}
            onClick={() => setFilter('escalated')}
          >
            Escalated
          </button>
          <button
            className={filter === 'resolved' ? 'active' : ''}
            onClick={() => setFilter('resolved')}
          >
            Resolved
          </button>
        </div>
      </div>

      <div className="complaints-table-container">
        <table className="complaints-table">
          <thead>
            <tr>
              <th>Complaint ID</th>
              <th>Order ID</th>
              <th>Title</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredComplaints.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">
                  No complaints found
                </td>
              </tr>
            ) : (
              filteredComplaints.map((complaint) => (
                <tr key={complaint.complaint_id || complaint.ComplaintID}>
                  <td>
                    <button
                      className="complaint-id-link"
                      onClick={() => setSelectedComplaint(complaint)}
                    >
                      #{complaint.complaint_id || complaint.ComplaintID}
                    </button>
                  </td>
                  <td>#{complaint.order_id || complaint.OrderID}</td>
                  <td>{complaint.title || complaint.Title}</td>
                  <td>
                    <span className={`priority-badge ${getPriorityBadgeClass(complaint.priority || complaint.Priority)}`}>
                      {complaint.priority || complaint.Priority}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(complaint.status || complaint.Status)}`}>
                      {complaint.status || complaint.Status}
                    </span>
                  </td>
                  <td>
                    {new Date(complaint.created_at || complaint.CreatedAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="action-buttons">
                      {(complaint.status || complaint.Status)?.toLowerCase() === 'open' && isSales && (
                        <button
                          className="btn-progress"
                          onClick={() => updateComplaintStatus(complaint.complaint_id || complaint.ComplaintID, 'in_progress')}
                        >
                          Start
                        </button>
                      )}
                      {(complaint.status || complaint.Status)?.toLowerCase() === 'in_progress' && isSales && (
                        <button
                          className="btn-escalate"
                          onClick={() => escalateComplaint(complaint.complaint_id || complaint.ComplaintID)}
                        >
                          Escalate
                        </button>
                      )}
                      {isManager && (complaint.status || complaint.Status)?.toLowerCase() !== 'resolved' && (
                        <button
                          className="btn-resolve"
                          onClick={() => setSelectedComplaint(complaint)}
                        >
                          Resolve
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedComplaint && (
        <div className="modal-overlay" onClick={() => setSelectedComplaint(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Complaint Details #{selectedComplaint.complaint_id || selectedComplaint.ComplaintID}</h2>
            <div className="complaint-details">
              <div className="detail-row">
                <span className="label">Order ID:</span>
                <span className="value">#{selectedComplaint.order_id || selectedComplaint.OrderID}</span>
              </div>
              <div className="detail-row">
                <span className="label">Title:</span>
                <span className="value">{selectedComplaint.title || selectedComplaint.Title}</span>
              </div>
              <div className="detail-row">
                <span className="label">Description:</span>
                <span className="value">{selectedComplaint.description || selectedComplaint.Description}</span>
              </div>
              <div className="detail-row">
                <span className="label">Priority:</span>
                <span className={`priority-badge ${getPriorityBadgeClass(selectedComplaint.priority || selectedComplaint.Priority)}`}>
                  {selectedComplaint.priority || selectedComplaint.Priority}
                </span>
              </div>
              <div className="detail-row">
                <span className="label">Status:</span>
                <span className={`status-badge ${getStatusBadgeClass(selectedComplaint.status || selectedComplaint.Status)}`}>
                  {selectedComplaint.status || selectedComplaint.Status}
                </span>
              </div>
              <div className="detail-row">
                <span className="label">Created At:</span>
                <span className="value">
                  {new Date(selectedComplaint.created_at || selectedComplaint.CreatedAt).toLocaleString()}
                </span>
              </div>
              {selectedComplaint.resolved_at || selectedComplaint.ResolvedAt ? (
                <div className="detail-row">
                  <span className="label">Resolved At:</span>
                  <span className="value">
                    {new Date(selectedComplaint.resolved_at || selectedComplaint.ResolvedAt).toLocaleString()}
                  </span>
                </div>
              ) : null}
            </div>

            {isManager && (selectedComplaint.status || selectedComplaint.Status)?.toLowerCase() !== 'resolved' && (
              <div className="resolution-section">
                <div className="form-group">
                  <label>Resolution Notes *</label>
                  <textarea
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    rows="4"
                    placeholder="Enter resolution details..."
                    required
                  />
                </div>
                <div className="modal-actions">
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      setSelectedComplaint(null)
                      setResolutionNotes('')
                    }}
                  >
                    Cancel
                  </button>
                  <button className="btn-resolve" onClick={resolveComplaint}>
                    Mark as Resolved
                  </button>
                </div>
              </div>
            )}

            {(!isManager || (selectedComplaint.status || selectedComplaint.Status)?.toLowerCase() === 'resolved') && (
              <button className="btn-secondary" onClick={() => setSelectedComplaint(null)}>
                Close
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ComplaintManagement

