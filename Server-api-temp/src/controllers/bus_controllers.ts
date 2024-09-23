import { BusService } from '../interface/bus.interface';
import Bus from '../models/bus_models';
import { Request, Response } from 'express';
import Routes from "../models/routes_model";
import { isRouteInDatabase } from '../service/route.service';
export const createBus = async (req: Request, res: Response) => {
    try {
        const body: BusService  = req.body;
        if (!body.busId || !body.route) {
            res.status(400).json({ message: "Please provide busId and route" });
            return;
        }
        const haveRoute = await isRouteInDatabase(body.route.valueOf());
        if (!haveRoute) {
            console.log("Creating routes...");
            const routes = await Routes.create(req.body);
            console.log(`Routes ${routes.name} created successfully`);
        }
        console.log("Creating Bus...");
        const bus = await Bus.create(body);
        console.log("Bus created successfully");
        res.status(201).json(bus);
    } catch (error) {
        console.error("Error in createBus:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const getBuses = async (req: Request, res: Response) => {
    try {
        console.log("Fetching Buss...");
        const buses = await Bus.find();
        console.log(`Found ${buses.length} Buss`);
        res.status(200).json(buses);
    } catch (error) {
        console.error("Error in getBuss:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const getBus = async (req: Request, res: Response) => {
    try {
        const { busId }: BusService = req.body;
        if (!busId ) {
            res.status(400).json({ message: "Please provide busId" });
            return;
        }
        console.log("Fetching Bus...");
        const bus = await Bus.findOne(busId);
        if (!bus) {
            res.status(404).json({ message: "Bus not found" });
            return;
        }
        console.log("Bus found");
        res.status(200).json(bus);
    } catch (error) {
        console.error("Error in getBus:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const updateBus = async (req: Request, res: Response) => {
    try {
        const { busId, newbusData }: {busId:String,newbusData:BusService}  = req.body;
        if (!busId || !newbusData) {
            res.status(400).json({ message: "Please provide busId and route" });
            return;
        }
        console.log("Updating Bus...");
        const bus = await Bus.findOneAndUpdate(busId , newbusData.busId || newbusData.route, { new: true });
        if (!bus) {
            res.status(404).json({ message: "Bus not found" });
            return;
        }
        console.log("Bus updated");
        res.status(200).json(bus);
    } catch (error) {
        console.error("Error in updateBus:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const deleteBus = async (req: Request, res: Response) => {
    try {
        const { busId }: BusService = req.body;
        if (!busId ) {
            res.status(400).json({ message: "Please provide busId" });
            return;
        }
        console.log("Deleting Bus...");
        const bus = await Bus.findOneAndDelete(busId);
        if (!bus) {
            res.status(404).json({ message: "Bus not found" });
            return;
        }
        console.log("Bus deleted");
        res.status(200).json(bus);
    } catch (error) {
        console.error("Error in deleteBus:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}