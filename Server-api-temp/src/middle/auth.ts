const jwt = require("jsonwebtoken");
import express, { Request, Response } from "express";
import { findUserById } from "../service/user.service";
import { parseJwt } from '../service/auth.service';
export const auth_middleware = async (
  req: Request,
  res: Response,
  next: () => void
) => {
  try {
    const key = process.env.TOKEN_KEY || "kimandfamily";
    const token = req.header("x-auth-token");
    if (!token)
      return res.status(401).json({ msg: "No auth token, access denied" });

    const verified = jwt.verify(token, key);
    if (!verified)
      return res
        .status(401)
        .json({ msg: "Token verification failed, authorization denied." });

    next();
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const admin_middleware = async function (req: Request,
  res: Response,
  next: () => void) {
    const key = process.env.FONTENDURL || "kimandfamily";
    const token = req.header("x-auth-token");
    if (!token)
      return res.status(401).json({ msg: "No auth token, access denied" });
    
    const extractToken = parseJwt(token);
    const verified = jwt.verify(token, key);
    if (!verified)
      return res
        .status(401)
        .json({ msg: "Token verification failed, authorization denied." });

      const checkedadmin = await findUserById(extractToken.id);
    if (checkedadmin?.role !== "admin") 
        return res
          .status(401)
          .json({ msg: "You are not admin." });
    
    next();
}

