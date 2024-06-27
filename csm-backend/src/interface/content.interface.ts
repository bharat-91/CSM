import mongoose from "mongoose";

export interface IMedia{
    userId?:mongoose.Types.ObjectId,
    contentPath?:any,
    createAt?:Date,
    updatedAt?:Date,
    status: string,
    filename?:string,
    title:string,
    description:string,
    contentType?:string
}