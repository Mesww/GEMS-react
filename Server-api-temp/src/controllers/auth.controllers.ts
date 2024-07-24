import express, { Request, Response } from "express";
import { auth } from '../service/auth.service';
import jwt from "jsonwebtoken";
import {interface_User} from "../models/users.model";
import { regis_user } from "../service/user.service";

export const auth_controller = async (req:Request,res:Response)=>{
    
    const { code } = req.body;
    const userDetails = await auth(code);

    let role = "USER";

    if (userDetails.email === process.env.SUPERADMIN && process.env.SUPERADMIN !== undefined ) {
        role = "ADMIN";
    }

    const user: interface_User = {
        email:userDetails.email,
        name:userDetails.name,
        role:role
    };
    
    const token = await regis_user(user);
    res.status(200).send(token);
}