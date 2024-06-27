import mongoose, { Model } from "mongoose";
import { IMedia } from '../interface';
import { articleType } from "../enum/article.enum";

export const mediaSchema = new mongoose.Schema<IMedia>({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    contentPath:{
        type:String,
        default:""
    },
    createAt:{
        type:Date,
        default:Date.now()
    },

    updatedAt:{
        type:Date,
        default:Date.now()
    },

    status:{
        type:String,
        enum:articleType,
        default:articleType.DRAFT
    },
    title:{
        type:String,
        required:[true, "Please Enter the Title of the Media"],
        trim:true
    },
    
    description:{
        type:String,
        required:[true, "Please Enter the Description of the Media"],
        trim:true
    },
    filename:{
        type:String,
    },
    contentType:{
        type:String,
        trim:true
    }
})

export const Media:Model<IMedia> = mongoose.model<IMedia>("Media", mediaSchema) 