<template>
  <div class="bai-viet-page">
    <div class="container mt-4">
      <div class="text-center mb-5">
        <h1 class="display-5 fw-bold text-gradient mb-3">Bài Viết Công Nghệ</h1>
        <p class="lead text-muted">Chia sẻ kiến thức và kinh nghiệm lập trình</p>
      </div>

      <!-- Bộ lọc danh mục -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card shadow-sm border-0 mb-4">
            <div class="card-body">
              <div class="d-flex flex-wrap gap-3 align-items-center">
                <h6 class="fw-bold mb-0">Lọc theo:</h6>
                <button class="btn btn-sm" :class="selectedCategory === 'all' ? 'btn-primary' : 'btn-outline-primary'" 
                        @click="selectedCategory = 'all'">
                  Tất cả
                </button>
                <button v-for="category in categories" :key="category" 
                        class="btn btn-sm" 
                        :class="selectedCategory === category ? getCategoryBtnClass(category) : `btn-outline-${getCategoryColor(category)}`"
                        @click="selectedCategory = category">
                  {{ category }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Bài viết với phân trang -->
      <div class="row g-4">
        <div v-for="post in paginatedPosts" :key="post.id" class="col-lg-6">
          <div class="card article-card h-100 border-0 shadow-hover">
            <div class="card-header p-0 border-0">
              <div v-if="post.featured_image" class="article-image">
                <img :src="post.featured_image" :alt="post.title" class="article-img">
              </div>
              <div v-else :class="`article-placeholder bg-gradient-${post.badge_color || 'primary'}`"></div>
            </div>
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <span class="badge" :class="`bg-${post.badge_color || 'primary'}`">
                  {{ post.category }}
                </span>
                <small class="text-muted">
                  <i class="bi bi-calendar me-1"></i>{{ formatDate(post.published_date) }}
                </small>
              </div>
              
              <h4 class="card-title fw-bold">
                <i :class="`bi ${getCategoryIcon(post.category)} text-${post.badge_color || 'primary'} me-2`"></i>
                {{ post.title }}
              </h4>
              <p class="card-text text-muted mb-3">{{ post.excerpt }}</p>
              
              <div class="d-flex align-items-center mb-3">
                <span class="badge bg-light text-dark me-2">
                  <i class="bi bi-clock me-1"></i>{{ post.read_time || '10 phút đọc' }}
                </span>
                <span class="badge bg-light text-dark me-2">
                  <i class="bi bi-eye me-1"></i>{{ post.views?.toLocaleString() || '0' }} lượt xem
                </span>
                <span class="badge bg-light text-dark">
                  <i class="bi bi-chat-dots me-1"></i>{{ post.comments_count || '0' }} bình luận
                </span>
              </div>

              <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                  <div v-if="post.author_avatar" class="avatar-sm me-2">
                    <img :src="post.author_avatar" :alt="post.author" class="rounded-circle" width="32" height="32">
                  </div>
                  <div v-else class="avatar-sm bg-primary rounded-circle d-flex align-items-center justify-content-center me-2">
                    <i class="bi bi-person text-white"></i>
                  </div>
                  <small class="text-muted">{{ post.author || 'Tuấn Anh' }}</small>
                </div>
                <button class="btn btn-primary" @click="handleReadArticle(post)">
                  <i class="bi bi-book me-1"></i>Đọc tiếp
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- No results message -->
      <div v-if="filteredPosts.length === 0" class="text-center py-5">
        <div class="empty-state">
          <i class="bi bi-journal-x display-1 text-muted mb-3"></i>
          <h4 class="fw-bold mb-3">Không tìm thấy bài viết</h4>
          <p class="text-muted mb-4">Không có bài viết nào trong danh mục "{{ selectedCategory }}"</p>
          <button class="btn btn-primary" @click="selectedCategory = 'all'">
            <i class="bi bi-arrow-left me-2"></i>Xem tất cả bài viết
          </button>
        </div>
      </div>

      <!-- Pagination -->
      <nav v-if="filteredPosts.length > 0" class="mt-5">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <a class="page-link" href="#" @click.prevent="changePage(currentPage - 1)">
              <i class="bi bi-chevron-left"></i> Trước
            </a>
          </li>
          
          <li v-for="page in totalPages" :key="page" 
              class="page-item" 
              :class="{ active: currentPage === page }">
            <a class="page-link" href="#" @click.prevent="changePage(page)">{{ page }}</a>
          </li>
          
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <a class="page-link" href="#" @click.prevent="changePage(currentPage + 1)">
              Tiếp <i class="bi bi-chevron-right"></i>
            </a>
          </li>
        </ul>
        
        <div class="text-center mt-3">
          <small class="text-muted">
            Hiển thị {{ paginatedPosts.length }} trong tổng số {{ filteredPosts.length }} bài viết
            (Trang {{ currentPage }} / {{ totalPages }})
          </small>
        </div>
      </nav>
    </div>

    <!-- Modal xem chi tiết bài viết -->
    <BaiVietChiTiet 
      :show="showPostDetail" 
      :bai-viet="selectedPost"
      :all-posts="filteredPosts"
      @close="closePostDetail"
      @view-post="handleViewRelatedPost"
    />
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import BaiVietChiTiet from './BaiVietChiTiet.vue';

const props = defineProps({
    dulieu: Object
});

const emit = defineEmits(['navigate']);

const blogPosts = computed(() => props.dulieu?.blog_posts || []);

// Phân trang và lọc
const currentPage = ref(1);
const itemsPerPage = 4;
const selectedPost = ref(null);
const showPostDetail = ref(false);
const selectedCategory = ref('all');

// Lấy danh mục duy nhất
const categories = computed(() => {
  const cats = [...new Set(blogPosts.value.map(post => post.category))];
  return cats;
});

// Lọc bài viết theo danh mục
const filteredPosts = computed(() => {
  if (selectedCategory.value === 'all') {
    return blogPosts.value;
  }
  return blogPosts.value.filter(post => post.category === selectedCategory.value);
});

const totalPages = computed(() => {
  return Math.ceil(filteredPosts.value.length / itemsPerPage);
});

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredPosts.value.slice(start, end);
});

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const handleReadArticle = (post) => {
  selectedPost.value = post;
  showPostDetail.value = true;
};

