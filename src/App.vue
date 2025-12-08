<script setup>
import { ref, onMounted, watch } from 'vue'
import trangchu from './components/trangchu.vue'
import thongtincanhan from './components/thongtincanhan.vue'
import kynang from './components/kynang.vue'
import danhsachbaiviet from './components/danhsachbaiviet.vue'
import lienhe from './components/lienhe.vue'
import AuthModal from './components/AuthModal.vue'
import AdminLayout from './components/AdminLayout.vue'

// State
const currentPage = ref('trangchu')
const navbarOpen = ref(false)
const data = ref(null)
const loading = ref(true)
const error = ref(null)

// State cho AuthModal
const showAuthModal = ref(false)
const authMode = ref('login')
const isLoggedIn = ref(false)
const user = ref(null)

// Router logic
const goToPage = (page) => {
  console.log('Điều hướng đến:', page)
  
  // Nếu vào trang admin nhưng chưa đăng nhập
  if (page === 'admin' && !isLoggedIn.value) {
    alert('Vui lòng đăng nhập để vào trang Admin')
    openAuthModal('login')
    return
  }
  
  currentPage.value = page
  navbarOpen.value = false
  window.location.hash = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const toggleNavbar = () => {
  navbarOpen.value = !navbarOpen.value
}

// Logic cho AuthModal
const openAuthModal = (mode = 'login') => {
  authMode.value = mode
  showAuthModal.value = true
}

const closeAuthModal = () => {
  showAuthModal.value = false
}

// HÀM MỚI: Xử lý khi có user mới đăng ký
const handleNewUserRegistered = (newUser) => {
  console.log('📥 Nhận user mới từ AuthModal:', newUser)
  
  // Thêm user mới vào data.value.users
  if (data.value && data.value.users) {
    // Kiểm tra xem user đã tồn tại chưa (theo email)
    const userExists = data.value.users.some(u => u.email === newUser.email)
    
    if (!userExists) {
      // Thêm user mới vào mảng users
      data.value.users.push(newUser)
      console.log('✅ Đã thêm user mới vào data.value.users:', newUser)
      
      // Cập nhật localStorage registeredUsers để đồng bộ
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
      registeredUsers.push(newUser)
      localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers))
    } else {
      console.log('⚠️ User đã tồn tại trong data:', newUser.email)
    }
  }
}

const handleAuthSuccess = (userData) => {
  user.value = userData
  isLoggedIn.value = true
  closeAuthModal()
  
  // Cập nhật localStorage
  localStorage.setItem('currentUser', JSON.stringify(userData))
  localStorage.setItem('isLoggedIn', 'true')
  
  // Cập nhật vào data.users nếu có
  if (data.value?.users) {
    // Kiểm tra xem user đã tồn tại chưa
    const existingUserIndex = data.value.users.findIndex(u => u.email === userData.email)
    if (existingUserIndex === -1) {
      // Thêm user mới vào danh sách
      data.value.users.push(userData)
    }
  }
  
  // Hiển thị thông báo
  if (userData.role === 'admin') {
    alert(`✅ Chào mừng Admin ${userData.fullName || userData.full_name}!`)
    // Nếu đang không ở trang admin, hỏi người dùng có muốn vào không
    if (currentPage.value !== 'admin') {
      const goToAdmin = confirm('Bạn có muốn vào trang Admin ngay bây giờ?')
      if (goToAdmin) {
        goToPage('admin')
      }
    }
  } else {
    alert(`✅ Chào mừng ${userData.fullName || userData.full_name}!`)
  }
}

const logout = () => {
  // Nếu đang ở trang admin, chuyển về trang chủ
  if (currentPage.value === 'admin') {
    goToPage('trangchu')
  }
  
  localStorage.removeItem('currentUser')
  localStorage.removeItem('isLoggedIn')
  
  isLoggedIn.value = false
  user.value = null
  
  alert('Đăng xuất thành công!')
}

