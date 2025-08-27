import { useState, useEffect } from "react";
import { Button, Row, Col, Form, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import { signIn,useSession } from "next-auth/react";

import useModals from "@/hooks/useModals";
import SpinnerButton from "@/components/utils/SpinnerButton";
import LoginWrapper from "@/components/wrappers/LoginWrapper";
import Icon from "@/components/Icon";
import ModalWrapper from "@/components/wrappers/ModalWrapper";
import PopUp from "@/components/utils/PopUp";


export default function Login() {
  const { t } = useTranslation();
  const { handleShowModal, handleCloseModal, isModalOpen } = useModals();
  const [loginMethod, setLoginMethod] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errorTitle, setErrorTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const { data: session, status } = useSession();
  const [company, setCompany] = useState("");

  useEffect(() => {
    if(status === "authenticated") {
      router.push("/member");
    }
  }, [status]); 

  // Extract company parameter from URL
  useEffect(() => {
    if (router.query.company) {
      setCompany(router.query.company);
      // Optional: Store in sessionStorage for persistence
      sessionStorage.setItem('currentCompany', router.query.company);
    } else {
      // set default if not in URL
      setCompany("company");
    }
  }, [router.query.company]);

  // 根據路由切換畫面
  useEffect(() => {
    if (Object.entries(router.query).length === 0 || (Object.keys(router.query).length === 1 && router.query.company)) {
      setLoginMethod("");
    } else if (router.query.method === "standard") {
      setLoginMethod("standard");
    }
  }, [router.query]);

  const handleLoginClick = () => {
    // 當按鈕被點擊時，將路由更改為 /login?method=standard
    const query = { method: "standard" };
    if (company) {
      query.company = company;
    }
    
    router.push({
      pathname: "/login",
      query: query
    });
    setLoginMethod("standard");
  };

  const handleCredentialsLogin = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    console.log("credentials login for company:", company);
    
    // Include company in the signIn call so NextAuth can access it
    const result = await signIn("credentials-login", {
      account: data.account,
      password: data.password,
      company: company, // This will be available in credentials object
      redirect: false,
    });
    
    console.log("login result: ", result);
    if(result.error) {
      let title = "";
      let msg = "";

      if(result.status === 401) {
        title = "登入失敗";
        msg = "帳號或密碼錯誤";
      }else if(result.status === 503){
        title = "登入失敗";
        msg = "後台服務異常,請稍後再試";
      }

      setIsLoading(false);
      setErrorTitle(title);
      setErrorMessage(msg);
      handleShowModal("popup");
      return;
    }

    if(result.ok) {
      // Redirect will be handled by useEffect above based on session
      setIsLoading(false);
    }
  };

  const handleLineLogin = async () => {
    // console.log("line login");

    
    setIsLoading(true);
    
    // Use the current URL with company parameter for callback
    const currentUrl = window.location.href;
    const callbackUrl = company 
      ? `/api/auth/callback/line-login?company=${company}`
      : '/api/auth/callback/line-login';
    
    try {
      const result = await signIn("line-login", {
        redirect: false,
        // callbackUrl: callbackUrl,
      });
    } catch (error) {
      console.error("LINE login error:", error);
      setIsLoading(false);
      setErrorTitle("Login Failed");
      setErrorMessage("An error occurred during LINE login, please try again later.");
      handleShowModal("popup");
    }
  };

  // Generate register link with company parameter
  const getRegisterLink = () => {
    return company ? `/register?company=${company}` : "/register";
  };

  // Generate forgot password link with company parameter  
  const getForgotPasswordLink = () => {
    return company ? `/in-app/forget-password?company=${company}` : "/in-app/forget-password";
  };

  // Get back link with company parameter
  const getBackLink = () => {
    return company ? `/login?company=${company}` : '/login';
  };

  return (
    <LoginWrapper title="歡迎回來" helperText="登入您的帳戶已使用我們的服務">
      {loginMethod === "" && (
        <Row className="mt-4 flex-column gap-4">
          <Col className="d-flex flex-column gap-2">
            {/* <Button
              style={{
                backgroundColor: "#22BA4F",
                border: "1px solid #22BA4F",
              }}
              className="py-0"
              onClick={handleLineLogin}
            >
              <Icon name="line"></Icon>快速登入
            </Button> */}

            <SpinnerButton type="button" className="py-0" isLoading={isLoading} onClick={handleLineLogin} style={{
                backgroundColor: "#22BA4F",
                border: "1px solid #22BA4F",
                height: "45px"
              }} loadingText=" "
            >
              <Icon name="line"></Icon>快速登入
            </SpinnerButton>

            <Button
              className="btn-secondary btn py-2"
              onClick={handleLoginClick}
            >
              一般登入
            </Button>
          </Col>
          <Col className="d-flex justify-content-center">
            <div className="d-flex gap-2">
              <span className="fs-small">沒有帳戶嗎？</span>
              <Link className="fs-small" href={getRegisterLink()}>
                立即註冊
              </Link>
            </div>
          </Col>
        </Row>
      )}

      {loginMethod === "standard" && (
        <>
          <Form 
            className="d-flex flex-column gap-2" 
            onSubmit={handleCredentialsLogin} 
            method="POST" 
            id="credentials-login-form"
          >
            <Form.Control 
              type="tel" 
              placeholder="輸入手機號碼" 
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

            {/* Hidden field for company */}
            {company && (
              <input type="hidden" name="company" value={company} />
            )}

            <Row className="py-2">
              <Col className="d-flex justify-content-between">
                <Form.Group>
                  <Form.Check type="checkbox" label="記住我" />
                </Form.Group>

                <Link href={getForgotPasswordLink()}>忘記密碼</Link>
              </Col>
            </Row>

            {/* <Button variant="primary" type="submit" className="btn-secondary" disabled={isLoading}>
              {!isLoading ? "登入" : <Spinner animation="border" size="sm" className="text-white" />}
            </Button> */}

            <SpinnerButton type="submit" className="btn-secondary" isLoading={isLoading}>登入</SpinnerButton>

          </Form>
          <Row>
            <Col className="d-flex justify-content-center gap-1 pt-4">
              <span className="fs-small">沒有帳戶嗎？</span>
              <Link className="fs-small" href={getRegisterLink()}>立即註冊</Link>
            </Col>
          </Row>
          <Row className="mt-4 text-center">
            <Col>
              <Link href={getBackLink()} className="fs-small">
                {t('return_previous_step')}
              </Link>
            </Col>
          </Row>
        </>
      )}

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
