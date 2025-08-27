import React from "react";
import { Row, Col } from "react-bootstrap";

export default function RechargeRecord({ detail }) {
  return (
    <Row className="border rounded-3 p-2">
      <Col xs="6" className="d-flex">
        <div
          className="text-light-green"
          style={{ fontSize: "14px", width: "80px" }}
        >
          日期
        </div>
        <span style={{ fontSize: "14px" }}>{detail.create_time}</span>
      </Col>
      <Col xs="6" className="d-flex ">
        <div
          className="text-light-green"
          style={{ fontSize: "14px", width: "80px" }}
        >
          儲值方式
        </div>
        <span style={{ fontSize: "14px" }} className="fw-bold">
          {detail.payment_name}
        </span>
      </Col>
      <Col xs="6" className="d-flex py-2">
        <div
          className="text-light-green"
          style={{ fontSize: "14px", width: "80px" }}
        >
          儲值金額
        </div>
        <span style={{ fontSize: "14px" }} className="fs-large fw-bold">
          ${detail.total_amount}
        </span>
      </Col>
    </Row>
  );
}
