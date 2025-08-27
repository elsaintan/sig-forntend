import { Row, Col,Spinner } from "react-bootstrap";
import { useRouter } from "next/router";
import { useState,useEffect } from "react";
import Pusher from "pusher-js";
import md5 from "md5";

import ModalWrapper from "@/components/wrappers/ModalWrapper";
import PopUp from "@/components/utils/PopUp";
import useModals from "@/hooks/useModals";

import { triggerRechargeEvent } from "@/api/member";


export default function PendingPayment({salePoint,coin,memberId,memberName}) {
  const router = useRouter();
  const [pusher,setPusher] = useState(null);
  const [channel,setChannel] = useState(null);

  const { handleShowModal, handleCloseModal, isModalOpen } = useModals();
  const [modalIcon,setModalIcon] = useState('success');
  const [modalTitle,setModalTitle] = useState('通知');
  const [modalDescribe,setModalDescribe] = useState('');
  const [confirmOnClick,setConfirmOnClick] = useState(() => () => {});
  const [isLoading,setIsLoading] = useState(false);

  useEffect(() => {
    // console.log('key:',process.env.NEXT_PUBLIC_PUSHER_APP_KEY);
    // console.log('cluster:',process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER);
    const pusherInstance = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
    });
    let channelInstance = null;
    let channelName = null;
    if(salePoint.id){
      // 訂閱特定的 channel
      channelName = `recharge-channel-${salePoint.id}`;
      channelInstance = pusherInstance.subscribe(channelName);
      
      setPusher(pusherInstance);
      setChannel(channelInstance);

      // 綁定 recharge-result-event
      channelInstance.bind('recharge-result-event', handleRechargeEvent);

      // 發送儲值請求事件
      const timestamp = new Date().toISOString();
      const checkSum = md5(salePoint.id+memberId+coin+timestamp);
      const data = {
        salePointId: salePoint.id,
        memberId: memberId,
        memberName: memberName,
        amount: coin,
        timestamp: timestamp,
        checkSum: checkSum
      }
      rechargeEvent(data);
      
      // channelInstance.trigger('client-recharge-event', data);
      // console.log('已發送儲值請求事件 client-recharge-event:', data);
    }

    return () => {
      if(channelInstance){
        channelInstance.unbind('recharge-result-event', handleRechargeEvent);
        pusherInstance.unsubscribe(channelName);
      }
    };
  }, [salePoint.id]);

  const rechargeEvent = async (data) => {
    try{
      const res = await triggerRechargeEvent(data);
     
      if(res.status){
        console.log('已發送儲值請求事件 recharge-event:', data);
        // router.push('/member/recharge?status=confirmation')
      }else{
        throw new Error(res.msg);
      }

    }catch(error){
      console.log('error:',error);
      if(error?.response?.status === 500){
        router.push('/systemError');
      }

      setModalIcon('error');
      setModalTitle('儲值失敗');
      setModalDescribe('請求儲值失敗');
      handleShowModal("popup");
      setConfirmOnClick(() => () => {
        router.push('/member/recharge')
      });
    }
  }

  const handleRechargeEvent = (data) => {
    console.log('收到儲值結果事件:', data);
    if(data.salePointId===salePoint.id){
      // setIsLoading(true);

      if(data.status){
        router.push('/member/recharge?status=success')
      }else{
        setModalIcon('error');
        setModalTitle('儲值失敗');
        setModalDescribe(data.msg);
        handleShowModal("popup");

        setConfirmOnClick(() => () => {
          router.push('/member/recharge')
        });

        // setIsLoading(false);
      }
      
    }
  };

  return (
    <>
    {isLoading && (
      <div className="position-fixed top-0 start-0 w-100 h-100 bg-secondary opacity-50 d-flex justify-content-center align-items-center" style={{zIndex: 9999}}>
        <Spinner animation="border" variant="light" />
      </div>
    )}
    <div className='vh-100'>
      <Row className="pt-8 flex-column gap-1 border-bottom pb-4">
        <Col className="d-flex justify-content-center">
          <div className="badge badge-gold py-1">儲值付款</div>
        </Col>
        <Col className="d-flex gap-2 justify-content-center">
          <div className="fw-bold fs-1">NT$</div>
          <div className="fw-bold fs-1">{coin.toLocaleString()}</div>
        </Col>
      </Row>

      <Row className="py-4">
        <Col className="d-flex gap-1 flex-column">
          <strong className="text-green">SIG美髮專門-{salePoint.name}</strong>
          <span className="fs-small" style={{color:'#8D8681'}}>正在進行確認...</span>
        </Col>
      </Row>
      <Row className="pt-4">
        <Col >
          <p>
            您的儲值訊息已經成功發送了！現在我們只需要等待店家進行確認，如果有任何問題或需要協助，請隨時與我們聯繫。感謝您的支持！
          </p>
        </Col>
      </Row>

      <ModalWrapper
        key="popup"
        show={isModalOpen("popup")}
        size="lg"
        onHide={() => handleCloseModal("popup")}
      >
        <PopUp
          imageSrc={modalIcon}
          title={modalTitle}
          describe={modalDescribe}
          confirmOnClick={() => {
            confirmOnClick();
            handleCloseModal("popup");
          }}
          denyOnClick={() => {
            handleCloseModal("popup");
          }}
        />
      </ModalWrapper>

    </div>
    </>
  );
}
