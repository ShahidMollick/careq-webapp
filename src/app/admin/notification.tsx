"use client";

import React, { useState, useEffect } from 'react';
import { Switch } from "@/components/ui/switch";
import { Loader2 } from "lucide-react";
import NotificationBanner, { NotificationType } from "./NotificationBanner";

interface NotificationHeaderProps {
  title?: string;
  count?: number;
  onClearAll?: () => void;
  isConnected?: boolean;
  onReconnect?: () => void;
  bookingWindowOpen?: boolean;
  onEditSchedule?: () => void;
  nextScheduleDate?: Date;
  children?: React.ReactNode;
}

// New interface for the booking status control
interface BookingControlProps {
  isOnlineBookingEnabled: boolean;
  onToggle: () => Promise<void>;
  isLoading: boolean;
}

// Original notification component
const NotificationHeader: React.FC<NotificationHeaderProps> = ({
  title = "Notifications",
  count = 0,
  onClearAll,
  isConnected = true,
  onReconnect,
  bookingWindowOpen,
  onEditSchedule,
  nextScheduleDate,
  children
}) => {
  // Fixed: Set initial state based on props, not derived calculations
  const [showOfflineNotification, setShowOfflineNotification] = useState(!isConnected);
  const [showBookingNotification, setShowBookingNotification] = useState(
    bookingWindowOpen === false
  );

  // Update notification states when props change
  useEffect(() => {
    console.log('Notification visibility update:', {
      isConnected,
      bookingWindowOpen,
      showOfflineNotification: !isConnected,
      showBookingNotification: bookingWindowOpen === false && isConnected
    });
    
    setShowOfflineNotification(!isConnected);
    
    // Only show booking notification when connected and booking is closed
    if (isConnected) {
      setShowBookingNotification(bookingWindowOpen === false);
    }
  }, [isConnected, bookingWindowOpen]);

  return (
    <div>
      {/* Original notification header */}
      <div className="">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold">{title}</h2>
          {count > 0 && (
            <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {count}
            </span>
          )}
        </div>
        {count > 0 && onClearAll && (
          <button 
            onClick={onClearAll}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear all
          </button>
        )}
      </div>
      
      {/* Offline connection notification */}
      {/* Moved console.log to useEffect for debugging */}
      <NotificationBanner
        type="offline"
        show={showOfflineNotification}
        onDismiss={() => setShowOfflineNotification(false)}
        
       
        message="You are currently offline. Connection to the server has been lost."
      />
      
      {/* Booking window closed notification */}
      {/* Moved console.log to useEffect for debugging */}
      <NotificationBanner
        type="booking-closed"
        show={showBookingNotification}
        onDismiss={() => setShowBookingNotification(false)}
        
        nextScheduleDate={nextScheduleDate}
      />

      {/* Pass through any additional children */}
      {children}
    </div>
  );
};

// New booking control component
export const BookingStatusControl: React.FC<BookingControlProps> = ({
  isOnlineBookingEnabled,
  onToggle,
  isLoading
}) => {
  return (
    <div className="mb-4 p-4 border bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium">Online Booking Status</h3>
          <p className="text-xs text-gray-500">
            {isOnlineBookingEnabled 
              ? "Patients can currently book appointments online" 
              : "Online booking is currently disabled"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
          ) : (
            <Switch
              checked={isOnlineBookingEnabled}
              onCheckedChange={onToggle}
              disabled={isLoading}
            />
          )}
          <span className="text-sm font-medium">
            {isOnlineBookingEnabled ? "Enabled" : "Disabled"}
          </span>
        </div>
      </div>
    </div>
  );
};

// System notification component for showing status messages
export const SystemNotification: React.FC<{
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}> = ({ message, type }) => {
  const bgColor = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-amber-50 border-amber-200',
    info: 'bg-blue-50 border-blue-200',
  }[type];
  
  const textColor = {
    success: 'text-green-700',
    error: 'text-red-700',
    warning: 'text-amber-700',
    info: 'text-blue-700',
  }[type];

  return (
    <div className={`my-2 p-3 rounded-md border ${bgColor}`}>
      <p className={`text-sm ${textColor}`}>{message}</p>
    </div>
  );
};

export default NotificationHeader;