const handleViewRelatedPost = (post) => {
  selectedPost.value = post;
};

const closePostDetail = () => {
  showPostDetail.value = false;
  selectedPost.value = null;
};

const formatDate = (dateString) => {
  if (!dateString) return 'Không có ngày';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const getCategoryColor = (category) => {
  const colors = {
    'Vue.js': 'primary',
    'Bootstrap': 'success',
    'JavaScript': 'warning',
    'CSS3': 'info',
    'UI/UX': 'danger'
  };
  return colors[category] || 'primary';
};

const getCategoryBtnClass = (category) => {
  const color = getCategoryColor(category);
  return `btn-${color}`;
};

const getCategoryIcon = (category) => {
  const icons = {
    'Vue.js': 'bi-vue text-success',
    'JavaScript': 'bi-file-code text-warning',
    'CSS3': 'bi-palette text-info',
    'Bootstrap': 'bi-bootstrap text-purple',
    'UI/UX': 'bi-palette2 text-danger'
  };
  return icons[category] || 'bi-journal-text text-primary';
};
</script>

<style scoped>
.bai-viet-page {
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
}

.text-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.article-card {
  transition: all 0.3s ease;
}

.article-card:hover {
  transform: translateY(-5px);
}

.shadow-hover {
  box-shadow: 0 2px 10px rgba(0,0,0,0.1) !important;
}

.shadow-hover:hover {
  box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
}

.article-image {
  height: 200px;
  overflow: hidden;
  border-radius: 15px 15px 0 0;
}

.article-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
}

.article-card:hover .article-img {
  transform: scale(1.05);
}

.article-placeholder {
  height: 200px;
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

.bg-gradient-info {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%) !important;
}

.bg-gradient-danger {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%) !important;
}

.avatar-sm {
  width: 32px;
  height: 32px;
}

.card-header {
  border-bottom: none;
}

.page-link {
  border: none;
  margin: 0 4px;
  border-radius: 8px !important;
  cursor: pointer;
}

.page-item.active .page-link {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  font-weight: 600;
}

.page-item.disabled .page-link {
  opacity: 0.5;
  cursor: not-allowed;
}

.empty-state {
  padding: 3rem;
  background: #f8f9fa;
  border-radius: 15px;
  max-width: 500px;
  margin: 0 auto;
}

.btn-outline-primary, .btn-outline-success, .btn-outline-warning, .btn-outline-info, .btn-outline-danger {
  border-radius: 20px;
  padding: 6px 16px;
}

@media (max-width: 768px) {
  .article-image, .article-placeholder {
    height: 150px;
  }
  
  .d-flex.flex-wrap {
    justify-content: center;
  }
  
  .btn-sm {
    margin-bottom: 5px;
  }
}
</style>