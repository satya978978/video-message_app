import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import { createServer } from 'http';
import authroute from './routes/authroutes.js';
import airoute from './routes/airoutes.js'
import db from './config/db.js';
import { WebSocketServer } from 'ws';
import { setupWSConnection } from 'y-websocket/bin/utils.js';
import coderoute from './routes/CodeRoute.js'

const app = express();
const httpserver = createServer(app);
const io = new Server(httpserver, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});


const wss = new WebSocketServer({ noServer: true })
httpserver.on('upgrade', (req, socket, head) => {
  if (req.url.startsWith('/yjs')) {
    wss.handleUpgrade(req, socket, head, (ws) => {
      setupWSConnection(ws, req)
    })

  }
})


io.on('connection', (socket) => {

  console.log(`New socket connected: ${socket.id}`);

  socket.on('join-room', ({ roomid }) => {
    socket.join(roomid);

    const room = io.sockets.adapter.rooms.get(roomid);

    if (room && room.size > 2) {
      socket.leave(roomid);
      socket.emit('room-full');
      return;
    }

    if (room && room.size === 2) {
      socket.to(roomid).emit('user-joined-4host', { NewUserId: socket.id });
    }
  });

  socket.on('send-signal', ({ from, to, signal }) => {
    io.to(to).emit('sendig-signal-4user', { from, signal });
  });

  socket.on('sending-recivied-signal', ({ to, signal }) => {
    io.to(to).emit('end-handshake', { from: socket.id, signal });
  });

  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
  socket.on("peer_broke", ({ roomid }) => {
    socket.emit("peer-destroy", { id: socket.id })
  })
  socket.on("leave_room", ({ roomid }) => {
    socket.leave(roomid)
    const room = io.sockets.adapter.rooms.get(roomid);
    console.log(room ? room.size : 'Room not found');
  });

  socket.on('messageSend',(message)=>{
    const chat= {sender:'user',message:message}
 socket.broadcast.emit('getMessage',chat)
  })
});

db();

const PORT = 5000 || process.env.PORT;

app.use(
  cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

app.use(express.json());
app.use('/api', authroute);
app.use('/api',airoute)
app.use('/api',coderoute)
app.get('/', (req, res) => {
  res.send('🚀 Hello from Express backend!');
});

httpserver.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
