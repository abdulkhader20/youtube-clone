import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function Register() {
  const navigate = useNavigate()

  // Form field values
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [error, setError] = useState('')      // error message to show user
  const [loading, setLoading] = useState(false) // disable button while submitting

  // Update the right field when user types
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    // --- Frontend validation ---
    if (!formData.username || !formData.email || !formData.password) {
      return setError('All fields are required')
    }
    if (formData.username.length < 3) {
      return setError('Username must be at least 3 characters')
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      return setError('Please enter a valid email')
    }
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters')
    }
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match')
    }

    try {
      setLoading(true)
      // Call backend register API
      await axios.post('http://localhost:5000/api/auth/register', {
        username: formData.username,
        email: formData.email,
        password: formData.password
      })

      // After successful registration → redirect to login
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <span style={{ color: '#ff0000', fontSize: '32px' }}>▶</span>
          <span style={{ color: 'var(--text-primary)', fontWeight: 'bold', fontSize: '24px', marginLeft: '8px' }}>YouTube</span>
        </div>
        <h2 className="auth-title">Create your account</h2>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label className="auth-label">Username</label>
            <input type="text" name="username" value={formData.username}
              onChange={handleChange} placeholder="Enter username" className="auth-input" />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label className="auth-label">Email</label>
            <input type="email" name="email" value={formData.email}
              onChange={handleChange} placeholder="Enter email" className="auth-input" />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label className="auth-label">Password</label>
            <input type="password" name="password" value={formData.password}
              onChange={handleChange} placeholder="Min 6 characters" className="auth-input" />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label className="auth-label">Confirm Password</label>
            <input type="password" name="confirmPassword" value={formData.confirmPassword}
              onChange={handleChange} placeholder="Repeat password" className="auth-input" />
          </div>
          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-link-text">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">Sign In</Link>
        </p>
      </div>
    </div>
  )
}

export default Register
