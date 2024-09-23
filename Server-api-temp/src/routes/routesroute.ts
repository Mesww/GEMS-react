import express from "express";
import { createRoutes, getRoutes, getRoute, updateRoute,deleteRoute } from "../controllers/routes_controllers";
import { auth_middleware,admin_middleware } from "../middle/auth";
const router = express.Router();

router.get("/getRoutes",auth_middleware ,getRoutes);
router.post("/createRoute",admin_middleware, createRoutes);
router.post("/getRoute",auth_middleware, getRoute);
router.put("/updateRoute",admin_middleware, updateRoute);
router.delete("/deleteRoute",admin_middleware, deleteRoute);

export default router;