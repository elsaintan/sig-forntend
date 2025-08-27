import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Image from "next/image";
import { useRouter } from 'next/router';
import DefaultLayout from '@/components/layout/DefaultLayout';

export default function ErrorPage() {
  const router = useRouter();
  return (
    <DefaultLayout title="系統錯誤" checkAuth={false}>
      <Container className="mt-5">
        <Row className="mb-10">
          <Col className="d-flex flex-column align-items-center gap-4 pt-10">
            <Image alt='logo' width={120} height={120} src="/image/logo.png"></Image>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col md={8}>
            <p className='text-center'>
              很抱歉，系統目前發生異常。請稍後再試或聯繫系統管理員以獲得協助。
            </p>
            
            <div className="text-center mt-4">
              <p>如果問題持續存在，請聯繫系統管理員</p>
            </div>
          </Col>
        </Row>
        <Row className='mt-4'>
          <Col className='text-center'>
            <Button onClick={() => router.push('/')}>重新整理</Button>
          </Col>
        </Row>
      </Container>
    </DefaultLayout>
  );
}
