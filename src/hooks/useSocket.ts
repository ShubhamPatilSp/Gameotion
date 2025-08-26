import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import { io, Socket } from 'socket.io-client';

const socketUrl = Platform.select({
  ios: 'http://localhost:4000',
  android: 'http://10.0.2.2:4000',
  default: 'http://localhost:4000',
});

export function useSocket(conversationId: string) {
  const socket = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!socketUrl) return;

    socket.current = io(socketUrl);

    socket.current.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
    });

    socket.current.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    return () => {
      socket.current?.disconnect();
    };
  }, [conversationId]);

  const sendMessage = (message: any) => {
    socket.current?.emit('sendMessage', { conversationId, message });
  };

  return { socket: socket.current, isConnected, sendMessage };
}
