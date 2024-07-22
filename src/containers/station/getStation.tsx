// src/hooks/useStations.js
import { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';

const API_URL = import.meta.env.VITE_API // Adjust this URL to match your server

// src/types/Station.ts
export interface Station {
  _id: string;
  id: string;
  position: string;
  waiting: number;
  route: string;
}

const useStations = () => {
  const [stations, setStations] = useState<AxiosResponse<Station[]> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await axios.get(`${API_URL}/getStation`);
        setStations(response);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  return { stations, loading, error };
};

export default useStations;
