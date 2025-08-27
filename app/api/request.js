import axios from 'axios';
import { getSession } from 'next-auth/react';
import { apiLogin } from './token';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKENDURL+'/api';

// 創建一個變數來存儲 API Token
let apiToken = null;

// 創建一個函數來獲取或刷新 API Token
async function getApiToken() {
  if (!apiToken) {
    try {
      const result = await apiLogin({account: process.env.NEXT_PUBLIC_BACKEND_ACCOUNT, password: process.env.NEXT_PUBLIC_BACKEND_PASSWORD});
      apiToken = result.access_token; // 假設 apiLogin 返回的對象中包含 token
    } catch (error) {
      console.error('獲取 API Token 失敗:', error);
      throw error;
    }
  }
  return apiToken;
}


axios.defaults.headers["Content-Type"] = "application/json;charset=utf-8";
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
});

// 請求攔截器
api.interceptors.request.use(
  async (config) => {
    if (config.noToken) {
      console.log('noToken config:', JSON.stringify(config, null, 2));

      return config;
    }

    const session = await getSession();
    
    if (session?.user?.accessToken) {
      // 如果使用者已登入，使用使用者的 token
      config.headers['Authorization'] = `Bearer ${session.user.accessToken}`;
    } else {
      // 如果使用者未登入，使用 API Token
      const token = await getApiToken();
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    // console.log('config in request interceptor:', config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 響應攔截器
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      // 如果收到 401 錯誤，可能是 API Token 過期
      // 清除現有的 API Token，下次請求時會重新獲取
      apiToken = null;
      // 重新登錄
      await getApiToken();
    }
    return Promise.reject(error);
  }
);

export default api;