import { Form, Row, Col, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

import useModals from "@/hooks/useModals";
import DefaultLayout from "@/components/layout/DefaultLayout";
import ModalWrapper from "@/components/wrappers/ModalWrapper";
import PopUp from "@/components/utils/PopUp";

import { createReservation } from "@/api/member";


export default function AppointmentForm({ selectedDateTime, selectedEmployee, selectedStock, selectedReservationDate }) {
  const router = useRouter();
  const { handleShowModal, handleCloseModal, isModalOpen } = useModals();
  const [modalIcon, setModalIcon] = useState('success');
  const [modalTitle, setModalTitle] = useState('通知');
  const [modalDescribe, setModalDescribe] = useState('');
  const [confirmOnClick, setConfirmOnClick] = useState(() => () => { });
  const [previousPath, setPreviousPath] = useState('/member/appointment/schedule');
  const [appointmentSuccess, setAppointmentSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    // reservation_type_id: 'confirmed',
    employee_id: '',
    stock_id: '',
    full_reservation_date: '',
    phone: '',
    description: ''
  });

  useEffect(() => {
    setFormData({
      reservation_type_id: 'pending',
      employee_id: selectedEmployee.id,
      stock_id: selectedStock.id,
      full_reservation_date: selectedReservationDate,
    });
  }, [selectedEmployee, selectedStock, selectedReservationDate]);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    // console.log('formData: ', formData);

    try {
      setIsLoading(true);

      const response = await createReservation(formData);
      console.log('response: ', response);
      if (response.status) {
        setAppointmentSuccess(true);
        setPreviousPath('/member');
      } else {

        setModalIcon('error');
        setModalTitle('預約失敗');
        setModalDescribe(response.msg);
        handleShowModal("popup");

        throw new Error(response.message);
      }
    } catch (error) {
      console.error('Error submitting form: ', error);
      if (error?.response?.status === 500) {
        router.push('/systemError');
      } else {

      }
    } finally {
      setIsLoading(false);
    }

  };

  return (
    <>
      <DefaultLayout goBack title="請確認預約內容" close previousPath={previousPath} isLoading={isLoading}>
        {appointmentSuccess ? (
          <>
            <Row className="pt-20 flex-column gap-10">
              <Col className="justify-content-center d-flex">
                <Image width={100} height={100} src={"../../image/logo.png"} />
              </Col>
              <Col>
                <Row className="">
                  <Col className="text-green fw-bold text-center mb-2">
                    預約成功！
                  </Col>
                </Row>
                <Row>
                  <Col className="text-center">
                    <p className="fs-small">
                      謝謝您的預約，我們已經收到您的預約資訊。
                      如果您有任何問題或需求，請隨時與我們聯繫。
                      祝您有美好的一天！
                    </p>
                  </Col>
                </Row>
              </Col>
            </Row>
          </>
        ) : (
          <Form className="pt-10 px-2" onSubmit={handleFormSubmit}>
            <Row className="gap-4">
              <Form.Group as={Col} md="4" controlId="personnel">
                <Form.Control type="hidden" name="employee_id" value={formData.employee_id} />
                <Form.Label className="text-green fw-bold">服務人員</Form.Label>
                <Form.Control type="text" name="employee_name" defaultValue={selectedEmployee.name} disabled />
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="service">
                <Form.Control type="hidden" name="stock_id" value={formData.stock_id} />
                <Form.Label className="text-green fw-bold">服務項目</Form.Label>
                <Form.Control type="text" name="stock_name" defaultValue={selectedStock.name} disabled />
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="date">
                <Form.Control type="hidden" name="full_reservation_date" value={formData.full_reservation_date} />
                <Form.Label className="text-green fw-bold">預約時間</Form.Label>
                <Form.Control type="text" name="reservation_date_display" defaultValue={selectedDateTime} disabled />
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="phone">
                <Form.Label className="text-green fw-bold">手機號碼</Form.Label>
                <Form.Control
                  value={formData.phone}
                  onChange={(e) => {
                    const newValue = e.target.value.replace(/[^\d+]/g, '');
                    const plusCount = newValue.split('+').length - 1;
                    if (plusCount <= 1) {
                      setFormData(prevData => ({
                        ...prevData,
                        phone: newValue
                      }));
                    }
                  }}
                  placeholder="請留下您的手機"
                  type="tel"
                  pattern="[\d\s+]*"
                  maxLength={18}
                  minLength={7}
                  required
                  name="phone"
                />
              </Form.Group>
              <Form.Group as={Col} md="4" controlId="phone">
                <Form.Label className="text-green fw-bold">留言內容</Form.Label>
                <Form.Control
                  as="textarea"
                  type="text"
                  name="description"
                  placeholder="點此留言給服務人員"
                  rows={3}
                  defaultValue={formData.description}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </Row>

            <Row className="mt-4">
              <Col className="">
                <span className="text-green">留意事項：</span>
                <ol className="ps-3">
                  <li className="fs-small">請提前15分鐘到達。</li>
                  <li className="fs-small">
                    若需要取消或更改預約，請提前一天通知，以免影響其他客人的安排
                  </li>
                </ol>
              </Col>
            </Row>

            <Button className="btn-bottom" type="submit">
              立即預約
            </Button>
          </Form>
        )}
      </DefaultLayout>

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
        />
      </ModalWrapper>
    </>
  );
}
