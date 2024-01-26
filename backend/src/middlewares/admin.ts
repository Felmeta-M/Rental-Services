import {
    Router,
    NextFunction
} from "express";
import {
    get
} from "lodash";
import jwt from "jsonwebtoken";
import ErrorMessage from "../models/errorMessage";
import express, {
    Request,
    Response
} from 'express';

export default function (req: Request, res: Response, next: NextFunction) {    
    let token = get(req, "headers.authorization", "");
    
    if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    token = token.split(" ")[1];    
    const decoded = jwt.verify(token, process.env.jwtPrivateKey as string); 
    // console.log(decoded);
    //@ts-ignore
    if (decoded.isAdmin) {
        //@ts-ignore
        req.user = decoded; 
        next();
        return;
    } 
    return res.status(403).send(new ErrorMessage("Higher privelege is required."));
  }
  catch (e) {        
    return res.status(400).send('Invalid token.');
  }
}