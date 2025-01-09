const WebSocket = require('ws')
const port = process.env.PORT || 3000

const wss = new WebSocket.Server({ 
  port,
  perMessageDeflate: false,
  clientTracking: true,
})

// 错误处理
wss.on('error', (error) => {
  console.error('WebSocket Server Error:', error)
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

// 服务器启动日志
console.log(`WebSocket server is running on port ${port}`)

// 错误处理
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
})

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error)
}) 
