import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import VideoPlayer from './pages/VideoPlayer'
import Channel from './pages/Channel'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { useState } from 'react'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="app">
          <Header onMenuClick={() => setSidebarOpen(prev => !prev)} />
          <div style={{ display: 'flex' }}>
            <Sidebar isOpen={sidebarOpen} />
            <main className="main-content">
              <Routes>
                <Route path="/"          element={<Home />} />
                <Route path="/login"     element={<Login />} />
                <Route path="/register"  element={<Register />} />
                <Route path="/video/:id" element={<VideoPlayer />} />
                <Route path="/channel"   element={<Channel />} />
              </Routes>
            </main>
          </div>
        </div>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
