import type React from 'react';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { toast } from 'sonner';
import { Bell, DollarSign, Upload, TrendingUp, Music, CheckCircle2 } from 'lucide-react';

interface Notification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  category: 'upload' | 'revenue' | 'analytics' | 'release' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  isConnected: boolean;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substring(7),
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Show toast notification
    const getIcon = () => {
      switch (notification.category) {
        case 'upload': return Upload;
        case 'revenue': return DollarSign;
        case 'analytics': return TrendingUp;
        case 'release': return Music;
        default: return Bell;
      }
    };

    const Icon = getIcon();

    toast(notification.title, {
      description: notification.message,
      icon: <Icon className="h-4 w-4" />,
      action: notification.action ? {
        label: notification.action.label,
        onClick: notification.action.onClick,
      } : undefined,
    });
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Simulate WebSocket connection for real-time updates
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const simulateConnection = () => {
      setIsConnected(true);

      // Simulate periodic notifications
      interval = setInterval(() => {
        const notificationTypes = [
          {
            type: 'success' as const,
            category: 'revenue' as const,
            title: 'New Revenue Earned!',
            message: `You earned $${(Math.random() * 50 + 10).toFixed(2)} from recent streams`,
          },
          {
            type: 'info' as const,
            category: 'analytics' as const,
            title: 'Streaming Milestone',
            message: `Your track "${['Midnight Dreams', 'Summer Vibes', 'Ocean Waves'][Math.floor(Math.random() * 3)]}" reached ${Math.floor(Math.random() * 1000 + 500)} new streams today`,
          },
          {
            type: 'success' as const,
            category: 'release' as const,
            title: 'Release Update',
            message: 'Your music is now live on 3 new platforms',
          },
          {
            type: 'info' as const,
            category: 'system' as const,
            title: 'Platform Update',
            message: 'New analytics features are now available in your dashboard',
          },
        ];

        const randomNotification = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];

        // Only add notification 30% of the time to avoid spam
        if (Math.random() < 0.3) {
          addNotification(randomNotification);
        }
      }, 15000); // Every 15 seconds
    };

    // Simulate connection delay
    const connectionTimeout = setTimeout(() => {
      simulateConnection();
    }, 2000);

    return () => {
      clearTimeout(connectionTimeout);
      if (interval) {
        clearInterval(interval);
      }
      setIsConnected(false);
    };
  }, []);

  // Add welcome notification on mount
  useEffect(() => {
    const welcomeTimeout = setTimeout(() => {
      addNotification({
        type: 'success',
        category: 'system',
        title: 'Welcome to WinningDistro!',
        message: 'Real-time notifications are now active. You\'ll receive updates about uploads, earnings, and more.',
      });
    }, 3000);

    return () => clearTimeout(welcomeTimeout);
  }, []);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    isConnected,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
