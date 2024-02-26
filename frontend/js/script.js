// login elements
const login = document.querySelector('.login')
const loginForm = login.querySelector('.login__form')
const loginInput = login.querySelector('.login__input')

// chat elements
const chat = document.querySelector('.chat')
const chatForm = chat.querySelector('.chat__form')
const chatInput = chat.querySelector('.chat__input')
const chatMessages = chat.querySelector('.chat__messages')

const colors = [
  "cadetblue",
  "darkgoldenrod",
  "cornflowerblue",
  "darkkhaki",
  "hotpink",
  "gold"
]

const time = () => {
  let hr, min
  const tempo = new Date()
  hr = tempo.getHours()
  min = tempo.getMinutes()

  return `${hr < 10 ? '0' + hr : hr}:${min < 10 ? '0' + min : min}`
}

const user = { id: "", name: "", color: "" }

let websocket

const createMessageSelfELement = (content) => {
  const div = document.createElement("div")
  const p = document.createElement("p")
  div.classList.add("message--self")
  div.innerHTML = content
  const tempo = time()
  p.innerHTML = tempo
  div.appendChild(p)

  return div
}


const createMessageOtherELement = (content, sender, senderColor) => {
  const div = document.createElement("div")
  const span = document.createElement("span")

  div.classList.add("message--other")
  span.classList.add("message--sender")
  div.classList.add("message--self")
  const p = document.createElement('p')
  p.innerHTML = time()

  span.style.color = senderColor

  div.appendChild(span)

  span.innerHTML = sender
  div.innerHTML += content
  div.appendChild(p)

  return div
}

const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * colors.length)
  return colors[randomIndex]
}

const scrollScreen = () => {
  window.scrollTo({
    top: document.body.scrollHeight,
    behavior: "smooth"
  })
}

const processMessage = ({ data }) => {
  const { userId, userName, userColor, content } = JSON.parse(data)

  const message = userId == user.id
    ? createMessageSelfELement(content)
    : createMessageOtherELement(content, userName, userColor)

  chatMessages.appendChild(message)
  scrollScreen()
}

const handleLogin = (event) => {
  event.preventDefault()

  user.id = crypto.randomUUID()
  user.name = loginInput.value
  user.color = getRandomColor()

  login.style.display = 'none'
  chat.style.display = 'flex'

  websocket = new WebSocket("wss://chat-online-5b0p.onrender.com")
  websocket.onmessage = processMessage

  // websocket.onopen = () => websocket.send(`Usuário: ${user.name} entrou no chat`)

  console.log(user)
}

const sendMessage = (event) => {
  event.preventDefault()

  const message = {
    userId: user.id,
    userName: user.name,
    userColor: user.color,
    content: chatInput.value,
  }

  websocket.send(JSON.stringify(message))

  chatInput.value = ""
}

loginForm.addEventListener('submit', handleLogin)
chatForm.addEventListener('submit', sendMessage)