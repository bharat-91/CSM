import mongoose from "mongoose"
import config from 'config'
export const DBConnection = () =>{
    mongoose.connect(config.get("DbURL")).then(() =>{
        console.log("Database Connected Successfully");
    }).catch((err:any)=>{
        console.log("Database Connection Error", err);
    })
}