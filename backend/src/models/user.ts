import mongoose from "mongoose";
import { IProperty } from "./property";

export interface IUserDocument extends mongoose.Document {
    name: string;
    phoneNumber: string;
    email: string;
    password: string;
    isAdmin: boolean;
    profileImage: string;
    likedProperties: Array<Number>;
    posts: Array<IProperty["_id"]>;
    wishlists: Array<IWishlist>;
}

export interface IWishlist{
    propertyId: string,
    dateSaved: Date,
} 

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    phoneNumber : {
        type: String,   
        default: "",             
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 2048
    },
    isAdmin: {
        type: Boolean,
        required: true,
    },
    profileImage: {
        type: String,       
        default : "https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZmlsZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" 
    },
    likedProperties: [
        {
            type: mongoose.Types.ObjectId,            
            ref: "Property"
        }
      ],
    posts: [
        {
            type: mongoose.Types.ObjectId,            
            ref: "Property"
        }
      ],
    wishlists: {
        type:Array,
        default: []
    }
});


const user = mongoose.model<IUserDocument>("User", UserSchema);

export default user;