import jsonServer from "json-server";
import path from "path";
import { fileURLToPath } from "url";

// Lấy đường dẫn tuyệt đối
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, "db.json"));
const middlewares = jsonServer.defaults();

// Middleware mặc định
server.use(middlewares);
server.use(jsonServer.bodyParser);

// 👉 THÊM ROUTE "/" CHO RENDER
server.get("/", (req, res) => {
  res.send("🚀 JSON Server đã chạy thành công trên Render.com!");
});

// Sử dụng router
server.use(router);

// Cổng Render cung cấp
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 JSON Server is running on http://localhost:${PORT}`);
});
