import React from "react";
import { Row, Col, Button } from "react-bootstrap";

import { useState, useEffect } from "react";

export default function AppointmentRecord({ detail }) {
  const [appointmentStatusStyle, setAppointmentStatusStyle] = useState("");


  useEffect(() => {
    switch (detail.reservation_type_name) {
      case "進行中":
        setAppointmentStatusStyle("badge-blue");
        break;
      case "已取消":
        setAppointmentStatusStyle("badge-red");
        break;
      case "已結束":
        setAppointmentStatusStyle("badge-green");
        break;
      default:
        setAppointmentStatusStyle("badge-green");
        break;
    }
  }, [detail, detail.reservation_type_name]);

  return (
    <Row className="border rounded-3 p-2 gap-1">
      <Col xs="12" className="d-flex justify-content-between">
        <div className="d-flex">
          <div
            className="text-light-green"
            style={{ fontSize: "14px", width: "80px" }}
          >
            服務人員
          </div>
          <span style={{ fontSize: "14px" }}>{detail.employee_name}</span>
        </div>
        <div className={`${appointmentStatusStyle} badge`}>
          {detail.reservation_type_name}
        </div>
      </Col>
      <Col xs="12" className="d-flex">
        <div
          className="text-light-green"
          style={{ fontSize: "14px", width: "80px" }}
        >
          服務項目
        </div>
        <span style={{ fontSize: "14px" }} className="fw-bold">
          {detail.stock_name}
        </span>
      </Col>
      <Col xs="12" className="d-flex">
        <div
          className="text-light-green"
          style={{ fontSize: "14px", width: "80px" }}
        >
          預約時間
        </div>
        <span style={{ fontSize: "14px" }}>{detail.full_reservation_date}</span>
      </Col>
      <Col xs="12" className="d-flex">
        <div
          className="text-light-green"
          style={{ fontSize: "14px", width: "80px" }}
        >
          手機號碼
        </div>
        <span style={{ fontSize: "14px" }}>{detail.mobile}</span>
      </Col>
      <Col xs="12" className="d-flex">
        <div
          className="text-light-green text-nowrap"
          style={{ fontSize: "14px", minWidth: "80px" }}
        >
          留言內容
        </div>
        <span style={{ fontSize: "14px" }}>{detail.description}</span>
      </Col>
      {detail.action !== null &&
        detail.action !== undefined &&
        detail.action !== "" && (
          <Col xs="12" className="d-flex">
            <div
              className="text-light-green"
              style={{ fontSize: "14px", width: "80px" }}
            >
              操作
            </div>
            <Button
              style={{ fontSize: "14px" }}
              className="bg-transparent text-red text-decoration-underline border-0 p-0"
            >
              {detail.action}
            </Button>
          </Col>
        )}
    </Row>
  );
}
