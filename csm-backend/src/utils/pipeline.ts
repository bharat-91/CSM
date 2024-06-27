import { paginationParams } from '../interface/pagination.params.interface';
import { PipelineStage } from 'mongoose';
import { User } from '../models';

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
