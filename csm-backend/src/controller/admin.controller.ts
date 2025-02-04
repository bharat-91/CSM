import { inject } from "inversify";
import { controller, httpDelete, httpGet, httpPost, request, response } from "inversify-express-utils";
import { adminService } from "../service/admin.service";
import { TYPES } from "../types/types";
import { Request, Response } from "express";
import { IUser } from "../interface";
import { ErrorHandling } from "../utils/errorHelper";
import { responseStatus, statusCode } from "../utils/statusResponse";
import { fileTypePer, getAllUsers, getMonthlyData } from "../utils/pipeline";
import { Media, User } from "../models";
import config from 'config';
import jwt from 'jsonwebtoken'
import { isAdmin } from "../middleware/authorization.middleware";
import { Role } from "../models/roleModel";
import mongoose from "mongoose";


const errorObj = new ErrorHandling()
@controller("/auth/admin")
export class adminController{

    constructor(@inject<adminService>(TYPES.adminService) private admin:adminService){}

    @httpPost('/register')
    async registerAdmin(@request() req:Request, @response() res:Response):Promise<void>{
        try {

            const role = await Role.findOne({role: "Admin"}) 
            const roleName = new mongoose.Types.ObjectId(role?._id)
            const adminData:IUser  = {
                username : config.get("ADMIN_USERNAME"),
                password : config.get("ADMIN_PASSWORD"),
                email:"bharat@gmail.com",
                role:roleName,
                bio:"Admin Bio test test test"
            }

            const adminCreated = await User.create(adminData)
            res.status(statusCode.CREATED.code).json({
                response: responseStatus.SUCCESS,
                details: statusCode.CREATED.message,
                data: adminCreated
            });
        } catch (error:any) {
            const message = errorObj.getErrorMsg(error) || error.message;
            res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                message: statusCode.INTERNAL_SERVER_ERROR.message,
                response: responseStatus.FAILED,
                details: message
            });
        }
    }

    @httpPost('/login')
    async loginAdmin(@request() req: Request, @response() res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                res.status(400).json({ message: 'Username and password are required' });
                return;
            }
            const adminEmail = config.get('ADMIN_EMAIL');
            const adminPassword = config.get('ADMIN_PASSWORD');

            if (email !== adminEmail || password !== adminPassword) {
                res.status(401).json({ message: 'Unauthorized', details: 'Invalid credentials' });
                return;
            }
            const admin = await User.findOne({email:adminEmail })

            const token = jwt.sign({ username: adminEmail,_id: admin?._id, isAdmin: true }, config.get('SecretKey'));
            const loggedInUser = await User.findOneAndUpdate(
                { email: adminEmail },
                { $set: { token } },
                { new: true }
            );
            if (!loggedInUser) {
                res.status(404).json({ message: 'User not found' });
                return;
            }
            res.status(200).json({
                response: responseStatus.SUCCESS,
                details: 'Logged in successfully',
                data: loggedInUser
            });
        } catch (error: any) {
            console.error('Error logging in admin:', error);
            const message = error.message || 'Internal Server Error';
            res.status(500).json({ message });
        }
    }
    @httpGet('/getUsers', isAdmin)
    async getAllUser(@request() req:Request, @response() res:Response):Promise<void>{
        try {
            const {page, limit, sort} = req.query
            const pageNumber = parseInt(page as string) || 1;
            const pageLimit = parseInt(limit as string) || 10;
            const pageSort = (parseInt(sort as string) as 1 | -1) || 1;

            const users = await getAllUsers({ pageNumber, pageLimit, pageSort });
            res.status(statusCode.SUCCESS.code).json({
                message: statusCode.SUCCESS.message,
                details: users,
                response: responseStatus.SUCCESS
            });
        } catch (error:any) {
            const message = errorObj.getErrorMsg(error) || error.message;
            res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                message: statusCode.INTERNAL_SERVER_ERROR.message,
                response: responseStatus.FAILED,
                details: message
            });
        }
    }

    @httpGet('/user/:userId')
    async getUserById(@request() req:Request, @response() res:Response):Promise<void>{
        try {
            const {userId} =  req.params

            const user = await User.findById({_id: userId})

            res.status(statusCode.SUCCESS.code).json({
                message: statusCode.SUCCESS.message,
                details: user,
                response: responseStatus.SUCCESS
            });
        } catch (error:any) {
            const message = errorObj.getErrorMsg(error) || error.message;
            res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                message: statusCode.INTERNAL_SERVER_ERROR.message,
                response: responseStatus.FAILED,
                details: message
            });
        }
    }
    @httpGet('/admin/analytics')
    async getMediaData(req: Request, res: Response): Promise<void> {
        try {
          const { page, limit, sort, searchKeyword, selectedMonth } = req.query;
    
          const pageNumber = parseInt(page as string) || 1;
          const pageLimit = parseInt(limit as string) || 10;
          const pageSort = (parseInt(sort as string) as 1 | -1) || 1;
          const search: any = searchKeyword || '';
    
          if (!selectedMonth || typeof selectedMonth !== 'string') {
            res.status(statusCode.BAD_REQUEST.code).json({
              message: "Invalid or missing 'selectedMonth' parameter",
              response: responseStatus.FAILED
            });
            return;
          }
    
          const monthStartDate = new Date(selectedMonth);
          const monthEndDate = new Date(new Date(selectedMonth).setMonth(monthStartDate.getMonth() + 1));
    
          const totalCountPipeline = [
            {
              $match: {
                createAt: {
                  $gte: monthStartDate,
                  $lt: monthEndDate
                },
                ...(search ? { $text: { $search: search } } : {})
              }
            },
            {
              $count: "totalCount"
            }
          ];
    
          const dataPipeline = [
            {
              $match: {
                createAt: {
                  $gte: monthStartDate,
                  $lt: monthEndDate
                },
                ...(search ? { $text: { $search: search } } : {})
              }
            },
            {
              $sort: { createAt: pageSort }
            },
            {
              $skip: (pageNumber - 1) * pageLimit
            },
            {
              $limit: pageLimit
            },
            {
              $project: {
                _id: 1,
                userId: 1,
                contentPath: 1,
                createAt: 1,
                updatedAt: 1,
                status: 1,
                title: 1,
                description: 1,
                filename: 1,
                fileType: 1,
                __v: 1
              }
            }
          ];
    
          const [totalCountResult, data, fileTypePerResult] = await Promise.all([
            Media.aggregate(totalCountPipeline),
            Media.aggregate(dataPipeline),
            fileTypePer()
          ]);
    
          const totalCount = totalCountResult.length > 0 ? totalCountResult[0].totalCount : 0;
    
          res.status(statusCode.SUCCESS.code).json({
            message: statusCode.SUCCESS.message,
            details: data,
            totalCount: totalCount,
            fileTypeStats: fileTypePerResult,
            response: responseStatus.SUCCESS
          });
        } catch (error: any) {
          console.error('Error fetching media data:', error);
          res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
            message: statusCode.INTERNAL_SERVER_ERROR.message,
            response: responseStatus.FAILED,
            error: error.message
          });
        }
    }
    

    @httpDelete('/deleteUser/:userId', isAdmin)
    async deleteUser(@request() req:Request, @response() res:Response):Promise<void>{
        try {
            const {userId} = req.params
            const deleteUser = await User.findByIdAndDelete({_id:userId })
            res.status(statusCode.SUCCESS.code).json({
                message: statusCode.SUCCESS.message,
                details: deleteUser,
                response: responseStatus.SUCCESS
            });
        } catch (error:any) {
            const message = errorObj.getErrorMsg(error) || error.message;
            res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                message: statusCode.INTERNAL_SERVER_ERROR.message,
                response: responseStatus.FAILED,
                details: message
            });
        }
    }
}


//todo need to make analytics for the admin to show total user and media content