import React, { useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { showLoginRequired } from './loginRequiredAlert'
import LoadingSpinner from './LoadingSpinner'

// Wrap protected routes with this to enforce login and show SweetAlert2 prompt
const RequireAuth = () => {
  const { user, loading } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      // Show prompt, then navigate accordingly
      (async () => {
        const result = await showLoginRequired()
        if (result.isConfirmed) navigate('/login', { state: { from: location } })
        else if (result.isDenied) navigate('/register', { state: { from: location } })
        else navigate('/')
      })()
    }
  }, [user, loading, location, navigate])

  if (loading) return <div className="container py-5"><LoadingSpinner /></div>
  if (!user) return null // Waiting for navigation after SweetAlert
  return <Outlet />
}

export default RequireAuth
