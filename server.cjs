const jsonServer = require('json-server');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// =======================
// CORS MIDDLEWARE (ĐẶT Ở ĐẦU)
// =======================
const cors = require('cors');


// =======================
// HEADER CHO GOOGLE POPUP
// =======================
server.use((req, res, next) => {
  // Chỉ cho phép domain front-end
  res.header('Access-Control-Allow-Origin', 'https://asmfw.vercel.app');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  // Cho phép preflight requests
  if (req.method === 'OPTIONS') return res.sendStatus(200);

  next();
});


// =======================
// OPTIONS HANDLER
// =======================
server.options('*', (req, res) => {
  res.sendStatus(200);
});

server.use(jsonServer.bodyParser);
server.use(middlewares);

// =======================
// 0. ROOT ROUTE - HIỂN THỊ THÔNG TIN SERVER
// =======================
server.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🚀 API Server đang chạy!',
    version: '1.0.0',
    author: 'Huỳnh Tuấn Anh',
    timestamp: new Date().toISOString(),
    endpoints: [
      { method: 'GET', path: '/api', description: 'Truy cập JSON database' },
      { method: 'GET', path: '/api/users', description: 'Lấy danh sách người dùng' },
      { method: 'GET', path: '/api/contacts', description: 'Lấy danh sách liên hệ' },
      { method: 'POST', path: '/api/send-contact-mail', description: 'Gửi email liên hệ từ form' },
      { method: 'POST', path: '/api/send-reply', description: 'Gửi phản hồi từ admin' },
      { method: 'POST', path: '/api/send-mail', description: 'Gửi email đơn giản' }
    ],
    documentation: 'Truy cập /api để xem toàn bộ database'
  });
});

// =======================
// 1. JSON-SERVER ROUTES
// =======================
server.use('/api', router); // Truy cập data qua /api/users, /api/contacts

// =======================
// 2. NODEMAILER TRANSPORTER
// =======================
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

// =======================
// 3. API GỬI MAIL LIÊN HỆ (Khi user submit form)
// =======================
server.post('/api/send-contact-mail', async (req, res) => {
  const { name, email, subject, message, type } = req.body;

  try {
    // Gửi thông báo đến admin
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER, // Gửi cho chính admin
      subject: `📨 LIÊN HỆ MỚI: ${subject}`,
      html: `
        <h3>📬 Có liên hệ mới từ website</h3>
        <p><strong>Người gửi:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Tiêu đề:</strong> ${subject}</p>
        <p><strong>Loại:</strong> ${type || 'Không xác định'}</p>
        <p><strong>Nội dung:</strong></p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
          ${message.replace(/\n/g, '<br>')}
        </div>
        <hr>
        <p><small>Thời gian: ${new Date().toLocaleString('vi-VN')}</small></p>
      `
    });

    // Gửi email xác nhận cho người dùng
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: email,
      subject: `✅ Đã nhận liên hệ: ${subject}`,
      html: `
        <h3>Cảm ơn bạn đã liên hệ!</h3>
        <p>Chào <strong>${name}</strong>,</p>
        <p>Tôi đã nhận được tin nhắn của bạn với nội dung:</p>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <strong>${subject}</strong><br><br>
          ${message.replace(/\n/g, '<br>')}
        </div>
        <p>Tôi sẽ phản hồi lại bạn trong thời gian sớm nhất.</p>
        <p>Trân trọng,<br>Huỳnh Tuấn Anh</p>
        <hr>
        <p><small>Đây là email tự động, vui lòng không trả lời email này.</small></p>
      `
    });

    res.json({ success: true, message: 'Đã gửi mail thông báo!' });
  } catch (err) {
    console.error('❌ Lỗi gửi mail liên hệ:', err);
    res.status(500).json({ success: false, message: 'Gửi email thất bại', error: err.message });
  }
});

// =======================
// 4. API TRẢ LỜI TỪ ADMIN
// =======================
server.post('/api/send-reply', async (req, res) => {
  const { to, subject, text, replyToName } = req.body;

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      subject: subject || 'Phản hồi từ Huỳnh Tuấn Anh',
      html: `
        <h3>Chào ${replyToName},</h3>
        <p>Cảm ơn bạn đã liên hệ với tôi. Dưới đây là phản hồi:</p>
        <div style="background: #f0f8ff; padding: 20px; border-left: 4px solid #007bff; margin: 15px 0;">
          ${text.replace(/\n/g, '<br>')}
        </div>
        <p>Nếu bạn có thêm câu hỏi, đừng ngần ngại liên hệ lại.</p>
        <p>Trân trọng,<br><strong>Huỳnh Tuấn Anh</strong></p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          Đây là email phản hồi tự động từ hệ thống.
        </p>
      `
    });

    res.json({ success: true, message: 'Đã gửi phản hồi!' });
  } catch (err) {
    console.error('❌ Lỗi gửi reply:', err);
    res.status(500).json({ success: false, message: 'Gửi phản hồi thất bại', error: err.message });
  }
});

// =======================
// 5. API TEST GỬI MAIL ĐƠN GIẢN
// =======================
server.post('/api/send-mail', async (req, res) => {
  const { to, subject, text, html } = req.body;

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to,
      subject,
      text: text || '',
      html: html || (text ? text.replace(/\n/g, '<br>') : '')
    });

    res.json({ success: true, message: 'Email đã gửi thành công!' });
  } catch (err) {
    console.error('❌ Lỗi gửi mail:', err);
    res.status(500).json({ success: false, message: 'Gửi email thất bại', error: err.message });
  }
});

// =======================
// 6. CREATE DB FILE IF NOT EXISTS
// =======================
const dbPath = path.join(__dirname, 'db.json');
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, JSON.stringify({
    users: [
      {
        id: 1,
        full_name: "Admin",
        email: "admin@example.com",
        password: "admin123",
        role: "admin",
        status: "active",
        joined_date: "2024-01-01"
      }
    ],
    contacts: []
  }, null, 2));
  console.log('✅ Đã tạo file db.json mới');
}

// =======================
// 7. START SERVER
// =======================
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
  console.log(`📧 Gmail user: ${process.env.GMAIL_USER}`);
  console.log(`📁 Database: http://localhost:${PORT}/api`);
  console.log(`🏠 Root API info: http://localhost:${PORT}/`);
});
