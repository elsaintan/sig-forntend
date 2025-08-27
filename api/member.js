import request from './request';
import Tool from '@/utils/tool';

export const login = async (data) => {
    try {
        const response = await request({
            url: `/login`,
            method: 'POST',
            data,
        });
        // console.log(['login response: ', response]);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const register = async (data) => {
    try {
        const response = await request({
            url: `/register`,
            method: 'POST',
            data,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getMemberInfo = async (id) => {
    try {
        const response = await request({
            url: `/member/${id}`,
            method: 'GET',
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateMemberInfo = async (id,data) => {
    try {
        const response = await request({
            url: `/member/${id}`,
            method: 'PUT',
            data,
        });
        return response.data;
    } catch (error) {
        // if(error.response.status==500){
        //     error.response.msg = '系統錯誤';
        // }
        throw error;
    }
};

export const uploadFile = async (id,data) => {
    try {
        const response = await request({
            url: `/member/upload/${id}`,
            method: 'POST',
            data,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createReservation = async (data) => {
    try {
        const response = await request({
            url: `/member/reservation`,
            method: 'POST',
            data,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getReservationList = async () => {
    try {
        const response = await request({
            url: `/member/reservation`,
            method: 'GET',
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getDepositList = async () => {
    try {
        const response = await request({
            url: `/sale`,
            method: 'GET',
            params:{
                is_detail:0,
                sale_type_id:'coin',
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getSaleList = async () => {
    try {
        const response = await request({
            url: `/sale`,
            method: 'GET',
            params:{
                is_detail:0,
                is_show_coin:1,
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const triggerRechargeEvent = async (data) => {
    try {
        const response = await request({
            url: `/member/recharge/event`,
            method: 'POST',
            data,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};