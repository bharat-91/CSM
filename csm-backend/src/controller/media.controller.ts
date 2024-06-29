import { inject } from "inversify";
import { controller, httpDelete, httpGet, httpPost, httpPut, request, response } from "inversify-express-utils";
import { mediaService } from "../service";
import { TYPES } from "../types/types";
import { Request, Response } from "express";
import { ErrorHandling } from "../utils/errorHelper";
import { responseStatus, statusCode } from "../utils/statusResponse";
import { IMedia } from "../interface";
import { upload } from '../middleware/multer.middleware';
import { isAdmin, isLoggedInMiddleware } from "../middleware/authorization.middleware";
import mongoose, { Types } from "mongoose";
import { handleCloudinaryUpload } from "../middleware/cloudinary.middleware";
import { Media, User } from "../models";
import { moduleType } from "../utils/moduleSetter";


const errorObj = new ErrorHandling()
@controller('/media',moduleType("Media"))

export class mediaController {
    constructor(@inject<mediaService>(TYPES.mediaService) private media: mediaService) { }


    @httpGet('/getAllContent')
    async getMediaContent(@request() req: Request, @response() res: Response): Promise<void> {
        try {
            const media = await Media.find()

            res.status(statusCode.CREATED.code).json({
                response: responseStatus.SUCCESS,
                details: statusCode.CREATED.message,
                data: media
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
    @httpGet('/getContent/:mediaId')
    async getMediaContentById(@request() req: Request, @response() res: Response): Promise<void> {
        try {
            const {mediaId} = req.params
            const media = await Media.findById({_id: mediaId})

            const getAuthorName = media?.userId
            let authorName = await User.findById({_id: getAuthorName})
            res.status(statusCode.CREATED.code).json({
                response: responseStatus.SUCCESS,
                details: statusCode.CREATED.message,
                authorName:authorName?.username,
                data: media
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

    @httpPost('/upload/:userId', isLoggedInMiddleware, upload.single('content'))
    async uploadMedia(@request() req: Request, @response() res: Response): Promise<void> {
        try {

            let mediaData: IMedia;

            if (req.body.mediaData) {
                try {
                    mediaData = JSON.parse(req.body.mediaData);
                } catch (error) {
                    res.status(400).json({ error: 'Invalid JSON format in mediaData' });
                    return;
                }
            } else {
                const { title, description, status } = req.body;
                const requiredFields = ['title', 'description', 'status'];
                const missingFields = requiredFields.filter(field => !req.body[field]);

                if (missingFields.length > 0) {
                    res.status(400).json({ error: `Please enter the missing fields: ${missingFields.join(', ')}` });
                    return;
                }

                mediaData = {
                    title: title,
                    description: description,
                    status: status
                };
            }
            const { userId } = req.params;
            mediaData.userId = new mongoose.Types.ObjectId(userId);

            if (req.file) {
                mediaData.contentPath = await handleCloudinaryUpload(req.file);
                mediaData.filename = req.file.originalname;
                mediaData.fileType = req.file.mimetype
            } 
            const mediaCreated = await this.media.uploadMedia(mediaData);
            

            res.status(statusCode.CREATED.code).json({
                response: responseStatus.SUCCESS,
                details: statusCode.CREATED.message,
                data: mediaCreated
            });

        } catch (error: any) {
            console.error('Error:', error);
            const message = errorObj.getErrorMsg(error) || error.message;
            res.status(500).json({
                message: 'Internal Server Error',
                response: 'FAILED',
                details: message
            });
        }
    }

    @httpPut('/updateContent/:userId/:mediaId', isLoggedInMiddleware, upload.single('content'))
    async updateMediaContent(@request() req: any, @response() res: Response): Promise<void> {
        try {
            let mediaData;
            mediaData = req.body
            const authenticatedUserId = req.user._id;
            const { userId, mediaId } = req.params
            if (userId !== authenticatedUserId.toString()) {
                res.status(statusCode.UNAUTHORIZED.code).json({
                    message: 'Unauthorized',
                    response: responseStatus.FAILED,
                    details: 'You are not authorized to update this Content'
                });
                return
            }
            const user = await User.findById({ _id: userId })
            if (!user) {
                res.status(404).json("User not Found")
            }
            const media = await Media.findById({ _id: mediaId })

            if (!media) {
                res.status(404).json("Media not Found")
            }
            if (req.file) {
                mediaData.contentPath = await handleCloudinaryUpload(req.file);
                mediaData.filename = req.file.originalname;
                mediaData.fileType = req.file.mimetype
            }
            console.log(mediaData, req.file);
            const updatedMedia = await Media.findByIdAndUpdate({ _id: mediaId }, mediaData)

            res.status(statusCode.SUCCESS.code).json({
                message: statusCode.SUCCESS.message,
                details: updatedMedia,
                response: responseStatus.SUCCESS
            });

        } catch (error: any) {
            const message = errorObj.getErrorMsg(error) || error.message;
            res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                message: statusCode.INTERNAL_SERVER_ERROR.message,
                response: responseStatus.FAILED,
                details: message
            });
        }
    }
    @httpPut('/updateContentDesc/:userId/:mediaId', isLoggedInMiddleware)
    async updateMediaContentData(@request() req: any, @response() res: Response): Promise<void> {
        try {
            const authenticatedUserId = req.user._id;
            const { userId, mediaId } = req.params
            if (userId !== authenticatedUserId.toString()) {
                res.status(statusCode.UNAUTHORIZED.code).json({
                    message: 'Unauthorized',
                    response: responseStatus.FAILED,
                    details: 'You are not authorized to update this Content'
                });
                return
            }
            const user = await User.findById({ _id: userId })
            if (!user) {
                res.status(404).json("User not Found")
            }
            const media = await Media.findById({ _id: mediaId })

            if (!media) {
                res.status(404).json("Media not Found")
            }
            const updatedMedia = await Media.findByIdAndUpdate({ _id: mediaId }, req.body)

            res.status(statusCode.SUCCESS.code).json({
                message: statusCode.SUCCESS.message,
                details: updatedMedia,
                response: responseStatus.SUCCESS
            });

        } catch (error: any) {
            const message = errorObj.getErrorMsg(error) || error.message;
            res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                message: statusCode.INTERNAL_SERVER_ERROR.message,
                response: responseStatus.FAILED,
                details: message
            });
        }
    }

    @httpDelete('/deleteContent/:userId/:mediaId', isLoggedInMiddleware, TYPES.PermissionMiddleware)
    async deleteContent(@request() req: any, @response() res: Response): Promise<void> {
        try {
            // const authenticatedUserId = req.user._id;
            const { userId, mediaId } = req.params
            // const isAdmin = req.user.roleName === 'Admin'
            // if (userId !== authenticatedUserId.toString() || !isAdmin) {
            //     res.status(statusCode.UNAUTHORIZED.code).json({
            //         message: 'Unauthorized',
            //         response: responseStatus.FAILED,
            //         details: 'You are not authorized to update this Content'
            //     });
            //     return
            // }
            // console.log(req.permission);
            // console.log("Permission", req.permission.update);
            
            // if(req.permission.update){
                const user = await User.findById({ _id: userId })
                if (!user) {
                    res.status(404).json("User not Found")
                }
                const media = await Media.findById({ _id: mediaId })
    
                if (!media) {
                    res.status(404).json("Media not Found")
                }
    
                const deleteMedia = await Media.findByIdAndDelete({ _id: mediaId })
                res.status(statusCode.SUCCESS.code).json({
                    message: statusCode.SUCCESS.message,
                    details: deleteMedia,
                    response: responseStatus.SUCCESS
                });
            // }
        } catch (error: any) {console.log(error);
        
            const message = errorObj.getErrorMsg(error) || error.message;
            res.status(statusCode.INTERNAL_SERVER_ERROR.code).json({
                message: statusCode.INTERNAL_SERVER_ERROR.message,
                response: responseStatus.FAILED,
                details: message
            });
        }
    }
}