import { Request, Response } from "express";
import Routes from "../models/routes_model";
export const createRoutes = async (req: Request, res: Response) => {
    try {
        console.log("Creating routes...");
        const routes = await Routes.create(req.body);
        console.log("Routes created successfully");
        res.status(201).json(routes);
    } catch (error) {
        console.error("Error in createRoutes:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const getRoutes = async (req: Request, res: Response) => {  
    try {
        console.log("Fetching routes...");
        const routes = await Routes.find();
        console.log(`Found ${routes.length} routes`);
        res.status(200).json(routes);    
    } catch (error) {
        console.error("Error in getRoutes:", error);
        res.status(500).json({ message: "Internal server error" });
    }
 }

 
export const getRoute = async (req: Request, res: Response) => {
    try {
        console.log("Fetching route...");
        const { name, id }: { name: String, id: String } = req.body;
        if (!name && !id) {
            res.status(400).json({ message: "Please provide route id or name" });
            return;
        }   
        const route = await Routes.find(name||id);
        if (!route) {
            res.status(404).json({ message: "Route not found" });
            return;
        }
        console.log("Route found");
        res.status(200).json(route);
    } catch (error) {
        console.error("Error in getRoute:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const updateRoute = async (req: Request, res: Response) => {
    try {
        const { name, id }: { name: String, id: String } = req.body;
        if (!name && !id) {
            res.status(400).json({ message: "Please provide route id or name" });
            return;
        }
        console.log("Updating route...");
        const route = await Routes.findOneAndUpdate(name || id, req.body, { new: true });
        if (!route) {
            res.status(404).json({ message: "Route not found" });
            return;
        }
        console.log("Route updated");
        res.status(200).json(route);
    } catch (error) {
        console.error("Error in updateRoute:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteRoute = async (req: Request, res: Response) => {
    try {
        const { name, id }: { name: String, id: String } = req.body;
        if (!name && !id) {
            res.status(400).json({ message: "Please provide route id or name" });
            return;
        }
        console.log("Deleting route...");
        const route = await Routes.findOneAndDelete(name || id);
        if (!route) {
            res.status(404).json({ message: "Route not found" });
            return;
        }
        console.log("Route deleted");
        res.status(200).json(route);
    } catch (error) {
        console.error("Error in deleteRoute:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}