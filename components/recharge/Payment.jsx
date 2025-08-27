import { Form, Row, Col, Button } from "react-bootstrap";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState,useEffect } from "react";

import ModalWrapper from "@/components/wrappers/ModalWrapper";
import PopUp from "@/components/utils/PopUp";
import useModals from "@/hooks/useModals";

export default function Payment({salePoint,isLoading,coin,setCoin}) {
  const router=useRouter()
  const { handleShowModal, handleCloseModal, isModalOpen } = useModals();
  const [modalIcon,setModalIcon] = useState('success');
  const [modalTitle,setModalTitle] = useState('通知');
  const [modalDescribe,setModalDescribe] = useState('');
  const [confirmOnClick,setConfirmOnClick] = useState(() => () => {});

  const coinList = [100,500,1000,5000,10000];
  
  const handleChangeCoin=(value)=>{
    setCoin(Number(value));
  }

  const handleSendConfirmation=()=>{

    setModalIcon('warning');
    setModalTitle('儲值確認');
    setModalDescribe(`確認要儲值${coin.toLocaleString()}嗎？`);
    setConfirmOnClick(() => () => {
      router.push('/member/recharge?status=pending')
    });
    handleShowModal("popup");
  }

  // useEffect(()=>{
  //   console.log('coin',coin);
  // },[coin])

  return (
    <>
      <Row className="pt-8">
        <Col xs="3">
          <Image src={"/image/cartThumbnail.png"} width={80} height={80} />
        </Col>
        <Col className="d-flex flex-column gap-1">
          <div className="badge badge-gold py-1" style={{ width: "80px" }}>
            儲值付款 
          </div>
          <strong className="text-green">SIG美髮專門-{salePoint.name}</strong>
          <Link href={""} style={{ color: "#8D8681" }}>
            詳細資訊{" >"}
          </Link>
        </Col>
      </Row>
      <Row className="flex-column pt-4 ">
        <Col className="text-green">
          <span className="me-2 text-green">儲值金額</span>
          {coinList.map((coinValue)=>{
            return <Button key={coinValue} className={`btn-coin btn-green me-2 ${coin === coinValue ? 'active' : ''}`} onClick={()=>handleChangeCoin(coinValue)}>{coinValue.toLocaleString()}</Button>
          })}
        </Col>
        <Col className="p-4 d-flex border-bottom justify-content-between align-items-center">
          <div className="fw-bold fs-1">NT$</div>
          <div className="fw-bold fs-1">
            <Form.Control 
              className="fw-bold fs-1 text-end border-0" 
              type="text" 
              value={coin.toLocaleString()} 
              onChange={(e) => handleChangeCoin(e.target.value.replace(/,/g, ''))} 
              required
            />
          </div>
        </Col>
      </Row>

      <Row>
        <Col>
          <div className="text-green py-4">注意事項:</div>
          <div>
            <ol>
              <li>請輸入商店人員告知您的付款金額。</li>
              <li>請點選「付款」按鍵，以進行付款。</li>
            </ol>
          </div>
        </Col>
      </Row>
      <Button className="btn-bottom" onClick={handleSendConfirmation}>發送儲值確認</Button>

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
    </>
  );
}
