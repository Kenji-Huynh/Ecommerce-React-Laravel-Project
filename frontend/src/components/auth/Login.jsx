import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    const result = await login(formData.email, formData.password)
    
    if (result.success) {
      toast.success('Đăng nhập thành công!')
      navigate('/')
    } else {
      // Hiển thị lỗi cụ thể từ backend
      if (result.errors?.email) {
        toast.error(result.errors.email[0])
      } else {
        toast.error(result.message)
      }
    }
    
    setIsLoading(false)
  }

  return (
    <div className="login-page">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-sm">
              <div className="card-body p-5">
                <h2 className="text-center mb-4">Đăng Nhập</h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="Nhập email của bạn"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Mật khẩu</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Nhập mật khẩu"
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary w-100 mb-3"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Đang đăng nhập...
                      </>
                    ) : (
                      'Đăng Nhập'
                    )}
                  </button>

                  <div className="text-center">
                    <p className="mb-0">
                      Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>

            <div className="alert alert-info mt-3" role="alert">
              <i className="fas fa-info-circle me-2"></i>
              Tài khoản admin không thể đăng nhập vào trang này. Vui lòng sử dụng trang admin panel.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
