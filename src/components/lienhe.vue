<script setup>
import { ref, defineProps, onMounted, computed } from "vue"

const props = defineProps({
  dulieu: {
    type: Object,
    default: () => ({})
  }
})

const API_URL = 'https://asmfw-3.onrender.com'


// Kiểm tra đăng nhập
const isLoggedIn = computed(() => localStorage.getItem('isLoggedIn') === 'true')
const currentUser = computed(() => JSON.parse(localStorage.getItem('currentUser') || 'null'))

// Lấy dữ liệu từ props
const contactInfo = computed(() => props.dulieu?.contact_info || {})
const personalInfo = computed(() => props.dulieu?.personal_info || {})
const testimonials = computed(() => props.dulieu?.testimonials || [])

// Social links
const socialLinks = computed(() => {
  return {
    facebook: 'https://facebook.com/tuananhdev',
    github: 'https://github.com/tuananhdev',
    linkedin: 'https://linkedin.com/in/tuananhdev',
    twitter: 'https://twitter.com/tuananhdev'
  }
})

// Form data
const formData = ref({
  name: '',
  email: '',
  subject: '',
  message: '',
  type: '',
  newsletter: false
})

const loading = ref(false)
const submitSuccess = ref(false)
const submitError = ref(false)

// Format date
const formatDate = (dateString) => {
  if (!dateString) return ''
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN')
  } catch {
    return dateString
  }
}

// Đăng nhập
const goToLogin = () => {
  if (window.openAuthModal) {
    window.openAuthModal('login')
  } else {
    alert('Vui lòng đăng nhập!')
  }
}

