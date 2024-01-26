import property from "../models/property";
import ErrorMessage from "../models/errorMessage";
import {
    Request,
    Response
} from "express";
import mongoose from "mongoose";
import { fillOwnersInProperties, fillUsersInReviewes } from "../utils/propertyUtils";



const pendingProperties = async(req:any, res: Response) => {
    //@ts-ignore
    const properties = await property.find({status: "pending"});    
    const filledProperties = await fillOwnersInProperties(properties);
    for(let i = 0; i < properties.length; i++){
        properties[i].reviewes = await fillUsersInReviewes(properties[i].reviewes);
    }
    return res.status(200).send(filledProperties);    
}

const approveProperty = async (req: any, res: Response) => {        
    try{                
        const pendingProperty = await property.findById(req.params.id);
        if(!pendingProperty){
            return res.status(400).send(new ErrorMessage("Property not found"));
        }
        pendingProperty.status = "approved";
        await pendingProperty.save();
        pendingProperty.reviewes = await fillUsersInReviewes(pendingProperty.reviewes);
        return res.status(201).send(pendingProperty);
    }
    catch(e){
        //@ts-ignore
        console.log(e.message);
        //@ts-ignore
        return res.status(400).send(new ErrorMessage(e.message));
    }
}

const rejectProperty = async (req: any, res: Response) => {        
    try{
        const pendingProperty = await property.findById(req.params.id);
        if(!pendingProperty){
            return res.status(400).send(new ErrorMessage("Property not found"));
        }
        pendingProperty.status = "declined";
        await pendingProperty.save();
        return res.status(201).send(pendingProperty);
    }
    catch(e){
        //@ts-ignore
        console.log(e.message);
        //@ts-ignore
        return res.status(400).send(new ErrorMessage(e.message));
    }
}


const AdminContoller = {
    pendingProperties,
    approveProperty,
    rejectProperty
}

export default AdminContoller;