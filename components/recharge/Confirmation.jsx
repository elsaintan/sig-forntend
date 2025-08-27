import { Row, Col, Button,Spinner } from "react-bootstrap";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Pusher from 'pusher-js';
import md5 from 'md5';

import SpinnerButton from "@/components/utils/SpinnerButton";
import ModalWrapper from "@/components/wrappers/ModalWrapper";
import PopUp from "@/components/utils/PopUp";
import useModals from "@/hooks/useModals";

import { confirmRecharge } from "@/api/sale_point";

export default function Confirmation({salePoint}) {
  const router = useRouter();
  const [pusher, setPusher] = useState(null);
  const [channel, setChannel] = useState(null);
  const [rechargeStatus, setRechargeStatus] = useState('waiting');
  const [coin, setCoin] = useState(0);
  const [memberName, setMemberName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rechargeData, setRechargeData] = useState({});

  const { handleShowModal, handleCloseModal, isModalOpen } = useModals();
  const [modalIcon,setModalIcon] = useState('success');
  const [modalTitle,setModalTitle] = useState('通知');
  const [modalDescribe,setModalDescribe] = useState('');
  const [confirmOnClick,setConfirmOnClick] = useState(() => () => {});

  useEffect(() => {
    // 初始化 Pusher
    const pusherInstance = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_APP_CLUSTER,
      encrypted: true
    });

    // 訂閱頻道
    const channelInstance = pusherInstance.subscribe(`recharge-channel-${salePoint.id}`);

    setPusher(pusherInstance);
    setChannel(channelInstance);

    // 監聽事件
    channelInstance.bind('recharge-event', handleRechargeEvent);

    // 組件卸載時清理
    return () => {
      channelInstance.unbind('recharge-event', handleRechargeEvent);
      pusherInstance.unsubscribe(`${salePoint.id}-recharge-channel`);
    };
  }, [salePoint.id]);

  // 在這裡處理接收到的儲值信息
  const handleRechargeEvent = (data) => {
    console.log('收到儲值事件:', data);
    if(data.salePointId===salePoint.id){
      const checkSum = md5(data.salePointId + data.memberId + data.amount + data.timestamp);
      if(checkSum===data.checkSum){
        setIsLoading(true);
        setRechargeStatus('recharging')
        setCoin(data.amount);
        setMemberName(data.memberName);
        setIsLoading(false);
        setRechargeData(data);
      }else{
        console.log('checkSum 錯誤:');
        console.log('our:',checkSum);
        console.log('theirs:',data.checkSum);
      }
    }
  };

  const handleConfirmPayment=async()=>{
    setIsLoading(true);

    await confirmRecharge(rechargeData).then(res=>{
      if(res.status){
        router.push('/member/recharge?status=confirmed')
      }else{
        throw new Error(res.msg??'');
      }
    }).catch(error=>{
      console.log('儲值失敗:',error);

      setModalIcon('error');
      setModalTitle('儲值失敗');
      setModalDescribe('儲值失敗，請使用者重新操作');
      handleShowModal('popup'); 
      setConfirmOnClick(() => () => {
        setRechargeStatus('waiting');
        setIsLoading(false);
        setRechargeData({});
      });
    }).finally(()=>{
      setIsLoading(false);
    })

    // router.push('/member/recharge?status=confirmed')
  }

  return (
    <>
      {rechargeStatus === 'recharging' ? (
        <>
          <Row className="flex-column pt-8 text-center gap-1">
            <Col className="fs-small text-gray">儲值確認，來自</Col>
            <Col className="text-green fs-large fw-bold">{memberName}</Col>
          </Row>

          <Row className="py-4 border-bottom border-top my-4 gap-1 flex-column">
            <Col className="d-flex justify-content-center">
              <div className="badge badge-gold">儲值付款</div>
            </Col>
            <Col className="d-flex justify-content-center gap-2">
              <div className="fs-2 fw-bold">NT$</div>
              <div className="fs-2 fw-bold">{coin.toLocaleString()}</div>
            </Col>
          </Row>

          <Row>
            <Col className="text-center">請問要確認此筆儲值嗎？</Col>
          </Row>

          <SpinnerButton type="button" onClick={handleConfirmPayment} className="btn-bottom" isLoading={isLoading}>確認</SpinnerButton>
        </>
      ) : (
        <>
          <Row className="flex-column pt-8 text-center gap-1">
            <Col className="fs-small text-gray">等待儲值中...</Col>
          </Row>
        </>
      )}
      {isLoading && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-secondary opacity-50 d-flex justify-content-center align-items-center" style={{zIndex: 9999}}>
          <Spinner animation="border" variant="light" />
        </div>
      )}

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
          denyText="再試一次"
        />
      </ModalWrapper>
    </>
  );
}
