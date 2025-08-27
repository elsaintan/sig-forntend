import { Form, Row, Col, FormGroup, Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import Link from "next/link";
import request from '@/api/request';


import DefaultLayout from "@/components/layout/DefaultLayout";
import Icon from "@/components/Icon";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const handleValidateEmail = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    const form = event.target.closest('form');
    if (form.checkValidity()) {
      try {
        setIsLoading(true);
        // send POST to backend 
        const response = await request({
          url: `/password/email`,
          method: 'POST',
          data: {
            email: email,
          },
        });
        console.log("yes");
        if (response.data.status === 'success') {
          setIsEmailSent(true);
        }
      } catch (error) {
        console.log("no");
        if (error.response.status === 400) {
          setError("此電子郵件尚未註冊");
        } else if (error.response.status === 422) {
          setError("電子郵件格式錯誤");
        } else {
          setError("伺服器錯誤");
        }
      }
    } else {
      form.reportValidity();
    }
    setIsLoading(false);
  };

  return (
    <DefaultLayout title="忘記密碼" goBack previousPath="/login?method=standard" isLoading={isLoading}>
      {isEmailSent ? (
        <>
          <Row className="text-center pt-15 px-2">
            <Col className="d-flex flex-column gap-4 align-items-center">
              <Icon name="success"></Icon>
              <h2 className="text-success">郵件已寄出</h2>
              <p>請前往電子郵件收取驗證信，並點擊驗證連結開始變更密碼</p>
            </Col>

            <Link
              href={"/login"}
              className="btn btn-bottom text-white btn-primary"
            >
              返回登入
            </Link>
          </Row>
        </>
      ) : (
        <>
          {" "}
          <Row className="pt-10">
            <Col className="px-4">
              請輸入您的使用者名稱或註冊的電子郵件。您將會在電子郵件信箱中收到重設密碼的連結。
            </Col>
          </Row>
          <Form className="px-2 pt-4">
            <Row>
              <FormGroup as={Col}>
                <Form.Label className="text-green">電子郵件</Form.Label>
                <Form.Control
                  value={email}
                  type="email"
                  placeholder="i2c@gmail.com"
                  required
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </FormGroup>
            </Row>
            <Button
              className="btn-bottom"
              onClick={(e) => handleValidateEmail(e)}
            >
              重設密碼
            </Button>
          </Form>
          {error &&
            <Row className="px-4 pt-0">
              <p className="text-danger">{error}
              </p>
            </Row>
          }
        </>
      )}
    </DefaultLayout>
  );
}
