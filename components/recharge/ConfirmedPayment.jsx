import { Row, Col, Button } from "react-bootstrap";

import Icon from "../Icon";

import { useRouter } from "next/router";

export default function ConfirmedPayment() {
  const router = useRouter();

  return (
    <>
      <Row className="pt-15">
        <Col className="d-flex flex-column gap-4 align-items-center">
          <Icon name="success"></Icon>
          <h2 className="text-success">儲值已確認！</h2>
          <p>
            儲值已確認！感謝您的支持，希望您能享受到我們提供的服務。如果有任何問題，歡迎隨時與我們聯繫。祝您有個愉快的一天！
          </p>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col className="d-flex justify-content-center">
          <Button onClick={()=>{
            router.push('/member/recharge?status=confirmation');
          }} >返回</Button>
        </Col>
      </Row>
    </>
  );
}
