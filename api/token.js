import request from './request';
import Tool from '@/utils/tool';

export const isTokenValid = async (token) => {
    // console.log('token in isTokenValid: ', token);
    try{
        const response = await request({
            url: `/me?${Tool.getQueryString({token: token})}`,
            method: 'GET',
        });
        // console.log('response isTokenValid: ', response);
        return response.data.status;
    }catch(error){
        return false;
    }
};

export const apiLogin = async (params) => {
    try{
        // console.log('ready to apiLogin');
        const response = await request({
            url: `/api_login`,
            method: 'POST',
            noToken: true,
            data: params,
        });

        // console.log('response apiLogin: ', response);
        if(response.data.status){
            return response.data.data;
        }else{
            throw new Error(response.data.msg ?? '登入失敗');
        }
    }catch(error){
        throw error;
    }
};
