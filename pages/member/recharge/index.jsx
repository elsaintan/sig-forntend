import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import DefaultLayout from "@/components/layout/DefaultLayout";
import Payment from "@/components/recharge/Payment";
import PendingPayment from "@/components/recharge/PendingPayment";
import SuccessfulPayment from "@/components/recharge/SuccessfulPayment";
import Confirmation from "@/components/recharge/Confirmation";
import ConfirmedPayment from "@/components/recharge/ConfirmedPayment";

import { useAuth } from "@/hooks/useAuth";
import { getSalePoint } from "@/api/sale_point";

export default function Recharge() {
  const router = useRouter();

  const { status } = router.query;
  const {session } = useAuth();
  const [salePoint,setSalePoint] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  const [coin,setCoin] = useState(0);
  const [memberId,setMemberId] = useState(session?.user?.memberId);
  const [memberName,setMemberName] = useState(session?.user?.memberName);
  const [isMember,setIsMember] = useState(session?.user?.role === 'member');

  useEffect(() => {
    if(!session?.user?.memberId){
      router.push('/member');
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try{
        const res = await getSalePoint();
        console.log('salePointRes:',res);
        setSalePoint(res.data[0]);
        setMemberId(session.user.memberId);
        setMemberName(session.user.memberName);
        setIsMember(session.user.role === 'member');

      }catch(error){
        console.log('error: ', error);
        if(error?.response?.status === 500){
          router.push('/systemError');
        }
      }finally{
        setIsLoading(false);
      }
    }

    fetchData();
  }, [session, router]); 

  useEffect(()=>{
    console.log('coin',coin);
  },[coin])

  const titles = {
    pending: "等待店家確認",
    success: "儲值成功",
    confirmation: "儲值確認",
    confirmed: "已確認儲值",
  };

  const components = {
    pending: <PendingPayment salePoint={salePoint} coin={coin} memberId={memberId} memberName={memberName} />,
    success: <SuccessfulPayment salePoint={salePoint} isLoading={isLoading} />,

    confirmation: <Confirmation salePoint={salePoint} />,
    confirmed: <ConfirmedPayment salePoint={salePoint}/>,
  };

  const layoutProps = {
    pending: { goBack: true },
    success: { goBack: true },
    confirmation: { goBack: false },
    confirmed: { goBack: true },
  };

  return (
    <DefaultLayout title={titles[status] || "儲值付款"} close={isMember?true:false} goBack={isMember?true:false} previousPath="/member" isLoading={isLoading} >
      {components[status] || <Payment salePoint={salePoint} isLoading={isLoading} coin={coin} setCoin={setCoin} />}
    </DefaultLayout>
  );
}
