import { Button, Row, Col, Form, Spinner } from "react-bootstrap";
import Link from "next/link";
// import { useAuth } from '../hooks/useAuth';
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { signIn,useSession } from "next-auth/react";
import LoginWrapper from "@/components/wrappers/LoginWrapper";
import Icon from "@/components/Icon";

import useModals from "@/hooks/useModals";
import ModalWrapper from "@/components/wrappers/ModalWrapper";
import PopUp from "@/components/utils/PopUp";
import { useTranslation } from "react-i18next";

export default function SalePointLogin() {
  const { t } = useTranslation();
  const { handleShowModal, handleCloseModal, isModalOpen } = useModals();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorTitle, setErrorTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { data: session, status } = useSession();

  useEffect(() => {
    if(status === "authenticated"){
        router.push('/member/recharge?status=confirmation')
    }
    console.log('sale_point_login status: ', status);
  }, [status]); 

  const handleCredentialsLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
      const result = await signIn("sale-point-login", {
        ...data,
        redirect: false,
      });
      
      console.log("sale_point_login result: ", result);
      
      if (result.error) {
        let title = "登入失敗";
        let msg = "未知錯誤";

        if (result.status === 401) {
          msg = "帳號或密碼錯誤";
        } else if (result.status === 503) {
          msg = "後台服務異常,請稍後再試";
        }

        setErrorTitle(title);
        setErrorMessage(msg);
        handleShowModal("popup");
      } else if (result.ok) {
        router.push('/member/recharge?status=confirmation');
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorTitle("登入失敗");
      setErrorMessage("發生未知錯誤，請稍後再試");
      handleShowModal("popup");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginWrapper title="經銷商登入系統" helperText="">
        <Form className="d-flex flex-column gap-2" onSubmit={handleCredentialsLogin} method="POST" id="credentials-sale-point-login-form">
            <Form.Control 
                type="text" 
                placeholder="輸入帳號" 
                name='account'
                disabled={isLoading}
                required
            />

            <Form.Control 
                type="password" 
                placeholder="密碼" 
                name='password'
                disabled={isLoading}
                required
            />

            <Row className="py-2">
                <Col className="d-flex justify-content-between">
                <Form.Group>
                    <Form.Check type="checkbox" label="記住我" />
                </Form.Group>

                <Link href={"/forget-password"}>忘記密碼</Link>
                </Col>
            </Row>

            <Button variant="primary" type="submit" className="btn-secondary" disabled={isLoading}>
                {!isLoading ? "登入" : <Spinner animation="border" size="sm" className="text-white" />}
            </Button>
        </Form>
         

        <ModalWrapper
        key="popup"
        show={isModalOpen("popup")}
        size="lg"
        onHide={() => handleCloseModal("popup")}
        >
            <PopUp
            imageSrc={"/icon/circle-error.svg"}
            title={errorTitle}
            describe={errorMessage}
            confirmOnClick={() => handleCloseModal("popup")}
            />
        </ModalWrapper>
    </LoginWrapper>
  );
}
