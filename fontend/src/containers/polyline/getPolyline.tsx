import axios, { AxiosResponse } from "axios";
import { Polylines } from '../../interfaces/polylines.interface';

const API_URL = import.meta.env.VITE_API


export const fetchPolylines = async (setPolylines:React.Dispatch<React.SetStateAction<AxiosResponse<Polylines[], any> | null>>,setLoading:React.Dispatch<React.SetStateAction<boolean>>) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/getPolyline`);
      console.log(response);
      if (response.status !== 200) {
        throw new Error('Error! Fetching stations');
      }
      if (response.data.length === 0) {
        throw new Error('Error! No stations found');
      }
      setPolylines(response);
      setLoading(false);
    } catch (error) {
      setLoading(true);
    }
};
