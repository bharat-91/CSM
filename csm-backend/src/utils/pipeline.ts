import { paginationParams } from '../interface/pagination.params.interface';
import { PipelineStage } from 'mongoose';
import { Media, User } from '../models';

const addPaginationStages = ({ pageNumber, pageLimit, pageSort }: paginationParams): PipelineStage[] => {
    return [
        { $skip: (pageNumber - 1) * pageLimit },
        { $limit: pageLimit },
        { $sort: { [pageSort]: 1 } } 
    ];
};

export const getAllUsers = async ({ pageNumber, pageLimit, pageSort }: paginationParams) => {
    const pipeline: PipelineStage[] = [
        ...addPaginationStages({ pageNumber, pageLimit, pageSort })
    ];

    try {
        const results = await User.aggregate(pipeline); 
        return results;
    } catch (error) {
        console.error('Error in getAllUsers aggregation:', error);
        throw error;
    }
};

export const fileTypePer = async () => {
    const pipeline = [
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
                imageCount: {
                    $sum: {
                        $cond: {
                            if: { $eq: ["$fileType", "image/jpeg"] },
                            then: 1,
                            else: 0
                        }
                    }
                },
                pdfCount: {
                    $sum: {
                        $cond: {
                            if: { $eq: ["$fileType", "application/pdf"] },
                            then: 1,
                            else: 0
                        }
                    }
                },
                videoCount: {
                    $sum: {
                        $cond: {
                            if: { $in: ["$fileType", ["video/mp4", "video/mpeg"]] },
                            then: 1,
                            else: 0
                        }
                    }
                },
                audioCount: {
                    $sum: {
                        $cond: {
                            if: { $in: ["$fileType", ["audio/mpeg", "audio/wav"]] },
                            then: 1,
                            else: 0
                        }
                    }
                }
            }
        },
        {
            $project: {
                _id: 0,
                total: "$total",
                imageCount: "$imageCount",
                imagePercentage: { $multiply: [{ $divide: ["$imageCount", "$total"] }, 100] },
                pdfCount: "$pdfCount",
                pdfPercentage: { $multiply: [{ $divide: ["$pdfCount", "$total"] }, 100] },
                videoCount: "$videoCount",
                videoPercentage: { $multiply: [{ $divide: ["$videoCount", "$total"] }, 100] },
                audioCount: "$audioCount",
                audioPercentage: { $multiply: [{ $divide: ["$audioCount", "$total"] }, 100] }
            }
        }
    ];

    const result = await Media.aggregate(pipeline).exec();
    return result;
};
export const getMonthlyData = async ({ pageNumber, pageLimit, pageSort }: paginationParams, selectedMonth: number) => {
    const pipeline: PipelineStage[] = [
        {
            $match: {
                createAt: {
                    $gte: new Date(selectedMonth),
                    $lt: new Date(new Date(selectedMonth).setMonth(new Date(selectedMonth).getMonth() + 1))
                }
            }
        },
        {
            $group: {
                _id: null,
                totalCount: { $sum: 1 },
                data: {
                    $push: {
                        _id: "$_id",
                        userId: "$userId",
                        contentPath: "$contentPath",
                        createAt: "$createAt",
                        updatedAt: "$updatedAt",
                        status: "$status",
                        title: "$title",
                        description: "$description",
                        filename: "$filename",
                        fileType: "$fileType",
                        __v: "$__v"
                    }
                }
            }
        },
        {
            $unwind: "$data"
        },
        {
            $replaceRoot: {
                newRoot: {
                    $mergeObjects: ["$data", { totalCount: "$totalCount" }]
                }
            }
        }
    ]

    return pipeline
}