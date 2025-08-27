import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function SalePointIndex() {
  const { session, status } = useAuth('/sale_point_login');
  const router = useRouter();

  useEffect(() => {
    console.log('sale_point_index status: ', status);
    if (status === 'authenticated') {
      router.push('/member/recharge?status=confirmation')
    }else{
      router.push('/sale_point_login');
    }
  }, [status, router]);
  
  // 顯示加載中的狀態
  if (status === 'loading') {
    return <div>載入中...</div>;
  }

  // 返回空白內容，實際導航將由 useEffect 處理
  return null;
}
