import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import API_URL from '../config/api'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!formData.email || !formData.password) {
      return setError('Email and password are required')
    }
    try {
      setLoading(true)
      const res = await axios.post(`${API_URL}/api/auth/login`, {
        email: formData.email,
        password: formData.password
      })
      login(res.data.user, res.data.token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
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
        <h2 className="auth-title">Sign in to YouTube</h2>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label className="auth-label">Email</label>
            <input type="email" name="email" value={formData.email}
              onChange={handleChange} placeholder="Enter your email" className="auth-input" />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label className="auth-label">Password</label>
            <input type="password" name="password" value={formData.password}
              onChange={handleChange} placeholder="Enter your password" className="auth-input" />
          </div>
          <button type="submit" disabled={loading} className="auth-btn">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="auth-link-text">
          Don't have an account?{' '}
          <Link to="/register" className="auth-link">Sign Up</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
