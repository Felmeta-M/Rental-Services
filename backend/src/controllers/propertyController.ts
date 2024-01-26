import mongoose from "mongoose";
import Property, { IProperty, IReview } from "../models/property";
import User, {IUserDocument} from "../models/user";
import ErrorMessage from "../models/errorMessage";
import {
    Request,
    Response
} from "express";

import _, { result } from "lodash";
import {fillOwnersInProperties, fillUsersInReviewes, getOwner} from "../utils/propertyUtils";
import { getImageUrl } from "../utils/uploadUtils";


const getProperty = async (req: any, res: Response) => {    
    const property = await Property.findById(req.params.id);
    if(!property){
        return res.status(404).send(new ErrorMessage('no property with that id'));
    }
    property.reviewes = await fillUsersInReviewes(property.reviewes);
    property.owner = await getOwner(property.ownerid);    
    return res.status(200).send(property);
}


const getProperties = async (req: any, res: Response) => {    
    var filterOptions: {[k: string]: any} = {};

    if(req.query.category){
        filterOptions.category = req.query.category
    }
    filterOptions.status = "approved";

    const properties = await Property.find(filterOptions);
    const filledProperties = await fillOwnersInProperties(properties);
    
    for(let i = 0; i < properties.length; i++){
        properties[i].reviewes = await fillUsersInReviewes(properties[i].reviewes);
    }
    return res.status(200).send(filledProperties);
}

const searchProperties = async(req: Request, res:Response) => {    
    const limitParam = req.query.limit;

    if(limitParam && isNaN(+limitParam)){
        return res.status(400).send("Invalid value for limit");
    }

    const limit:number = Number(limitParam);
    const keyword = req.query.keyword?.toString();    

    if(!keyword){
        return res.status(200).send([]);
    };

    const results = await Property.find(
        {
            $text: {$search: keyword}, 
            status: "approved",                       
        },          
    ).limit(limit);

    for(let i = 0; i < results.length; i++){        
        results[i].owner = await getOwner(results[i].ownerid);
    }
    return res.status(200).send(results);
}


const addProperty = async (req: any, res: Response) => {    
    const property:  IProperty = new Property(req.body);    
    try{
        property.ownerid = req.user.id;
        property.status = "pending";
        //@ts-ignore
        property.cost.bill = parseFloat(property.cost.bill);
        //@ts-ignore        
        property.images = req.files.map(file => file.filename);                    
        await property.save();
                
        // let updatedUser = await User.findOneAndUpdate({"id": req.user.id}, { $push: { posts: property.id } }, {new: true});
        
        let user = await User.findById(req.user.id);
        if(user != null){
            user.posts.push(property.id);
            await user.save();
        }            

        // console.log(property);        
        return res.status(201).send(property);
    }
    catch(e){
        //@ts-ignore
        console.log(e.message);
        //@ts-ignore
        return res.status(400).send(new ErrorMessage(e.message));
    }
}

const updateProperty = async (req: any, res: Response) => {    
    try{
        const property = await Property.findById(req.params.id);            
        if(!property){
            return res.status(404).send(new ErrorMessage("property not found"));
        }                
        if(property.ownerid != req.user.id){
            return res.status(403).send(new ErrorMessage("Current user can't update this property"));
        }                        
        const newProperty = await Property.findByIdAndUpdate(req.params.id, req.body, {new : true}); 
        if(newProperty != null){
            newProperty!.owner = await getOwner(newProperty!.ownerid);
            newProperty.status = "pending"; 
        }          
        return res.status(200).send(newProperty);                    
    }
    catch(e){
        // console.log(e.message);
        //@ts-ignore        
        return res.send(400).send(new ErrorMessage(e.message));
    }    
}

const getUserReview = async (req: any, res: Response) => {    
    try{        
        let property = await Property.findById(req.params.id);            
        if(!property){
            return res.status(404).send(new ErrorMessage("property not found"));
        }        
        
        let hasUserAlreadyReviewed = property.reviewes.filter(review => review.user == req.user.id);
        
        if(hasUserAlreadyReviewed.length == 0){
            return res.status(400).send(new ErrorMessage("user has not reviewed the property yet"));
        }
        hasUserAlreadyReviewed[0].user = await getOwner(req.user.id);
        return res.status(200).send(hasUserAlreadyReviewed[0]);                                        
    }
    catch(e){
        //@ts-ignore
        return res.status(400).send(new ErrorMessage(e.message));
    }    
}

const bestRatedProperties =  async (req: any, res: Response) => {    
    try{
        const results = await Property.find({status: "approved"}).sort('-rating').limit(5);
        for(let i = 0; i < results.length; i++){        
            results[i].owner = await getOwner(results[i].ownerid);
        }
        return res.status(200).send(results);
    }
    catch(e){
        //@ts-ignore
        return res.status(400).send(new ErrorMessage(e.message));
    }
} 

