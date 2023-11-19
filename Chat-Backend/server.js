const express = require('express')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const cors = require('cors')


dotenv.config()
const port  = process.env.PORT || 5000
const DB_URL = process.env.DB_URL

const app = express()
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello World!')
})



mongoose.connect(DB_URL).then((connection) => {
    console.log("db connection established")
}).catch((error) => {
    console.log(error)
})

const chatRoutes = require('./routes/chatRoutes')
const messageRoutes = require('./routes/messageRoutes')
const userRoutes = require('./routes/userRoutes')
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

const server = app.listen(port, () => {
  console.log('Example app listening on port '+ port)
})


const io = require('socket.io')(server,{
  pingTimeout:60000,
  cors:{
    origin:"http://localhost:3000"
  }
});

io.on('connection',(socket)=>{
  console.log(socket.id)
  console.log("connection established")
})

