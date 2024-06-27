import { Request, Response, NextFunction } from "express";
import jwt, { decode } from "jsonwebtoken";
import config from "config";
import { User } from "../models/user.model";
import { statusCode } from "../utils/statusResponse";import mongoose from "mongoose";
import { Role } from "../models/roleModel";
;

export async function isLoggedInMiddleware(req: any, res: Response, next: NextFunction) {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: "Access denied. No token provided." });
        }
        const decoded: any = jwt.verify(token, config.get("SecretKey")) as { userId: string };
        const user = await User.findById(decoded._id);
        
        if (!user) {
            return res.status(401).json({ error: "Unauthorized. User not found." });
        }
        req.user = decoded;
        
        next();
    } catch (error) {
        console.error("isLoggedInMiddleware error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}
export async function isAdmin(req: any, res: Response, next: NextFunction) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ error: "Access denied. No token provided." });
        }
        const decoded: any = jwt.verify(token, config.get("SecretKey"))
        const user = await User.findById(decoded._id);

        const role = await Role.findOne({role: "Admin"}) 
        const roleName = new mongoose.Types.ObjectId(role?._id)
        // if(!user || user?.role !== "Admin"){
        //     res.status(statusCode.BAD_REQUEST.code).json("Not Allowed to see this Content")
        // }
        req.user = decoded;
        next();
    } catch (error) {
        console.error("isLoggedInMiddleware error:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

