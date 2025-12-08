<template>
  <div class="trang-chu">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <div class="row align-items-center min-vh-100">
          <div class="col-lg-6">
            <div class="hero-content">
              <h6 class="text-uppercase text-primary mb-3 fw-semibold">{{ personalInfo.subtitle || 'Chuyên Gia Phát Triển Web' }}</h6>
              <h1 class="display-3 fw-bold text-dark mb-4">
                Xin chào, tôi là 
                <span class="text-gradient">{{ personalInfo.full_name?.split(' ').slice(-2).join(' ') || 'Tuấn Anh' }}</span>
              </h1>
              <p class="lead text-muted mb-5">
                {{ personalInfo.about_me || 'Lập trình viên Full-stack với 3+ năm kinh nghiệm phát triển ứng dụng web hiện đại.' }}
              </p>
              <div class="hero-actions d-flex gap-3 flex-wrap">
                <button class="btn btn-primary btn-lg px-4 py-3" @click="handleViewProjects">
                  <i class="bi bi-folder me-2"></i>Xem Dự Án
                </button>
                <button class="btn btn-outline-dark btn-lg px-4 py-3" @click="handleContactNow">
                  <i class="bi bi-telephone me-2"></i>Liên Hệ Ngay
                </button>
              </div>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="hero-visual">
              <div class="floating-card card-1">
                <i class="bi bi-vue text-success"></i>
                <span>Vue.js Expert</span>
              </div>
              <div class="floating-card card-2">
                <i class="bi bi-palette text-primary"></i>
                <span>UI/UX Design</span>
              </div>
              <div class="floating-card card-3">
                <i class="bi bi-phone text-info"></i>
                <span>Responsive</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Thống Kê -->
    <section class="thong-ke-section py-5 bg-light">
      <div class="container">
        <div class="row g-4 text-center">
          <div class="col-md-3 col-6">
            <div class="thong-ke-item">
              <h2 class="display-4 fw-bold text-primary mb-2">{{ statistics.projects || '25+' }}</h2>
              <p class="text-muted mb-0">Dự Án</p>
            </div>
          </div>
          <div class="col-md-3 col-6">
            <div class="thong-ke-item">
              <h2 class="display-4 fw-bold text-success mb-2">{{ statistics.experience || '3+' }}</h2>
              <p class="text-muted mb-0">Năm KN</p>
            </div>
          </div>
          <div class="col-md-3 col-6">
            <div class="thong-ke-item">
              <h2 class="display-4 fw-bold text-warning mb-2">{{ statistics.clients || '15+' }}</h2>
              <p class="text-muted mb-0">Khách Hàng</p>
            </div>
          </div>
          <div class="col-md-3 col-6">
            <div class="thong-ke-item">
              <h2 class="display-4 fw-bold text-info mb-2">{{ statistics.completion_rate || '99%' }}</h2>
              <p class="text-muted mb-0">Hoàn Thành</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Giới Thiệu -->
    <section class="gioi-thieu-section py-5">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <div class="section-header mb-5">
              <h6 class="text-uppercase text-primary mb-3">Về Tôi</h6>
              <h2 class="display-5 fw-bold text-dark mb-3">Chuyên Gia Web</h2>
              <p class="text-muted">
                {{ personalInfo.about_me || `Tôi là ${personalInfo.full_name || 'Huỳnh Tuấn Anh'}, lập trình viên full-stack với đam mê công nghệ.` }}
              </p>
            </div>
            
            <div class="thong-tin-ca-nhan">
              <div class="row g-3">
                <div class="col-sm-6">
                  <div class="info-item d-flex align-items-center">
                    <i class="bi bi-calendar text-primary me-3"></i>
                    <div>
                      <strong>Ngày sinh:</strong>
                      <p class="mb-0">{{ personalInfo.birthday || '15/06/2006' }}</p>
                    </div>
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="info-item d-flex align-items-center">
                    <i class="bi bi-geo-alt text-success me-3"></i>
                    <div>
                      <strong>Địa chỉ:</strong>
                      <p class="mb-0">{{ personalInfo.location || 'Tuyên Quang' }}</p>
                    </div>
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="info-item d-flex align-items-center">
                    <i class="bi bi-envelope text-warning me-3"></i>
                    <div>
                      <strong>Email:</strong>
                      <p class="mb-0">{{ personalInfo.email || 'tuananh@email.com' }}</p>
                    </div>
                  </div>
                </div>
                <div class="col-sm-6">
                  <div class="info-item d-flex align-items-center">
                    <i class="bi bi-telephone text-info me-3"></i>
                    <div>
                      <strong>Điện thoại:</strong>
                      <p class="mb-0">{{ personalInfo.phone || '+84 123 456 789' }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="col-lg-6">
            <div class="ky-nang-progress">
              <h4 class="fw-bold mb-4">Kỹ Năng Nổi Bật</h4>
              
              <div v-for="category in skills.slice(0, 1)" :key="category.category">
                <div v-for="(skill, index) in category.skills.slice(0, 4)" :key="skill.name" class="progress-item mb-4">
                  <div class="d-flex justify-content-between mb-2">
                    <span class="fw-semibold">{{ skill.name }}</span>
                    <span class="text-primary">{{ skill.level }}%</span>
                  </div>
                  <div class="progress">
                    <div class="progress-bar bg-primary" :style="`width: ${skill.level}%`"></div>
                  </div>
                  <small class="text-muted d-block mt-1">{{ skill.detail }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Dịch Vụ -->
    <section class="dich-vu-section py-5 bg-light">
      <div class="container">
        <div class="section-header text-center mb-5">
          <h6 class="text-uppercase text-primary mb-3">Dịch Vụ</h6>
          <h2 class="display-5 fw-bold text-dark mb-3">Dịch Vụ Cung Cấp</h2>
        </div>
        
        <div class="row g-4">
          <div v-for="service in services" :key="service.id" class="col-lg-3 col-md-6">
            <div class="dich-vu-card card border-0 shadow-lg h-100">
              <div class="card-body text-center p-4">
                <div class="dich-vu-icon mb-4">
                  <i :class="`bi bi-${service.icon} display-4 text-${service.color}`"></i>
                </div>
                <h5 class="fw-bold mb-3">{{ service.title }}</h5>
                <p class="text-muted mb-4">{{ service.description }}</p>
                <ul class="list-unstyled text-start">
                  <li v-for="feature in service.features.slice(0, 3)" :key="feature" class="mb-2">
                    <i class="bi bi-check-circle text-success me-2"></i>
                    {{ feature }}
                  </li>
                </ul>
                <button class="btn btn-outline-primary btn-sm mt-3" @click="handleContactNow">
                  <i class="bi bi-info-circle me-1"></i>Chi tiết
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Dự Án -->
    <section class="du-an-section py-5">
      <div class="container">
        <div class="section-header text-center mb-5">
          <h6 class="text-uppercase text-primary mb-3">Dự Án</h6>
          <h2 class="display-5 fw-bold text-dark mb-3">Dự Án Tiêu Biểu</h2>
        </div>
        
        <div class="row g-4">
          <div v-for="(project, index) in projects.slice(0, 4)" :key="project.id" class="col-lg-3 col-md-6">
            <div class="du-an-card card border-0 shadow-lg h-100">
              <div class="du-an-image position-relative overflow-hidden">
                <div v-if="project.image" class="image-container">
                  <img :src="project.image" :alt="project.name" class="project-img">
                </div>
                <div v-else :class="`image-placeholder bg-gradient-${getBadgeColor(project.id)}`"></div>
                <div class="du-an-overlay">
                  <div class="du-an-actions">
                    <button class="btn btn-light btn-sm me-2" @click="handleViewProjectDetails(project)">
                      <i class="bi bi-eye"></i>
                    </button>
                    <a v-if="project.github_link" :href="project.github_link" target="_blank" class="btn btn-light btn-sm">
                      <i class="bi bi-github"></i>
                    </a>
                  </div>
                </div>
              </div>
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-3">
                  <h5 class="card-title fw-bold">{{ project.name }}</h5>
                  <span class="badge bg-primary">{{ project.badge_year || '2024' }}</span>
                </div>
                <p class="card-text text-muted mb-3">{{ project.description }}</p>
                <div class="cong-nghe d-flex flex-wrap gap-2">
                  <span v-for="tech in project.technologies.slice(0, 2)" :key="tech" 
                        class="cong-nghe-tag bg-light text-dark rounded-pill px-3 py-1 small">
                    {{ tech }}
                  </span>
                  <span v-if="project.technologies.length > 2" class="cong-nghe-tag bg-light text-dark rounded-pill px-3 py-1 small">
                    +{{ project.technologies.length - 2 }}
                  </span>
                </div>
                <button class="btn btn-outline-primary btn-sm mt-3 w-100" @click="handleViewProjectDetails(project)">
                  <i class="bi bi-info-circle me-1"></i>Xem chi tiết
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="text-center mt-5">
          <button class="btn btn-primary btn-lg" @click="handleViewProjects">
            <i class="bi bi-folder me-2"></i>Xem tất cả dự án
          </button>
        </div>
      </div>
    </section>

    <!-- Học Vấn -->
    <section class="hoc-van-section py-5 bg-light">
      <div class="container">
        <div class="section-header text-center mb-5">
          <h6 class="text-uppercase text-primary mb-3">Học Vấn</h6>
          <h2 class="display-5 fw-bold text-dark mb-3">Quá Trình Học Tập</h2>
        </div>

        <div class="row g-4">
          <div v-for="edu in education" :key="edu.id" class="col-lg-6">
            <div class="hoc-van-card p-4 shadow-sm rounded-4 bg-white">
              <div class="d-flex align-items-start mb-3">
                <div class="edu-icon bg-primary rounded-circle p-3 me-3">
                  <i class="bi bi-mortarboard text-white fs-4"></i>
                </div>
                <div>
                  <h5 class="fw-bold mb-1">{{ edu.institution }}</h5>
                  <span class="text-primary small fw-semibold">{{ edu.period }}</span>
                </div>
              </div>
              <p class="mt-3 text-muted">
                <strong>{{ edu.major }}</strong> - {{ edu.description }}
              </p>
              <div v-if="edu.gpa" class="mt-3">
                <span class="badge bg-success">GPA: {{ edu.gpa }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Bài Viết Nổi Bật -->
    <section class="bai-viet-section py-5">
      <div class="container">
        <div class="section-header text-center mb-5">
          <h6 class="text-uppercase text-primary mb-3">Bài Viết</h6>
          <h2 class="display-5 fw-bold text-dark mb-3">Bài Viết Nổi Bật</h2>
        </div>

        <div class="row g-4">
          <div v-for="post in blogPosts.slice(0, 3)" :key="post.id" class="col-lg-4 col-md-6">
            <div class="bai-viet-card card border-0 shadow-lg h-100">
              <div v-if="post.featured_image" class="bai-viet-image">
                <img :src="post.featured_image" :alt="post.title" class="post-img">
              </div>
              <div v-else :class="`bai-viet-image bg-gradient-${post.badge_color || 'primary'}`"></div>
              <div class="card-body">
                <div class="d-flex align-items-center mb-3">
                  <span class="badge" :class="`bg-${post.badge_color || 'primary'}`">
                    {{ post.category }}
                  </span>
                  <small class="text-muted ms-2">
                    <i class="bi bi-clock me-1"></i>{{ post.time_ago || 'Mới đây' }}
                  </small>
                </div>
                <h5 class="fw-bold mb-3">{{ post.title }}</h5>
                <p class="text-muted mb-3">{{ post.excerpt }}</p>
                <div class="d-flex justify-content-between align-items-center">
                  <div class="d-flex align-items-center">
                    <div class="avatar-sm bg-primary rounded-circle d-flex align-items-center justify-content-center me-2">
                      <i class="bi bi-person text-white"></i>
                    </div>
                    <small class="text-muted">{{ post.author || 'Tuấn Anh' }}</small>
                  </div>
                  <button class="btn btn-primary btn-sm px-3" @click="handleReadArticle(post)">
                    <i class="bi bi-book me-1"></i>Đọc tiếp
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="text-center mt-5">
          <button class="btn btn-outline-primary btn-lg" @click="$emit('navigate', 'danhsachbaiviet')">
            <i class="bi bi-journal-text me-2"></i>Xem tất cả bài viết
          </button>
        </div>
      </div>
    </section>

    <!-- Liên Hệ -->
    <section class="lien-he-section py-5 bg-primary text-white">
      <div class="container">
        <div class="row align-items-center text-center text-lg-start">
          <div class="col-lg-8">
            <h3 class="display-6 fw-bold mb-3">Sẵn sàng bắt đầu dự án?</h3>
            <p class="lead mb-0">Liên hệ ngay để thảo luận về ý tưởng của bạn</p>
          </div>
          <div class="col-lg-4 text-lg-end">
            <button class="btn btn-light btn-lg px-5 py-3 fw-bold" @click="handleContactNow">
              <i class="bi bi-whatsapp me-2"></i>Liên Hệ Ngay
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
    dulieu: Object
});

const emit = defineEmits(['navigate']);

const personalInfo = computed(() => props.dulieu?.personal_info || {});
const statistics = computed(() => props.dulieu?.statistics || {});
const services = computed(() => props.dulieu?.services || []);
const projects = computed(() => props.dulieu?.projects || []);
const education = computed(() => props.dulieu?.education || []);
const blogPosts = computed(() => props.dulieu?.blog_posts || []);
const skills = computed(() => props.dulieu?.skills?.technical || []);

const handleViewProjects = () => {
  emit('navigate', 'kynang');
};

const handleContactNow = () => {
  emit('navigate', 'lienhe');
};

const handleViewProjectDetails = (project) => {
  emit('navigate', 'kynang');
};

const handleReadArticle = (post) => {
  emit('navigate', 'danhsachbaiviet');
};

const getBadgeColor = (id) => {
  const colors = ['primary', 'success', 'warning', 'info'];
  return colors[(id - 1) % colors.length];
};
</script>

<style scoped>
.trang-chu {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
}

.hero-section {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
  position: relative;
  overflow: hidden;
  padding: 0;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 600px;
  height: 600px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 50%;
  opacity: 0.03;
}

.text-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: block;
}