const updateReviewProperty = async (req: any, res: Response) => {    
    try{        
        let property = await Property.findById(req.params.id);            
        if(!property){
            return res.status(404).send(new ErrorMessage("property not found"));
        }        
        
        let hasUserAlreadyReviewed = property.reviewes.filter(review => review.user == req.user.id);
        
        if(hasUserAlreadyReviewed.length == 0){
            return res.status(400).send(new ErrorMessage("user has not reviewed the property yet"));
        }

        if(!(req.body.message && req.body.rating)){
            return res.status(400).send(new ErrorMessage("message and rating are required"));
        }
        
        const newReview : IReview = {
            user: req.user.id,
            message:req.body.message,
            rating: req.body.rating
        };
                        
        //updating the rating using the mean method        
        const totalRating = (property.rating * property.reviewes.length);
        property.reviewes = property.reviewes.filter(review => review.user != req.user.id);        
        property.reviewes.push(newReview);
        const newRating = (totalRating + req.body.rating) / (property.reviewes.length);

        property.rating = Math.min(newRating,5);
        await property.save();
        newReview.user = await getOwner(req.user.id);
        return res.status(200).send(newReview);                                        
    }
    catch(e){
        //@ts-ignore
        return res.status(400).send(new ErrorMessage(e.message));
    }    
}


const reviewProperty =  async (req: any, res: Response) => {    
    try{        
        let property = await Property.findById(req.params.id);            
        if(!property){
            return res.status(404).send(new ErrorMessage("property not found"));
        }        
        
        let hasUserAlreadyReviewed = property.reviewes.filter(review => review.user == req.user.id);
        
        if(hasUserAlreadyReviewed.length > 0){
            return res.status(400).send(new ErrorMessage("user has already reviewed the property"));
        }

        if(!(req.body.message && req.body.rating)){
            return res.status(400).send(new ErrorMessage("message and rating are required"));
        }

        //updating the rating using the mean method
        const totalRating = property.rating * property.reviewes.length;
        const newRating = (totalRating + req.body.rating) / (property.reviewes.length  + 1) * 1.1;

        const newReview : IReview = {
            user: req.user.id,
            message:req.body.message,
            rating: req.body.rating
        };

        property.reviewes.push(newReview);
        property.rating = newRating;
        await property.save();
        return res.status(200).send(newReview);                                        
    }
    catch(e){
        //@ts-ignore
        return res.status(400).send(new ErrorMessage(e.message));
    }    
}

const likeProperty = async (req: any, res: Response) => {    
    try{
        let property = await Property.findById(req.params.id);            
        if(!property){
            return res.status(404).send(new ErrorMessage("property not found"));
        }                
        //adding the current item to list of properties liked by the user
        let user = await User.findById(req.user.id);
        if(!user){
            return res.status(400).send(new ErrorMessage("user not found"));
        }

        if(user.likedProperties.includes(property.id)){
            return res.status(400).send(new ErrorMessage("User has already like the property"));            
        }
        user.likedProperties.push(property.id);

        property.likedBy.push(req.user.id);
        
        await property.save();
        await user.save();
        return res.status(200).send({
            "likeCount" : property.likedBy.length
        });
    }
    catch(e){
        //@ts-ignore
        return res.status(400).send(new ErrorMessage(e.message));
    }
}

const unlikeProperty= async (req: any, res: Response) => {    
    try{
        let property = await Property.findById(req.params.id);            
        if(!property){
            return res.status(404).send(new ErrorMessage("property not found"));
        }                        
        let user = await User.findById(req.user.id);
        if(!user){
            return res.status(400).send(new ErrorMessage("user not found"));
        }

        if(user.likedProperties.includes(property.id) == false){
            return res.status(400).send(new ErrorMessage("User hasn't liked this property yet"));            
        }
        
        //removing form both lists
        user.likedProperties = user.likedProperties.filter(propertyId => propertyId != property!.id);
        property.likedBy = property.likedBy.filter(userId => userId != req.user.id);        
        
        await property.save();
        await user.save();
        return res.status(200).send({
            "likeCount" : property.likedBy.length
        });
    }
    catch(e){
        //@ts-ignore
        return res.status(400).send(new ErrorMessage(e.message));
    }
}



const PropertyController = {
    addProperty,
    updateProperty,
    reviewProperty,
    likeProperty,
    unlikeProperty,
    getProperties,
    getProperty,
    searchProperties,
    updateReviewProperty,
    getUserReview,
    bestRatedProperties
}

export default PropertyController;