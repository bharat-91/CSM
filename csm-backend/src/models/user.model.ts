import mongoose, { Model } from "mongoose"
import { IUser } from "../interface"
import bcrypt from 'bcrypt';

export const userSchema = new mongoose.Schema<IUser>({
    username:{
        type: String,
        minlength: 5,
        required: [true, "Please Enter Username"]
    },

    email:{
        type: String,
        required: [true, "Please enter the email address"],
        trim: true,
        // match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        lowercase: true,
        unique:true
    },

    password:{
        type: String,
        minlength: 5,
        required: [true, "Please Enter Password"]
    },

    profilePic:{
        type:String,
        default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQttE9sxpEu1EoZgU2lUF_HtygNLCaz2rZYHg&s"
    },
    bio:{
        type:String,
        minlength:15,
    },
    token:{
        type:String,
        default:""
    },
    role:{
        type:mongoose.Types.ObjectId,
        ref:'Role',
        default:""
    }
},{
    timestamps:true
})


userSchema.pre('save', async function (next) {
    if (!this.isModified) {
        return next()
    }
    try {
        const encPassword = await bcrypt.hash(this.password, 10)
        this.password = encPassword
        next()
    } catch (error: any) {
        next(error)
    }
})

export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema)