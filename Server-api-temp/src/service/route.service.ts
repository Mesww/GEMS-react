import RouteModel from '../models/routes_model';
import { isRoutenameInPolyline } from './polyline.service';
export async function isRouteInDatabase(route: string): Promise<boolean> {
    try {
        console.log('Checking if route exists in database...');
        const routeExists = await RouteModel.findOne({ route }).exec();
        console.log('Route exists in database:', !!route); // Logs true if the route exists, false otherwise
        return !!routeExists; // Returns true if the route exists, false otherwise
    } catch (error) {
        console.error('Error checking route in database:', error);
        return false;
    }
}