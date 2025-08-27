import { Form, Row, Col, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import DefaultLayout from "@/components/layout/DefaultLayout";
import Icon from "@/components/Icon";

export default function Registration() {
  const router = useRouter();
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const handleFormSubmit = () => {
    setRegistrationSuccess(true);
    router.push("/in-app/registration?status=success");
  };

  useEffect(() => {
    if (Object.keys(router.query).length === 0) {
      setRegistrationSuccess(false);
    } else if (router.query.status === "success") {
      setRegistrationSuccess(true);
    }
  }, [router, router.query]);

  

  return (
    <DefaultLayout title="會員註冊" goBack>
      {registrationSuccess ? (
        <>
        <Row className="text-center pt-15 px-2">
          <Col className="d-flex flex-column gap-4 align-items-center">
            <Icon name="success"></Icon>
            <h2 className="text-success">註冊成功</h2>
            <p>請前往電子郵件收取驗證信，並點擊驗證連結開始登入使用服務</p>
          </Col>

          <Link href={'/login'} className="btn btn-bottom text-white btn-primary">
            返回登入
          </Link>
        </Row>
        </>
      ) : (
        <Form className="pt-10 px-2">
          <Row className="gap-4">
            <Form.Group as={Col} md="4" controlId="user">
              <Form.Label className="text-green">使用者名稱</Form.Label>
              <Form.Control type="text" name="firstName" />
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="email">
              <Form.Label className="text-green">電子郵件</Form.Label>
              <Form.Control type="text" name="email" />
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="password">
              <Form.Label className="text-green">密碼</Form.Label>
              <Form.Control type="password" name="password" />
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="date-of-birth">
              <Form.Label className="text-green">生日</Form.Label>
              <Form.Control type="date" name="date-of-birth" />
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="phone">
              <Form.Label className="text-green">電話</Form.Label>
              <Form.Control type="text" name="phone" />
            </Form.Group>
            <Form.Group as={Col} md="4" controlId="address">
              <Form.Label className="text-green">地址</Form.Label>
              <Form.Control type="text" name="address" />
            </Form.Group>
          </Row>

          <Row className="mt-4">
            <Col className="d-flex gap-3">
              <div>
                <Icon name="redBell" />
              </div>
              <p className="text-gray fs-small">
                註冊會員將視為同意輸入的資料將依照SIG使用者條款與隱私權政策進行使用
              </p>
            </Col>
          </Row>

          <Button className="btn-bottom" onClick={handleFormSubmit}>
            立即註冊
          </Button>
        </Form>
      )}
    </DefaultLayout>
  );
}
