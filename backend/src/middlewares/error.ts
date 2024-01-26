import ErrorMessage from "../models/errorMessage";
import express, { Request,NextFunction,Response
 } from "express";

export default function(err : Error,req : Request,res : Response,next : NextFunction){
    console.log(err.message);
    return res.status(500).send(new ErrorMessage("Something failed"));
}