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
    //@ts-ignore
    req.user = decoded; 
    next();
  }
  catch (e) {        
    res.status(400).send('Invalid token.');
  }
}