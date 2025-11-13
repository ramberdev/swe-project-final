import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import './SupplierOnboarding.css'

const SupplierOnboarding = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    business_name: '',
    business_address: '',
    contact_email: '',
    contact_phone: '',
    tax_id: '',
    registration_number: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Submit KYB information
      await api.post('/suppliers/onboarding', formData)
      alert('Onboarding information submitted successfully! Your account will be activated after verification.')
      navigate('/dashboard')
    } catch (error) {
      console.error('Failed to submit onboarding:', error)
      setError(error.response?.data?.detail || 'Failed to submit onboarding information')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        <h1>Supplier Onboarding (KYB)</h1>
        <p className="onboarding-subtitle">
          Please provide your business information for verification
        </p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="business_name">Business Legal Name *</label>
            <input
              type="text"
              id="business_name"
              name="business_name"
              value={formData.business_name}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="business_address">Business Address *</label>
            <textarea
              id="business_address"
              name="business_address"
              value={formData.business_address}
              onChange={handleChange}
              rows="3"
              required
              disabled={loading}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="contact_email">Contact Email *</label>
              <input
                type="email"
                id="contact_email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact_phone">Contact Phone *</label>
              <input
                type="tel"
                id="contact_phone"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="tax_id">Tax ID / EIN *</label>
              <input
                type="text"
                id="tax_id"
                name="tax_id"
                value={formData.tax_id}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="registration_number">Business Registration Number</label>
              <input
                type="text"
                id="registration_number"
                name="registration_number"
                value={formData.registration_number}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate('/dashboard')} disabled={loading}>
              Skip for Now
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Information'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SupplierOnboarding

