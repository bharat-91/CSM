import mongoose from "mongoose";

export interface IMedia{
    _id?: mongoose.Types.ObjectId
    userId?:mongoose.Types.ObjectId,
    contentPath?:any,
    createAt?:Date,
    updatedAt?:Date,
    status: string,
    filename?:string,
    title:string,
    description:string,
    fileType?:string
}