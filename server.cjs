const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('data.json');
const middlewares = jsonServer.defaults();
const nodemailer = require('nodemailer');

server.use(middlewares);
server.use(jsonServer.bodyParser);

// CORS FIX
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// =======================
// 📌 CẤU HÌNH NODEMAILER
// =======================
const ADMIN_EMAIL = "anhtienong@gmail.com";
const ADMIN_PASSWORD = process.env.GMAIL_APP_PASSWORD; // Dùng App Password từ Google

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  requireTLS: true,
  auth: {
    user: "anhtienong@gmail.com",
    pass: "hwor bkox eumj jmtj",
  },
  tls: { 
    rejectUnauthorized: false,
    minVersion: "TLSv1.2"
  }
});

// Kiểm tra kết nối transporter
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ Lỗi kết nối Nodemailer:", error);
  } else {
    console.log("✅ Kết nối Nodemailer thành công!");
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
    // Gửi email thông báo cho ADMIN bằng Nodemailer
    const mailOptions = {
      from: `"Portfolio Contact" <${ADMIN_EMAIL}>`,
      to: ADMIN_EMAIL, // Chỉ gửi cho admin
      replyTo: email, // Người dùng có thể reply trực tiếp
      subject: `[LIÊN HỆ MỚI] ${subject}`,
      text: `
Liên hệ mới từ website:

Họ tên: ${name}
Email: ${email}
Loại: ${type || 'Không xác định'}
Tiêu đề: ${subject}

Nội dung:
${message}

Thời gian: ${new Date().toLocaleString('vi-VN')}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">📩 Liên hệ mới từ website</h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px;">
            <p><strong>👤 Họ tên:</strong> ${name}</p>
            <p><strong>📧 Email:</strong> ${email}</p>
            <p><strong>📌 Loại:</strong> ${type || 'Không xác định'}</p>
            <p><strong>📝 Tiêu đề:</strong> ${subject}</p>
            
            <div style="margin-top: 15px;">
              <strong>💬 Nội dung:</strong>
              <div style="background-color: white; padding: 15px; margin-top: 10px; border-radius: 5px;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
            
            <div style="margin-top: 20px; padding: 10px; background: #e7f3ff; border-radius: 5px;">
              <p style="margin: 5px 0;">
                <strong>🕐 Thời gian:</strong> ${new Date().toLocaleString('vi-VN')}
              </p>
              <p style="margin: 5px 0;">
                <strong>💡 Để trả lời:</strong> Click "Reply" trong email này
              </p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log(`✅ Đã gửi thông báo liên hệ từ ${name} đến ADMIN bằng Nodemailer`);
    
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      throw new Error(`Email không hợp lệ: ${to}`);
    }

    console.log(`📤 Đang gửi phản hồi từ Admin đến: ${to}`);
    
    const mailOptions = {
      from: `"TuanAnh Dev" <${ADMIN_EMAIL}>`,
      to: to.trim(), // Email người dùng
      subject: `[PHẢN HỒI] ${subject}`,
      text: `
Xin chào ${replyToName || "bạn"},

Cảm ơn bạn đã liên hệ với tôi. Dưới đây là phản hồi của tôi:

${text}

Trân trọng,
Huỳnh Tuấn Anh
Full-Stack Web Developer
Email: ${ADMIN_EMAIL}
Phone: 0972 147 819

Thời gian: ${new Date().toLocaleString('vi-VN')}
      `,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #198754; color: white; padding: 20px; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 25px; border-radius: 0 0 10px 10px; }
            .message { background: white; padding: 20px; border-left: 4px solid #198754; margin: 20px 0; }
            .footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin: 0;">📬 Phản hồi từ TuanAnh Dev</h2>
            </div>
            
            <div class="content">
              <p>Xin chào <strong style="color: #198754;">${replyToName || "bạn"}</strong>,</p>
              <p>Cảm ơn bạn đã liên hệ với tôi. Dưới đây là phản hồi của tôi:</p>
              
              <div class="message">
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
            </div>
            
            <div class="footer">
              <p><em>⏰ Thời gian: ${new Date().toLocaleString('vi-VN')}</em></p>
              <p><em>⚠️ Đây là email tự động. Vui lòng không trả lời email này.</em></p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);

    console.log(`✅ Đã gửi phản hồi thành công đến: ${to}`);
    console.log(`📨 Message ID: ${info.messageId}`);
    
    res.json({ 
      success: true, 
      message: "Đã gửi phản hồi thành công!",
      messageId: info.messageId
    });

  } catch (error) {
    console.error("❌ Reply Email Error:", error);
    console.error("📧 Email gửi đến:", to);
    console.error("🔧 Error details:", error.message);
    
    res.status(500).json({ 
      success: false, 
      message: "Gửi phản hồi thất bại",
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
    const mailOptions = {
      from: `"Portfolio Test" <${ADMIN_EMAIL}>`,
      to: to || ADMIN_EMAIL,
      subject: "📧 Test Email từ Portfolio (Nodemailer)",
      text: "Đây là email test để kiểm tra hệ thống gửi mail bằng Nodemailer với Gmail",
      html: "<p>Đây là email test để kiểm tra hệ thống gửi mail bằng <strong>Nodemailer với Gmail</strong></p>"
    };

    const info = await transporter.sendMail(mailOptions);
    
    res.json({
      success: true,
      message: "Email test đã được gửi thành công bằng Nodemailer!",
      messageId: info.messageId,
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

server.use(router);

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`🚀 JSON Server running at http://localhost:${PORT}`);
  console.log(`📨 POST /api/send-contact-mail (User → Admin)`);
  console.log(`📨 POST /api/send-reply (Admin → User)`);
  console.log(`📧 Email admin: ${ADMIN_EMAIL}`);
  console.log(`🔑 Đang sử dụng App Password từ Google`);
  console.log(`✉️  SMTP Server: smtp.gmail.com:587`);
  console.log(`📌 Test API: POST /api/test-email`);
  console.log(`⚠️  Lưu ý: Cần bật "Less secure app access" hoặc tạo App Password trên Google`);
});
