<script setup>
import { ref, reactive, watch, defineProps, defineEmits } from "vue"

const API_URL = 'https://asmfw-3.onrender.com'

const props = defineProps(['show', 'initialMode'])
const emit = defineEmits(['close', 'login-success', 'register-success'])

const isLogin = ref(props.initialMode === 'login')
const showPassword = ref(false)

const formData = reactive({
  fullName: "",
  email: "",
  password: "",
  confirmPassword: ""
})

const closeModal = () => {
  emit('close')
}

const toggleMode = (loginMode) => {
  isLogin.value = loginMode
  formData.fullName = ""
  formData.email = ""
  formData.password = ""
  formData.confirmPassword = ""
}

const handleSubmit = async () => {
  if (!formData.email || !formData.password) {
    alert("Vui lòng nhập email và mật khẩu")
    return
  }

  if (!isLogin.value) {
    if (!formData.fullName) {
      alert("Vui lòng nhập họ tên")
      return
    }
    
    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu không khớp")
      return
    }
  }

  try {
    if (isLogin.value) {
      // Đăng nhập
      const response = await fetch(`${API_URL}/users?email=${formData.email}`)
      const users = await response.json()
      
      const user = users.find(u => u.password === formData.password)
      
      if (!user) {
        alert("Sai email hoặc mật khẩu!")
        return
      }

      sessionStorage.setItem('currentUser', JSON.stringify(user))
      alert(`Đăng nhập thành công!`)
      emit('login-success', user)
      closeModal()
      
    } else {
      // Đăng ký
      const checkResponse = await fetch(`${API_URL}/users?email=${formData.email}`)
      const existingUsers = await checkResponse.json()
      
      if (existingUsers.length > 0) {
        alert("Email đã được đăng ký!")
        return
      }

      const newUser = {
        id: Date.now(),
        full_name: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: "user",
        joined_date: new Date().toISOString().split('T')[0],
        status: "active"
      }

      const postResponse = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      })

      if (postResponse.ok) {
        sessionStorage.setItem('currentUser', JSON.stringify(newUser))
        alert(`Đăng ký thành công!`)
        emit('register-success', newUser)
        closeModal()
      }
    }
  } catch {
    alert("Có lỗi xảy ra")
  }
}

watch(() => props.initialMode, (newMode) => {
  isLogin.value = newMode === 'login'
})
</script>

