import express, { Request, Response } from "express";
import { auth } from "../service/auth.service";
import jwt from "jsonwebtoken";
import { interface_User } from "../models/users.model";
import { findUserById } from "../service/user.service";
import { parseJwt } from "../service/auth.service";

export const userRolecontroller = async function (req: Request, res: Response) {
  const token = req.header("x-auth-token");
  const key = process.env.FONTENDURL || "kimandfamily";
  if (!token)
    return res.status(401).json({ msg: "No auth token, access denied" });

  const extractToken = parseJwt(token);

  const user = await findUserById(extractToken.id);
  
  if (!user) {
    return res.status(500).send(null);
  }
  
  const token_userinfo = jwt.sign({"email":user.email,"name":user.name,"role":user.role}, key);
  return res.status(200).send(token_userinfo);
};
