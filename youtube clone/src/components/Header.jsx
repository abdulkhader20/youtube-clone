import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import YouTubeLogo from './YouTubeLogo'

function Header({ onMenuClick }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) navigate(`/?search=${searchQuery}`)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <>
      <header className="header">

        {/* LEFT */}
        <div className="header-left">
          <button className="icon-btn hamburger-btn" onClick={onMenuClick} title="Menu">
            <span className="hamburger-line" />
            <span className="hamburger-line" />
            <span className="hamburger-line" />
          </button>
          <Link to="/" className="logo-link">
            <YouTubeLogo />
          </Link>
        </div>

        {/* CENTER */}
        <form
          className={`header-center search-form ${searchFocused ? 'search-focused' : ''}`}
          onSubmit={handleSearch}
        >
          <div className="search-wrap">
            <input
              className="search-input"
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <button className="search-btn" type="submit" title="Search">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M20.87 20.17l-5.59-5.59A7.49 7.49 0 0 0 16 10a7.5 7.5 0 1 0-7.5 7.5c1.82 0 3.5-.65 4.82-1.71l5.59 5.59.96-.96zM3.5 10a6 6 0 1 1 12 0 6 6 0 0 1-12 0z"/>
              </svg>
            </button>
          </div>
        </form>

        {/* RIGHT */}
        <div className="header-right">
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            {isDark ? '☀️' : '🌙'}
          </button>

          {user ? (
            <>
              <div className="user-avatar" title={user.username}>
                {user.username.charAt(0).toUpperCase()}
              </div>
              <span className="username-text">{user.username}</span>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <Link to="/login" className="signin-btn">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
              </svg>
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </header>

      {/* Mobile search */}
      <div className="mobile-search" style={{ display: 'none' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', width: '100%' }}>
          <input className="search-input" type="text" placeholder="Search"
            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
          <button className="search-btn" type="submit">🔍</button>
        </form>
      </div>
    </>
  )
}

export default Header
