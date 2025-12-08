<template>
  <div class="thong-tin-page min-vh-100">
    <!-- Header Full Width -->
    <section class="profile-header py-6">
      <div class="container-fluid px-xxl-6 px-xl-5 px-lg-4 px-md-3">
        <div class="row align-items-center">
          <div class="col-xl-4 text-center">
            <div class="profile-avatar mx-auto mb-5 mb-xl-0">
              <div class="avatar-image">
                <img 
                  :src="personalInfo.avatar || '/img/1.png'" 
                  :alt="personalInfo.full_name"
                  class="avatar-img"
                >
              </div>
              <div class="avatar-badge">
                <i class="bi bi-patch-check-fill text-primary fs-4"></i>
              </div>
            </div>
          </div>
          <div class="col-xl-8">
            <div class="profile-info ps-xl-5">
              <h6 class="text-uppercase text-primary mb-3 fs-4">{{ personalInfo.title || 'Senior Full-stack Developer' }}</h6>
              <h1 class="display-2 fw-bold text-dark mb-4">{{ personalInfo.full_name || 'Huỳnh Tuấn Anh' }}</h1>
              <p class="lead text-muted mb-5 fs-4 lh-lg">
                {{ personalInfo.about_me || 'Chuyên gia phát triển web với 3+ năm kinh nghiệm trong việc xây dựng ứng dụng hiện đại. Đam mê tạo ra sản phẩm chất lượng và trải nghiệm người dùng xuất sắc.' }}
              </p>
              <div class="profile-meta d-flex flex-wrap gap-5">
                <div class="meta-item d-flex align-items-center">
                  <i class="bi bi-geo-alt text-primary fs-2 me-3"></i>
                  <div>
                    <strong class="fs-5 d-block">Địa chỉ</strong>
                    <span class="text-muted fs-6">{{ personalInfo.location || 'Tuyên Quang, Việt Nam' }}</span>
                  </div>
                </div>
                <div class="meta-item d-flex align-items-center">
                  <i class="bi bi-envelope text-success fs-2 me-3"></i>
                  <div>
                    <strong class="fs-5 d-block">Email</strong>
                    <span class="text-muted fs-6">{{ personalInfo.email || 'tuananh@email.com' }}</span>
                  </div>
                </div>
                <div class="meta-item d-flex align-items-center">
                  <i class="bi bi-telephone text-info fs-2 me-3"></i>
                  <div>
                    <strong class="fs-5 d-block">Điện thoại</strong>
                    <span class="text-muted fs-6">{{ personalInfo.phone || '+84 123 456 789' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Thông Tin Chi Tiết Full Width -->
    <section class="chi-tiet-section py-6 bg-light">
      <div class="container-fluid px-xxl-6 px-xl-5 px-lg-4 px-md-3">
        <div class="row g-5">
          <div class="col-lg-6">
            <div class="card shadow-lg border-0 h-100">
              <div class="card-header bg-primary text-white py-4">
                <h3 class="fw-semibold mb-0 fs-2"><i class="bi bi-info-circle me-3"></i>Thông tin cá nhân</h3>
              </div>
              <div class="card-body p-5">
                <div class="list-group list-group-flush">
                  <div class="list-group-item d-flex align-items-center py-4 px-0">
                    <i class="bi bi-person text-primary fs-1 me-4"></i>
                    <div>
                      <strong class="fs-5 d-block">Họ tên</strong>
                      <p class="mb-0 fs-6 text-muted">{{ personalInfo.full_name || 'Huỳnh Tuấn Anh' }}</p>
                    </div>
                  </div>
                  <div class="list-group-item d-flex align-items-center py-4 px-0">
                    <i class="bi bi-calendar text-success fs-1 me-4"></i>
                    <div>
                      <strong class="fs-5 d-block">Ngày sinh</strong>
                      <p class="mb-0 fs-6 text-muted">{{ personalInfo.birthday || '15/06/2006' }}</p>
                    </div>
                  </div>
                  <div class="list-group-item d-flex align-items-center py-4 px-0">
                    <i class="bi bi-geo-alt text-warning fs-1 me-4"></i>
                    <div>
                      <strong class="fs-5 d-block">Quê quán</strong>
                      <p class="mb-0 fs-6 text-muted">{{ personalInfo.hometown || 'Tuyên Quang' }}</p>
                    </div>
                  </div>
                  <div class="list-group-item d-flex align-items-center py-4 px-0">
                    <i class="bi bi-code-slash text-info fs-1 me-4"></i>
                    <div>
                      <strong class="fs-5 d-block">Chuyên ngành</strong>
                      <p class="mb-0 fs-6 text-muted">{{ personalInfo.major || 'Web Design & Development' }}</p>
                    </div>
                  </div>
                  <div class="list-group-item d-flex align-items-center py-4 px-0">
                    <i class="bi bi-briefcase text-danger fs-1 me-4"></i>
                    <div>
                      <strong class="fs-5 d-block">Vị trí</strong>
                      <p class="mb-0 fs-6 text-muted">{{ personalInfo.title || 'Full-Stack Developer' }}</p>
                    </div>
                  </div>
                  <div class="list-group-item d-flex align-items-center py-4 px-0">
                    <i class="bi bi-link text-primary fs-1 me-4"></i>
                    <div>
                      <strong class="fs-5 d-block">Website</strong>
                      <a :href="personalInfo.website || '#'" target="_blank" class="mb-0 fs-6 text-muted text-decoration-none">
                        {{ personalInfo.website || 'https://tuananhportfolio.dev' }}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-6">
            <div class="card shadow-lg border-0 h-100">
              <div class="card-header bg-success text-white py-4">
                <h3 class="fw-semibold mb-0 fs-2"><i class="bi bi-images me-3"></i>Portfolio Gallery</h3>
              </div>
              <div class="card-body p-5">
                <div class="row g-4">
                  <div v-for="item in gallery.slice(0, 4)" :key="item.id" class="col-6">
                    <div class="portfolio-item rounded-4 overflow-hidden position-relative" @click="viewGalleryItem(item)">
                      <img 
                        :src="item.image_url" 
                        :alt="item.title"
                        class="portfolio-img"
                      >
                      <div class="portfolio-overlay">
                        <div class="portfolio-content">
                          <i class="bi bi-zoom-in text-white fs-3"></i>
                          <p class="text-white mb-0 mt-2 fw-semibold">Xem chi tiết</p>
                        </div>
                      </div>
                    </div>
                    <p class="text-center small mt-3 mb-0 fw-semibold">{{ item.title }}</p>
                  </div>
                </div>
                <div class="text-center mt-4">
                  <button class="btn btn-outline-success" @click="viewAllGallery">
                    <i class="bi bi-images me-2"></i>Xem tất cả ảnh
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Kinh nghiệm làm việc -->
        <div class="row mt-5">
          <div class="col-12">
            <div class="card shadow-lg border-0">
              <div class="card-header bg-warning text-white py-4">
                <h3 class="fw-semibold mb-0 fs-2"><i class="bi bi-briefcase me-3"></i>Kinh nghiệm làm việc</h3>
              </div>
              <div class="card-body p-5">
                <div class="timeline">
                  <div v-for="(job, index) in workExperience" :key="job.id" class="timeline-item">
                    <div class="timeline-marker" :class="`bg-${index % 2 === 0 ? 'primary' : 'success'}`"></div>
                    <div class="timeline-content">
                      <div class="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h5 class="fw-bold mb-1">{{ job.position }}</h5>
                          <p class="text-muted mb-1">{{ job.company }} - {{ job.location }}</p>
                        </div>
                        <span class="badge" :class="`bg-${index % 2 === 0 ? 'primary' : 'success'}`">{{ job.period }}</span>
                      </div>
                      <p class="text-muted mb-3">{{ job.description }}</p>
                      
                      <div class="mb-3">
                        <h6 class="fw-bold mb-2">Trách nhiệm:</h6>
                        <ul class="list-unstyled">
                          <li v-for="resp in job.responsibilities" :key="resp" class="mb-2">
                            <i class="bi bi-check-circle text-success me-2"></i>
                            {{ resp }}
                          </li>
                        </ul>
                      </div>
                      
                      <div>
                        <h6 class="fw-bold mb-2">Công nghệ:</h6>
                        <div class="d-flex flex-wrap gap-2">
                          <span v-for="tech in job.technologies" :key="tech" class="badge bg-secondary">
                            {{ tech }}
                          </span>
                        </div>
                      </div>
                      
                      <div v-if="job.achievements && job.achievements.length > 0" class="mt-3">
                        <h6 class="fw-bold mb-2">Thành tích:</h6>
                        <ul class="list-unstyled">
                          <li v-for="achievement in job.achievements" :key="achievement" class="mb-2">
                            <i class="bi bi-trophy text-warning me-2"></i>
                            {{ achievement }}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Kỹ năng chính -->
        <div class="row mt-5">
          <div class="col-12">
            <div class="card shadow-lg border-0">
              <div class="card-header bg-info text-white py-4">
                <h3 class="fw-semibold mb-0 fs-2"><i class="bi bi-tools me-3"></i>Kỹ năng chuyên môn</h3>
              </div>
              <div class="card-body p-5">
                <div class="row">
                  <div v-for="category in technicalSkills" :key="category.category" class="col-md-6 mb-4">
                    <div class="skill-category">
                      <h5 class="fw-bold mb-4 text-primary">{{ category.category }}</h5>
                      <div v-for="skill in category.skills" :key="skill.name" class="skill-item mb-3">
                        <div class="d-flex justify-content-between mb-2">
                          <span class="fw-semibold">{{ skill.name }}</span>
                          <span class="text-primary">{{ skill.level }}%</span>
                        </div>
                        <div class="progress" style="height: 10px;">
                          <div class="progress-bar" :class="`bg-${getProgressBarColor(skill.level)}`" 
                               :style="`width: ${skill.level}%`"></div>
                        </div>
                        <small class="text-muted d-block mt-1">{{ skill.detail }}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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

const personalInfo = computed(() => props.dulieu?.personal_info || {});
const gallery = computed(() => props.dulieu?.gallery || []);
const workExperience = computed(() => props.dulieu?.work_experience || []);
const technicalSkills = computed(() => props.dulieu?.skills?.technical || []);

const viewGalleryItem = (item) => {
  alert(`Xem chi tiết: ${item.title}\n\n${item.detail || item.description}`);
};

const viewAllGallery = () => {
  alert(`Xem tất cả ${gallery.value.length} ảnh trong gallery`);
};

const getProgressBarColor = (level) => {
  if (level >= 90) return 'success';
  if (level >= 80) return 'info';
  if (level >= 70) return 'primary';
  if (level >= 60) return 'warning';
  return 'secondary';
};
</script>

<style scoped>
.thong-tin-page {
  background: white;
}

.profile-header {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%);
  border-bottom: 1px solid rgba(0,0,0,0.05);
}

.profile-avatar {
  position: relative;
  width: 280px;
  height: 280px;
}

.avatar-image {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(102, 126, 234, 0.3);
  border: 4px solid white;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
}

.avatar-img:hover {
  transform: scale(1.05);
}

.avatar-badge {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: white;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
  border: 3px solid #f8f9fa;
  z-index: 10;
}

.profile-info {
  padding-left: 4rem;
}

.card {
  transition: all 0.4s ease;
  border: 1px solid rgba(0,0,0,0.03);
}

.card:hover {
  transform: translateY(-10px);
  box-shadow: 0 25px 50px rgba(0,0,0,0.15) !important;
}

.card-header {
  border-bottom: none;
}

.portfolio-item {
  height: 180px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.portfolio-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
}

.portfolio-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
}

