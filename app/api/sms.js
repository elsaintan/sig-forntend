import request from './request';
import Tool from '@/utils/tool';

export const sendSMS = async (countryCode,mobile) => {
    try {
        const response = await request({
            url: `/send_sms_code`,
            method: 'POST',
            data: { countryCode,mobile },
        });
        // console.log('sendSMS response: ', response);
        return response.data;
    } catch (error) {
        // console.error('發送簡訊時發生錯誤:', error);
        throw error;
    }
};

export const checkSMSCode = async (mobile, verify_code) => {
    try {
        const response = await request({
            url: `/check_sms_code`,
            method: 'POST',
            data: { mobile, verify_code },
        }); 
        return response.data;
    } catch (error) {
        // console.error('驗證簡訊碼時發生錯誤:', error);
        throw error;
    }
};