<template>
  <div class="auth-modal" v-if="show" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">{{ isLogin ? 'Đăng nhập' : 'Đăng ký' }}</h5>
        <button type="button" class="btn-close" @click="closeModal"></button>
      </div>
      
      <div class="modal-body">
        <!-- Tabs chuyển đổi -->
        <div class="auth-tabs mb-4">
          <div class="nav nav-pills nav-fill">
            <button class="nav-link" :class="{ active: isLogin }" @click="toggleMode(true)">
              <i class="bi bi-box-arrow-in-right me-2"></i>Đăng nhập
            </button>
            <button class="nav-link" :class="{ active: !isLogin }" @click="toggleMode(false)">
              <i class="bi bi-person-plus me-2"></i>Đăng ký
            </button>
          </div>
        </div>

        <!-- Form đăng nhập/đăng ký -->
        <form @submit.prevent="handleSubmit">
          <div v-if="!isLogin" class="mb-3">
            <label class="form-label">Họ tên *</label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="bi bi-person"></i>
              </span>
              <input type="text" v-model="formData.fullName" class="form-control" placeholder="Nhập họ tên" required>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Email *</label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="bi bi-envelope"></i>
              </span>
              <input type="email" v-model="formData.email" class="form-control" placeholder="email@example.com" required>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label">Mật khẩu *</label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="bi bi-lock"></i>
              </span>
              <input :type="showPassword ? 'text' : 'password'" v-model="formData.password" class="form-control" placeholder="Nhập mật khẩu" required>
              <button class="btn btn-outline-secondary" type="button" @click="togglePasswordVisibility">
                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
          </div>

          <div v-if="!isLogin" class="mb-3">
            <label class="form-label">Xác nhận mật khẩu *</label>
            <div class="input-group">
              <span class="input-group-text">
                <i class="bi bi-lock-fill"></i>
              </span>
              <input type="password" v-model="formData.confirmPassword" class="form-control" placeholder="Xác nhận mật khẩu" required>
            </div>
            <div v-if="formData.password !== formData.confirmPassword && formData.confirmPassword" class="text-danger small mt-1">
              Mật khẩu không khớp
            </div>
          </div>

          <div v-if="isLogin" class="mb-3 form-check">
            <input type="checkbox" v-model="rememberMe" class="form-check-input" id="remember">
            <label class="form-check-label" for="remember">Ghi nhớ đăng nhập</label>
            <a href="#" class="float-end text-decoration-none small">Quên mật khẩu?</a>
          </div>

          <div class="d-grid gap-2 mb-3">
            <button type="submit" class="btn btn-primary btn-lg" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              <i v-else :class="isLogin ? 'bi bi-box-arrow-in-right me-2' : 'bi bi-person-plus me-2'"></i>
              {{ isLogin ? 'Đăng nhập' : 'Đăng ký' }}
            </button>
          </div>

          <!-- Demo Credentials -->
          <div v-if="isLogin" class="alert alert-info mt-3">
            <small>
              <i class="bi bi-info-circle me-1"></i>
              <strong>Đăng nhập demo:</strong><br>
              • Admin: <strong>admin@example.com</strong> / mật khẩu: <strong>admin123</strong><br>
              • Người dùng: <strong>user1@example.com</strong> / mật khẩu: <strong>user123</strong>
            </small>
          </div>

          <div class="text-center">
            <p class="text-muted mb-2">Hoặc đăng nhập với</p>
            <div class="d-flex justify-content-center gap-3">
              <button type="button" class="btn btn-outline-primary">
                <i class="bi bi-google"></i>
              </button>
              <button type="button" class="btn btn-outline-dark">
                <i class="bi bi-github"></i>
              </button>
              <button type="button" class="btn btn-outline-info">
                <i class="bi bi-facebook"></i>
              </button>
            </div>
          </div>

          <div class="text-center mt-3">
            <p class="mb-0">
              {{ isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?' }}
              <a href="#" @click.prevent="toggleMode(!isLogin)" class="text-decoration-none fw-semibold">
                {{ isLogin ? 'Đăng ký ngay' : 'Đăng nhập' }}
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Giữ nguyên style cũ */
.auth-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1060;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 15px;
  max-width: 450px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  padding: 1.5rem;
  border-bottom: 1px solid #dee2e6;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 15px 15px 0 0;
}

.modal-header .btn-close {
  filter: invert(1);
}

.auth-tabs .nav-link {
  border-radius: 10px;
  padding: 10px;
  transition: all 0.3s ease;
}

.auth-tabs .nav-link.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
}

.auth-tabs .nav-link:not(.active):hover {
  background-color: #f8f9fa;
}

.modal-body {
  padding: 2rem;
}

.input-group-text {
  background-color: #f8f9fa;
  border-right: none;
}

.form-control {
  border-left: none;
}

.form-control:focus {
  box-shadow: none;
  border-color: #667eea;
}

.form-control:focus + .input-group-text {
  border-color: #667eea;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 10px;
  font-weight: 600;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

.btn-outline-secondary {
  border-left: none;
}

.btn-outline-secondary:hover {
  background-color: #f8f9fa;
}

.btn-outline-primary, .btn-outline-dark, .btn-outline-info {
  border-radius: 50%;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-outline-primary:hover {
  background-color: #667eea;
  color: white;
}

.btn-outline-dark:hover {
  background-color: #333;
  color: white;
}

.btn-outline-info:hover {
  background-color: #17a2b8;
  color: white;
}

.alert-info {
  background-color: #e7f3ff;
  border-color: #b3d7ff;
  font-size: 0.9rem;
}

.alert-info strong {
  color: #0056b3;
}

@media (max-width: 576px) {
  .modal-content {
    max-height: 95vh;
  }
  
  .modal-body {
    padding: 1.5rem;
  }
}
</style>
