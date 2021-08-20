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
import Message from './model/Message';
import { DecryptMessage } from './utils/encrypt';
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
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get(`${PREFIX}/test/:roomId`, async (req, res) => {
  const { roomId } = req.params;
  const { numberOfMessages } = req.query;
  const messagesData = await Message.find({ room: roomId })
    .sort([['createdAt', -1]])
    .skip(parseInt(numberOfMessages) === 1 ? 0 : parseInt(numberOfMessages) - 1)
    .limit(8);
  const messages = [...messagesData];

  res.json({
    messages: messages.reverse().map((mess) => {
      const newMess = {
        ...mess,
        text: DecryptMessage(mess.text, mess.room.toString()),
      };

      return newMess.text;
    }),
  });
});

app.use(`${PREFIX}/auth`, baseAuth, AuthRouter);
app.use(`${PREFIX}/user`, UserRouter);
app.use(`${PREFIX}/room`, authorizeMiddleware, RoomRouter);
app.use(`${PREFIX}/message`, authorizeMiddleware, MessageRouter);
app.use(`${PREFIX}/friend`, authorizeMiddleware, FriendRouter);
app.use(`${PREFIX}/upload`, UploadRouter);

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

io.on('connection', (socket) => {
  socket.on('send-online', (userId) => {
    addUser(socket.id, userId);

    io.emit('online', getAllUSers());
  });

  socket.on('send-offline', (user) => {
    socket.broadcast.emit('recieve-offline', user);
  });

  socket.on('send-message', (message, roomId) => {
    showUsers();
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

  //
  socket.on('create-newroom', () => {
    socket.broadcast.emit('newroom');
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
