import { Form, Row, Col, Button } from "react-bootstrap";
import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";

import DefaultLayout from "@/components/layout/DefaultLayout";

export default function AppointmentForm() {
  const [appointmentSuccess, setAppointmentSuccess] = useState(false);

  const handleFormSubmit = () => {
    setAppointmentSuccess(true);
  };
  return (
    <DefaultLayout  title="請確認預約內容" close>
      {appointmentSuccess ? (
        <>
          <Row className="pt-20 flex-column gap-10">
            <Col className="justify-content-center d-flex">
              <Image width={100} height={100} src={"../../image/logo.png"} />
            </Col>
            <Col>
              <Row className="">
                <Col className="text-green fw-bold text-center mb-2">預約成功！</Col>
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
        <Form className="pt-10 px-2">
          <Row className="gap-4">
            <Form.Group as={Col} md="4" controlId="personnel">
              <Form.Control type="hidden" name="employee_id" />
              <Form.Label className="text-green fw-bold">服務人員</Form.Label>
              <Form.Control type="text" name="employee_name" />
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="service">
              <Form.Control type="hidden" name="stock_id" />
              <Form.Label className="text-green fw-bold">服務項目</Form.Label>
              <Form.Control type="text" name="stock_name" />
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="time">
              <Form.Control type="hidden" name="reservation_date" />
              <Form.Control type="hidden" name="reservation_start_time" />
              <Form.Label className="text-green fw-bold">預約時間</Form.Label>
              <Form.Control type="text" name="reservation_time" />
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="phone">
              <Form.Label className="text-green fw-bold">手機號碼</Form.Label>
              <Form.Control
                type="phone"
                name="phone"
                placeholder="請留下您的手機"
              />
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="phone">
              <Form.Label className="text-green fw-bold">留言內容</Form.Label>
              <Form.Control
                as="textarea"
                type="text"
                name="description"
                placeholder="點此留言給服務人員"
                style={{ height: "100px" }}
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

          <Button className="btn-bottom" onClick={handleFormSubmit}>
            立即預約
          </Button>
        </Form>
      )}
    </DefaultLayout>
  );
}
