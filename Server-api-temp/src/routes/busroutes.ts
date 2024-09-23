import express, { Request, Response } from "express";
import { createBus, getBuses, getBus, updateBus,deleteBus } from "../controllers/bus_controllers";
import { auth_middleware,admin_middleware } from "../middle/auth";
const router = express.Router();

router.get("/getBuses",auth_middleware ,getBuses);
router.post("/createBus",admin_middleware, createBus);
router.post("/getBus",auth_middleware, getBus);
router.put("/updateBus",admin_middleware, updateBus);
router.delete("/deleteBus",admin_middleware, deleteBus);

export default router;