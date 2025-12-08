<template>
  <div class="du-an-chi-tiet-modal" v-if="show" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">{{ duAn?.name }}</h5>
        <button type="button" class="btn-close" @click="closeModal"></button>
      </div>
      <div class="modal-body">
        <div class="row">
          <!-- Hình ảnh -->
          <div class="col-lg-6">
            <div class="image-container rounded-3 overflow-hidden mb-4">
              <div v-if="duAn?.image" class="project-detail-image">
                <img :src="duAn.image" :alt="duAn.name" class="img-fluid">
              </div>
              <div v-else :class="`image-placeholder bg-gradient-${getBadgeColor(duAn?.id)} d-flex align-items-center justify-content-center`" style="height: 250px">
                <i :class="`bi bi-${getProjectIcon(duAn?.id)} text-white display-3`"></i>
              </div>
            </div>
            
            <!-- Stats -->
            <div class="project-stats mb-4">
              <div class="row g-2">
                <div class="col-6">
                  <div class="stat-box text-center p-3 bg-light rounded-3">
                    <i class="bi bi-people text-primary fs-4 mb-2"></i>
                    <h6 class="fw-bold mb-1">{{ duAn?.team_size }}</h6>
                    <small class="text-muted">Team size</small>
                  </div>
                </div>
                <div class="col-6">
                  <div class="stat-box text-center p-3 bg-light rounded-3">
                    <i class="bi bi-calendar text-success fs-4 mb-2"></i>
                    <h6 class="fw-bold mb-1">{{ duAn?.duration }}</h6>
                    <small class="text-muted">Thời gian</small>
                  </div>
                </div>
                <div class="col-6">
                  <div class="stat-box text-center p-3 bg-light rounded-3">
                    <i class="bi bi-calendar-check text-warning fs-4 mb-2"></i>
                    <h6 class="fw-bold mb-1">{{ duAn?.start_date }} - {{ duAn?.end_date }}</h6>
                    <small class="text-muted">Thời điểm</small>
                  </div>
                </div>
                <div class="col-6">
                  <div class="stat-box text-center p-3 bg-light rounded-3">
                    <i class="bi bi-check-circle text-info fs-4 mb-2"></i>
                    <h6 class="fw-bold mb-1">{{ duAn?.badge_year }}</h6>
                    <small class="text-muted">Năm hoàn thành</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Thông tin chi tiết -->
          <div class="col-lg-6">
            <div class="project-info">
              <div class="d-flex justify-content-between align-items-start mb-3">
                <div>
                  <h4 class="fw-bold">{{ duAn?.name }}</h4>
                  <span class="badge bg-primary fs-6">{{ duAn?.badge_year || '2024' }}</span>
                  <span class="badge ms-2" :class="duAn?.status === 'Hoàn thành' ? 'bg-success' : 'bg-warning'">
                    {{ duAn?.status }}
                  </span>
                </div>
              </div>
              
              <p class="text-muted mb-4">{{ duAn?.description }}</p>
              
              <!-- Detail content -->
              <div v-if="duAn?.detail" class="mb-4">
                <h6 class="fw-bold mb-2">Chi tiết dự án:</h6>
                <p class="text-muted">{{ duAn.detail }}</p>
              </div>
              
              <div class="technologies mb-4">
                <h6 class="fw-bold mb-3">Công nghệ sử dụng:</h6>
                <div class="d-flex flex-wrap gap-2">
                  <span v-for="tech in duAn?.technologies" :key="tech" 
                        class="tech-tag" :class="getTechBadgeClass(tech)">
                    {{ tech }}
                  </span>
                </div>
              </div>
              
              <!-- Vai trò -->
              <div class="mb-4">
                <h6 class="fw-bold mb-2">Vai trò trong dự án:</h6>
                <div class="role-badge bg-primary text-white rounded-pill px-3 py-1 d-inline-block">
                  {{ duAn?.role || 'Full-stack Developer' }}
                </div>
              </div>
              
              <!-- Features -->
              <div v-if="duAn?.features && duAn.features.length > 0" class="mb-4">
                <h6 class="fw-bold mb-3">Tính năng chính:</h6>
                <ul class="list-unstyled">
                  <li v-for="feature in duAn.features" :key="feature" class="mb-2">
                    <i class="bi bi-check-circle text-success me-2"></i>
                    {{ feature }}
                  </li>
                </ul>
              </div>
              
              <div class="project-links">
                <h6 class="fw-bold mb-3">Liên kết dự án:</h6>
                <div class="d-flex gap-3">
                  <a v-if="duAn?.demo_link" :href="duAn.demo_link" target="_blank" 
                     class="btn btn-primary">
                    <i class="bi bi-eye me-2"></i>Xem Demo
                  </a>
                  <a v-if="duAn?.github_link" :href="duAn.github_link" target="_blank" 
                     class="btn btn-outline-dark">
                    <i class="bi bi-github me-2"></i>GitHub
                  </a>
                  <button class="btn btn-outline-secondary" @click="copyProjectInfo">
                    <i class="bi bi-clipboard me-2"></i>Copy Info
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Challenges and Results -->
        <div v-if="duAn?.challenges || duAn?.results" class="project-details mt-5">
          <div class="row">
            <div v-if="duAn?.challenges" class="col-md-6">
              <div class="detail-section">
                <h6 class="fw-bold mb-3 text-warning">
                  <i class="bi bi-exclamation-triangle me-2"></i>Thách thức gặp phải
                </h6>
                <div class="card bg-light border-0">
                  <div class="card-body">
                    <p class="mb-0">{{ duAn.challenges }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="duAn?.results" class="col-md-6">
              <div class="detail-section">
                <h6 class="fw-bold mb-3 text-success">
                  <i class="bi bi-trophy me-2"></i>Kết quả đạt được
                </h6>
                <div class="card bg-light border-0">
                  <div class="card-body">
                    <p class="mb-0">{{ duAn.results }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Learnings -->
        <div v-if="getProjectLearnings(duAn?.id).length > 0" class="project-learnings mt-5">
          <h6 class="fw-bold mb-3 text-info">
            <i class="bi bi-lightbulb me-2"></i>Bài học rút ra
          </h6>
          <div class="row">
            <div v-for="(learning, index) in getProjectLearnings(duAn?.id)" :key="index" class="col-md-6">
              <div class="learning-item d-flex align-items-center mb-3">
                <i class="bi bi-check-circle-fill text-info me-3"></i>
                <span>{{ learning }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Related Projects -->
        <div v-if="getRelatedProjects(duAn?.id).length > 0" class="related-projects mt-5">
          <h6 class="fw-bold mb-3">Dự án liên quan:</h6>
          <div class="row g-3">
            <div v-for="related in getRelatedProjects(duAn?.id)" :key="related.id" class="col-md-6">
              <div class="related-project-card p-3 bg-light rounded-3 d-flex align-items-center" 
                  style="cursor: pointer" @click="viewRelatedProject(related)">
                <div class="flex-shrink-0">
                  <i class="bi bi-folder text-primary fs-4 me-3"></i>
                </div>
                <div class="flex-grow-1">
                  <h6 class="fw-bold mb-1">{{ related.name }}</h6>
                  <small class="text-muted">{{ related.description.substring(0, 60) }}...</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" @click="closeModal">Đóng</button>
        <button type="button" class="btn btn-primary" @click="shareProject">
          <i class="bi bi-share me-1"></i>Chia sẻ
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';

const props = defineProps({
  show: Boolean,
  duAn: Object,
  allProjects: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['close', 'view-related']);

const closeModal = () => {
  emit('close');
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
    case 1: return 'phone';
    case 2: return 'journal-bookmark';
    case 3: return 'cart';
    case 4: return 'bar-chart';
    default: return 'folder';
  }
};

const getTechBadgeClass = (tech) => {
  if (tech.includes('Vue') || tech.includes('React')) return 'bg-primary';
  if (tech.includes('Bootstrap') || tech.includes('Tailwind')) return 'bg-success';
  if (tech.includes('Node') || tech.includes('Express')) return 'bg-warning';
  if (tech.includes('MongoDB') || tech.includes('Firebase')) return 'bg-info';
  return 'bg-secondary';
};

const getProjectLearnings = (id) => {
  const learnings = {
    1: [
      'Xử lý bảo mật thanh toán trực tuyến',
      'Tối ưu hiệu suất với large datasets',
      'Implement real-time notifications',
      'SEO optimization cho e-commerce'
    ],
    2: [
      'Tối ưu performance cho SPA',
      'Dark/Light mode implementation',
      'Smooth animations và transitions',
      'Responsive design principles'
    ],
    3: [
      'Real-time collaboration techniques',
      'Handling concurrency issues',
      'Optimizing database queries',
      'File upload và storage management'
    ],
    4: [
      'Data visualization với D3.js',
      'Real-time data streaming',
      'Export data to multiple formats',
      'Dashboard performance optimization'
    ]
  };
  return learnings[id] || [];
};

const getRelatedProjects = (currentId) => {
  if (!currentId) return [];
  return props.allProjects.filter(project => project.id !== currentId).slice(0, 2);
};

const viewRelatedProject = (project) => {
  emit('view-related', project);
};

const copyProjectInfo = () => {
  const projectInfo = `Dự án: ${props.duAn?.name}\nMô tả: ${props.duAn?.description}\nCông nghệ: ${props.duAn?.technologies?.join(', ')}`;
  navigator.clipboard.writeText(projectInfo);
  alert('Thông tin dự án đã được sao chép!');
};

const shareProject = () => {
  if (navigator.share) {
    navigator.share({
      title: props.duAn?.name,
      text: props.duAn?.description,
      url: props.duAn?.demo_link || window.location.href
    });
  } else {
    const text = `${props.duAn?.name} - ${props.duAn?.description}`;
    alert(`Chia sẻ dự án: ${text}\n\nURL: ${props.duAn?.demo_link || window.location.href}`);
  }
};
</script>

<style scoped>
.du-an-chi-tiet-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 15px;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
  animation: modalFadeIn 0.3s ease;
}

@keyframes modalFadeIn {
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
  padding: 1.5rem 1.5rem 0.5rem;
  border-bottom: 1px solid #dee2e6;
}

.modal-title {
  font-size: 1.75rem;
  font-weight: bold;
  color: #333;
}

.modal-body {
  padding: 1.5rem;
}

.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #dee2e6;
}

.image-container {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.project-detail-image img {
  width: 100%;
  height: 250px;
  object-fit: cover;
  border-radius: 12px;
}

.image-placeholder {
  border-radius: 12px;
}

.project-stats .stat-box {
  transition: all 0.3s ease;
}

.project-stats .stat-box:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.tech-tag {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  color: white;
  font-weight: 500;
}

.role-badge {
  font-weight: 600;
  font-size: 0.9rem;
}

.detail-section {
  height: 100%;
}

.detail-section .card {
  height: calc(100% - 2rem);
  transition: all 0.3s ease;
}

.detail-section .card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.learning-item {
  padding: 10px 15px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.learning-item:hover {
  background: #e9ecef;
  transform: translateX(5px);
}

.related-project-card {
  transition: all 0.3s ease;
  border: 1px solid #dee2e6;
}

.related-project-card:hover {
  background: #e9ecef !important;
  transform: translateX(5px);
  border-color: #667eea;
}

.btn-close {
  font-size: 1.2rem;
}

.btn {
  font-weight: 500;
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

@media (max-width: 768px) {
  .modal-content {
    max-height: 95vh;
  }
  
  .modal-title {
    font-size: 1.5rem;
  }
  
  .project-detail-image img {
    height: 200px;
  }
  
  .project-stats .row {
    margin-bottom: -10px;
  }
  
  .project-stats .col-6 {
    margin-bottom: 10px;
  }
  
  .btn {
    width: 100%;
    margin-bottom: 10px;
  }
}
</style>