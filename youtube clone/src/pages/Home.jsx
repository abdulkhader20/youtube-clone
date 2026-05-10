import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import VideoCard from '../components/VideoCard'

const categories = [
  'All', 'Web Development', 'JavaScript',
  'Data Structures', 'Server', 'Music', 'Information Technology'
]

// Skeleton placeholder while loading
function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton skeleton-thumb" />
      <div className="skeleton-info">
        <div className="skeleton skeleton-avatar" />
        <div className="skeleton-lines">
          <div className="skeleton skeleton-line w80" />
          <div className="skeleton skeleton-line w60" />
          <div className="skeleton skeleton-line w40" />
        </div>
      </div>
    </div>
  )
}

function Home() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search') || ''

  useEffect(() => {
    fetchVideos()
  }, [activeCategory, searchQuery])

  const fetchVideos = async () => {
    try {
      setLoading(true)
      const params = {}
      if (searchQuery) params.search = searchQuery
      if (activeCategory !== 'All') params.category = activeCategory
      const res = await axios.get('http://localhost:5000/api/videos', { params })
      setVideos(res.data)
    } catch (err) {
      console.error('Failed to fetch videos:', err.message)
      setVideos([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Search result label */}
      {searchQuery && (
        <p style={{ color: 'var(--text-secondary)', marginBottom: '16px', fontSize: '14px' }}>
          Results for: <strong style={{ color: 'var(--text-primary)' }}>"{searchQuery}"</strong>
        </p>
      )}

      {/* Filter buttons */}
      <div className="filter-bar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`filter-btn ${activeCategory === cat ? 'active' : 'inactive'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skeleton loading */}
      {loading && (
        <div className="skeleton-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      )}

      {/* Video grid */}
      {!loading && videos.length > 0 && (
        <div className="video-grid">
          {videos.map(video => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && videos.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🎬</div>
          <p className="empty-title">No videos found</p>
          <p className="empty-desc">
            {searchQuery
              ? `No results for "${searchQuery}"`
              : 'Upload some videos from your channel page!'}
          </p>
        </div>
      )}
    </div>
  )
}

export default Home
