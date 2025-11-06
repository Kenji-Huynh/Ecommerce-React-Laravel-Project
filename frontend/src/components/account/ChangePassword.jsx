import React, { useState } from 'react'
import { changePassword } from '../../services/api'
import { toast } from 'react-toastify'

const ChangePassword = () => {
  const [current_password, setCurrentPassword] = useState('')
  const [password, setPassword] = useState('')
  const [password_confirmation, setPasswordConfirmation] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const onSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setErrors({})
    try {
      await changePassword(current_password, password, password_confirmation)
      toast.success('Đổi mật khẩu thành công!')
      setCurrentPassword('')
      setPassword('')
      setPasswordConfirmation('')
    } catch (e) {
      const data = e.response?.data
      const message = data?.message || 'Đổi mật khẩu thất bại'
      toast.error(message)
      setErrors(data?.errors || {})
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <h4 className="mb-3">Đổi mật khẩu</h4>
      <form onSubmit={onSubmit} className="card p-3">
        <div className="mb-3">
          <label className="form-label">Mật khẩu hiện tại</label>
          <input type="password" className={`form-control ${errors.current_password ? 'is-invalid' : ''}`} value={current_password} onChange={(e)=>setCurrentPassword(e.target.value)} required />
          {errors.current_password && <div className="invalid-feedback">{errors.current_password[0]}</div>}
        </div>
        <div className="mb-3">
          <label className="form-label">Mật khẩu mới</label>
          <input type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} value={password} onChange={(e)=>setPassword(e.target.value)} required minLength={8} />
        </div>
        <div className="mb-3">
          <label className="form-label">Xác nhận mật khẩu mới</label>
          <input type="password" className="form-control" value={password_confirmation} onChange={(e)=>setPasswordConfirmation(e.target.value)} required minLength={8} />
          {errors.password && <div className="invalid-feedback d-block">{errors.password[0]}</div>}
        </div>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Đang lưu...' : 'Cập nhật mật khẩu'}
        </button>
      </form>
    </div>
  )
}

export default ChangePassword
