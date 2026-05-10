import { Link } from 'react-router-dom'

function formatViews(views) {
  if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M views'
  if (views >= 1000) return (views / 1000).toFixed(0) + 'K views'
  return views + ' views'
}

function timeAgo(dateStr) {
  const now = new Date()
  const date = new Date(dateStr)
  const diff = Math.floor((now - date) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return Math.floor(diff / 60) + ' minutes ago'
  if (diff < 86400) return Math.floor(diff / 3600) + ' hours ago'
  if (diff < 2592000) return Math.floor(diff / 86400) + ' days ago'
  if (diff < 31536000) return Math.floor(diff / 2592000) + ' months ago'
  return Math.floor(diff / 31536000) + ' years ago'
}

function VideoCard({ video }) {
  return (
    <Link to={`/video/${video._id}`} className="video-card-link">
      <div className="video-card">

        {/* Thumbnail */}
        <div className="video-thumbnail-wrap">
          <img
            src={video.thumbnailUrl}
            alt={video.title}
            className="video-thumbnail-img"
            onError={(e) => {
              e.target.src = 'https://placehold.co/320x180/1a1a1a/555?text=No+Thumbnail'
            }}
          />

          {/* Play overlay */}
          <div className="play-overlay">
            <div className="play-icon">▶</div>
          </div>

          {/* Duration badge */}
          <span className="video-duration">4:32</span>

          {/* 3-dot menu button */}
          <button
            className="video-menu-btn"
            onClick={e => e.preventDefault()}
            title="More options"
          >
            ⋮
          </button>
        </div>

        {/* Info */}
        <div className="video-info">
          <div className="channel-avatar">
            {video.channel?.channelName?.charAt(0).toUpperCase() || 'C'}
          </div>
          <div className="video-text">
            <p className="video-title">{video.title}</p>
            <p className="video-channel">{video.channel?.channelName}</p>
            <p className="video-meta">
              {formatViews(video.views)} • {timeAgo(video.createdAt)}
            </p>
          </div>
        </div>

      </div>
    </Link>
  )
}

export default VideoCard
