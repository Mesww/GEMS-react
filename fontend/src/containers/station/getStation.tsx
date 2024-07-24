// src/hooks/useStations.js
import { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';

const API_URL = import.meta.env.VITE_API // Adjust this URL to match your server

// src/types/Station.ts
export interface Stations {
  _id: string;
  id: string;
  position: string;
  waiting: number;
  route: string;
}

export const fetchStations = async (setStations:React.Dispatch<React.SetStateAction<AxiosResponse<Stations[], any> | null>>,setLoading:React.Dispatch<React.SetStateAction<boolean>>) => {
      try {
        const response = await axios.get(`${API_URL}/getStation`);
        // console.log(response);
        if (response.status !== 200) {
          throw new Error('Error! Fetching stations');
        }
        setStations(response);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
};
