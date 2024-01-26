import jwt from "jsonwebtoken";
import config from "config";

export function generateAuthToken(id: string,isAdmin: boolean) { 
    const token = jwt.sign({ id: id, isAdmin: isAdmin }, process.env.jwtPrivateKey as string);
    return token;
  }
 