const checkLoginStatus = () => {
  const storedUser = localStorage.getItem('currentUser')
  const status = localStorage.getItem('isLoggedIn')
  
  if (status === 'true' && storedUser) {
    try {
      user.value = JSON.parse(storedUser)
      isLoggedIn.value = true
      console.log('User đã đăng nhập:', user.value)
      
      // Kiểm tra user trong data.users để lấy thông tin đầy đủ
      if (data.value?.users) {
        const fullUserInfo = data.value.users.find(u => u.email === user.value.email)
        if (fullUserInfo) {
          user.value = { ...user.value, ...fullUserInfo }
          localStorage.setItem('currentUser', JSON.stringify(user.value))
        }
      }
    } catch (e) {
      console.error("Lỗi khi đọc thông tin người dùng", e)
      localStorage.removeItem('currentUser')
      localStorage.removeItem('isLoggedIn')
    }
  }
}

// Tải dữ liệu từ JSON
const loadData = async () => {
  try {
    loading.value = true
    error.value = null
    
    // Sử dụng fetch để tải data.json
    const response = await fetch('/data.json')
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    data.value = await response.json()
    console.log('Dữ liệu đã tải:', data.value)
    
    // Khởi tạo registeredUsers trong localStorage nếu chưa có
    if (!localStorage.getItem('registeredUsers')) {
      // Thêm các user mặc định từ data.json
      const defaultUsers = data.value.users || []
      localStorage.setItem('registeredUsers', JSON.stringify(defaultUsers))
    }
    
  } catch (err) {
    console.error('Lỗi tải data.json:', err)
    error.value = err.message || 'Không thể tải dữ liệu từ server'
    
    // Fallback data
    data.value = {
      personal_info: {
        full_name: "Huỳnh Tuấn Anh",
        title: "Full-Stack Developer",
        email: "huynhtuananh.dev@gmail.com",
        phone: "+84 972 147 819",
        location: "Tuyên Quang, Việt Nam",
        about_me: "Full-Stack Web Developer với đam mê công nghệ và sáng tạo."
      },
      users: [
        {
          id: 1,
          full_name: "Huỳnh Tuấn Anh",
          fullName: "Huỳnh Tuấn Anh",
          email: "admin@example.com",
          password: "admin123",
          role: "admin",
          joined_date: "2024-01-01",
          avatar: "/img/1.png",
          status: "active",
          bio: "Quản trị viên hệ thống và Full-stack Developer",
          phone: "0972147819",
          location: "Tuyên Quang"
        },
        {
          id: 2,
          full_name: "Nguyễn Văn A",
          fullName: "Nguyễn Văn A",
          email: "user1@example.com",
          password: "user123",
          role: "user",
          joined_date: "2024-02-15",
          avatar: null,
          status: "active",
          bio: "Frontend Developer",
          phone: "0987654321",
          location: "Hà Nội"
        }
      ],
      site_config: {
        current_year: new Date().getFullYear(),
        version: "1.0.0",
        last_updated: new Date().toISOString().split('T')[0]
      }
    }
    
    // Khởi tạo registeredUsers
    if (!localStorage.getItem('registeredUsers')) {
      localStorage.setItem('registeredUsers', JSON.stringify(data.value.users))
    }
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  // Tải dữ liệu
  await loadData()
  
  // Kiểm tra trạng thái đăng nhập
  checkLoginStatus()
  
  // Xử lý hash URL
  const handleHashChange = () => {
    const hash = window.location.hash.substring(1)
    const validPages = ['trangchu', 'thongtincanhan', 'kynang', 'danhsachbaiviet', 'lienhe', 'admin']
    
    if (hash && validPages.includes(hash)) {
      currentPage.value = hash
    } else if (!hash) {
      currentPage.value = 'trangchu'
      window.location.hash = 'trangchu'
    }
  }
  
  handleHashChange()
  window.addEventListener('hashchange', handleHashChange)
  
  // Thêm Bootstrap JS nếu chưa có
  if (!window.bootstrap) {
    const bootstrapScript = document.createElement('script')
    bootstrapScript.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js'
    document.head.appendChild(bootstrapScript)
  }
})

// Watch for data changes
watch(() => data.value?.users, (users) => {
  if (users && isLoggedIn.value && user.value) {
    const updatedUser = users.find(u => u.email === user.value.email)
    if (updatedUser) {
      user.value = { ...user.value, ...updatedUser }
      localStorage.setItem('currentUser', JSON.stringify(user.value))
    }
  }
})
</script>

