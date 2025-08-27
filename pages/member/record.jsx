import { Row, Col, Button, Form } from "react-bootstrap";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import DefaultLayout from "@/components/layout/DefaultLayout";
import Icon from "@/components/Icon";
import Appointment from "@/components/records/AppointmentList";
import Recharge from "@/components/records/RechargeList";
import Expense from "@/components/records/ExpenseList";

import { useAuth } from "@/hooks/useAuth";
import recordOptions from "@/data/options/recordOptions.json";
import { getMemberInfo } from "@/api/member";

export default function Record() {
  const router = useRouter();
  const { record } = router.query;
  const [activeRecord, setActiveRecord] = useState("預約紀錄");
  const [memberInfo, setMemberInfo] = useState(null);
  const [systemError, setSystemError] = useState(false);
  const { session, status } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (systemError) {
      router.push('/systemError');
      return;
    }
    console.log('member session:', session);
    if (!session?.user?.memberId) return;

    setIsLoading(true);
    getMemberInfo(session.user.memberId).then((res) => {
      setMemberInfo(res.data);
      console.log('memberInfo: ', memberInfo);

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


  // 根據當前 URL 查詢參數設置預設的紀錄內容
  useEffect(() => {
    if (record) {
      const option = recordOptions.find((opt) => opt.key === record);
      if (option) {
        setActiveRecord(option.value);
      }
    }
  }, [record]);

  const handleShowRecord = (record) => {
    const option = recordOptions.find((opt) => opt.key === record);
    if (option) {
      setActiveRecord(option.value);
    }

    router.replace(`/member/record?record=${record}`, undefined, {
      shallow: true,
    });
  };

  // 動態渲染對應的紀錄元件
  const renderActiveRecord = () => {
    switch (activeRecord) {
      case "消費紀錄":
        return <Expense />;
      case "儲值紀錄":
        return <Recharge />;
      default:
        return <Appointment />;
    }
  };

  return (
    <DefaultLayout title={activeRecord} goBack previousPath="/member" close isLoading={isLoading}>
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
                  src={memberInfo?.avatar || '/image/memberThumbnail.png'}
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

      <Row className="mt-4">
        <Col>
          <Row className="mx-0">
            {recordOptions.map((option, i) => {
              return (
                <Col key={option.key} xs="4" className="p-0">
                  <Button
                    onClick={() => handleShowRecord(option.key)}
                    className={
                      activeRecord === option.value
                        ? "btn-record-nav-active"
                        : "btn-record-nav"
                    }
                  >
                    {option.value}
                  </Button>
                </Col>
              );
            })}
          </Row>
        </Col>
      </Row>

      <Row className="py-4">
        <Col>
          <Form.Select className="py-2">
            <option>依日期排序</option>
          </Form.Select>
        </Col>
      </Row>
      <Row className="pt-4">
        <Col>{renderActiveRecord()}</Col>
      </Row>
    </DefaultLayout>
  );
}
