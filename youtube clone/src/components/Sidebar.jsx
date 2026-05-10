import { Link, useLocation } from 'react-router-dom'

const mainNav = [
  { icon: '🏠', label: 'Home',          path: '/' },
  { icon: '🔥', label: 'Trending',      path: '/' },
  { icon: '📺', label: 'Subscriptions', path: '/' },
]

const youNav = [
  { icon: '📚', label: 'Library',      path: '/' },
  { icon: '🕐', label: 'History',      path: '/' },
  { icon: '▶️', label: 'Your Videos',  path: '/channel' },
  { icon: '⏰', label: 'Watch Later',  path: '/' },
  { icon: '👍', label: 'Liked Videos', path: '/' },
]

const exploreNav = [
  { icon: '🎵', label: 'Music',   path: '/' },
  { icon: '🎮', label: 'Gaming',  path: '/' },
  { icon: '📰', label: 'News',    path: '/' },
  { icon: '⚽', label: 'Sports',  path: '/' },
]

function NavGroup({ title, items, currentPath }) {
  return (
    <div className="sidebar-section">
      {title && <p className="sidebar-label">{title}</p>}
      {items.map(item => (
        <Link
          key={item.label}
          to={item.path}
          className={`sidebar-link ${currentPath === item.path && item.path !== '/' ? 'active' : ''}`}
        >
          <span className="sidebar-icon">{item.icon}</span>
          <span>{item.label}</span>
        </Link>
      ))}
    </div>
  )
}

function Sidebar({ isOpen }) {
  const location = useLocation()
  if (!isOpen) return null

  return (
    <aside className="sidebar">
      <NavGroup items={mainNav} currentPath={location.pathname} />
      <NavGroup title="You" items={youNav} currentPath={location.pathname} />
      <NavGroup title="Explore" items={exploreNav} currentPath={location.pathname} />
    </aside>
  )
}

export default Sidebar
