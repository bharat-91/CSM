import { injectable } from "inversify";
import { IMedia } from "../interface";
import { Media } from "../models";

@injectable()
export class mediaService{
    async uploadMedia(mediaData:IMedia):Promise<IMedia | null>{
        try {
           const media =  await Media.create(mediaData)
           return media
        } catch (error:any) {
            throw new Error(error)
        }
    }
}