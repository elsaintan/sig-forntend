import request from './request';
import Tool from '@/utils/tool';

export const getEmployee = async () => {
    try {
        const response = await request({
            url: `/employee`,
            method: 'GET',
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getScheduleByEmployeeId = async (employeeId, startDate, endDate) => {
    try {
        const response = await request({
            url: `/employee/schedule/${employeeId}`,
            method: 'GET',
            params: {
                startDate: startDate,
                endDate: endDate,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};