import express from 'express';
import cors from 'cors';
import http from 'http';
import 'colors';
import { ConnectMongo } from './database/mongodb';
import errorMiddleware from './middleware/errorMiddleware';
import baseAuth from './middleware/baseAuth';
import AuthRouter from './routes/auth';
import UserRouter from './routes/user';
import RoomRouter from './routes/room';
import MessageRouter from './routes/message';
import FriendRouter from './routes/friend';
import UploadRouter from './routes/upload';
import { Server } from 'socket.io';
import authorizeMiddleware from './middleware/authorizeMiddleware';
import {
  addUser,
  getAllUSers,
  getUser,
  removeUser,
  showUsers,
} from './utils/usersSocket';

ConnectMongo.getConnect();
// MongoConnect();

const PREFIX = '/api/v1';
const app = express();

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
app.use(`${PREFIX}/friend`, authorizeMiddleware, FriendRouter);
app.use(`${PREFIX}/upload`, authorizeMiddleware, UploadRouter);
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

io.on('connection', (socket) => {
  socket.on('send-online', (userId) => {
    addUser(socket.id, userId);
    socket.broadcast.emit('online', userId);
  });

  socket.on('check-online-user', (listFriends, info) => {
    let users = [...getAllUSers()];

    const onlineUsers = [];
    users = users.filter((user) => user.userId !== info._id);
    if (users.length > 0) {
      listFriends.forEach((friend) => {
        users.forEach((user) => {
          if (user.userId === friend._id) {
            onlineUsers.push(friend);
          }
        });
      });
    }

    socket.emit('online-users', onlineUsers);
  });

  socket.on('send-message', (message, roomId) => {
    socket.broadcast.emit('recieve-message', message);
  });

  socket.on('join-room', (roomId, name) => {
    console.log(`${name} has join the room ${roomId}`);
    socket.join(roomId);
  });

  // friend request
  socket.on('send-friend-request', (requestData) => {
    socket.broadcast.emit('recieve-friend-request', requestData);
  });

  socket.on('send-accept-request', (AcceptData) => {
    socket.broadcast.emit('recieve-accept', AcceptData);
  });

  socket.on('send-offline', (user) => {
    socket.broadcast.emit('recieve-offline', user);
  });

  socket.on('disconnect', async () => {
    const user = getUser(socket.id);
    removeUser(socket.id);
    if (user) {
      io.emit('recieve-offline', user);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`.yellow);
});
