import React, { useState } from 'react'
import { api } from '../../services/api'

const TestAuth = () => {
  const [result, setResult] = useState('')

  const testRegister = async () => {
    setResult('Testing register...')
    try {
      const response = await api.post('/register', {
        name: 'Test User ' + Date.now(),
        email: 'test' + Date.now() + '@example.com',
        password: '12345678',
        password_confirmation: '12345678'
      })
      setResult(JSON.stringify(response.data, null, 2))
      console.log('Register success:', response.data)
    } catch (error) {
      setResult(JSON.stringify({
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      }, null, 2))
      console.error('Register error:', error)
    }
  }

  const testLogin = async () => {
    setResult('Testing login...')
    try {
      const response = await api.post('/login', {
        email: 'user@test.com',
        password: '12345678'
      })
      setResult(JSON.stringify(response.data, null, 2))
      console.log('Login success:', response.data)
    } catch (error) {
      setResult(JSON.stringify({
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      }, null, 2))
      console.error('Login error:', error)
    }
  }

  return (
    <div className="container py-5">
      <h1>Test Authentication</h1>
      <div className="btn-group mb-3">
        <button className="btn btn-primary" onClick={testRegister}>
          Test Register
        </button>
        <button className="btn btn-success" onClick={testLogin}>
          Test Login
        </button>
      </div>
      <pre className="bg-light p-3 rounded" style={{ maxHeight: '500px', overflow: 'auto' }}>
        {result || 'Click a button to test...'}
      </pre>
    </div>
  )
}

export default TestAuth
