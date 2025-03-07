"use client";

import React, { useState, useEffect } from 'react';
import { X, WifiOff, CalendarX, Calendar, AlertTriangle, Info, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { format, isToday, addDays } from 'date-fns';

export type NotificationType = 
  | 'offline'
  | 'booking-closed' 
  | 'schedule-gap'
  | 'info'
  | 'warning'
  | 'success'
  | 'error'
  | 'custom';

interface NotificationBannerProps {
  type: NotificationType;
  show: boolean;
  onDismiss: () => void;
  message?: string;
  nextScheduleDate?: Date;
  className?: string;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  type,
  show,
  onDismiss,
  message,
  nextScheduleDate,
  className
}) => {
  // Fixed: This state should track if component is currently mounted/visible
  const [isVisible, setIsVisible] = useState(false);

  // Update visibility when show prop changes - with debugging
  useEffect(() => {
    console.log(`Banner ${type} - show prop changed to:`, show);
    if (show) {
      setIsVisible(true);
    } else {
      // Use this pattern for animating out
      setIsVisible(false);
    }
  }, [show, type]);

  const handleDismiss = () => {
    console.log(`Banner ${type} - dismissing`);
    setIsVisible(false);
    // We need to delay the actual dismissal to allow animation
    setTimeout(onDismiss, 300);
  };

  // Default messages for different notification types
  const getDefaultMessage = () => {
    switch (type) {
      case 'offline':
        return 'You are currently offline. Please check your connection.';
      case 'booking-closed':
        return nextScheduleDate 
          ? `Online booking is currently closed `
          : 'Online booking is currently closed.';
      case 'schedule-gap':
        return 'There appears to be a gap in your schedule. Consider updating your schedule settings.';
      case 'info':
        return 'System information notification';
      case 'warning':
        return 'Warning: Please review this information';
      case 'success':
        return 'Operation completed successfully';
      case 'error':
        return 'An error has occurred';
      default:
        return message || '';
    }
  };

  // Rest of helper functions
  // ...existing code...

  // Get icon for notification type
  const NotificationIcon = () => {
    switch (type) {
      case 'offline':
        return <WifiOff className="h-5 w-5" />;
      case 'booking-closed':
        return <CalendarX className="h-5 w-5" />;
      case 'schedule-gap':
        return <Calendar className="h-5 w-5" />;
      case 'info':
        return <Info className="h-5 w-5" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />;
      case 'success':
        return <Bell className="h-5 w-5" />;
      case 'error':
        return <AlertTriangle className="h-5 w-5" />;
      case 'custom':
        return message ? null : <Info className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  // Set styles based on notification type
  const getBannerStyles = () => {
    switch (type) {
      case 'offline':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'booking-closed':
        return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'schedule-gap':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-700';
      case 'warning':
        return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'success':
        return 'bg-green-50 border-green-200 text-green-700';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'custom':
        return 'bg-gray-50 border-gray-200 text-gray-700';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-700';
    }
  };

  // Fixed: removed the early return and let AnimatePresence handle the visibility
  // if show is false but isVisible is true, the exit animation will play

  return (
    <AnimatePresence>
      {(show || isVisible) && (
        <motion.div
          key={`notification-${type}`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={cn("overflow-hidden", className)}
        >
          <div className={`flex items-center justify-between p-4 border rounded-md ${getBannerStyles()} mx-6 my-2`}>
            <div className="flex items-center space-x-3 flex-grow">
              <NotificationIcon />
              <p className="text-sm font-medium">
                {message || getDefaultMessage()}
              </p>
            </div>
            <div className="flex items-center">
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDismiss}
                className="h-7 w-7 p-0 rounded-full hover:bg-opacity-20"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Dismiss</span>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationBanner;

// Helper functions that were omitted above
function formatNextScheduleDate() {
  const nextScheduleDate = new Date(); // Default to now
  nextScheduleDate.setDate(nextScheduleDate.getDate() + 1); // Sample: tomorrow
  
  if (isToday(nextScheduleDate)) {
    return `')}`;
  } else if (isToday(addDays(nextScheduleDate, -1))) {
    return ``;
  } else {
    return format(nextScheduleDate, '');
  }
}
