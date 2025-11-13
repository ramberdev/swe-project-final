import { useEffect, useState } from 'react'
import api from '../services/api'
import './OrderManagement.css'

const OrderManagement = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders')
      setOrders(response.data || [])
    } catch (error) {
      console.error('Failed to fetch orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId, status, reason = null) => {
    try {
      const updateData = { status }
      if (reason) {
        updateData.rejection_reason = reason
      }
      await api.patch(`/orders/${orderId}`, updateData)
      fetchOrders()
      setShowRejectModal(false)
      setSelectedOrder(null)
      setRejectionReason('')
    } catch (error) {
      console.error('Failed to update order:', error)
      alert('Failed to update order status')
    }
  }

  const handleReject = (order) => {
    setSelectedOrder(order)
    setShowRejectModal(true)
  }

  const confirmReject = () => {
    if (!rejectionReason.trim()) {
      alert('Please provide a rejection reason')
      return
    }
    updateOrderStatus(
      selectedOrder.order_id || selectedOrder.OrderID,
      'rejected',
      rejectionReason
    )
  }

  const getStatusBadgeClass = (status) => {
    const statusLower = status?.toLowerCase()
    if (statusLower === 'completed') return 'status-completed'
    if (statusLower === 'accepted') return 'status-accepted'
    if (statusLower === 'pending') return 'status-pending'
    if (statusLower === 'rejected') return 'status-rejected'
    if (statusLower === 'in_progress') return 'status-in-progress'
    if (statusLower === 'cancelled') return 'status-cancelled'
    return ''
  }

  const filteredOrders = orders.filter((order) => {
    if (filter === 'all') return true
    return order.status?.toLowerCase() === filter.toLowerCase()
  })

  if (loading) {
    return <div className="page-loading">Loading orders...</div>
  }

  return (
    <div className="order-management">
      <div className="page-header">
        <h1>Order Management</h1>
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
            className={filter === 'accepted' ? 'active' : ''}
            onClick={() => setFilter('accepted')}
          >
            Accepted
          </button>
          <button
            className={filter === 'in_progress' ? 'active' : ''}
            onClick={() => setFilter('in_progress')}
          >
            In Progress
          </button>
          <button
            className={filter === 'completed' ? 'active' : ''}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
          <button
            className={filter === 'rejected' ? 'active' : ''}
            onClick={() => setFilter('rejected')}
          >
            Rejected
          </button>
        </div>
      </div>

      <div className="orders-table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Consumer ID</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Delivery Date</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">
                  No orders found
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.order_id || order.OrderID}>
                  <td>
                    <button
                      className="order-id-link"
                      onClick={() => setSelectedOrder(order)}
                    >
                      #{order.order_id || order.OrderID}
                    </button>
                  </td>
                  <td>{order.consumer_id || order.ConsumerID}</td>
                  <td>${(order.total_amount || order.TotalAmount || 0).toFixed(2)}</td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(order.status || order.Status)}`}>
                      {order.status || order.Status}
                    </span>
                  </td>
                  <td>
                    {order.delivery_date || order.DeliveryDate
                      ? new Date(order.delivery_date || order.DeliveryDate).toLocaleDateString()
                      : '-'}
                  </td>
                  <td>
                    {new Date(order.created_at || order.CreatedAt).toLocaleDateString()}
                  </td>
                  <td>
                    <div className="action-buttons">
                      {(order.status || order.Status)?.toLowerCase() === 'pending' && (
                        <>
                          <button
                            className="btn-approve"
                            onClick={() => updateOrderStatus(order.order_id || order.OrderID, 'accepted')}
                          >
                            Accept
                          </button>
                          <button
                            className="btn-reject"
                            onClick={() => handleReject(order)}
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {(order.status || order.Status)?.toLowerCase() === 'accepted' && (
                        <button
                          className="btn-progress"
                          onClick={() => updateOrderStatus(order.order_id || order.OrderID, 'in_progress')}
                        >
                          Mark In Progress
                        </button>
                      )}
                      {(order.status || order.Status)?.toLowerCase() === 'in_progress' && (
                        <button
                          className="btn-complete"
                          onClick={() => updateOrderStatus(order.order_id || order.OrderID, 'completed')}
                        >
                          Complete
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

      {selectedOrder && !showRejectModal && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Order Details #{selectedOrder.order_id || selectedOrder.OrderID}</h2>
            <div className="order-details">
              <div className="detail-row">
                <span className="label">Consumer ID:</span>
                <span className="value">{selectedOrder.consumer_id || selectedOrder.ConsumerID}</span>
              </div>
              <div className="detail-row">
                <span className="label">Total Amount:</span>
                <span className="value">
                  ${(selectedOrder.total_amount || selectedOrder.TotalAmount || 0).toFixed(2)}
                </span>
              </div>
              <div className="detail-row">
                <span className="label">Status:</span>
                <span className={`status-badge ${getStatusBadgeClass(selectedOrder.status || selectedOrder.Status)}`}>
                  {selectedOrder.status || selectedOrder.Status}
                </span>
              </div>
              <div className="detail-row">
                <span className="label">Delivery Date:</span>
                <span className="value">
                  {selectedOrder.delivery_date || selectedOrder.DeliveryDate
                    ? new Date(selectedOrder.delivery_date || selectedOrder.DeliveryDate).toLocaleDateString()
                    : '-'}
                </span>
              </div>
              {selectedOrder.rejection_reason || selectedOrder.RejectionReason ? (
                <div className="detail-row">
                  <span className="label">Rejection Reason:</span>
                  <span className="value">
                    {selectedOrder.rejection_reason || selectedOrder.RejectionReason}
                  </span>
                </div>
              ) : null}
            </div>
            <button className="btn-secondary" onClick={() => setSelectedOrder(null)}>
              Close
            </button>
          </div>
        </div>
      )}

      {showRejectModal && (
        <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Reject Order</h2>
            <div className="form-group">
              <label>Rejection Reason *</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows="4"
                placeholder="Please provide a reason for rejecting this order..."
                required
              />
            </div>
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowRejectModal(false)
                  setRejectionReason('')
                }}
              >
                Cancel
              </button>
              <button className="btn-reject" onClick={confirmReject}>
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrderManagement

