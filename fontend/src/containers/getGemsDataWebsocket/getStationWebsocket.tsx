import { useState, useEffect, useCallback } from 'react';
import { Stations } from '../../interfaces/station.interface';
const VITE_WSURL = import.meta.env.VITE_STATIONWSURL;
const TOKEN = import.meta.env.VITE_WEBSOCKETKEY;

export function useStationWebSocket() {
  const [messages, setMessages] = useState<Stations | null>(null);
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const url = `${VITE_WSURL}?token=${TOKEN}`;

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onopen = () => {
      console.log('WebSocket connected to /stationws');
      setSocket(ws);
    };

    ws.onmessage = (event: MessageEvent) => {
      try {
        const newMessage: Stations = JSON.parse(event.data);
        setMessages(newMessage);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onerror = (error: Event) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected from /stationws');
    };

    return () => {
      ws.close();
    };
  }, [url]);

  const sendMessage = useCallback((message: any) => {
    if (socket) {
      socket.send(JSON.stringify(message));
    }
  }, [socket]);

  return { messages, sendMessage };
}
