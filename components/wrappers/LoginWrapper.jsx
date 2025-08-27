import { Button, Container, Row, Col } from "react-bootstrap";
import Image from "next/image";
import Link from "next/link";

export default function LoginWrapper({ children, title, helperText }) {
  return (
    <Container className="footer-background">
      <Row className="mb-10">
        <Col className="d-flex flex-column align-items-center gap-4 pt-10">
          <Image alt='logo' width={120} height={120} src="/image/logo.png"></Image>
          <div className="d-flex flex-column gap-2 text-center">
            <h1>{title}</h1>
            {helperText != "" && <span className="fs-small">{helperText}</span>}
          </div>
        </Col>
      </Row>

      {children}

      <Row className="mt-auto">
        <Col className="text-center">
          <span className="text-white footer-copyright" style={{ fontSize: "10px" }}>
            Copyright © SILENCE IS GOLD INCORPORATED All Rights Reserved.
          </span>
        </Col>
      </Row>
    </Container>
  );
}
