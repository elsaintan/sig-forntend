import { Row, Col, Spinner } from "react-bootstrap";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useState } from "react";
export default function RegistrationCompleted() {
  const { t } = useTranslation();
  const [isLoading,setIsLoading] = useState(false);
  return (
    <>
      <Row className="mt-4 text-center">
        <Col>
          <Link className="btn btn-secondary w-100" href={"/login?method=standard"} disabled={isLoading}>
            {!isLoading ? t('login_right_now') : <Spinner animation="border" size="sm" className="text-white" />}
          </Link>
        </Col>
      </Row>
    </>
  );
}