.hero-visual {
  position: relative;
  height: 400px;
}

.floating-card {
  position: absolute;
  background: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  animation: float 3s ease-in-out infinite;
}

.floating-card i {
  font-size: 1.5rem;
}

.card-1 {
  top: 20%;
  left: 10%;
  animation-delay: 0s;
}

.card-2 {
  top: 50%;
  right: 20%;
  animation-delay: 1s;
}

.card-3 {
  bottom: 20%;
  left: 30%;
  animation-delay: 2s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.thong-ke-section {
  background: white;
}

.thong-ke-item {
  padding: 20px;
}

.info-item {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.info-item:hover {
  background: #e9ecef;
  transform: translateX(5px);
}

.progress {
  height: 8px;
  border-radius: 10px;
}

.progress-bar {
  border-radius: 10px;
}

.dich-vu-card, .du-an-card, .bai-viet-card {
  transition: all 0.3s ease;
  border: 1px solid rgba(0,0,0,0.05);
}

.dich-vu-card:hover, .du-an-card:hover, .bai-viet-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.15) !important;
}

.dich-vu-icon i {
  font-size: 3rem;
}

.du-an-image {
  height: 200px;
  border-radius: 15px 15px 0 0;
  position: relative;
}

.image-container {
  width: 100%;
  height: 100%;
}

