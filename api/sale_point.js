import request from './request';
import Tool from '@/utils/tool';

export const salePointLogin = async (data) => {
    try {
        const response = await request({
            url: `/sale_point_login`,
            method: 'POST',
            data,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getSalePoint = async () => {
    try {
        const response = await request({
            url: `/sale_point`,
            method: 'GET',
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const confirmRecharge = async (params) => {
    try {
        const response = await request({
            url: `/sale_point/confirm_recharge`,
            method: 'POST',
            data: params
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
