import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext.js';
import { useToast } from './ToastContext.js';
import { notificationService } from '../services/orderService.js';
import { INotification } from '../types/index.js';

interface SocketContextType {
  socket: Socket | null;
  notifications: INotification[];
  unreadCount: number;
  refreshNotifications: () => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
  markAllNotificationsAsRead: () => Promise<void>;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const { info } = useToast();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const refreshNotifications = async () => {
    if (isAuthenticated) {
      try {
        const res = await notificationService.getNotifications();
        setNotifications(res.data || []);
        setUnreadCount(res.unreadCount || 0);
      } catch (err) {
        console.warn('Failed to load notifications', err);
      }
    }
  };

  useEffect(() => {
    refreshNotifications();
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && token) {
      const socketClient = io(import.meta.env.VITE_SOCKET_URL || '/', {
        auth: { token },
        transports: ['websocket', 'polling'],
      });

      socketClient.on('connect', () => {
        // Connected to real-time notification gateway
      });

      socketClient.on('notification:new', (newNotif: INotification) => {
        setNotifications((prev) => [newNotif, ...prev]);
        setUnreadCount((prev) => prev + 1);
        info(newNotif.message, newNotif.title);
      });

      setSocket(socketClient);

      return () => {
        socketClient.disconnect();
      };
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [isAuthenticated, token]);

  const markNotificationAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
    try {
      await notificationService.markAsRead(id);
    } catch (e) {
      console.warn('Failed to mark notification read', e);
    }
  };

  const markAllNotificationsAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    try {
      await notificationService.markAllAsRead();
    } catch (e) {
      console.warn('Failed to mark all read', e);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        notifications,
        unreadCount,
        refreshNotifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
