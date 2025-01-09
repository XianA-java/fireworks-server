const WebSocket = require('ws')
const port = process.env.PORT || 3000

const wss = new WebSocket.Server({
  port,
  perMessageDeflate: false,
  clientTracking: true,
  // 添加 CORS 支持
  verifyClient: (info) => {
    // 允许所有来源
    return true
  }
})

// 存储所有连接的客户端
const clients = new Set()

// 广播消息给所有客户端
function broadcast(message, sender) {
  clients.forEach(client => {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(message)
    }
  })
}

// 添加心跳检测
setInterval(() => {
  wss.clients.forEach((client) => {
    if (client.isAlive === false) {
      return client.terminate()
    }
    client.isAlive = false
    client.ping()
  })
}, 30000)

wss.on('connection', (ws) => {
  ws.isAlive = true
  ws.on('pong', () => {
    ws.isAlive = true
  })

  clients.add(ws)
  console.log('New client connected, total:', clients.size)

  ws.on('message', (message) => {
    broadcast(message, ws)
  })

  ws.on('close', () => {
    clients.delete(ws)
    console.log('Client disconnected, total:', clients.size)
  })
})

console.log(`WebSocket server is running on port ${port}`)
