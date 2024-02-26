const { WebSocketServer } = require("ws")
const dotenv = require("dotenv")

dotenv.config()

const wss = new WebSocketServer({ port: process.env.PORT || 8080 })

// usuário se conectando
wss.on("connection", (ws) => {
  ws.on("error", console.error)

  ws.send("Mensagem enviada pelo servidor!")

  // servidor recebeu alguma mensagem
  ws.on("message", (data) => {
    console.log(data.toString())
    // enviar essa mensagem para todos os usuários
    wss.clients.forEach((client) => client.send(data.toString()))

    console.log("client connected")
  })
})