import { IProperty, IReview } from "../models/property";
import User from "../models/user";
import _ from "lodash";

async function addUserIntoToReview (review: IReview){
    const user = await User.findById(review.user);
    if(!user){
        throw new Error("not deleted message when deleting user account");
    }
    review.user = user;
    return review;
}

export async function fillUsersInReviewes(reviewes : Array<IReview>){
    return Promise.all(reviewes.map(review => addUserIntoToReview(review)))
};


export async function getOwner(ownerid: String){
    const owner = await User.findById(ownerid);    
    return _.omit(owner,"password"); 
}

async function addOwnerIntoProperty(property: IProperty){
    property.owner = await getOwner(property.ownerid);
    return property;
}

export async function fillOwnersInProperties(properties: Array<IProperty>){
    return Promise.all(properties.map(property => addOwnerIntoProperty(property)))
}