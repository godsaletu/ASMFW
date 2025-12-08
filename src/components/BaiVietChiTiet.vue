<template>
    <div class="bai-viet-chi-tiet-modal" v-if="show" @click.self="closeModal">
        <div class="modal-content">
        <div class="modal-header">
            <div class="header-content w-100">
            <div class="d-flex justify-content-between align-items-center">
                <h5 class="modal-title mb-0">{{ baiViet?.title }}</h5>
                <button type="button" class="btn-close" @click="closeModal"></button>
            </div>
            <div class="post-meta mt-2">
                <span class="badge" :class="`bg-${baiViet?.badge_color || 'primary'}`">
                {{ baiViet?.category }}
                </span>
                <span class="text-muted ms-3">
                <i class="bi bi-calendar me-1"></i>
                {{ formatDate(baiViet?.published_date) }}
                </span>
                <span class="text-muted ms-3">
                <i class="bi bi-person me-1"></i>
                {{ baiViet?.author || 'Tuấn Anh' }}
                </span>
                <span class="text-muted ms-3">
                <i class="bi bi-clock me-1"></i>
                {{ baiViet?.read_time }}
                </span>
            </div>
            </div>
        </div>
        <div class="modal-body">
            <!-- Featured Image -->
            <div v-if="baiViet?.featured_image" class="featured-image mb-4">
            <img :src="baiViet.featured_image" :alt="baiViet.title" class="img-fluid rounded-3">
            </div>
            <div v-else class="featured-placeholder mb-4">
            <div :class="`image-placeholder bg-gradient-${baiViet?.badge_color || 'primary'} rounded-3 d-flex align-items-center justify-content-center`" 
                style="height: 200px">
                <i class="bi bi-journal-text text-white display-3"></i>
            </div>
            </div>
            
            <!-- Excerpt -->
            <div class="excerpt mb-4">
            <p class="lead fst-italic text-muted">{{ baiViet?.excerpt }}</p>
            </div>
            
            <!-- Content -->
            <div class="content mb-5">
            <div class="article-content" v-html="baiViet?.full_content || baiViet?.content || getArticleContent(baiViet)"></div>
            </div>
            
            <!-- Tags -->
            <div class="tags mb-4" v-if="baiViet?.tags && baiViet.tags.length > 0">
            <h6 class="fw-bold mb-3">Tags:</h6>
            <div class="d-flex flex-wrap gap-2">
                <span v-for="tag in baiViet.tags" :key="tag" class="badge bg-light text-dark">
                #{{ tag }}
                </span>
            </div>
            </div>
            
            <!-- Stats -->
            <div class="stats mb-4">
            <div class="row g-3">
                <div class="col-4">
                <div class="stat-item text-center p-3 bg-light rounded-3">
                    <i class="bi bi-eye display-6 text-primary mb-2"></i>
                    <h4 class="fw-bold">{{ baiViet?.views?.toLocaleString() || '0' }}</h4>
                    <small class="text-muted">Lượt xem</small>
                </div>
                </div>
                <div class="col-4">
                <div class="stat-item text-center p-3 bg-light rounded-3">
                    <i class="bi bi-heart display-6 text-danger mb-2"></i>
                    <h4 class="fw-bold">{{ baiViet?.likes || '0' }}</h4>
                    <small class="text-muted">Likes</small>
                </div>
                </div>
                <div class="col-4">
                <div class="stat-item text-center p-3 bg-light rounded-3">
                    <i class="bi bi-chat-dots display-6 text-success mb-2"></i>
                    <h4 class="fw-bold">{{ baiViet?.comments_count || '0' }}</h4>
                    <small class="text-muted">Bình luận</small>
                </div>
                </div>
            </div>
            </div>
            
            <!-- Author Info -->
            <div class="author-info mb-5">
            <div class="card border-0 bg-light">
                <div class="card-body">
                <div class="d-flex align-items-center">
                    <div v-if="baiViet?.author_avatar" class="author-avatar me-3">
                    <img :src="baiViet.author_avatar" :alt="baiViet.author" class="rounded-circle" width="60" height="60">
                    </div>
                    <div v-else class="author-avatar bg-primary rounded-circle d-flex align-items-center justify-content-center me-3">
                    <i class="bi bi-person text-white fs-3"></i>
                    </div>
                    <div>
                    <h6 class="fw-bold mb-1">{{ baiViet?.author || 'Tuấn Anh' }}</h6>
                    <p class="text-muted mb-2">Tác giả bài viết</p>
                    <div class="author-social d-flex gap-2">
                        <a :href="socialLinks.github" target="_blank" class="text-muted">
                        <i class="bi bi-github"></i>
                        </a>
                        <a :href="socialLinks.linkedin" target="_blank" class="text-muted">
                        <i class="bi bi-linkedin"></i>
                        </a>
                        <a :href="socialLinks.twitter" target="_blank" class="text-muted">
                        <i class="bi bi-twitter"></i>
                        </a>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
            
            <!-- Related Posts -->
            <div class="related-posts" v-if="relatedPosts.length > 0">
            <h6 class="fw-bold mb-3">Bài viết liên quan:</h6>
            <div class="row g-3">
                <div v-for="post in relatedPosts" :key="post.id" class="col-md-6">
                <div class="related-post-card p-3 bg-light rounded-3 d-flex align-items-center" 
                    style="cursor: pointer" @click="viewRelatedPost(post)">
                    <div class="flex-shrink-0">
                    <i :class="`bi bi-journal-text text-${post.badge_color || 'primary'} fs-4 me-3`"></i>
                    </div>
                    <div class="flex-grow-1">
                    <h6 class="fw-bold mb-1">{{ post.title }}</h6>
                    <small class="text-muted">{{ post.time_ago || 'Mới đây' }}</small>
                    </div>
                </div>
                </div>
            </div>
            </div>
            
            <!-- Comments Section -->
            <div class="comments-section mt-5">
            <h6 class="fw-bold mb-3">Bình luận ({{ baiViet?.comments_count || '0' }})</h6>
            <div class="comment-form mb-4">
                <textarea class="form-control" rows="3" placeholder="Thêm bình luận của bạn..."></textarea>
                <div class="d-flex justify-content-end mt-2">
                <button class="btn btn-primary btn-sm">
                    <i class="bi bi-send me-1"></i>Gửi bình luận
                </button>
                </div>
            </div>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-outline-secondary me-2" @click="closeModal">
            <i class="bi bi-x-circle me-1"></i>Đóng
            </button>
            <button type="button" class="btn btn-primary me-2" @click="shareArticle">
            <i class="bi bi-share me-1"></i>Chia sẻ
            </button>
            <button type="button" class="btn btn-outline-primary" @click="likeArticle">
            <i class="bi bi-heart me-1"></i>Thích ({{ baiViet?.likes || '0' }})
            </button>
        </div>
        </div>
    </div>
    </template>

    <script setup>
    import { defineProps, defineEmits, computed } from 'vue';

    const props = defineProps({
    show: Boolean,
    baiViet: Object,
    allPosts: {
        type: Array,
        default: () => []
    },
    socialLinks: {
        type: Object,
        default: () => ({})
    }
    });

    const emit = defineEmits(['close', 'view-post', 'like-post']);

    const closeModal = () => {
    emit('close');
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

    const getArticleContent = (post) => {
    const categoryContent = {
        'Vue.js': `
        <div class="article-section">
            <h4>Giới thiệu Vue.js</h4>
            <p>Vue.js là một framework JavaScript tiến bộ cho xây dựng giao diện người dùng. Khác với các framework nguyên khối, Vue được thiết kế từ đầu để có thể áp dụng từng phần.</p>
            
            <h5>Tính năng chính của Vue 3</h5>
            <ul>
                <li><strong>Composition API:</strong> Cung cấp cách tổ chức code linh hoạt hơn Options API</li>
                <li><strong>Reactivity System:</strong> Hệ thống reactive mạnh mẽ với Proxy-based implementation</li>
                <li><strong>Teleport:</strong> Render component ở bất kỳ đâu trong DOM</li>
                <li><strong>Suspense:</strong> Xử lý async operations trong component</li>
            </ul>
            
            <h5>Ví dụ cơ bản</h5>
            <pre><code>import { createApp, ref } from 'vue'

    const app = createApp({
        setup() {
        const count = ref(0)
        const increment = () => count.value++
        
        return { count, increment }
        }
    })
    
    app.mount('#app')</code></pre>
        </div>
        `,
        'JavaScript': `
        <div class="article-section">
            <h4>ES6+ Features Overview</h4>
            <p>ECMAScript 6 (ES6) đã mang đến nhiều tính năng mới giúp JavaScript trở nên mạnh mẽ và dễ sử dụng hơn.</p>
            
            <h5>Những tính năng quan trọng</h5>
            <ul>
                <li><strong>Arrow Functions:</strong> Cú pháp hàm ngắn gọn với lexical this binding</li>
                <li><strong>Template Literals:</strong> String interpolation và multi-line strings</li>
                <li><strong>Destructuring:</strong> Trích xuất dữ liệu từ arrays và objects</li>
                <li><strong>Modules:</strong> Import/export với ES6 module syntax</li>
                <li><strong>Promises & Async/Await:</strong> Xử lý asynchronous operations</li>
            </ul>
            
            <h5>Ví dụ Async/Await</h5>
            <pre><code>async function fetchUserData(userId) {
        try {
        const response = await fetch(\`/api/users/\${userId}\`)
        const data = await response.json()
        return data
        } catch (error) {
        console.error('Error:', error)
        }
    }</code></pre>
        </div>
        `,
        'CSS3': `
        <div class="article-section">
            <h4>CSS3 Advanced Techniques</h4>
            <p>CSS3 mang đến nhiều tính năng mới giúp tạo giao diện hiện đại và responsive.</p>
            
            <h5>Kỹ thuật nâng cao</h5>
            <ul>
                <li><strong>CSS Grid:</strong> Hệ thống layout 2D mạnh mẽ cho thiết kế web</li>
                <li><strong>Flexbox:</strong> Layout module cho việc sắp xếp items trong container</li>
                <li><strong>CSS Variables:</strong> Biến CSS để tái sử dụng giá trị</li>
                <li><strong>Animations:</strong> Tạo hiệu ứng chuyển động phức tạp</li>
                <li><strong>Responsive Design:</strong> Media queries và mobile-first approach</li>
            </ul>
            
            <h5>Ví dụ CSS Grid</h5>
            <pre><code>.container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        grid-gap: 20px;
        padding: 20px;
    }
    
    .item {
        background: #fff;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }</code></pre>
        </div>
        `
    };
    
    return categoryContent[post?.category] || `
        <div class="article-section">
            <h4>${post?.title || 'Bài viết'}</h4>
            <p>Bài viết này cung cấp kiến thức chi tiết về ${post?.category || 'công nghệ'}.</p>
            <p>Nội dung đang được cập nhật...</p>
        </div>
    `;
    };

    const relatedPosts = computed(() => {
    if (!props.baiViet || !props.allPosts.length) return [];
    return props.allPosts
        .filter(post => post.id !== props.baiViet.id)
        .slice(0, 2);
    });

    const viewRelatedPost = (post) => {
    emit('view-post', post);
    };

    const shareArticle = () => {
    if (navigator.share) {
        navigator.share({
        title: props.baiViet?.title || 'Bài viết',
        text: props.baiViet?.excerpt || '',
        url: window.location.href
        });
    } else {
        const text = `${props.baiViet?.title || 'Bài viết'} - ${props.baiViet?.excerpt || ''}`;
        alert(`Chia sẻ bài viết: ${text}\n\nURL: ${window.location.href}`);
    }
    };

    const likeArticle = () => {
    emit('like-post', props.baiViet?.id);
    };
    </script>

    <style scoped>
    .bai-viet-chi-tiet-modal {
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
    max-width: 800px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.2);
    animation: modalSlideIn 0.3s ease;
    }

    @keyframes modalSlideIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
    }

    .modal-header {
    padding: 1.5rem;
    border-bottom: 1px solid #dee2e6;
    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
    }

    .modal-title {
    font-size: 1.5rem;
    font-weight: bold;
    color: #333;
    }

    .post-meta {
    font-size: 0.9rem;
    }

    .modal-body {
    padding: 1.5rem;
    }

    .featured-image img {
    width: 100%;
    max-height: 300px;
    object-fit: cover;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }

    .image-placeholder {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }

    .excerpt {
    border-left: 4px solid #667eea;
    padding-left: 1rem;
    font-size: 1.1rem;
    }

    .article-content {
    line-height: 1.8;
    color: #333;
    }

    .article-content h4 {
    color: #333;
    margin-top: 1.5rem;
    margin-bottom: 1rem;
    font-weight: 600;
    }

    .article-content h5 {
    color: #555;
    margin-top: 1.25rem;
    margin-bottom: 0.75rem;
    font-weight: 600;
    }

    .article-content ul {
    padding-left: 1.5rem;
    margin-bottom: 1rem;
    }

    .article-content li {
    margin-bottom: 0.5rem;
    position: relative;
    }

    .article-content li::before {
    content: "•";
    color: #667eea;
    font-weight: bold;
    display: inline-block;
    width: 1em;
    margin-left: -1em;
    }

    .article-content pre {
    background: #f8f9fa;
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
    margin: 1rem 0;
    border: 1px solid #e9ecef;
    }

    .article-content code {
    font-family: 'Courier New', Courier, monospace;
    color: #e83e8c;
    background: #f8f9fa;
    padding: 2px 4px;
    border-radius: 4px;
    font-size: 0.9em;
    }

    .article-content pre code {
    background: transparent;
    padding: 0;
    color: inherit;
    }

    .stat-item {
    transition: all 0.3s ease;
    }

    .stat-item:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }

    .author-info {
    border-top: 1px solid #dee2e6;
    padding-top: 1.5rem;
    }

    .author-avatar {
    width: 60px;
    height: 60px;
    }

    .author-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    }

    .author-social a {
    font-size: 1.2rem;
    transition: all 0.3s ease;
    }

    .author-social a:hover {
    color: #667eea !important;
    transform: translateY(-2px);
    }

    .related-post-card {
    transition: all 0.3s ease;
    border: 1px solid #dee2e6;
    }

    .related-post-card:hover {
    background: #e9ecef !important;
    transform: translateX(5px);
    border-color: #667eea;
    }

    .comment-form textarea {
    border: 1px solid #dee2e6;
    border-radius: 8px;
    resize: vertical;
    }

    .comment-form textarea:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 0.25rem rgba(102, 126, 234, 0.25);
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
        font-size: 1.25rem;
    }
    
    .featured-image img {
        max-height: 200px;
    }
    
    .stat-item h4 {
        font-size: 1.25rem;
    }
    
    .post-meta {
        flex-wrap: wrap;
        gap: 0.5rem;
    }
    
    .post-meta > span {
        margin: 0.25rem 0;
    }
    }
    </style>