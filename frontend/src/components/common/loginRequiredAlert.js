import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

export function showLoginRequired() {
  return MySwal.fire({
    title: 'Yêu cầu đăng nhập',
    text: 'Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng và xem giỏ hàng. Bạn vẫn có thể xem chi tiết sản phẩm khi chưa đăng nhập.',
    icon: 'info',
    showCancelButton: true,
    showDenyButton: true,
    confirmButtonText: 'Đăng nhập',
    denyButtonText: 'Đăng ký',
    cancelButtonText: 'Để sau',
    reverseButtons: true,
    focusConfirm: true,
    customClass: {
      confirmButton: 'btn btn-primary',
      denyButton: 'btn btn-outline-primary',
      cancelButton: 'btn btn-secondary',
    },
    buttonsStyling: false,
  })
}
