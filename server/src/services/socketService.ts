import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';

let io: SocketIOServer | null = null;
const onlineUsers = new Map<string, string>(); // userId -> socketId

export const initSocket = (httpServer: HTTPServer): SocketIOServer => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token;
    if (token) {
      try {
        const decoded = jwt.verify(token, ENV.JWT_SECRET) as { id: string };
        socket.data.userId = decoded.id;
      } catch (err) {
        // Continue unauthenticated
      }
    }
    next();
  });

  io.on('connection', (socket: Socket) => {
    const userId = socket.data.userId;
    if (userId) {
      onlineUsers.set(userId, socket.id);
      io?.emit('user:status', { userId, status: 'online' });
    }

    socket.on('join:conversation', (conversationId: string) => {
      socket.join(`conv_${conversationId}`);
    });

    socket.on('leave:conversation', (conversationId: string) => {
      socket.leave(`conv_${conversationId}`);
    });

    socket.on('disconnect', () => {
      if (userId) {
        onlineUsers.delete(userId);
        io?.emit('user:status', { userId, status: 'offline' });
      }
    });
  });

  return io;
};

export const getIO = (): SocketIOServer | null => io;

export const emitToUser = (userId: string, event: string, data: any) => {
  if (!io) return;
  const socketId = onlineUsers.get(userId);
  if (socketId) {
    io.to(socketId).emit(event, data);
  }
};

export const emitToConversation = (conversationId: string, event: string, data: any) => {
  if (!io) return;
  io.to(`conv_${conversationId}`).emit(event, data);
};