// Submit form - GỬI LÊN API
const handleSubmit = async () => {
  if (!isLoggedIn.value) {
    alert("Vui lòng đăng nhập để gửi tin nhắn!")
    goToLogin()
    return
  }

  if (!formData.value.name || !formData.value.email || !formData.value.subject || !formData.value.message) {
    alert("Vui lòng điền đầy đủ thông tin")
    return
  }

  loading.value = true

  try {
    // Tạo contact
    const newContact = {
      id: Date.now(),
      name: formData.value.name,
      email: formData.value.email,
      subject: formData.value.subject,
      message: formData.value.message,
      type: formData.value.type || 'other',
      date: new Date().toISOString().split('T')[0],
      status: 'new',
      newsletter: formData.value.newsletter,
      user_id: currentUser.value?.id || null
    }

    // Gửi lên JSON Server
    const response = await fetch(`${API_URL}/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newContact)
    })

    if (response.ok) {
      submitSuccess.value = true
      formData.value = {
        name: isLoggedIn.value ? currentUser.value?.fullName || currentUser.value?.full_name || '' : '',
        email: isLoggedIn.value ? currentUser.value?.email || '' : '',
        subject: '',
        message: '',
        type: '',
        newsletter: false
      }
      setTimeout(() => { submitSuccess.value = false }, 3000)
    } else {
      throw new Error('Gửi thất bại')
    }
  } catch (error) {
    submitError.value = true
    alert('Có lỗi xảy ra!')
  } finally {
    loading.value = false
  }
}

// Tự động điền thông tin
onMounted(() => {
  if (isLoggedIn.value && currentUser.value) {
    formData.value.name = currentUser.value.fullName || currentUser.value.full_name || ''
    formData.value.email = currentUser.value.email || ''
  }
})
</script>
<template>
  <div class="lien-he-page">
    <div class="container mt-4">
      <div class="text-center mb-5">
        <h1 class="display-5 fw-bold text-gradient mb-3">Liên Hệ</h1>
        <p class="lead text-muted">Hãy kết nối và cùng nhau tạo ra những điều tuyệt vời</p>
      </div>

      <div class="row g-4">
        <!-- Thông tin liên hệ -->
        <div class="col-lg-4">
          <div class="card shadow-sm border-0 h-100">
            <div class="card-header bg-primary text-white">
              <h3 class="fw-semibold mb-0"><i class="bi bi-telephone me-2"></i>Thông tin liên hệ</h3>
            </div>
            <div class="card-body">
              <div class="contact-info">
                <div class="d-flex align-items-center mb-4">
                  <div class="contact-icon bg-primary rounded-circle d-flex align-items-center justify-content-center me-3">
                    <i class="bi bi-envelope text-white"></i>
                  </div>
                  <div>
                    <h6 class="fw-bold mb-1">Email</h6>
                    <p class="text-muted mb-0">{{ contactInfo.email || personalInfo.email || 'huynhtuananh.dev@gmail.com' }}</p>
                  </div>
                </div>

                <div class="d-flex align-items-center mb-4">
                  <div class="contact-icon bg-success rounded-circle d-flex align-items-center justify-content-center me-3">
                    <i class="bi bi-phone text-white"></i>
                  </div>
                  <div>
                    <h6 class="fw-bold mb-1">Điện thoại</h6>
                    <p class="text-muted mb-0">{{ contactInfo.phone || personalInfo.phone || '+84 972 147 819' }}</p>
                  </div>
                </div>

                <div class="d-flex align-items-center mb-4">
                  <div class="contact-icon bg-warning rounded-circle d-flex align-items-center justify-content-center me-3">
                    <i class="bi bi-geo-alt text-white"></i>
                  </div>
                  <div>
                    <h6 class="fw-bold mb-1">Địa chỉ</h6>
                    <p class="text-muted mb-0">{{ contactInfo.address || personalInfo.location || 'Tuyên Quang, Việt Nam' }}</p>
                  </div>
                </div>

                <div class="d-flex align-items-center">
                  <div class="contact-icon bg-info rounded-circle d-flex align-items-center justify-content-center me-3">
                    <i class="bi bi-clock text-white"></i>
                  </div>
                  <div>
                    <h6 class="fw-bold mb-1">Thời gian làm việc</h6>
                    <p class="text-muted mb-0">{{ contactInfo.working_hours || 'Thứ 2 - Thứ 6: 8:00 - 18:00' }}</p>
                    <small class="text-muted">{{ contactInfo.emergency_contact || 'Có sẵn 24/7 cho dự án urgent' }}</small>
                  </div>
                </div>
              </div>

              <hr class="my-4">

              <div class="social-links">
                <h6 class="fw-bold mb-3 text-center">Kết nối với tôi</h6>
                <div class="d-flex justify-content-center flex-wrap gap-3">
                  <a :href="socialLinks.facebook" target="_blank" class="social-link facebook" title="Facebook">
                    <i class="bi bi-facebook"></i>
                    <span class="ms-2">Facebook</span>
                  </a>
                  <a :href="socialLinks.github" target="_blank" class="social-link github" title="GitHub">
                    <i class="bi bi-github"></i>
                    <span class="ms-2">GitHub</span>
                  </a>
                  <a :href="socialLinks.linkedin" target="_blank" class="social-link linkedin" title="LinkedIn">
                    <i class="bi bi-linkedin"></i>
                    <span class="ms-2">LinkedIn</span>
                  </a>
                  <a :href="socialLinks.twitter" target="_blank" class="social-link twitter" title="Twitter">
                    <i class="bi bi-twitter"></i>
                    <span class="ms-2">Twitter</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Form liên hệ -->
        <div class="col-lg-8">
          <div class="card shadow-sm border-0 h-100">
            <div class="card-header bg-success text-white">
              <h3 class="fw-semibold mb-0"><i class="bi bi-send me-2"></i>Gửi tin nhắn</h3>
            </div>
            <div class="card-body">
              <!-- Thông báo chưa đăng nhập -->
              <div v-if="!isLoggedIn" class="alert alert-warning">
                <i class="bi bi-exclamation-triangle me-2"></i>
                <strong>Vui lòng đăng nhập để gửi tin nhắn!</strong> 
                <p class="mb-0 mt-2">Bạn cần đăng nhập tài khoản để có thể gửi liên hệ.</p>
                <button class="btn btn-primary btn-sm mt-2" @click="goToLogin">
                  <i class="bi bi-box-arrow-in-right me-1"></i>Đăng nhập ngay
                </button>
              </div>
              
              <form v-else class="row g-3" @submit.prevent="handleSubmit">
                <div class="col-md-6">
                  <label class="form-label fw-semibold">Họ tên <span class="text-danger">*</span></label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0">
                      <i class="bi bi-person text-muted"></i>
                    </span>
                    <input type="text" v-model="formData.name" class="form-control border-start-0" 
                           placeholder="Nhập họ tên của bạn" required>
                  </div>
                </div>

                <div class="col-md-6">
                  <label class="form-label fw-semibold">Email <span class="text-danger">*</span></label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0">
                      <i class="bi bi-envelope text-muted"></i>
                    </span>
                    <input type="email" v-model="formData.email" class="form-control border-start-0" 
                           placeholder="Nhập email của bạn" required>
                  </div>
                </div>

                <div class="col-12">
                  <label class="form-label fw-semibold">Tiêu đề <span class="text-danger">*</span></label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0">
                      <i class="bi bi-chat-dots text-muted"></i>
                    </span>
                    <input type="text" v-model="formData.subject" class="form-control border-start-0" 
                           placeholder="Nhập tiêu đề tin nhắn" required>
                  </div>
                </div>

                <div class="col-12">
                  <label class="form-label fw-semibold">Loại yêu cầu</label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0">
                      <i class="bi bi-list-ul text-muted"></i>
                    </span>
                    <select v-model="formData.type" class="form-select border-start-0">
                      <option value="">Chọn loại yêu cầu</option>
                      <option value="freelance">Dự án freelance</option>
                      <option value="consulting">Tư vấn công nghệ</option>
                      <option value="collaboration">Hợp tác</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                </div>

                <div class="col-12">
                  <label class="form-label fw-semibold">Nội dung <span class="text-danger">*</span></label>
                  <div class="input-group">
                    <span class="input-group-text bg-light border-end-0 align-items-start pt-3">
                      <i class="bi bi-pencil text-muted"></i>
                    </span>
                    <textarea v-model="formData.message" class="form-control border-start-0" rows="6" 
                              placeholder="Mô tả chi tiết nội dung bạn muốn trao đổi..." required></textarea>
                  </div>
                  <div class="form-text">
                    Hãy mô tả chi tiết dự án hoặc vấn đề bạn đang gặp phải.
                  </div>
                </div>

                <div class="col-12">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" v-model="formData.newsletter" id="newsletter">
                    <label class="form-check-label text-muted" for="newsletter">
                      Đăng ký nhận bản tin về các bài viết mới và cập nhật công nghệ
                    </label>
                  </div>
                </div>

                <div class="col-12">
                  <button type="submit" class="btn btn-success btn-lg w-100 py-3" :disabled="loading">
                    <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                    <i v-else class="bi bi-send me-2"></i>
                    {{ loading ? 'Đang gửi...' : 'Gửi tin nhắn' }}
                  </button>
                </div>
              </form>
              
              <!-- Success message -->
              <div v-if="submitSuccess" class="alert alert-success mt-4">
                <i class="bi bi-check-circle me-2"></i>
                Tin nhắn đã được gửi thành công! Tôi sẽ liên hệ lại với bạn trong thời gian sớm nhất.
              </div>
              
              <!-- Error message -->
              <div v-if="submitError" class="alert alert-danger mt-4">
                <i class="bi bi-exclamation-circle me-2"></i>
                Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau!
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Map Section -->
      <div class="card shadow-sm border-0 mt-4">
        <div class="card-header bg-warning text-dark">
          <h3 class="fw-semibold mb-0"><i class="bi bi-map me-2"></i>Vị trí của tôi</h3>
        </div>
        <div class="card-body p-0">
          <div class="map-container">
            <div class="map-placeholder bg-light d-flex align-items-center justify-content-center">
              <div class="text-center p-4">
                <i class="bi bi-geo-alt display-1 text-primary mb-3"></i>
                <h5 class="text-dark mb-2">{{ personalInfo.location || 'Tuyên Quang, Việt Nam' }}</h5>
                <p class="text-muted mb-3">Tôi sẵn sàng làm việc remote hoặc onsite tại khu vực này</p>
                <div class="contact-details">
                  <p class="mb-1"><i class="bi bi-clock text-warning me-2"></i> {{ contactInfo.working_hours || 'Thứ 2 - Thứ 6: 8:00 - 18:00' }}</p>
                  <p class="mb-0"><i class="bi bi-telephone text-success me-2"></i> {{ contactInfo.phone || personalInfo.phone }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Testimonials -->
      <div v-if="testimonials.length > 0" class="card shadow-sm border-0 mt-4">
        <div class="card-header bg-info text-white">
          <h3 class="fw-semibold mb-0"><i class="bi bi-chat-left-quote me-2"></i>Phản hồi từ khách hàng</h3>
        </div>
        <div class="card-body">
          <div class="row g-4">
            <div v-for="testimonial in testimonials" :key="testimonial.id" class="col-md-6">
              <div class="testimonial-card p-4 bg-light rounded-4">
                <div class="d-flex align-items-center mb-3">
                  <div class="testimonial-avatar bg-primary rounded-circle d-flex align-items-center justify-content-center me-3">
                    <i class="bi bi-person text-white"></i>
                  </div>
                  <div>
                    <h6 class="fw-bold mb-0">{{ testimonial.name }}</h6>
                    <small class="text-muted">{{ testimonial.position }}</small>
                  </div>
                  <div class="ms-auto">
                    <div class="rating">
                      <i v-for="star in 5" :key="star" 
                         class="bi" 
                         :class="star <= testimonial.rating ? 'bi-star-fill text-warning' : 'bi-star text-muted'"></i>
                    </div>
                  </div>
                </div>
                <p class="text-muted mb-0">{{ testimonial.content }}</p>
                <small class="text-muted d-block mt-2">
                  <i class="bi bi-calendar me-1"></i>{{ formatDate(testimonial.date) }}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
.lien-he-page {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
}

.text-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.contact-icon {
  width: 50px;
  height: 50px;
  flex-shrink: 0;
}

.social-link {
  display: inline-flex;
  align-items: center;
  padding: 10px 20px;
  border-radius: 25px;
  text-decoration: none;
  transition: all 0.3s ease;
  color: white;
  font-weight: 500;
}

.social-link.facebook { background-color: #3b5998; }
.social-link.github { background-color: #333; }
.social-link.linkedin { background-color: #0077b5; }
.social-link.twitter { background-color: #1da1f2; }

.social-link:hover {
  transform: translateY(-3px);
  color: white;
  box-shadow: 0 5px 15px rgba(0,0,0,0.2);
}

.map-container {
  position: relative;
  border-radius: 0 0 0.375rem 0.375rem;
  overflow: hidden;
}

.map-placeholder {
  height: 300px;
}

.input-group-text {
  transition: all 0.3s ease;
}

.form-control:focus + .input-group-text,
.form-control:focus ~ .input-group-text {
  border-color: #667eea;
  background-color: #e9ecef;
}

.btn-success {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  border: none;
  transition: all 0.3s ease;
}

.btn-success:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(79, 172, 254, 0.4);
}

.btn-success:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.card {
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
}

.testimonial-card {
  transition: all 0.3s ease;
}

.testimonial-card:hover {
  transform: translateY(-5px);
  background: #e9ecef !important;
}

.testimonial-avatar {
  width: 50px;
  height: 50px;
}

.rating i {
  font-size: 1.1rem;
}

.alert {
  border: none;
  border-radius: 10px;
}

@media (max-width: 768px) {
  .contact-icon {
    width: 40px;
    height: 40px;
  }
  
  .social-link {
    width: 100%;
    justify-content: center;
    margin-bottom: 10px;
  }
  
  .social-link span {
    display: inline-block;
  }
  
  .map-placeholder {
    height: 200px;
  }
  
  .testimonial-card {
    padding: 1.5rem;
  }
}
</style>
