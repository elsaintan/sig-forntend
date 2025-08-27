import request from './request';
import Tool from '@/utils/tool';

export const getStock = async () => {
    try {
        const response = await request({
            url: `/stock`,
            method: 'GET',
            params: {
                exclude_id: 'coin',
                is_valid: 1,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
