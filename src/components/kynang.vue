<template>
  <div class="ky-nang-page">
    <div class="container mt-4">
      <div class="text-center mb-5">
        <h1 class="display-5 fw-bold text-gradient mb-3">Kỹ Năng & Dự Án</h1>
        <p class="lead text-muted">Năng lực chuyên môn và các dự án đã thực hiện</p>
      </div>

      <!-- Kỹ năng mềm -->
      <section class="mb-5">
        <div class="card shadow-sm border-0">
          <div class="card-header bg-primary text-white">
            <h3 class="fw-semibold mb-0"><i class="bi bi-chat-dots me-2"></i>Kỹ năng mềm</h3>
          </div>
          <div class="card-body">
            <div class="row g-3">
              <div v-for="skill in softSkills" :key="skill.name" class="col-md-4">
                <div class="skill-soft-card p-4 rounded-3 bg-light h-100">
                  <div class="d-flex align-items-center mb-3">
                    <i :class="`bi bi-${skill.icon} text-primary fs-2 me-3`"></i>
                    <div>
                      <h6 class="fw-bold mb-1">{{ skill.name }}</h6>
                      <div class="d-flex align-items-center">
                        <div class="progress flex-grow-1 me-2" style="height: 6px;">
                          <div class="progress-bar bg-primary" :style="`width: ${skill.level}%`"></div>
                        </div>
                        <span class="text-primary fw-bold">{{ skill.level }}%</span>
                      </div>
                    </div>
                  </div>
                  <p class="text-muted small mb-2">{{ skill.description }}</p>
                  <small class="text-muted">{{ skill.detail }}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Kỹ năng kỹ thuật -->
      <section class="mb-5">
        <div class="card shadow-sm border-0">
          <div class="card-header bg-success text-white">
            <h3 class="fw-semibold mb-0"><i class="bi bi-code-slash me-2"></i>Kỹ năng kỹ thuật</h3>
          </div>
          <div class="card-body">
            <div class="row">
              <div v-for="category in technicalSkills" :key="category.category" class="col-lg-4 col-md-6 mb-4">
                <div class="skill-tech-category">
                  <h5 class="fw-bold mb-4 text-success">
                    <i :class="`bi bi-${getCategoryIcon(category.category)} me-2`"></i>
                    {{ category.category }}
                  </h5>
                  <div v-for="skill in category.skills" :key="skill.name" class="skill-tech-item mb-4">
                    <div class="d-flex justify-content-between align-items-center mb-2">
                      <div class="d-flex align-items-center">
                        <i :class="`bi bi-${skill.icon} text-success me-2`"></i>
                        <span class="fw-semibold">{{ skill.name }}</span>
                      </div>
                      <span class="badge" :class="`bg-${getLevelBadgeColor(skill.level)}`">{{ skill.level }}%</span>
                    </div>
                    <div class="progress" style="height: 8px;">
                      <div class="progress-bar bg-success" :style="`width: ${skill.level}%`"></div>
                    </div>
                    <small class="text-muted d-block mt-2">{{ skill.detail }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Kinh Nghiệm Làm Việc -->
      <section class="kinh-nghiem-section mb-5">
        <div class="card shadow-sm border-0">
          <div class="card-header bg-warning text-dark">
            <h3 class="fw-semibold mb-0"><i class="bi bi-briefcase me-2"></i>Kinh nghiệm làm việc</h3>
          </div>
          <div class="card-body">
            <div class="row g-4">
              <div v-for="job in workExperience" :key="job.id" class="col-lg-6">
                <div class="kinh-nghiem-card p-4 bg-white rounded-4 border h-100">
                  <div class="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h5 class="fw-bold mb-1">{{ job.position }}</h5>
                      <p class="text-muted mb-1">{{ job.company }} - {{ job.location }}</p>
                      <span class="badge bg-warning">{{ job.period }}</span>
                    </div>
                    <i class="bi bi-building text-warning fs-3"></i>
                  </div>
                  <p class="text-muted mb-3">{{ job.description }}</p>
                  
                  <div v-if="job.detail" class="mb-3">
                    <p class="small">{{ job.detail }}</p>
                  </div>
                  
                  <div class="mb-3">
                    <h6 class="fw-bold mb-2">Trách nhiệm chính:</h6>
                    <ul class="list-unstyled">
                      <li v-for="resp in job.responsibilities" :key="resp" class="mb-2">
                        <i class="bi bi-check-circle text-success me-2"></i>
                        {{ resp }}
                      </li>
                    </ul>
                  </div>
                  
                  <div class="mb-3">
                    <h6 class="fw-bold mb-2">Công nghệ sử dụng:</h6>
                    <div class="d-flex flex-wrap gap-2">
                      <span v-for="tech in job.technologies" :key="tech" class="badge bg-light text-dark">
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
      </section>

      <!-- Dự án cá nhân -->
      <section>
        <div class="card shadow-sm border-0">
          <div class="card-header bg-info text-white">
            <h3 class="fw-semibold mb-0"><i class="bi bi-folder me-2"></i>Dự án cá nhân</h3>
          </div>
          <div class="card-body">
            <div class="row g-4">
              <div v-for="(project, index) in projects" :key="project.id" class="col-lg-6">
                <div class="project-card card h-100 border-0 shadow-hover">
                  <div class="project-image rounded-top overflow-hidden position-relative">
                    <img 
                      v-if="project.image"
                      :src="project.image" 
                      :alt="project.name"
                      class="project-img"
                    >
                    <div v-else class="image-fallback" :class="`bg-gradient-${getBadgeColor(project.id)} d-flex align-items-center justify-content-center w-100 h-100`">
                      <i :class="`bi ${getProjectIcon(project.id)} text-white display-4`"></i>
                    </div>
                    <div class="project-overlay">
                      <div class="project-overlay-content">
                        <i class="bi bi-zoom-in text-white fs-3"></i>
                        <p class="text-white mb-0 mt-2 fw-semibold">Xem chi tiết</p>
                      </div>
                    </div>
                  </div>
                  <div class="card-body">
                    <h4 class="card-title fw-bold">{{ project.name }}</h4>
                    <p class="card-text text-muted mb-3">{{ project.description }}</p>
                    
                    <div class="mb-3">
                      <h6 class="fw-bold mb-2">Công nghệ:</h6>
                      <div class="d-flex flex-wrap gap-2">
                        <span v-for="tech in project.technologies" :key="tech" 
                              class="tech-badge" 
                              :class="getTechBadgeClass(tech)">
                          {{ tech }}
                        </span>
                      </div>
                    </div>

                    <div class="row g-2 mb-3">
                      <div class="col-6">
                        <small class="text-muted">Số người:</small>
                        <p class="fw-bold mb-0">{{ project.team_size }}</p>
                      </div>
                      <div class="col-6">
                        <small class="text-muted">Thời gian:</small>
                        <p class="fw-bold mb-0">{{ project.duration }}</p>
                      </div>
                      <div class="col-6">
                        <small class="text-muted">Trạng thái:</small>
                        <p class="fw-bold mb-0">
                          <span class="badge" :class="project.status === 'Hoàn thành' ? 'bg-success' : 'bg-warning'">
                            {{ project.status }}
                          </span>
                        </p>
                      </div>
                      <div class="col-6">
                        <small class="text-muted">Năm:</small>
                        <p class="fw-bold mb-0">{{ project.badge_year }}</p>
                      </div>
                    </div>

                    <div class="d-flex gap-2">
                      <button class="btn btn-primary btn-sm flex-grow-1" @click="viewProjectDetails(project)">
                        <i class="bi bi-eye me-1"></i>Xem chi tiết
                      </button>
                      <a v-if="project.github_link" :href="project.github_link" target="_blank" 
                         class="btn btn-outline-secondary btn-sm">
                        <i class="bi bi-github me-1"></i>GitHub
                      </a>
                      <a v-if="project.demo_link" :href="project.demo_link" target="_blank" 
                         class="btn btn-outline-success btn-sm">
                        <i class="bi bi-link me-1"></i>Demo
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Modal xem chi tiết dự án -->
    <DuAnChiTiet 
      :show="showProjectDetail" 
      :du-an="selectedProject"
      @close="closeProjectDetail"
    />
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import DuAnChiTiet from './DuAnChiTiet.vue';

const props = defineProps({
    dulieu: Object
});

const emit = defineEmits(['navigate']);

const workExperience = computed(() => props.dulieu?.work_experience || []);
const projects = computed(() => props.dulieu?.projects || []);
const softSkills = computed(() => props.dulieu?.skills?.soft_skills || []);
const technicalSkills = computed(() => props.dulieu?.skills?.technical || []);

const selectedProject = ref(null);
const showProjectDetail = ref(false);

const viewProjectDetails = (project) => {
  selectedProject.value = project;
  showProjectDetail.value = true;
};

const closeProjectDetail = () => {
  showProjectDetail.value = false;
  selectedProject.value = null;
};

// Helper functions
const getCategoryIcon = (category) => {
  const icons = {
    'Frontend': 'display',
    'Backend': 'server',
    'DevOps & Tools': 'tools'
  };
  return icons[category] || 'code-slash';
};

const getLevelBadgeColor = (level) => {
  if (level >= 90) return 'success';
  if (level >= 80) return 'info';
  if (level >= 70) return 'primary';
  return 'secondary';
};

const getBadgeColor = (id) => {
  switch(id) {
    case 1: return 'primary';
    case 2: return 'success';
    case 3: return 'warning';
    case 4: return 'info';
    default: return 'primary';
  }
};

const getProjectIcon = (id) => {
  switch(id) {
    case 1: return 'bi-phone';
    case 2: return 'bi-journal-bookmark';
    case 3: return 'bi-cart';
    case 4: return 'bi-bar-chart';
    default: return 'bi-folder';
  }
};

const getTechBadgeClass = (tech) => {
  if (tech.includes('Vue') || tech.includes('React')) return 'bg-primary';
  if (tech.includes('Bootstrap') || tech.includes('Tailwind')) return 'bg-success';
  if (tech.includes('Node') || tech.includes('Express')) return 'bg-warning';
  if (tech.includes('MongoDB') || tech.includes('Firebase')) return 'bg-info';
  return 'bg-secondary';
};
</script>

<style scoped>
.ky-nang-page {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
}

.text-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.tech-badge {
  padding: 6px 12px;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
  color: white;
}

.project-card {
  transition: all 0.3s ease;
}

.project-card:hover {
  transform: translateY(-5px);
}

.project-image {
  height: 200px;
  position: relative;
}

.project-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
}

.image-fallback {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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

.bg-gradient-info {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%) !important;
}

.project-overlay {
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

.project-overlay-content {
  text-align: center;
  transform: translateY(20px);
  transition: all 0.3s ease;
}

.project-card:hover .project-overlay {
  opacity: 1;
}

.project-card:hover .project-overlay-content {
  transform: translateY(0);
}

.project-card:hover .project-img {
  transform: scale(1.1);
}

.shadow-hover {
  box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important;
}

.shadow-hover:hover {
  box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
}

.card {
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
}

.skill-soft-card {
  transition: all 0.3s ease;
}

.skill-soft-card:hover {
  transform: translateY(-5px);
  background: #e9ecef !important;
}

.kinh-nghiem-card {
  transition: all 0.3s ease;
}

.kinh-nghiem-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1) !important;
}

.skill-tech-item {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.skill-tech-item:hover {
  background: #e9ecef;
  transform: translateX(5px);
}

@media (max-width: 768px) {
  .project-image {
    height: 150px;
  }
  
  .d-flex.gap-2 {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
    margin-bottom: 0.5rem;
  }
  
  .skill-soft-card, .kinh-nghiem-card {
    padding: 1rem;
  }
}
</style>