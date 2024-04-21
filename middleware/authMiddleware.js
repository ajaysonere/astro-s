import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import HttpError from "../models/errorModel.js";

export const authMiddleware = (req, res, next) => { 
  try {
    const Authorization =
      req.headers.Authorization || req.headers.authorization;

    if (!Authorization) {
      return next(new HttpError("User is not authenticated", 401));
    }

    if (Authorization.startsWith("Bearer")) {
        const token = Authorization.split(" ")[1];
        
        jwt.verify(token, process.env.JWT_SECRET , (err , info) => {
            if(err){
               return next(new HttpError("User is not authenticated" , 401))
            }
            console.log(info);
            req.user = info;
            next();
        });
    }
  } catch (error) {
    return next(new HttpError("User is not authenticated", 401));
  }
};
