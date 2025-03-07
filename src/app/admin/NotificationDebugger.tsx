"use client";

import React, { useState, useEffect } from 'react';

interface NotificationState {
  isConnected: boolean;
  bookingWindowOpen: boolean | undefined;
  offlineBannerVisible: boolean;
  bookingBannerVisible: boolean;
  capacityWarningVisible: boolean;
}

const NotificationDebugger: React.FC<NotificationState> = ({
  isConnected,
  bookingWindowOpen,
  offlineBannerVisible,
  bookingBannerVisible,
  capacityWarningVisible
}) => {
  const [visible, setVisible] = useState(false);
  
  // Toggle visibility with Alt+Shift+D keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.shiftKey && e.key === 'D') {
        setVisible(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  if (!visible) return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/80 text-white p-3 rounded-md shadow-lg text-xs font-mono">
      <div className="mb-1 font-bold text-center">Notification Debug (Alt+Shift+D)</div>
      <table className="border-collapse">
        <thead>
          <tr>
            <th className="px-2 py-1 text-left">State</th>
            <th className="px-2 py-1 text-left">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-2 py-1">Connection</td>
            <td className={`px-2 py-1 ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
              {isConnected ? 'Online ✓' : 'Offline ✗'}
            </td>
          </tr>
          <tr>
            <td className="px-2 py-1">Booking Window</td>
            <td className={`px-2 py-1 ${bookingWindowOpen ? 'text-green-400' : 'text-red-400'}`}>
              {bookingWindowOpen ? 'Open ✓' : 'Closed ✗'}
            </td>
          </tr>
          <tr>
            <td className="px-2 py-1">Offline Banner</td>
            <td className={`px-2 py-1 ${offlineBannerVisible ? 'text-yellow-400' : 'text-gray-400'}`}>
              {offlineBannerVisible ? 'Visible !' : 'Hidden -'}
            </td>
          </tr>
          <tr>
            <td className="px-2 py-1">Booking Banner</td>
            <td className={`px-2 py-1 ${bookingBannerVisible ? 'text-yellow-400' : 'text-gray-400'}`}>
              {bookingBannerVisible ? 'Visible !' : 'Hidden -'}
            </td>
          </tr>
          <tr>
            <td className="px-2 py-1">Capacity Warning</td>
            <td className={`px-2 py-1 ${capacityWarningVisible ? 'text-yellow-400' : 'text-gray-400'}`}>
              {capacityWarningVisible ? 'Visible !' : 'Hidden -'}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="mt-2 text-center text-xs text-gray-400">
        Press Alt+Shift+D to close
      </div>
    </div>
  );
};

export default NotificationDebugger;
