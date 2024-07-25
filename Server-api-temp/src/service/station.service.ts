import { interface_User } from '../interface/user.interface';
import Station from '../models/station_model';

export async function addUserToStation(stationId: string, user: interface_User, addedAt: Date) {
  try {
      const station = await Station.findById(stationId);
      if (station) {
          if (!station.waiting) {
              station.waiting = [];
          }

          // Check if a user with the same email already exists in the waiting list
          const existingUser = station.waiting.find(waitingUser => waitingUser.email === user.email);
          if (existingUser) {
              console.log('User with this email already exists in the waiting list. Ignoring duplicate entry.');
              return { "status": "Success", "message": "User already in waiting list. No action taken." };
          }

          // Create a new object that combines user data and time
          const userWithTime = {
              ...user,
              addedAt: addedAt
          };
          station.waiting.push(userWithTime);
          await station.save();
          console.log('User added to the waiting list successfully.');
          return { "status": "Success", "message": "User added to the waiting list successfully." };
      } else {
          console.log('Station not found.');
          return { "status": "Error", "message": "Station not found." };
      }
  } catch (error) {
      console.error('Error adding user to the waiting list:', error);
      return { "status": "Error", "message": "Error adding user to the waiting list." };
  }
}