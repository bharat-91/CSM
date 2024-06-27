import { injectable } from "inversify";
import { IUser } from "../interface";
import { User } from "../models";

@injectable()
export class userService{
    async registerUser(userData:IUser):Promise<IUser | undefined>{
        try {
            console.log(userData);
            const user = await User.create(userData)
            return user
        } catch (error:any) {
            console.log(error);
            
            throw new Error(error)
        }
    }

    async getUsers(userId:string):Promise<IUser | null>{
        try {
            const user = await User.findById({_id: userId})
            return user
        } catch (error:any) {
            throw new Error(error)
            
        }
    }
    
    async updateUser( userId:string, userData:any):Promise<void>{
        try {
            await User.findByIdAndUpdate({_id: userId}, userData)
        } catch (error:any) {
            throw new Error(error)
        }
    }
}