.portfolio-content {
  text-align: center;
  transform: translateY(20px);
  transition: all 0.3s ease;
}

.portfolio-item:hover .portfolio-overlay {
  opacity: 1;
}

.portfolio-item:hover .portfolio-content {
  transform: translateY(0);
}

.portfolio-item:hover .portfolio-img {
  transform: scale(1.1);
}

.list-group-item {
  border: none;
  transition: all 0.3s ease;
}

.list-group-item:hover {
  background-color: #f8f9fa;
  border-radius: 10px;
  padding-left: 1rem !important;
}

/* Timeline styles */
.timeline {
  position: relative;
  padding-left: 30px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #dee2e6;
}

.timeline-item {
  position: relative;
  margin-bottom: 2rem;
}

.timeline-marker {
  position: absolute;
  left: -36px;
  top: 0;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 3px solid white;
  box-shadow: 0 0 0 2px;
}

.timeline-content {
  padding: 1.5rem;
  background: #f8f9fa;
  border-radius: 10px;
  transition: all 0.3s ease;
}

.timeline-content:hover {
  background: #e9ecef;
  transform: translateX(5px);
}

.skill-item .progress {
  border-radius: 10px;
}

@media (max-width: 768px) {
  .profile-info {
    padding-left: 0;
    text-align: center;
  }
  
  .profile-meta {
    justify-content: center;
    gap: 2rem;
  }
  
  .profile-avatar {
    width: 200px;
    height: 200px;
  }
  
  .avatar-badge {
    width: 40px;
    height: 40px;
    bottom: 15px;
    right: 15px;
  }
  
  .portfolio-item {
    height: 120px;
  }
  
  .display-2 {
    font-size: 3rem !important;
  }
  
  .timeline {
    padding-left: 20px;
  }
  
  .timeline-marker {
    left: -26px;
  }
}

@media (max-width: 1200px) {
  .container-fluid {
    padding-left: 2rem;
    padding-right: 2rem;
  }
  
  .profile-info {
    padding-left: 2rem;
  }
}

.py-6 {
  padding-top: 6rem !important;
  padding-bottom: 6rem !important;
}
</style>