import React, { useEffect } from 'react';
import { Button, Row, Col, Container, Spinner } from "react-bootstrap";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import ModalWrapper from "@/components/wrappers/ModalWrapper";
import useModals from "@/hooks/useModals";
import PopUp from "@/components/utils/PopUp";
import Icon from "../Icon";
import { useTranslation } from "react-i18next";
// import { useAuth } from "@/hooks/useAuth";

export default function DefaultLayout({
  children,
  title,
  close,
  goBack,
  logout,
  className,
  previousPath,
  isLoading,
  checkAuth = true
}) {
  const { t } = useTranslation();
  // const { session, status } = useAuth();
  const router = useRouter();
  const { handleShowModal, handleCloseModal, isModalOpen } = useModals();

  const onPreviousPage = (path) => {
    router.push(path);
  };

  const handleLogout = () => {
    signOut();
  };

  // useEffect(() => {
  //   if (checkAuth && status !== "loading") {
  //     if (status === "unauthenticated" && router.pathname !== "/login") {
  //       router.push("/login");
  //     }
  //   }
  // }, [status, checkAuth, router]);

  return (
    <>
      <header className={`border-bottom`} style={{ paddingTop: '13px', paddingBottom: '13px' }}>
        <Container>
          <Row className="align-items-center">
            <Col xs="3">
              {goBack && (
                <Button
                  className="bg-transparent border-0 d-flex align-items-center text-nowrap"
                  // onClick={() => router.push('/member')}
                  onClick={() => onPreviousPage(previousPath)}
                >
                  <Icon name="arrowLeft" />
                  {t('back')} {/* 左邊返回按鈕 */}
                </Button>
              )}
            </Col>
            <Col xs="6" className="text-center d-flex align-items-center justify-content-center">
              <h5 className="m-0 text-white text-nowrap">{title}</h5>
              {/* 中間標題 */}
              {/* {isLoading ? <Spinner animation="border"  size="sm" role="status" className="text-white ms-2"></Spinner> : null} */}
            </Col>
            <Col xs="3" className="d-flex align-items-end justify-content-end">
              {close && (
                // <Button variant="link" onClick={()=>onPreviousPage(previousPath)}>
                <Button variant="link" onClick={()=>router.push('/member')}>
                  <Icon name="close" /> {/* 右邊叉叉按鈕 */}
                </Button>
              )}

              {logout && (
                <Button className="bg-transparent border-0 d-flex align-items-center text-nowrap gap-1" onClick={()=>handleShowModal('logout')}>
                  <Icon name="logout" />
                  <span className="logout-text">{t('logout')}</span>
                </Button>
              )}
            </Col>
          </Row>
        </Container>
      </header>

      <Container fluid className={`main-content-wrapper ${className} position-relative`}>
        {/* 主要內容 */}
        {children}
      </Container>

      {isLoading && (
        <div className="position-fixed top-0 start-0 w-100 h-100 bg-secondary opacity-50 d-flex justify-content-center align-items-center" style={{zIndex: 9999}}>
          <Spinner animation="border" variant="light" />
        </div>
      )}

      <ModalWrapper
        key="logout"
        show={isModalOpen("logout")}
        size="lg"
        onHide={() => handleCloseModal("logout")}
      >
        <PopUp
          imageSrc={"/icon/warning.svg"}
          title={t('logout_confirm')}
          // describe="登出後，無法復原"
          describeClass='fs-5 text-red'
          denyOnClick={() => handleCloseModal("logout")}
          confirmOnClick={() => {
            handleLogout();
            handleCloseModal("logout");
          }}
        />
      </ModalWrapper>
    </>
  );
}
