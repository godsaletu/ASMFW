<script setup>
import { ref, computed, onMounted } from "vue"

const API_URL = 'https://asmfw-4.onrender.com'



const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['logout'])

// State
const activeTab = ref('users')
const showAddUserForm = ref(false)
const showContactModal = ref(false)
const selectedContact = ref(null)

// Dữ liệu
const users = ref([])
const contacts = ref([])

// Dữ liệu người dùng mới
const newUser = ref({
  full_name: '',
  email: '',
  password: '',
  role: 'user',
  status: 'active',
  joined_date: new Date().toISOString().split('T')[0]
})

// Load users từ JSON Server
const loadUsers = async () => {
  try {
    const response = await fetch(`${API_URL}/users`)
    users.value = await response.json()
  } catch (error) {
    console.log('Không thể tải users')
  }
}

// Load contacts từ JSON Server
const loadContacts = async () => {
  try {
    const response = await fetch(`${API_URL}/contacts`)
    contacts.value = await response.json()
  } catch (error) {
    console.log('Không thể tải contacts')
  }
}

// Statistics cho contacts
const newContacts = computed(() => 
  contacts.value.filter(c => c.status === 'new').length
)

const readContacts = computed(() => 
  contacts.value.filter(c => c.status === 'read').length
)

const repliedContacts = computed(() => 
  contacts.value.filter(c => c.status === 'replied').length
)

// Format date
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN')
}

// Status helpers cho contact
const getStatusLabel = (status) => {
  const labels = {
    'new': 'Mới',
    'read': 'Đã đọc', 
    'replied': 'Đã trả lời'
  }
  return labels[status] || status
}

const getStatusBadge = (status) => {
  const badges = {
    'new': 'bg-danger',
    'read': 'bg-info',
    'replied': 'bg-success'
  }
  return badges[status] || 'bg-secondary'
}

// User management
const addUser = async () => {
  if (!newUser.value.full_name || !newUser.value.email || !newUser.value.password) {
    alert('Vui lòng điền đầy đủ thông tin')
    return
  }

  // Check if email already exists từ JSON Server
  const checkResponse = await fetch(`${API_URL}/users?email=${newUser.value.email}`)
  const existingUsers = await checkResponse.json()
  if (existingUsers.length > 0) {
    alert('Email đã tồn tại!')
    return
  }

  // Create new user
  const userToAdd = {
    ...newUser.value,
    id: Date.now(),
    bio: 'Người dùng mới',
    avatar: null
  }

  // Save to JSON Server
  await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userToAdd)
  })

  // Reset form
  newUser.value = {
    full_name: '',
    email: '',
    password: '',
    role: 'user',
    status: 'active',
    joined_date: new Date().toISOString().split('T')[0]
  }
  showAddUserForm.value = false
  await loadUsers() // Tải lại danh sách
  alert('Thêm người dùng thành công!')
}

const editUser = async (user) => {
  const newRole = prompt(`Thay đổi vai trò cho ${user.full_name}:`, user.role)
  if (newRole && ['admin', 'user'].includes(newRole)) {
    // Update on JSON Server
    await fetch(`${API_URL}/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole })
    })
    await loadUsers() // Tải lại
    alert(`Đã cập nhật vai trò thành ${newRole}`)
  }
}

const deleteUser = async (userId) => {
  if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
    // Không cho xóa admin mặc định (ID: 1)
    if (userId === 1) {
      alert('Không thể xóa tài khoản admin mặc định!')
      return
    }

    // Delete from JSON Server
    await fetch(`${API_URL}/users/${userId}`, { method: 'DELETE' })
    await loadUsers() // Tải lại
    alert('Xóa người dùng thành công!')
  }
}

// Contact management
const viewContact = (contact) => {
  selectedContact.value = contact
  showContactModal.value = true
  
  // Mark as read if new
  if (contact.status === 'new') {
    markAsRead(contact.id)
  }
}

const markAsRead = async (contactId) => {
  // Update status on JSON Server
  await fetch(`${API_URL}/contacts/${contactId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'read' })
  })
  await loadContacts()
}

