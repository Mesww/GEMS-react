import asynchandler from 'express-async-handler';
import { Request,Response,NextFunction } from 'express';
export const logger = asynchandler(async (req:Request,res:Response,next:NextFunction) => {
    let date =  new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Bangkok'
      });;
    const currentip = req.ip;
    
    console.log(`New request from ${currentip} when ${date} at path : ${req.path} `);
    next()
})  