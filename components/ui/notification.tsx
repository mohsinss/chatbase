import { useEffect } from 'react';

interface NotificationProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export const CustomNotification = ({ message, type, onClose }: NotificationProps) => (
  <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg ${
    type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }`}>
    <div className="flex justify-between items-center">
      <p>{message}</p>
      <button 
        onClick={onClose}
        className="ml-4 text-gray-500 hover:text-gray-700"
      >
        ×
      </button>
    </div>
  </div>
); 