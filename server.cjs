const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('data.json');
const middlewares = jsonServer.defaults();
const nodemailer = require("nodemailer");
require('dotenv').config();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// CORS FIX - Render.com cần linh hoạt hơn
server.use((req, res, next) => {
  const allowedOrigins = [
    'https://asmfw.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173',
    'https://*.vercel.app',
    'https://*.onrender.com'
  ];
  
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin) || !origin) {
    res.header('Access-Control-Allow-Origin', origin || '*');
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// =======================
// 📌 CẤU HÌNH EMAIL CHO RENDER.COM
// =======================
const ADMIN_EMAIL = process.env.GMAIL_USER || "anhtienong@gmail.com";
const ADMIN_PASSWORD = process.env.GMAIL_PASS || "hwor bkox eumj jmtj";

// Tạo transporter với cấu hình tương thích Render.com
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: ADMIN_EMAIL,
    pass: ADMIN_PASSWORD
  },
  // Thêm tùy chọn cho môi trường cloud
  pool: true,
  maxConnections: 1,
  rateDelta: 20000,
  rateLimit: 5
});

// Kiểm tra kết nối email
transporter.verify(function(error, success) {
  if (error) {
    console.log("❌ Email connection error:", error);
  } else {
    console.log("✅ Email server is ready to send");
    console.log("📧 Email user:", ADMIN_EMAIL);
  }
});

// =======================
// 📌 1. API gửi email từ form liên hệ (CHO ADMIN)
// =======================
server.post("/api/send-contact-mail", async (req, res) => {
  const { name, email, subject, message, type } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ 
      success: false, 
      message: "Thiếu thông tin cần thiết" 
    });
  }

  try {
    console.log(`📨 Nhận liên hệ từ: ${name} (${email})`);
    
    // Gửi thông báo đến admin
    await transporter.sendMail({
      from: `"Portfolio Contact" <${ADMIN_EMAIL}>`,
      to: ADMIN_EMAIL,
      replyTo: email,
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
      from: `"Huỳnh Tuấn Anh" <${ADMIN_EMAIL}>`,
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

    console.log(`✅ Đã gửi thông báo liên hệ từ ${name} đến ADMIN và người dùng`);
    
    res.json({ 
      success: true, 
      message: "Liên hệ đã được gửi thành công!" 
    });

  } catch (error) {
    console.error("❌ Contact Email Error:", error);
    
    res.status(500).json({ 
      success: false, 
      message: "Gửi email thất bại. Vui lòng thử lại sau.",
      error: error.message
    });
  }
});

// =======================
// 📌 2. API gửi email phản hồi từ Admin (CHO NGƯỜI DÙNG)
// =======================
server.post("/api/send-reply", async (req, res) => {
  const { to, subject, text, replyToName } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ 
      success: false, 
      message: "Thiếu thông tin cần thiết" 
    });
  }

  try {
    // Kiểm tra email hợp lệ
    if (!to.includes('@') || !to.includes('.')) {
      throw new Error(`Email không hợp lệ: ${to}`);
    }

    console.log(`📤 Đang gửi phản hồi từ Admin đến: ${to}`);
    
    await transporter.sendMail({
      from: `"Huỳnh Tuấn Anh" <${ADMIN_EMAIL}>`,
      to: to.trim(),
      subject: subject || 'Phản hồi từ Huỳnh Tuấn Anh',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto;">
          <div style="background: #198754; color: white; padding: 20px; border-radius: 10px 10px 0 0;">
            <h2 style="margin: 0;">📬 Phản hồi từ TuanAnh Dev</h2>
          </div>
          
          <div style="background: #f8f9fa; padding: 25px; border-radius: 0 0 10px 10px;">
            <p>Xin chào <strong style="color: #198754;">${replyToName || "bạn"}</strong>,</p>
            <p>Cảm ơn bạn đã liên hệ với tôi. Dưới đây là phản hồi:</p>
            
            <div style="background: white; padding: 20px; border-left: 4px solid #198754; margin: 20px 0;">
              ${text.replace(/\n/g, '<br>')}
            </div>
            
            <div style="background: white; padding: 15px; border-radius: 5px; border: 1px solid #dee2e6;">
              <p>Trân trọng,</p>
              <p>
                <strong>Huỳnh Tuấn Anh</strong><br>
                <span style="color: #666;">Full-Stack Web Developer</span><br>
                <span style="color: #666;">📧 Email: ${ADMIN_EMAIL}</span><br>
                <span style="color: #666;">📱 Phone: 0972 147 819</span>
              </p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
              <p><em>⏰ Thời gian: ${new Date().toLocaleString('vi-VN')}</em></p>
              <p><em>⚠️ Đây là email tự động. Vui lòng không trả lời email này.</em></p>
            </div>
          </div>
        </div>
      `
    });

    console.log(`✅ Đã gửi phản hồi thành công đến: ${to}`);
    
    res.json({ 
      success: true, 
      message: "Đã gửi phản hồi thành công!"
    });

  } catch (error) {
    console.error("❌ Reply Email Error:", error);
    console.error("📧 Email gửi đến:", to);
    console.error("🔧 Error details:", error.message);
    
    let errorMessage = "Gửi phản hồi thất bại";
    
    if (error.message.includes("550")) {
      errorMessage = "Email người nhận không tồn tại hoặc không hợp lệ";
    } else if (error.message.includes("535")) {
      errorMessage = "Lỗi xác thực email. Kiểm tra App Password";
    } else if (error.message.includes("connection")) {
      errorMessage = "Lỗi kết nối đến máy chủ email";
    }
    
    res.status(500).json({ 
      success: false, 
      message: errorMessage,
      error: error.message,
      to: to
    });
  }
});

// =======================
// 📌 3. API KIỂM TRA EMAIL (debug)
// =======================
server.post("/api/test-email", async (req, res) => {
  const { to } = req.body;
  
  try {
    const testMail = await transporter.sendMail({
      from: `"Test Email" <${ADMIN_EMAIL}>`,
      to: to || ADMIN_EMAIL,
      subject: "📧 Test Email từ Portfolio",
      text: "Đây là email test để kiểm tra hệ thống gửi mail.",
      html: "<p>Đây là email test để kiểm tra hệ thống gửi mail.</p>"
    });
    
    res.json({
      success: true,
      message: "Email test đã được gửi thành công!",
      messageId: testMail.messageId,
      to: to || ADMIN_EMAIL
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Gửi email test thất bại",
      error: error.message
    });
  }
});

// =======================
// 📌 4. HEALTH CHECK ENDPOINT (Render.com yêu cầu)
// =======================
server.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

server.use('/api', router);

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 JSON Server running at http://localhost:${PORT}`);
  console.log(`📨 POST /api/send-contact-mail (User → Admin)`);
  console.log(`📨 POST /api/send-reply (Admin → User)`);
  console.log(`📧 Email admin: ${ADMIN_EMAIL}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
  console.log(`📁 Database: http://localhost:${PORT}/api`);
  console.log(`⚠️ Môi trường: ${process.env.NODE_ENV || 'development'}`);
});
