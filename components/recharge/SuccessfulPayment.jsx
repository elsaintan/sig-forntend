import { Row, Col } from "react-bootstrap";

import Icon from "../Icon";

export default function SuccessfulPayment() {
  return (
    <Row className="pt-15">
      <Col className="d-flex flex-column gap-4 align-items-center">
        <Icon name="success"></Icon>
        <h2 className="text-success">儲值成功</h2>
        <p>
          感謝您的支持。如果您有任何問題或需要協助，請隨時與我們聯繫，我們將竭誠為您服務。
        </p>
      </Col>
    </Row>
  );
}
