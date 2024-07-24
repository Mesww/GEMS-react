import { Request, Response } from 'express';
import Polyline from '../models/polyline_model';

export const getPolylines = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Fetching polylines...');
    const polylines = await Polyline.find();
    console.log(`Found ${polylines.length} polylines`);
    res.status(200).json(polylines);
  } catch (error: unknown) {
    console.error('Error fetching polylines:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Error fetching polylines', error: error.message });
    } else {
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};
