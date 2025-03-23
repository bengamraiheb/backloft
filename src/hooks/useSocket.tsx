
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './useAuth';

const SOCKET_URL = 'http://localhost:5000';

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    // Initialize socket connection
    const socketInstance = io(SOCKET_URL, {
      withCredentials: true,
    });

    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance.id);
      setIsConnected(true);
      
      // Authenticate socket with user ID if logged in
      if (user) {
        socketInstance.emit('authenticate', user.id);
      }
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    socketInstance.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, [user]);

  // Re-authenticate when user changes
  useEffect(() => {
    if (socket && isConnected && user) {
      socket.emit('authenticate', user.id);
    }
  }, [socket, isConnected, user]);

  return { socket, isConnected };
};
