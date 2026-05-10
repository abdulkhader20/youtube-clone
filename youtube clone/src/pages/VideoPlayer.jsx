import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

function VideoPlayer() {
  const { id } = useParams()
  const { user, token } = useAuth()

  const [video, setVideo]         = useState(null)
  const [comments, setComments]   = useState([])
  const [newComment, setNewComment] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText]   = useState('')
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [commentError, setCommentError] = useState('')
  const [commentSuccess, setCommentSuccess] = useState('')

  // Track like/dislike counts AND whether current user has liked/disliked
  const [likes, setLikes]         = useState(0)
  const [dislikes, setDislikes]   = useState(0)
  const [userLiked, setUserLiked] = useState(false)
  const [userDisliked, setUserDisliked] = useState(false)

  useEffect(() => {
    fetchVideo()
    fetchComments()
  }, [id])

  const fetchVideo = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`http://localhost:5000/api/videos/${id}`)
      const v = res.data
      setVideo(v)
      setLikes(v.likes.length)
      setDislikes(v.dislikes.length)
      // Check if current user already liked/disliked
      if (user) {
        setUserLiked(v.likes.includes(user._id))
        setUserDisliked(v.dislikes.includes(user._id))
      }
    } catch (err) {
      setError('Video not found')
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/comments/${id}`)
      setComments(res.data)
    } catch (err) {
      console.error('Failed to fetch comments')
    }
  }

  // ── LIKE (toggle) ──
  const handleLike = async () => {
    if (!user) return alert('Please sign in to like videos')
    try {
      const res = await axios.put(
        `http://localhost:5000/api/videos/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setLikes(res.data.likes)
      setDislikes(res.data.dislikes)
      setUserLiked(prev => !prev)
      if (userDisliked) setUserDisliked(false)
    } catch (err) {
      console.error('Like failed')
    }
  }

  // ── DISLIKE (toggle) ──
  const handleDislike = async () => {
    if (!user) return alert('Please sign in to dislike videos')
    try {
      const res = await axios.put(
        `http://localhost:5000/api/videos/${id}/dislike`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setLikes(res.data.likes)
      setDislikes(res.data.dislikes)
      setUserDisliked(prev => !prev)
      if (userLiked) setUserLiked(false)
    } catch (err) {
      console.error('Dislike failed')
    }
  }

  // ── ADD COMMENT ──
  const handleAddComment = async (e) => {
    e.preventDefault()
    setCommentError('')
    if (!user) return alert('Please sign in to comment')
    if (!newComment.trim()) return setCommentError('Comment cannot be empty')

    try {
      const res = await axios.post(
        `http://localhost:5000/api/comments/${id}`,
        { text: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setComments(prev => [res.data, ...prev])
      setNewComment('')
    } catch (err) {
      setCommentError('Failed to add comment. Please try again.')
    }
  }

  // ── EDIT COMMENT ──
  const handleEditStart = (comment) => {
    setEditingId(comment._id)
    setEditText(comment.text)
  }

  const handleEditSave = async (commentId) => {
    if (!editText.trim()) return
    try {
      const res = await axios.put(
        `http://localhost:5000/api/comments/${commentId}`,
        { text: editText },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setComments(prev => prev.map(c => c._id === commentId ? res.data : c))
      setEditingId(null)
    } catch (err) {
      console.error('Failed to edit comment')
    }
  }

  // ── DELETE COMMENT ──
  const handleDelete = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return
    try {
      await axios.delete(
        `http://localhost:5000/api/comments/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setComments(prev => prev.filter(c => c._id !== commentId))
    } catch (err) {
      console.error('Failed to delete comment')
    }
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '100px' }}>
      <div className="spinner" />
    </div>
  )

  if (error) return (
    <div className="empty-state">
      <div className="empty-icon">😕</div>
      <p className="empty-title">{error}</p>
      <Link to="/" style={{ color: 'var(--blue)', fontSize: '14px' }}>← Back to Home</Link>
    </div>
  )

  return (
    <div className="player-layout page-enter">

      {/* ── LEFT: Video + Info + Comments ── */}
      <div style={{ flex: 1, minWidth: 0 }}>

        {/* Video player */}
        <div style={{
          width: '100%', backgroundColor: '#000',
          borderRadius: 'var(--radius)', overflow: 'hidden',
          marginBottom: '16px', boxShadow: 'var(--shadow)'
        }}>
          <video
            src={video.videoUrl}
            controls
            style={{ width: '100%', maxHeight: '500px', display: 'block' }}
          />
        </div>

        {/* Title */}
        <h1 style={{
          color: 'var(--text-primary)', fontSize: '20px',
          fontWeight: '600', marginBottom: '12px', lineHeight: '1.4'
        }}>
          {video.title}
        </h1>

        {/* Channel + Like/Dislike row */}
        <div style={{
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap',
          gap: '12px', marginBottom: '16px'
        }}>
          {/* Channel info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #ff0000, #ff6b6b)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: '700', color: '#fff', fontSize: '16px',
              boxShadow: '0 2px 8px rgba(255,0,0,0.3)'
            }}>
              {video.channel?.channelName?.charAt(0) || 'C'}
            </div>
            <div>
              <p style={{ color: 'var(--text-primary)', fontWeight: '600', fontSize: '15px' }}>
                {video.channel?.channelName}
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                {video.channel?.subscribers?.toLocaleString() || 0} subscribers
              </p>
            </div>
            {/* Subscribe button */}
            <button className="subscribe-btn">Subscribe</button>
          </div>

          {/* Like / Dislike */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div style={{
              display: 'flex', borderRadius: '20px',
              overflow: 'hidden', border: '1px solid var(--border)'
            }}>
              {/* Like */}
              <button
                onClick={handleLike}
                className={`like-btn ${userLiked ? 'liked' : ''}`}
                style={{ borderRadius: '20px 0 0 20px', borderRight: '1px solid var(--border)' }}
                title={user ? 'Like' : 'Sign in to like'}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/>
                </svg>
                <span style={{ fontWeight: '600' }}>{likes}</span>
              </button>

              {/* Dislike */}
              <button
                onClick={handleDislike}
                className={`dislike-btn ${userDisliked ? 'disliked' : ''}`}
                style={{ borderRadius: '0 20px 20px 0' }}
                title={user ? 'Dislike' : 'Sign in to dislike'}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"/>
                </svg>
                <span style={{ fontWeight: '600' }}>{dislikes}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={{
          backgroundColor: 'var(--bg-hover)', borderRadius: 'var(--radius)',
          padding: '16px', marginBottom: '28px'
        }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '13px', marginBottom: '8px' }}>
            <strong style={{ color: 'var(--text-primary)' }}>
              {video.views?.toLocaleString()} views
            </strong>
            {' '}• {new Date(video.createdAt).toDateString()}
          </p>
          <p style={{ color: 'var(--text-primary)', fontSize: '14px', lineHeight: '1.7', whiteSpace: 'pre-wrap' }}>
            {video.description || 'No description provided.'}
          </p>
        </div>

        {/* ── COMMENTS ── */}
        <div>
          <h3 style={{ color: 'var(--text-primary)', fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>
            {comments.length} Comment{comments.length !== 1 ? 's' : ''}
          </h3>

          {/* Add comment */}
          {user ? (
            <form onSubmit={handleAddComment} style={{ display: 'flex', gap: '12px', marginBottom: '28px' }}>
              <div className="user-avatar" style={{ flexShrink: 0 }}>
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  value={newComment}
                  onChange={e => { setNewComment(e.target.value); setCommentError('') }}
                  placeholder="Add a comment..."
                  style={{
                    width: '100%', backgroundColor: 'transparent',
                    border: 'none', borderBottom: `2px solid ${commentError ? '#ff4444' : 'var(--border)'}`,
                    color: 'var(--text-primary)', fontSize: '14px',
                    padding: '8px 0', outline: 'none', marginBottom: '4px',
                    transition: 'border-color 0.2s'
                  }}
                  onFocus={e => e.target.style.borderBottomColor = 'var(--blue)'}
                  onBlur={e => e.target.style.borderBottomColor = commentError ? '#ff4444' : 'var(--border)'}
                />
                {/* Validation error */}
                {commentError && (
                  <p style={{ color: '#ff6b6b', fontSize: '12px', marginBottom: '6px' }}>
                    {commentError}
                  </p>
                )}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '8px' }}>
                  <button
                    type="button"
                    onClick={() => { setNewComment(''); setCommentError('') }}
                    style={{
                      padding: '6px 16px', background: 'transparent',
                      border: 'none', color: 'var(--text-secondary)',
                      cursor: 'pointer', borderRadius: '20px', fontSize: '13px',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newComment.trim()}
                    style={{
                      padding: '6px 16px',
                      backgroundColor: newComment.trim() ? 'var(--blue)' : 'var(--bg-hover)',
                      border: 'none', color: newComment.trim() ? '#fff' : 'var(--text-muted)',
                      cursor: newComment.trim() ? 'pointer' : 'not-allowed',
                      borderRadius: '20px', fontWeight: '600', fontSize: '13px',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    Comment
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '12px 16px', backgroundColor: 'var(--bg-hover)',
              borderRadius: 'var(--radius-sm)', marginBottom: '20px'
            }}>
              <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                <Link to="/login" style={{ color: 'var(--blue)', fontWeight: '600' }}>Sign in</Link>
                {' '}to add a comment
              </span>
            </div>
          )}

          {/* Comments list */}
          {comments.length === 0 && (
            <p style={{ color: 'var(--text-muted)', fontSize: '14px', textAlign: 'center', padding: '20px 0' }}>
              No comments yet. Be the first to comment!
            </p>
          )}

          {comments.map(comment => (
            <div key={comment._id} style={{
              display: 'flex', gap: '12px', marginBottom: '20px',
              animation: 'fadeInUp 0.3s ease'
            }}>
              {/* Avatar */}
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                backgroundColor: 'var(--bg-hover)', flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: '700', color: 'var(--text-primary)', fontSize: '14px',
                border: '1px solid var(--border)'
              }}>
                {comment.user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>

              <div style={{ flex: 1 }}>
                {/* Username + time */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: '600' }}>
                    @{comment.user?.username}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                    {new Date(comment.createdAt).toDateString()}
                  </span>
                </div>

                {/* Comment text or edit input */}
                {editingId === comment._id ? (
                  <div>
                    <input
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      style={{
                        width: '100%', backgroundColor: 'transparent',
                        border: 'none', borderBottom: '2px solid var(--blue)',
                        color: 'var(--text-primary)', fontSize: '14px',
                        padding: '4px 0', outline: 'none'
                      }}
                      autoFocus
                    />
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                      <button
                        onClick={() => setEditingId(null)}
                        style={{
                          padding: '4px 14px', background: 'transparent',
                          border: 'none', color: 'var(--text-secondary)',
                          cursor: 'pointer', borderRadius: '20px', fontSize: '13px'
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleEditSave(comment._id)}
                        style={{
                          padding: '4px 14px', backgroundColor: 'var(--blue)',
                          border: 'none', color: '#fff', cursor: 'pointer',
                          borderRadius: '20px', fontWeight: '600', fontSize: '13px'
                        }}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <p style={{ color: 'var(--text-primary)', fontSize: '14px', lineHeight: '1.6' }}>
                    {comment.text}
                  </p>
                )}

                {/* Edit/Delete — only for comment owner */}
                {user && user._id === comment.user?._id && editingId !== comment._id && (
                  <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
                    <button
                      onClick={() => handleEditStart(comment)}
                      style={{
                        background: 'none', border: 'none',
                        color: 'var(--text-muted)', cursor: 'pointer',
                        fontSize: '12px', padding: '4px 8px', borderRadius: '4px',
                        transition: 'color 0.2s, background-color 0.2s'
                      }}
                      onMouseEnter={e => { e.target.style.color = 'var(--text-primary)'; e.target.style.backgroundColor = 'var(--bg-hover)' }}
                      onMouseLeave={e => { e.target.style.color = 'var(--text-muted)'; e.target.style.backgroundColor = 'transparent' }}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(comment._id)}
                      style={{
                        background: 'none', border: 'none',
                        color: 'var(--text-muted)', cursor: 'pointer',
                        fontSize: '12px', padding: '4px 8px', borderRadius: '4px',
                        transition: 'color 0.2s, background-color 0.2s'
                      }}
                      onMouseEnter={e => { e.target.style.color = '#ff6b6b'; e.target.style.backgroundColor = 'rgba(255,68,68,0.1)' }}
                      onMouseLeave={e => { e.target.style.color = 'var(--text-muted)'; e.target.style.backgroundColor = 'transparent' }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default VideoPlayer