<template>
  <div id="app">
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div class="container">
        <a class="navbar-brand fw-bold" href="#" @click.prevent="goToPage('trangchu')">
          <i class="bi bi-code-slash me-2"></i>Portfolio
        </a>
        
        <button class="navbar-toggler" type="button" @click="toggleNavbar">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div class="collapse navbar-collapse" :class="{ show: navbarOpen }">
          <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link" :class="{ active: currentPage === 'trangchu' }" 
                 @click.prevent="goToPage('trangchu')">
                <i class="bi bi-house me-1"></i>Trang Chủ
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{ active: currentPage === 'thongtincanhan' }" 
                 @click.prevent="goToPage('thongtincanhan')">
                <i class="bi bi-person me-1"></i>Thông Tin
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{ active: currentPage === 'kynang' }" 
                 @click.prevent="goToPage('kynang')">
                <i class="bi bi-tools me-1"></i>Kỹ Năng
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{ active: currentPage === 'danhsachbaiviet' }" 
                 @click.prevent="goToPage('danhsachbaiviet')">
                <i class="bi bi-journal-text me-1"></i>Bài Viết
              </a>
            </li>
            <li class="nav-item">
              <a class="nav-link" :class="{ active: currentPage === 'lienhe' }" 
                 @click.prevent="goToPage('lienhe')">
                <i class="bi bi-envelope me-1"></i>Liên Hệ
              </a>
            </li>
            
            <!-- Thêm nút Admin nếu user là admin -->
            <li class="nav-item" v-if="isLoggedIn && user?.role === 'admin'">
              <a class="nav-link text-warning" :class="{ active: currentPage === 'admin' }" 
                 @click.prevent="goToPage('admin')">
                <i class="bi bi-gear me-1"></i>Admin
              </a>
            </li>
          </ul>
          
          <!-- Auth Section -->
          <div class="d-flex align-items-center ms-lg-3">
            <div v-if="isLoggedIn" class="dropdown">
              <a class="nav-link nav-profile dropdown-toggle d-flex align-items-center" 
                 href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                <div v-if="user?.avatar" class="avatar-sm me-2">
                  <img :src="user.avatar" :alt="user.fullName || user.full_name" class="rounded-circle" width="30" height="30">
                </div>
                <div v-else class="avatar-sm bg-primary rounded-circle d-flex align-items-center justify-content-center me-2">
                  <i class="bi bi-person text-white"></i>
                </div>
                <span>{{ user?.fullName?.split(' ').pop() || user?.full_name?.split(' ').pop() || 'User' }}</span>
              </a>
              <ul class="dropdown-menu dropdown-menu-dark">
                <li>
                  <h6 class="dropdown-header">Xin chào, {{ user?.fullName || user?.full_name || 'User' }}</h6>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <a class="dropdown-item" href="#" @click.prevent="goToPage('thongtincanhan')">
                    <i class="bi bi-person me-2"></i>Thông tin cá nhân
                  </a>
                </li>
                <li v-if="user?.role === 'admin'">
                  <a class="dropdown-item text-warning" href="#" @click.prevent="goToPage('admin')">
                    <i class="bi bi-gear me-2"></i>Trang Admin
                  </a>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li>
                  <a class="dropdown-item text-danger" href="#" @click.prevent="logout">
                    <i class="bi bi-box-arrow-right me-2"></i>Đăng xuất
                  </a>
                </li>
              </ul>
            </div>
            
            <div v-else class="d-flex gap-2">
              <button class="btn btn-outline-light btn-sm" @click="openAuthModal('login')">
                <i class="bi bi-box-arrow-in-right me-1"></i>Đăng nhập
              </button>
              <button class="btn btn-primary btn-sm" @click="openAuthModal('register')">
                <i class="bi bi-person-plus me-1"></i>Đăng ký
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <div class="main-content-area container mt-5 pt-4">
      <!-- Loading state -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3">Đang tải dữ liệu...</p>
      </div>
      
      <!-- Error state -->
      <div v-else-if="error" class="text-center py-5">
        <i class="bi bi-exclamation-triangle display-1 text-danger mb-3"></i>
        <h3 class="mb-3">Không thể tải dữ liệu</h3>
        <p class="text-muted mb-4">{{ error }}</p>
        <button class="btn btn-primary" @click="loadData">
          <i class="bi bi-arrow-clockwise me-2"></i>Thử lại
        </button>
      </div>
      
      <!-- Các trang chính -->
      <div v-else-if="data">
        <!-- Hiển thị AdminLayout nếu vào trang admin và là admin -->
        <AdminLayout 
          v-if="currentPage === 'admin' && isLoggedIn && user?.role === 'admin'" 
          :data="data"
          @logout="logout" />
        
        <!-- Hiển thị trang báo lỗi nếu vào admin nhưng không phải admin -->
        <div v-else-if="currentPage === 'admin'">
          <div class="text-center py-5">
            <i class="bi bi-shield-lock display-1 text-danger mb-3"></i>
            <h3 class="mb-3">Không có quyền truy cập</h3>
            <p class="text-muted mb-4">Bạn cần đăng nhập với tài khoản admin để truy cập trang này</p>
            <button class="btn btn-primary" @click="goToPage('trangchu')">
              <i class="bi bi-house me-2"></i>Về trang chủ
            </button>
          </div>
        </div>
        
        <!-- Các trang khác -->
        <trangchu v-else-if="currentPage === 'trangchu'" :dulieu="data" @navigate="goToPage" />
        <thongtincanhan v-else-if="currentPage === 'thongtincanhan'" :dulieu="data" />
        <kynang v-else-if="currentPage === 'kynang'" :dulieu="data" />
        <danhsachbaiviet v-else-if="currentPage === 'danhsachbaiviet'" :dulieu="data" @navigate="goToPage" />
        <lienhe v-else-if="currentPage === 'lienhe'" :dulieu="data" />
        
        <!-- Trang không tồn tại -->
        <div v-else class="text-center py-5">
          <h3 class="mb-3">Trang không tồn tại</h3>
          <button class="btn btn-primary" @click="goToPage('trangchu')">
            <i class="bi bi-house me-2"></i>Về trang chủ
          </button>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="bg-dark text-white mt-5 py-4">
      <div class="container">
        <div class="row">
          <div class="col-md-6 mb-3 mb-md-0">
            <h5 class="mb-3">Portfolio - {{ data?.personal_info?.full_name || 'Huỳnh Tuấn Anh' }}</h5>
            <p class="text-muted mb-0">
              {{ data?.personal_info?.about_me?.substring(0, 100) || 'Full-Stack Web Developer với đam mê công nghệ' }}...
            </p>
          </div>
          <div class="col-md-3 mb-3 mb-md-0">
            <h5 class="mb-3">Liên kết nhanh</h5>
            <ul class="list-unstyled">
              <li class="mb-2">
                <a href="#" @click.prevent="goToPage('trangchu')" class="text-white-50 text-decoration-none">
                  <i class="bi bi-chevron-right me-1"></i>Trang chủ
                </a>
              </li>
              <li class="mb-2">
                <a href="#" @click.prevent="goToPage('kynang')" class="text-white-50 text-decoration-none">
                  <i class="bi bi-chevron-right me-1"></i>Kỹ năng
                </a>
              </li>
              <li class="mb-2">
                <a href="#" @click.prevent="goToPage('danhsachbaiviet')" class="text-white-50 text-decoration-none">
                  <i class="bi bi-chevron-right me-1"></i>Bài viết
                </a>
              </li>
              <li>
                <a href="#" @click.prevent="goToPage('lienhe')" class="text-white-50 text-decoration-none">
                  <i class="bi bi-chevron-right me-1"></i>Liên hệ
                </a>
              </li>
            </ul>
          </div>
          <div class="col-md-3">
            <h5 class="mb-3">Kết nối</h5>
            <div class="social-links d-flex gap-3">
              <a v-if="data?.contact_info?.social_links?.github" 
                 :href="data.contact_info.social_links.github" 
                 target="_blank" 
                 class="text-white-50">
                <i class="bi bi-github fs-5"></i>
              </a>
              <a v-if="data?.contact_info?.social_links?.linkedin" 
                 :href="data.contact_info.social_links.linkedin" 
                 target="_blank" 
                 class="text-white-50">
                <i class="bi bi-linkedin fs-5"></i>
              </a>
              <a v-if="data?.contact_info?.social_links?.facebook" 
                 :href="data.contact_info.social_links.facebook" 
                 target="_blank" 
                 class="text-white-50">
                <i class="bi bi-facebook fs-5"></i>
              </a>
              <a v-if="data?.personal_info?.email" 
                 :href="`mailto:${data.personal_info.email}`" 
                 class="text-white-50">
                <i class="bi bi-envelope fs-5"></i>
              </a>
            </div>
          </div>
        </div>
        <hr class="my-4 bg-white-50">
        <div class="row">
          <div class="col-md-6">
            <p class="mb-0 text-white-50 small">
              &copy; {{ data?.site_config?.current_year || new Date().getFullYear() }} 
              {{ data?.personal_info?.full_name || 'Huỳnh Tuấn Anh' }}. All rights reserved.
            </p>
          </div>
          <div class="col-md-6 text-md-end">
            <p class="mb-0 text-white-50 small">
              Version {{ data?.site_config?.version || '1.0.0' }} | 
              Last updated: {{ data?.site_config?.last_updated || '2024-10-15' }}
            </p>
          </div>
        </div>
      </div>
    </footer>
    
    <!-- Auth Modal - THÊM @new-user-registered -->
    <AuthModal 
      :show="showAuthModal" 
      :initial-mode="authMode"
      @close="closeAuthModal"
      @login-success="handleAuthSuccess"
      @register-success="handleAuthSuccess"
      @new-user-registered="handleNewUserRegistered" />
  </div>
