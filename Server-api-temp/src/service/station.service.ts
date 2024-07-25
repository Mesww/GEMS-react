import { interface_User } from '../interface/user.interface';
import Station from '../models/station_model';
export async function addUserToStation(stationId: string, user: interface_User) {
    try {
      const station = await Station.findById(stationId);
      if (station) {
        if (!station.waiting) {
            station.waiting = [];
          }
        station.waiting.push(user);
        await station.save();
        console.log('User added to the waiting list successfully.');
        return { "status":"Success","message":"User added to the waiting list successfully."};
      } else {
        console.log('Station not found.');
        return {"status":"Error","message":"Station not found."};
      }
    } catch (error) {
      console.error('Error adding user to the waiting list:', error);
      return {"status":"Error","message":"Error adding user to the waiting list."};
    }
  }