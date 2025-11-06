import React from 'react'

const LoadingSpinner = ({ message = 'Đang tải...' }) => {
  return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      {message && <p className="mt-3 text-muted">{message}</p>}
    </div>
  )
}

export default LoadingSpinner