const markAsReplied = async (contactId) => {
  // Update status on JSON Server
  await fetch(`${API_URL}/contacts/${contactId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'replied' })
  })
  await loadContacts()
}

const deleteContact = async (contactId) => {
  if (confirm('Bạn có chắc chắn muốn xóa liên hệ này?')) {
    // Delete from JSON Server
    await fetch(`${API_URL}/contacts/${contactId}`, { method: 'DELETE' })
    await loadContacts()
  }
}

const clearAllContacts = async () => {
  if (confirm('Bạn có chắc chắn muốn xóa TẤT CẢ liên hệ? Hành động này không thể hoàn tác!')) {
    // Delete all contacts from JSON Server
    for (const contact of contacts.value) {
      await fetch(`${API_URL}/contacts/${contact.id}`, { method: 'DELETE' })
    }
    await loadContacts()
  }
}

const replyEmail = (contact) => {
  // Mở email client để trả lời
  const subject = encodeURIComponent(`Re: ${contact.subject}`)
  const body = encodeURIComponent(`\n\n---\nTrả lời cho liên hệ từ: ${contact.name}`)
  window.open(`mailto:${contact.email}?subject=${subject}&body=${body}`)
  
  // Mark as replied
  markAsReplied(contact.id)
}

// Logout
const logout = () => {
  emit('logout')
}

// Initialize
onMounted(() => {
  loadUsers()
  loadContacts()
})
</script>
<template>
  <div class="admin-layout">
    <div class="container mt-4">
      <h1 class="text-center mb-4">Trang Quản Trị</h1>
      
      <!-- Thông báo -->
      <div v-if="message" class="alert" :class="messageType === 'success' ? 'alert-success' : 'alert-danger'">
        {{ message }}
        <button type="button" class="btn-close" @click="message = ''"></button>
      </div>

      <!-- Hai tab chính: Người dùng và Liên hệ -->
      <div class="mb-4">
        <ul class="nav nav-tabs">
          <li class="nav-item">
            <button class="nav-link" :class="{ active: activeTab === 'users' }" 
                    @click="activeTab = 'users'">
              <i class="bi bi-people me-2"></i>Người Dùng ({{ users.length }})
            </button>
          </li>
          <li class="nav-item">
            <button class="nav-link" :class="{ active: activeTab === 'contacts' }" 
                    @click="activeTab = 'contacts'">
              <i class="bi bi-envelope me-2"></i>Liên Hệ ({{ contacts.length }})
            </button>
          </li>
        </ul>
      </div>

      <!-- Nội dung -->
      <div class="tab-content p-3 border rounded-bottom">
        
        <!-- Tab Người Dùng -->
        <div v-if="activeTab === 'users'" class="tab-pane fade show active">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="mb-0">Quản lý người dùng</h4>
            <button class="btn btn-primary btn-sm" @click="showAddUserForm = true">
              <i class="bi bi-person-plus me-1"></i>Thêm người dùng
            </button>
          </div>
          
          <!-- Form thêm người dùng -->
          <div v-if="showAddUserForm" class="card mb-4">
            <div class="card-body">
              <h5 class="card-title">Thêm người dùng mới</h5>
              <form @submit.prevent="addUser">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="form-label">Họ tên</label>
                    <input type="text" v-model="newUser.full_name" class="form-control" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Email</label>
                    <input type="email" v-model="newUser.email" class="form-control" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Mật khẩu</label>
                    <input type="password" v-model="newUser.password" class="form-control" required>
                  </div>
                  <div class="col-md-6">
                    <label class="form-label">Vai trò</label>
                    <select v-model="newUser.role" class="form-select">
                      <option value="user">Người dùng</option>
                      <option value="admin">Quản trị viên</option>
                    </select>
                  </div>
                  <div class="col-12">
                    <div class="d-flex gap-2">
                      <button type="submit" class="btn btn-success">Thêm người dùng</button>
                      <button type="button" class="btn btn-secondary" @click="showAddUserForm = false">Hủy</button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
          
          <!-- Danh sách người dùng -->
          <div class="table-responsive">
            <table class="table table-striped table-hover">
              <thead class="table-dark">
                <tr>
                  <th width="50">ID</th>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>Vai trò</th>
                  <th>Ngày tham gia</th>
                  <th>Trạng thái</th>
                  <th width="150">Hành động</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id">
                  <td>{{ user.id }}</td>
                  <td>
                    <div class="d-flex align-items-center">
                      <i class="bi bi-person-circle me-2"></i>
                      {{ user.full_name }}
                    </div>
                  </td>
                  <td>{{ user.email }}</td>
                  <td>
                    <span class="badge" :class="user.role === 'admin' ? 'bg-danger' : 'bg-primary'">
                      {{ user.role === 'admin' ? 'Admin' : 'User' }}
                    </span>
                  </td>
                  <td>{{ formatDate(user.joined_date) }}</td>
                  <td>
                    <span class="badge" :class="user.status === 'active' ? 'bg-success' : 'bg-secondary'">
                      {{ user.status === 'active' ? 'Hoạt động' : 'Không hoạt động' }}
                    </span>
                  </td>
                  <td>
                    <div class="btn-group btn-group-sm">
                      <button class="btn btn-warning" @click="editUser(user)">
                        <i class="bi bi-pencil"></i>
                      </button>
                      <button class="btn btn-danger" @click="deleteUser(user.id)" 
                              :disabled="user.id === 1">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div class="alert alert-info mt-3">
            <i class="bi bi-info-circle me-2"></i>
            <strong>Lưu ý:</strong> 
            - Tài khoản Admin (ID: 1) không thể xóa<br>
            - Người dùng mới có thể đăng nhập ngay sau khi được thêm
          </div>
        </div>

        <!-- Tab Liên Hệ -->
        <div v-if="activeTab === 'contacts'" class="tab-pane fade show active">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="mb-0">Quản lý liên hệ</h4>
            <div>
              <button class="btn btn-sm btn-primary me-2" @click="loadContacts">
                <i class="bi bi-arrow-clockwise me-1"></i>Tải lại
              </button>
              <button class="btn btn-sm btn-danger" @click="clearAllContacts">
                <i class="bi bi-trash me-1"></i>Xóa tất cả
              </button>
            </div>
          </div>
          
          <!-- Thống kê -->
          <div class="row mb-4">
            <div class="col-md-3">
              <div class="card text-center">
                <div class="card-body">
                  <h3 class="text-primary">{{ contacts.length }}</h3>
                  <p class="text-muted mb-0">Tổng liên hệ</p>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card text-center">
                <div class="card-body">
                  <h3 class="text-danger">{{ newContacts }}</h3>
                  <p class="text-muted mb-0">Chưa đọc</p>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card text-center">
                <div class="card-body">
                  <h3 class="text-success">{{ repliedContacts }}</h3>
                  <p class="text-muted mb-0">Đã trả lời</p>
                </div>
              </div>
            </div>
            <div class="col-md-3">
              <div class="card text-center">
                <div class="card-body">
                  <h3 class="text-info">{{ readContacts }}</h3>
                  <p class="text-muted mb-0">Đã đọc</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Danh sách liên hệ -->
          <div v-if="contacts.length === 0" class="text-center py-4 text-muted">
            <i class="bi bi-inbox display-4"></i>
            <p class="mt-2">Chưa có liên hệ nào</p>
            <small>Khi người dùng gửi form liên hệ, dữ liệu sẽ xuất hiện ở đây</small>
          </div>
          
          <div v-else class="table-responsive">
            <table class="table table-striped table-hover">
              <thead class="table-dark">
                <tr>
                  <th width="50">ID</th>
                  <th>Họ tên</th>
                  <th>Email</th>
                  <th>Tiêu đề</th>
                  <th>Ngày gửi</th>
                  <th>Trạng thái</th>
                  <th width="200">Hành động</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="contact in contacts" :key="contact.id" 
                    :class="{'table-info': contact.status === 'new'}">
                  <td>{{ contact.id }}</td>
                  <td>{{ contact.name }}</td>
                  <td>
                    <a :href="`mailto:${contact.email}`" class="text-decoration-none">
                      {{ contact.email }}
                    </a>
                  </td>
                  <td>{{ contact.subject }}</td>
                  <td>{{ formatDate(contact.date) }}</td>
                  <td>
                    <span class="badge" :class="getStatusBadge(contact.status)">
                      {{ getStatusLabel(contact.status) }}
                    </span>
                  </td>
                  <td>
                    <div class="btn-group btn-group-sm">
                      <button class="btn btn-info" @click="viewContact(contact)">
                        <i class="bi bi-eye"></i> Xem
                      </button>
                      <button class="btn btn-success" @click="markAsRead(contact.id)" 
                              v-if="contact.status === 'new'">
                        <i class="bi bi-check"></i> Đã đọc
                      </button>
                      <button class="btn btn-danger" @click="deleteContact(contact.id)">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Modal xem chi tiết liên hệ -->
      <div class="modal fade" :class="{ show: showContactModal }" v-if="showContactModal" 
           @click.self="showContactModal = false">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Liên hệ #{{ selectedContact?.id }}</h5>
              <button type="button" class="btn-close" @click="showContactModal = false"></button>
            </div>
            <div class="modal-body" v-if="selectedContact">
              <div class="row">
                <div class="col-md-6">
                  <p><strong>Họ tên:</strong> {{ selectedContact.name }}</p>
                  <p><strong>Email:</strong> {{ selectedContact.email }}</p>
                  <p><strong>Tiêu đề:</strong> {{ selectedContact.subject }}</p>
                  <p><strong>Trạng thái:</strong> {{ getStatusLabel(selectedContact.status) }}</p>
                  <p><strong>Ngày gửi:</strong> {{ formatDate(selectedContact.date) }}</p>
                </div>
                <div class="col-md-6">
                  <p><strong>Nội dung:</strong></p>
                  <div class="border p-3 rounded bg-light">
                    {{ selectedContact.message }}
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="showContactModal = false">Đóng</button>
              <button type="button" class="btn btn-primary" @click="replyEmail(selectedContact)">
                <i class="bi bi-reply me-1"></i>Trả lời email
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Nút đăng xuất -->
      <div class="text-center mt-4">
        <button class="btn btn-outline-danger" @click="logout">
          <i class="bi bi-box-arrow-left me-2"></i>Đăng xuất
        </button>
      </div>
    </div>
  </div>
</template>

<!-- AdminLayout.vue - Phần cần bổ sung vào script setup -->


<style scoped>
.admin-layout {
  min-height: calc(100vh - 200px);
}

.nav-tabs .nav-link {
  color: #666;
  font-weight: 500;
}

.nav-tabs .nav-link.active {
  color: #0d6efd;
  font-weight: 600;
  border-bottom: 3px solid #0d6efd;
}

.modal {
  display: block;
  background-color: rgba(0, 0, 0, 0.5);
}

.table th, .table td {
  vertical-align: middle;
}

.btn-group-sm .btn {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.card {
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.badge {
  font-weight: 500;
}

@media (max-width: 768px) {
  .table-responsive {
    font-size: 0.9rem;
  }
  
  .btn-group {
    flex-wrap: wrap;
  }
  
  .btn-group .btn {
    margin-bottom: 2px;
  }
}
</style>
