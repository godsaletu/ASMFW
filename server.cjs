const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('data.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)
server.use(jsonServer.bodyParser)

// CORS fix
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})

// Custom routes nếu cần
server.post('/api/register', (req, res) => {
  const newUser = req.body
  // Thêm logic xử lý đặc biệt nếu cần
  res.json({ success: true, user: newUser })
})

server.use(router)

// Dùng port 3001 để tránh conflict
const PORT = process.env.PORT || 3001

server.listen(PORT, () => {
  console.log(`✅ JSON Server is running on http://localhost:${PORT}`)
  console.log(`✅ Routes:`)
  console.log(`   GET  /users`)
  console.log(`   POST /users`)
  console.log(`   GET  /contacts`)
  console.log(`   POST /contacts`)
})
