import { Request, Response } from 'express';
import Station from '../models/station_model';
import { addUserToStation } from '../service/station.service';

export const getStations = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Fetching stations...');
    const stations = await Station.find();
    console.log(`Found ${stations.length} stations`);

    // Map over the stations to include the waiting length and exclude the waiting array
    const stationsWithoutWaiting = stations.map(station => {
      const { waiting, ...stationWithoutWaiting } = station.toObject();
      return {
        ...stationWithoutWaiting,
        waitingLength: waiting && waiting.length ? waiting.length : 0 
      };
    });

    res.status(200).json(stationsWithoutWaiting);
  } catch (error: unknown) {
    console.error('Error fetching stations:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error fetching stations', error: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

export const addUserToStationscontoller = async (req: Request, res: Response): Promise<void> => {
    console.log('Updating station...');
    const user = {
      name: req.body.name,
      email: req.body.email,
      role:req.body.role
    };
     const message =  await addUserToStation(req.body.id, user);
    if (message.status === 'Error') {
      res.status(404).json({ message: message.message});
    }
    res.status(200).json({ message: message.message });
  };
