import { useState, useEffect, useCallback } from 'react';
import { BusData } from '../../interfaces/bus.interface';
const VITE_WSURL = import.meta.env.VITE_WSURL
const TOKEN = import.meta.env.VITE_WEBSOCKETKEY;



export function useWebSocketData() {
  const [messages, setMessages] = useState<BusData | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const url = `${VITE_WSURL}?token=${TOKEN}`;

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setSocket(ws);
    };

    ws.onmessage = (event: MessageEvent) => {
      try {
        const newMessage: BusData = JSON.parse(event.data);
        setMessages(newMessage);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error: Event) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = useCallback((message: any) => {
    if (socket) {
      socket.send(JSON.stringify(message));
    }
  }, [socket]);

  return { messages, sendMessage };
}