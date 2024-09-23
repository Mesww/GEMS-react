import PolylineModel, { Polyline } from '../models/polyline_model';
export async function isRoutenameInPolyline(route: string): Promise<boolean> {
    try {
        console.log('Checking if route exists in database...');
        const polylines: Polyline[] = await PolylineModel.find().exec(); // Ensure TypeScript knows the type
        const routeExists = polylines.some((polyline) => polyline.name.includes(route));
        console.log('Route exists in polyline:', routeExists); // Logs true if the route exists, false otherwise
        return routeExists;
    } catch (error) {
        console.error('Error checking route in database:', error);
        return false;
    }
}