import { Request, Response } from 'express';
import Station from '../models/station_model';

export const getStations = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Fetching stations...');
    const stations = await Station.find();
    console.log(`Found ${stations.length} stations`);
    res.status(200).json(stations);
  } catch (error: unknown) {
    console.error('Error fetching stations:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error fetching stations', error: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};
