import express, { Request, Response } from "express";
import config from '../config/config';
import { join } from "path";
import User from "../models/users.model";
const IP = require("ip");
const bcrypt = require("bcrypt");
// const User = require("../models/users.model");
import jwt from "jsonwebtoken";
// const jwt = require("jsonwebtoken");
// import { auth } from '../service/auth.service';
import { admin_middleware, auth_middleware } from '../middle/auth';
import { auth_controller } from "../controllers/auth.controllers";
import { userRolecontroller } from "../controllers/user.controller";
const authroute = express.Router();
const { OAuth2Client } = require("google-auth-library");

const bodyParser = require("body-parser");


interface CustomRequest extends Request {
  user?: any;
  token?: any;
}

authroute.post("/signin", auth_controller);

authroute.get("/alluser", admin_middleware, async (req: 
CustomRequest, res:Response) => {
  const user = await User.findById(req.user);
  if (user !== null) {
    res.json({ ...user, token: req.token });
  }
});

authroute.get("/getUser",auth_middleware,userRolecontroller);

authroute.get("/testip", (req, res) => {
  const ipAddress = IP.address();
  res.send(ipAddress);
});

export default authroute;
export { authroute };