.project-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
}

.image-placeholder {
  height: 100%;
  border-radius: 15px 15px 0 0;
}

.bg-gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}

.bg-gradient-success {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%) !important;
}

.bg-gradient-warning {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%) !important;
}

.du-an-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
  border-radius: 15px 15px 0 0;
}

.du-an-card:hover .du-an-overlay {
  opacity: 1;
}

.du-an-card:hover .project-img {
  transform: scale(1.1);
}

.cong-nghe-tag {
  font-size: 0.75rem;
  border: 1px solid #e9ecef;
}

.edu-icon {
  flex-shrink: 0;
}

.bai-viet-image {
  height: 200px;
  border-radius: 15px 15px 0 0;
  overflow: hidden;
}

.post-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.lien-he-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 10px;
  font-weight: 600;
}

.btn-outline-dark {
  border-radius: 10px;
  font-weight: 600;
}

.avatar-sm {
  width: 32px;
  height: 32px;
}

@media (max-width: 768px) {
  .hero-section {
    padding: 100px 0 60px;
    text-align: center;
  }
  
  .display-3 {
    font-size: 2.5rem;
  }
  
  .hero-actions {
    justify-content: center;
  }
  
  .floating-card {
    position: relative;
    margin: 10px auto;
    width: 200px;
  }
  
  .du-an-image, .bai-viet-image {
    height: 150px;
  }
}
</style>