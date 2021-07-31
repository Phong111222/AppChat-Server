import express from 'express';
import cors from 'cors';
import http from 'http';
import 'colors';
import MongoConnect from './database/mongodb';
import errorMiddleware from './middleware/errorMiddleware';
import baseAuth from './middleware/baseAuth';
import AuthRouter from './routes/auth';
import UserRouter from './routes/user';
import RoomRouter from './routes/room';
import MessageRouter from './routes/message';
import { Server } from 'socket.io';
import authorizeMiddleware from './middleware/authorizeMiddleware';

const PREFIX = '/api/v1';
const app = express();
MongoConnect();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

app.use(express.json());
app.use(cors());

app.use(`${PREFIX}/auth`, baseAuth, AuthRouter);
app.use(`${PREFIX}/user`, UserRouter);
app.use(`${PREFIX}/room`, authorizeMiddleware, RoomRouter);
app.use(`${PREFIX}/message`, authorizeMiddleware, MessageRouter);
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
io.on('connection', (socket) => {
  const id = socket.id;
  socket.on('send-message', (message, roomId) => {
    socket.to(roomId).emit('recieve-message', message);
  });

  socket.on('send-online', (userId) => {
    socket.broadcast.emit('online', userId);
  });
  socket.on('join-room', (roomId, name) => {
    console.log(`${name} connected to room ${roomId}`);
    socket.join(roomId);
  });
  socket.on('disconnect', () => {
    socket.on('send-offline', (userId) => {
      console.log(userId);
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.yellow);
});
