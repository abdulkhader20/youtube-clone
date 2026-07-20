import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import API_URL from '../config/api'

function Channel() {
  const { user, token } = useAuth()
  const navigate = useNavigate()

  const [channel, setChannel] = useState(null)         // user's channel data
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [editingVideo, setEditingVideo] = useState(null) // video being edited

  // Create channel form state
  const [channelForm, setChannelForm] = useState({ channelName: '', handle: '', description: '' })

  // Upload video form state
  const [videoForm, setVideoForm] = useState({
    title: '', description: '', videoUrl: '', thumbnailUrl: '', category: 'Web Development'
  })
  const [videoFile, setVideoFile] = useState(null)
  const [thumbFile, setThumbFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState('')
  const [videoFormError, setVideoFormError] = useState('')

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const categories = [
    'Web Development', 'JavaScript', 'Data Structures',
    'Server', 'Music', 'Information Technology',
    'Gaming', 'Movies', 'News', 'Sports', 'Live'
  ]

  // Redirect to login if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchMyChannel()
  }, [user])
  const fetchMyChannel = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_URL}/api/channels/my`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setChannel(res.data)
    } catch (err) {
      // 404 means user has no channel yet — that's fine
      if (err.response?.status === 404) {
        setChannel(null)
      }
    } finally {
      setLoading(false)
    }
  }

  // ── CREATE CHANNEL ──
  const handleCreateChannel = async (e) => {
    e.preventDefault()
    setError('')
    if (!channelForm.channelName || !channelForm.handle) {
      return setError('Channel name and handle are required')
    }
    try {
      const res = await axios.post(
        `${API_URL}/api/channels`,
        channelForm,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setChannel(res.data)
      setShowCreateForm(false)
      setSuccess('Channel created successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create channel')
    }
  }

  // ── UPLOAD VIDEO ──
  const handleUploadVideo = async (e) => {
    e.preventDefault()
    setError('')

    if (!videoForm.title) return setError('Title is required')
    if (!videoFile && !videoForm.videoUrl) return setError('Please select a video file or enter a URL')

    try {
      setUploadProgress('Uploading...')
      let finalVideoUrl = videoForm.videoUrl
      let finalThumbUrl = videoForm.thumbnailUrl

      // Upload video file if selected
      if (videoFile) {
        setUploadProgress('Uploading video file...')
        const formData = new FormData()
        formData.append('video', videoFile)
        const res = await axios.post(`${API_URL}/api/upload/video`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
        finalVideoUrl = res.data.url
      }

      // Upload thumbnail file if selected
      if (thumbFile) {
        setUploadProgress('Uploading thumbnail...')
        const formData = new FormData()
        formData.append('thumbnail', thumbFile)
        const res = await axios.post(`${API_URL}/api/upload/thumbnail`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        })
        finalThumbUrl = res.data.url
      }

      setUploadProgress('Saving video...')
      const res = await axios.post(
        `${API_URL}/api/videos`,
        { ...videoForm, videoUrl: finalVideoUrl, thumbnailUrl: finalThumbUrl, channelId: channel._id },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setChannel(prev => ({ ...prev, videos: [res.data, ...prev.videos] }))
      setShowUploadForm(false)
      setVideoForm({ title: '', description: '', videoUrl: '', thumbnailUrl: '', category: 'Web Development' })
      setVideoFile(null)
      setThumbFile(null)
      setUploadProgress('')
      setSuccess('Video uploaded successfully!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload video')
      setUploadProgress('')
    }
  }

  // ── UPDATE VIDEO ──
  const handleUpdateVideo = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await axios.put(
        `${API_URL}/api/videos/${editingVideo._id}`,
        {
          title: editingVideo.title,
          description: editingVideo.description,
          thumbnailUrl: editingVideo.thumbnailUrl,
          category: editingVideo.category
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      // Update video in list
      setChannel(prev => ({
        ...prev,
        videos: prev.videos.map(v => v._id === res.data._id ? res.data : v)
      }))
      setEditingVideo(null)
      setSuccess('Video updated!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update video')
    }
  }

  // ── DELETE VIDEO ──
  const handleDeleteVideo = async (videoId) => {
    if (!window.confirm('Are you sure you want to delete this video?')) return
    try {
      await axios.delete(
        `${API_URL}/api/videos/${videoId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setChannel(prev => ({
        ...prev,
        videos: prev.videos.filter(v => v._id !== videoId)
      }))
      setSuccess('Video deleted!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError('Failed to delete video')
    }
  }

  if (!user) return null

  if (loading) return (
    <div style={{ color: '#fff', textAlign: 'center', marginTop: '100px' }}>Loading...</div>
  )

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>

      {/* Success / Error messages */}
      {success && (
        <div style={{
          backgroundColor: '#1a3d1a', border: '1px solid #4caf50',
          color: '#4caf50', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px'
        }}>
          {success}
        </div>
      )}
      {error && (
        <div style={{
          backgroundColor: '#3d1a1a', border: '1px solid #ff4444',
          color: '#ff4444', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px'
        }}>
          {error}
        </div>
      )}

      {/* ── NO CHANNEL YET ── */}
      {!channel && !showCreateForm && (
        <div style={{ textAlign: 'center', marginTop: '80px' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>📺</div>
          <h2 style={{ color: '#fff', marginBottom: '12px' }}>You don't have a channel yet</h2>
          <p style={{ color: '#aaa', marginBottom: '24px' }}>
            Create a channel to start uploading videos
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            style={{
              padding: '12px 28px', backgroundColor: '#ff0000',
              border: 'none', borderRadius: '8px',
              color: '#fff', fontSize: '16px', fontWeight: '600', cursor: 'pointer'
            }}
          >
            Create Channel
          </button>
        </div>
      )}

      {/* ── CREATE CHANNEL FORM ── */}
      {showCreateForm && (
        <div style={{
          backgroundColor: '#1f1f1f', borderRadius: '12px',
          padding: '32px', border: '1px solid #303030', maxWidth: '500px', margin: '40px auto'
        }}>
          <h2 style={{ color: '#fff', marginBottom: '24px', textAlign: 'center' }}>
            How you'll appear
          </h2>
          <form onSubmit={handleCreateChannel}>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Channel Name</label>
              <input
                type="text"
                placeholder="e.g. Code with John"
                value={channelForm.channelName}
                onChange={e => setChannelForm(p => ({ ...p, channelName: e.target.value }))}
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Handle</label>
              <input
                type="text"
                placeholder="e.g. @CodeWithJohn"
                value={channelForm.handle}
                onChange={e => setChannelForm(p => ({ ...p, handle: e.target.value }))}
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={labelStyle}>Description (optional)</label>
              <textarea
                placeholder="Tell viewers about your channel"
                value={channelForm.description}
                onChange={e => setChannelForm(p => ({ ...p, description: e.target.value }))}
                rows={3}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                style={cancelBtnStyle}
              >
                Cancel
              </button>
              <button type="submit" style={primaryBtnStyle}>
                Create Channel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── CHANNEL EXISTS ── */}
      {channel && (
        <div>
          {/* Channel banner */}
          <div style={{
            height: '160px',
            backgroundColor: '#272727',
            borderRadius: '12px',
            marginBottom: '24px',
            backgroundImage: channel.channelBanner ? `url(${channel.channelBanner})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {!channel.channelBanner && (
              <span style={{ color: '#555', fontSize: '14px' }}>Channel Banner</span>
            )}
          </div>

          {/* Channel info row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              backgroundColor: '#ff0000',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '32px', fontWeight: 'bold', color: '#fff', flexShrink: 0
            }}>
              {channel.channelName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 style={{ color: '#fff', fontSize: '24px', fontWeight: '700' }}>
                {channel.channelName}
              </h1>
              <p style={{ color: '#aaa', fontSize: '14px' }}>
                {channel.handle} • {channel.subscribers} subscribers • {channel.videos?.length || 0} videos
              </p>
              {channel.description && (
                <p style={{ color: '#aaa', fontSize: '13px', marginTop: '4px' }}>
                  {channel.description}
                </p>
              )}
            </div>
          </div>

          {/* Upload Video button */}
          <div style={{ marginBottom: '24px' }}>
            <button
              onClick={() => { setShowUploadForm(true); setError('') }}
              style={primaryBtnStyle}
            >
              + Upload Video
            </button>
          </div>

          {/* ── UPLOAD VIDEO FORM ── */}
          {showUploadForm && (
            <div style={{
              backgroundColor: '#1f1f1f', borderRadius: '12px',
              padding: '28px', border: '1px solid #303030', marginBottom: '28px'
            }}>
              <h3 style={{ color: '#fff', marginBottom: '20px' }}>Upload New Video</h3>
              <form onSubmit={handleUploadVideo}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>Title *</label>
                    <input
                      type="text"
                      placeholder="Video title"
                      value={videoForm.title}
                      onChange={e => setVideoForm(p => ({ ...p, title: e.target.value }))}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Category</label>
                    <select
                      value={videoForm.category}
                      onChange={e => setVideoForm(p => ({ ...p, category: e.target.value }))}
                      style={{ ...inputStyle, cursor: 'pointer' }}
                    >
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  {/* Video file picker */}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Video File * (pick a file from your computer)</label>
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/mkv,video/*"
                      onChange={e => {
                        setVideoFile(e.target.files[0])
                        setVideoForm(p => ({ ...p, videoUrl: '' })) // clear URL if file chosen
                      }}
                      style={{ ...inputStyle, padding: '8px' }}
                    />
                    <p style={{ color: '#555', fontSize: '12px', marginTop: '4px' }}>
                      — or paste a URL instead —
                    </p>
                    <input
                      type="url"
                      placeholder="https://example.com/video.mp4"
                      value={videoForm.videoUrl}
                      onChange={e => {
                        setVideoForm(p => ({ ...p, videoUrl: e.target.value }))
                        setVideoFile(null) // clear file if URL typed
                      }}
                      style={{ ...inputStyle, marginTop: '6px' }}
                    />
                  </div>

                  {/* Thumbnail file picker */}
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Thumbnail (pick an image or paste URL)</label>
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/*"
                      onChange={e => {
                        setThumbFile(e.target.files[0])
                        setVideoForm(p => ({ ...p, thumbnailUrl: '' }))
                      }}
                      style={{ ...inputStyle, padding: '8px' }}
                    />
                    <input
                      type="url"
                      placeholder="https://example.com/thumbnail.jpg"
                      value={videoForm.thumbnailUrl}
                      onChange={e => {
                        setVideoForm(p => ({ ...p, thumbnailUrl: e.target.value }))
                        setThumbFile(null)
                      }}
                      style={{ ...inputStyle, marginTop: '6px' }}
                    />
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Description</label>
                    <textarea
                      placeholder="Describe your video"
                      value={videoForm.description}
                      onChange={e => setVideoForm(p => ({ ...p, description: e.target.value }))}
                      rows={3}
                      style={{ ...inputStyle, resize: 'vertical' }}
                    />
                  </div>
                </div>

                {/* Upload progress */}
                {uploadProgress && (
                  <p style={{ color: '#3ea6ff', fontSize: '14px', marginTop: '12px' }}>
                    ⏳ {uploadProgress}
                  </p>
                )}

                <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '16px' }}>
                  <button type="button" onClick={() => { setShowUploadForm(false); setUploadProgress('') }} style={cancelBtnStyle}>
                    Cancel
                  </button>
                  <button type="submit" style={primaryBtnStyle} disabled={!!uploadProgress}>
                    {uploadProgress ? 'Uploading...' : 'Upload'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── VIDEO LIST ── */}
          <h2 style={{ color: '#fff', fontSize: '18px', marginBottom: '16px' }}>
            Your Videos ({channel.videos?.length || 0})
          </h2>

          {channel.videos?.length === 0 && (
            <p style={{ color: '#aaa', fontSize: '14px' }}>
              No videos yet. Click "Upload Video" to add your first video.
            </p>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {channel.videos?.map(video => (
              <div key={video._id}>
                {/* ── EDIT VIDEO FORM ── */}
                {editingVideo?._id === video._id ? (
                  <div style={{
                    backgroundColor: '#1f1f1f', borderRadius: '12px',
                    padding: '20px', border: '1px solid #3ea6ff'
                  }}>
                    <h4 style={{ color: '#fff', marginBottom: '16px' }}>Edit Video</h4>
                    <form onSubmit={handleUpdateVideo}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={labelStyle}>Title</label>
                          <input
                            value={editingVideo.title}
                            onChange={e => setEditingVideo(p => ({ ...p, title: e.target.value }))}
                            style={inputStyle}
                          />
                        </div>
                        <div>
                          <label style={labelStyle}>Category</label>
                          <select
                            value={editingVideo.category}
                            onChange={e => setEditingVideo(p => ({ ...p, category: e.target.value }))}
                            style={{ ...inputStyle, cursor: 'pointer' }}
                          >
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <label style={labelStyle}>Thumbnail URL</label>
                          <input
                            value={editingVideo.thumbnailUrl || ''}
                            onChange={e => setEditingVideo(p => ({ ...p, thumbnailUrl: e.target.value }))}
                            style={inputStyle}
                          />
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <label style={labelStyle}>Description</label>
                          <textarea
                            value={editingVideo.description || ''}
                            onChange={e => setEditingVideo(p => ({ ...p, description: e.target.value }))}
                            rows={2}
                            style={{ ...inputStyle, resize: 'vertical' }}
                          />
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                        <button type="button" onClick={() => setEditingVideo(null)} style={cancelBtnStyle}>
                          Cancel
                        </button>
                        <button type="submit" style={primaryBtnStyle}>
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                ) : (
                  /* ── VIDEO ROW ── */
                  <div style={{
                    display: 'flex', gap: '16px', alignItems: 'center',
                    backgroundColor: '#1f1f1f', borderRadius: '12px',
                    padding: '12px', border: '1px solid #303030'
                  }}>
                    {/* Thumbnail */}
                    <div style={{
                      width: '160px', height: '90px', flexShrink: 0,
                      backgroundColor: '#272727', borderRadius: '8px', overflow: 'hidden'
                    }}>
                      {video.thumbnailUrl ? (
                        <img
                          src={video.thumbnailUrl}
                          alt={video.title}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={e => { e.target.src = 'https://placehold.co/160x90/272727/fff?text=No+Thumb' }}
                        />
                      ) : (
                        <div style={{
                          width: '100%', height: '100%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#555', fontSize: '12px'
                        }}>
                          No Thumbnail
                        </div>
                      )}
                    </div>

                    {/* Video info */}
                    <div style={{ flex: 1 }}>
                      <Link
                        to={`/video/${video._id}`}
                        style={{ color: '#fff', textDecoration: 'none', fontWeight: '600', fontSize: '15px' }}
                      >
                        {video.title}
                      </Link>
                      <p style={{ color: '#aaa', fontSize: '13px', marginTop: '4px' }}>
                        {video.category} • {video.views?.toLocaleString() || 0} views
                      </p>
                      <p style={{ color: '#555', fontSize: '12px', marginTop: '2px' }}>
                        {new Date(video.createdAt).toDateString()}
                      </p>
                    </div>

                    {/* Edit / Delete buttons */}
                    <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                      <button
                        onClick={() => setEditingVideo(video)}
                        style={{
                          padding: '6px 14px', backgroundColor: '#272727',
                          border: '1px solid #555', borderRadius: '6px',
                          color: '#fff', cursor: 'pointer', fontSize: '13px'
                        }}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteVideo(video._id)}
                        style={{
                          padding: '6px 14px', backgroundColor: '#3d1a1a',
                          border: '1px solid #ff4444', borderRadius: '6px',
                          color: '#ff4444', cursor: 'pointer', fontSize: '13px'
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Shared styles
const inputStyle = {
  width: '100%', padding: '10px 14px',
  backgroundColor: '#121212', border: '1px solid #303030',
  borderRadius: '8px', color: '#fff', fontSize: '14px',
  outline: 'none', boxSizing: 'border-box'
}
const labelStyle = {
  color: '#aaa', fontSize: '13px', display: 'block', marginBottom: '6px'
}
const primaryBtnStyle = {
  padding: '10px 20px', backgroundColor: '#ff0000',
  border: 'none', borderRadius: '8px',
  color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
}
const cancelBtnStyle = {
  padding: '10px 20px', backgroundColor: 'transparent',
  border: '1px solid #555', borderRadius: '8px',
  color: '#aaa', fontSize: '14px', cursor: 'pointer'
}

export default Channel
