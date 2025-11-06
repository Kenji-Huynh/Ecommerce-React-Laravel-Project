import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { toast } from 'react-toastify'

const Register = () => {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
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

    // Kiểm tra mật khẩu khớp
    if (formData.password !== formData.password_confirmation) {
      toast.error('Mật khẩu xác nhận không khớp!')
      return
    }

    setIsLoading(true)

    const result = await register(
      formData.name,
      formData.email,
      formData.password,
      formData.password_confirmation
    )
    
    if (result.success) {
      toast.success('Đăng ký thành công!')
      navigate('/')
    } else {
      // Hiển thị lỗi validation
      if (result.errors) {
        Object.values(result.errors).forEach(errorArray => {
          errorArray.forEach(error => toast.error(error))
        })
      } else {
        toast.error(result.message)
      }
    }
    
    setIsLoading(false)
  }

  return (
    <div className="register-page">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className="card shadow-sm">
              <div className="card-body p-5">
                <h2 className="text-center mb-4">Đăng Ký</h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Họ và tên</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Nhập họ và tên"
                    />
                  </div>

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
                      minLength="8"
                      placeholder="Nhập mật khẩu (tối thiểu 8 ký tự)"
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password_confirmation" className="form-label">Xác nhận mật khẩu</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password_confirmation"
                      name="password_confirmation"
                      value={formData.password_confirmation}
                      onChange={handleChange}
                      required
                      minLength="8"
                      placeholder="Nhập lại mật khẩu"
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
                        Đang đăng ký...
                      </>
                    ) : (
                      'Đăng Ký'
                    )}
                  </button>

                  <div className="text-center">
                    <p className="mb-0">
                      Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>

            <div className="alert alert-success mt-3" role="alert">
              <i className="fas fa-check-circle me-2"></i>
              Đăng ký tài khoản để trải nghiệm đầy đủ tính năng mua sắm!
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
