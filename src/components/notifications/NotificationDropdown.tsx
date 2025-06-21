import React from 'react';
import { Bell, BellDot, DollarSign, Upload, TrendingUp, Music, Check, Trash2, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useNotifications } from '@/contexts/NotificationContext';

const NotificationDropdown = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    isConnected
  } = useNotifications();

  const getIcon = (category: string) => {
    switch (category) {
      case 'upload': return Upload;
      case 'revenue': return DollarSign;
      case 'analytics': return TrendingUp;
      case 'release': return Music;
      default: return Bell;
    }
  };

  const formatTime = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative text-gold hover:text-green p-2">
          {unreadCount > 0 ? (
            <BellDot className="h-5 w-5" />
          ) : (
            <Bell className="h-5 w-5" />
          )}
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-green text-black"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-black border-green w-80 max-h-96 overflow-y-auto" align="end">
        <DropdownMenuLabel className="flex items-center justify-between text-gold">
          <div className="flex items-center">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
            {isConnected ? (
              <Wifi className="h-3 w-3 ml-2 text-green" />
            ) : (
              <WifiOff className="h-3 w-3 ml-2 text-red-500" />
            )}
          </div>
          {unreadCount > 0 && (
            <Badge variant="outline" className="text-green border-green">
              {unreadCount} new
            </Badge>
          )}
        </DropdownMenuLabel>

        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator className="bg-green" />
            <div className="flex items-center justify-between px-2 py-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-green hover:text-gold text-xs h-6"
                disabled={unreadCount === 0}
              >
                <Check className="h-3 w-3 mr-1" />
                Mark all read
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearNotifications}
                className="text-red-400 hover:text-red-300 text-xs h-6"
                disabled={notifications.length === 0}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Clear all
              </Button>
            </div>
          </>
        )}

        <DropdownMenuSeparator className="bg-green" />

        {notifications.length === 0 ? (
          <div className="p-4 text-center">
            <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-400 text-sm">No notifications yet</p>
            <p className="text-gray-500 text-xs">You'll see updates about uploads, earnings, and more here</p>
          </div>
        ) : (
          <div className="max-h-64 overflow-y-auto">
            {notifications.slice(0, 10).map((notification) => {
              const Icon = getIcon(notification.category);

              return (
                <DropdownMenuItem
                  key={notification.id}
                  className={`p-3 cursor-pointer hover:bg-zinc-900 focus:bg-zinc-900 ${
                    !notification.read ? 'bg-zinc-900/50' : ''
                  }`}
                  onClick={() => {
                    if (!notification.read) {
                      markAsRead(notification.id);
                    }
                    if (notification.action) {
                      notification.action.onClick();
                    }
                  }}
                >
                  <div className="flex items-start space-x-3 w-full">
                    <div className={`p-1.5 rounded-full ${
                      notification.type === 'success' ? 'bg-green' :
                      notification.type === 'error' ? 'bg-red-600' :
                      notification.type === 'warning' ? 'bg-yellow-600' :
                      'bg-blue-600'
                    }`}>
                      <Icon className="h-3 w-3 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <p className={`text-sm font-medium ${
                          !notification.read ? 'text-gold' : 'text-white'
                        }`}>
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-green rounded-full flex-shrink-0 ml-2 mt-1"></div>
                        )}
                      </div>

                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {notification.message}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {formatTime(notification.timestamp)}
                        </span>

                        {notification.action && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-green hover:text-gold text-xs h-5 px-2"
                          >
                            {notification.action.label}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </DropdownMenuItem>
              );
            })}

            {notifications.length > 10 && (
              <DropdownMenuItem className="text-center p-2 text-green hover:text-gold">
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  View all notifications
                </Button>
              </DropdownMenuItem>
            )}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
