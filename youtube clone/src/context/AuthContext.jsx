import { createContext, useContext, useState, useEffect } from 'react'

// Create the context — this is like a global variable for the whole app
const AuthContext = createContext()

export function AuthProvider({ children }) {
  // user = null means not logged in
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  // On app load, check if user was already logged in (saved in localStorage)
  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
  }, [])

  // Called after successful login
  const login = (userData, jwtToken) => {
    setUser(userData)
    setToken(jwtToken)
    // Save to localStorage so user stays logged in after page refresh
    localStorage.setItem('token', jwtToken)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  // Called when user clicks logout
  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook — any component can call useAuth() to get user/token/login/logout
export function useAuth() {
  return useContext(AuthContext)
}
