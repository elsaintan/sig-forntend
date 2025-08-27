import React from "react";
import { Row, Col, Button, Spinner } from "react-bootstrap";
import Image from "next/image";

import DefaultLayout from "@/components/layout/DefaultLayout";
import Icon from "@/components/Icon";
import memberActions from "@/data/options/memberActions.json";

import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getMemberInfo } from "@/api/member";
import { useAuth } from "@/hooks/useAuth";

export default function Member() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [memberInfo, setMemberInfo] = useState(null);
  const [systemError, setSystemError] = useState(false);
  const { session, status } = useAuth();

  useEffect(() => {
    if (systemError) {
      router.push('/systemError');
      return;
    }
    // console.log('member session:',session);
    if (!session?.user?.memberId) return;

    setIsLoading(true);
    getMemberInfo(session.user.memberId).then((res) => {
      setMemberInfo(res.data);
      // console.log('memberInfo: ', memberInfo);

      //先完成資料才能使用
      // if(memberInfo.user.is_enable===0){
      //   router.push('/member/edit-info');
      // }
      if (session.user.role === 'sale_point') {
        router.push('/member/recharge?status=confirmation')
      }

      setIsLoading(false);
    }).catch((error) => {
      if (error?.response?.status === 500) {
        setSystemError(true);
      }
      console.log('error: ', error);
      setIsLoading(false);
    }).finally(() => {
      setIsLoading(false);
    });

  }, [session, systemError, router]);


  return (
    <DefaultLayout title="會員中心" logout className="member-footer" isLoading={isLoading}>

      <Row className="pt-4">
        <Col>
          <Row className="pb-0">
            <Col xs="9" className="d-flex align-items-center">
              {memberInfo ? (
                <Image
                  width={60}
                  height={60}
                  alt="頭貼"
                  className="rounded-circle object-fit-cover"
                  src={memberInfo.avatar || '/image/memberThumbnail.png'}
                />
              ) : (
                <div style={{ width: 60, height: 60 }} className="rounded-circle object-fit-cover"></div>
              )}
              <div className="d-flex flex-column ms-4 flex-grow-1 overflow-hidden">
                <div className="text-green fs-large fw-bold mb-0 text-truncate">Hi, {memberInfo?.name}</div>
                <span className="fs-small">歡迎回來</span>
              </div>
            </Col>
            <Col xs="3" className="d-flex justify-content-end align-items-center">
              <Button className="bg-transparent border-0 d-flex p-0 text-nowrap" onClick={() => router.push('/member/edit-info')}>
                <Icon name="setting"></Icon>
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row className="mt-4 px-2">
        <Col className="custom-shadow rounded rounded-3">
          <Row className="flex-column align-items-center py-4 px-2">
            <Col className="d-flex gap-2">
              <div className="badge badge-gold">剩餘儲值金</div>
              <Icon name="rechargeInfo"></Icon>
            </Col>
            <Col className="d-flex gap-2 mt-1">
              <div className="index-money-text">NT$</div>
              <div className="index-money-text">{(memberInfo?.coin?.coin * 1 || 0).toLocaleString()}</div>
            </Col>
          </Row>
        </Col>
      </Row>

      {/*  ToDo: 通知bar */}
      {/* <Row className="pt-4 px-2">
        <Col className="shadow rounded rounded-3 p-4">
          <Row>
            <Col xs="2" className="d-flex justify-content-center">
              <Icon name="redBell"></Icon>
            </Col>
            <Col>
              <p style={{ color: "#8D8681" }}>
              </p>
            </Col>
          </Row>
        </Col>
      </Row> */}

      <Row className="pt-6">
        <Col className="d-flex flex-column gap-3">
          {memberActions.map((type, i) => (
            <Row key={i} className="">
              <Col className="d-flex gap-2 align-items-center">
                <Icon name={type.icon}></Icon>
                <strong className={type.textStyle}>{type.name}</strong>
              </Col>
              {type.buttons.map((button, i) => (
                <React.Fragment key={i}>
                  {button.actionText && (
                    <Col>
                      <Button className={button.className} onClick={() => router.push(button.route)}>
                        {button.actionText}
                      </Button>
                    </Col>
                  )}
                  {button.recordText && (
                    <Col className="d-flex justify-content-end">
                      <Button className={button.className} onClick={() => router.push(button.route)}>
                        {button.recordText}
                      </Button>
                    </Col>
                  )}
                </React.Fragment>
              ))}
              <div className="fs-small justify-content-end d-flex gap-2">
                <span className="text-gray">{type.last_action.text}</span>
                <span className="text-gray">{memberInfo && memberInfo[`recent_${type.id}_date`] || '--'}</span>
              </div>
            </Row>
          ))}
        </Col>
      </Row>

      <Row className="mt-40 pt-28 ">
        <Col className="text-center">
          <span
            className="text-white footer-copyright"
            style={{ fontSize: "10px" }}
          >
            Copyright © SILENCE IS GOLD INCORPORATED All Rights Reserved.
          </span>
        </Col>
      </Row>
    </DefaultLayout>
  );
}
