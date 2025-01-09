const WebSocket = require('ws')
const http = require('http')

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('Server is healthy')
  } else {
    res.writeHead(426, { 'Content-Type': 'text/plain' })
    res.end('Upgrade Required')
  }
})

// 在 HTTP 服务器上创建 WebSocket 服务器
const wss = new WebSocket.Server({ 
  server,
  perMessageDeflate: false,
  clientTracking: true
})

// 连接处理
wss.on('connection', (ws) => {
  console.log('Client connected')
  
  ws.on('error', (error) => {
    console.error('Client Error:', error)
  })
  
  ws.on('message', (message) => {
    try {
      // 广播消息给所有客户端
      wss.clients.forEach(client => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(message)
        }
      })
    } catch (error) {
      console.error('Message Error:', error)
    }
  })

  ws.on('close', () => {
    console.log('Client disconnected')
  })
})

// 错误处理
wss.on('error', (error) => {
  console.error('WebSocket Server Error:', error)
})

// 启动服务器
const port = process.env.PORT || 3000
server.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

// 进程错误处理
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
})

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error)
}) 
