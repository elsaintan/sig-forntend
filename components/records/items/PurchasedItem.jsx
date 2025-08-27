import { Row, Col } from "react-bootstrap";

export default function PurchasedItem({ detail }) {
  return (
    <Row className="border rounded-3 p-2">
      <Col xs="6" className="d-flex">
        <div className="text-light-green" style={{ fontSize: "14px",width:'80px' }}>
          日期
        </div>
        <span style={{ fontSize: "14px" }}>{detail.create_time}</span>
      </Col>
      <Col xs="6" className="d-flex ">
        <div className="text-light-green" style={{ fontSize: "14px",width:'80px' }}>
          服務項目
        </div>
        <span style={{ fontSize: "14px" }}>{detail.stock_name}</span>
      </Col>
      <Col xs="6" className="d-flex py-2">
        <div className="text-light-green" style={{ fontSize: "14px",width:'80px' }}>
          消費金額
        </div>
        <span style={{ fontSize: "14px" }}>{detail.total_amount}</span>
      </Col>
      <Col xs="6" className="d-flex py-2">
        <span className="text-light-green" style={{ fontSize: "14px",width:'80px' }}>
          剩餘金額
        </span>
        <span style={{ fontSize: "14px" }}>{detail.remain_coin}</span>
      </Col>
      <Col className="d-flex ">
        <div className="text-light-green" style={{ fontSize: "14px",minWidth:'80px' }}>
          備註
        </div>
        <span style={{ fontSize: "14px" }}>{detail.description}</span>
      </Col>
    </Row>
  );
}