</template>


<style>
body {
  padding-top: 76px;
  background-color: #f8f9fa;
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.nav-link {
  cursor: pointer;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.8);
  padding: 0.5rem 1rem;
  margin: 0 0.2rem;
  border-radius: 5px;
  transition: all 0.3s ease;
  text-align: left;
}

.nav-link:hover {
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.active {
  color: white;
  background-color: rgba(102, 126, 234, 0.8);
}

.navbar-brand {
  font-size: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.social-links a {
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.social-links a:hover {
  color: #667eea !important;
  transform: translateY(-2px);
}

footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

/* Style cho nút đăng nhập và profile */
.nav-link-auth {
  padding: 0.375rem 0.75rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.nav-link-auth:hover {
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
}

.nav-profile {
  color: white !important;
  font-weight: 500;
  padding: 0.5rem 0.7rem;
  border-radius: 5px;
}

.nav-profile:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.dropdown-menu-dark .dropdown-header {
  color: rgba(255, 255, 255, 0.75);
}

.avatar-sm {
  width: 30px;
  height: 30px;
}

.avatar-sm img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Responsive */
@media (max-width: 991.98px) {
  body {
    padding-top: 66px;
  }
  
  .navbar-collapse {
    background-color: #343a40;
    padding: 1rem;
    border-radius: 0 0 10px 10px;
    margin-top: 0.5rem;
  }
  
  .nav-link {
    margin: 0.2rem 0;
  }
  
  .nav-link-auth {
    margin-top: 0.5rem;
    width: 100%;
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.5);
  }
  
  .nav-profile {
    margin: 0.2rem 0;
    width: 100%;
    text-align: left;
  }
  
  .nav-profile img {
    margin-right: 0.5rem !important;
  }
}

@media (max-width: 768px) {
  body {
    padding-top: 56px;
  }
}

/* CSS cho simple login card */
.card {
  border: none;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
}

.card-title {
  color: #333;
  font-weight: 600;
}

.form-control:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.alert-danger {
  background-color: #f8d7da;
  border-color: #f5c2c7;
  color: #842029;
  border-radius: 8px;
  padding: 10px 15px;
  font-size: 0.9rem;
}

/* Animation cho loading */
.spinner-border {
  animation: spinner-border 0.75s linear infinite;
}

@keyframes spinner-border {
  to { transform: rotate(360deg); }
}

/* Main content area */
.main-content-area {
  min-height: calc(100vh - 250px);
}

/* Transition cho page change */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #667eea;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #764ba2;
}

/* Text gradient */
.text-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Badge styles */
.badge {
  font-weight: 500;
  padding: 0.35em 0.65em;
}

/* Card hover effects */
.shadow-hover {
  transition: all 0.3s ease;
}

.shadow-hover:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
}

/* Button styles */
.btn {
  border-radius: 8px;
  font-weight: 500;
}

.btn-outline-primary {
  border-color: #667eea;
  color: #667eea;
}

.btn-outline-primary:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  color: white;
}
</style>