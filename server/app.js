const express = require('express')
const cors = require('cors')
const { Server } = require('socket.io')
const app = express()
const authroute = require('./routes/authroutes')
const { createServer } = require('http'); // ✅ CORRECT

const httpserver = createServer(app)
const io = new Server(httpserver, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true
  }
})

io.on('connection', (socket) => {
  socket.emit('hostid',socket.id)
  socket.on("join-room",({roomid})=>{
    socket.join(roomid)
    console.log("socket.id:", socket.id)
    socket.to(roomid).emit("user-joined-4host",{NewUserId:socket.id})
  })
  socket.on("send-signal",({from,signal,to})=>{
  socket.to(to).emit("sendig-signal-4user",{from,signal,to})
  })
  socket.on('sending-recivied-signal',({to,signal})=>{
 socket.to(to).emit("end-handshake",{signal,to})
  })
  
})

const db = require('./config/db'); // path to your db.js
const user = require('./models/user')
db()
const PORT = 5000 || process.env.PORT;
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
}));



app.use(express.json());
app.use('/api', authroute);

app.get('/', (req, res) => {
  res.send('🚀 Hello from Express backend!');
});
httpserver.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});