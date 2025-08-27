import { Row, Col } from "react-bootstrap";
import React from "react";
import { useEffect, useState } from "react";
import { getReservationList } from "@/api/member";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";

import AppointmentRecord from "./items/AppointmentRecord";
import Pagination from "../assembly/Pagination";

export default function AppointmentList() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [systemError, setSystemError] = useState(false);
  const { session, status } = useAuth();
  const [activePage, setActivePage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    if (systemError) {
      router.push("/systemError");
      return;
    }

    if (status === "authenticated" && session.user.memberId) {
      setIsLoading(true);
      getReservationList(session.user.memberId)
        .then((res) => {
          console.log(res);
          setReservations(res.data);
        })
        .catch((error) => {
          console.log("error: ", error);
          if (error?.response?.status === 500) {
            setSystemError(true);
          }
          setIsLoading(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [status, session, router, systemError]);

  return (
    <>
      <Row>
        <Col className="d-flex flex-column gap-2">
          {reservations.slice((activePage - 1) * pageSize, activePage * pageSize).map((reservation, i) => {
            return (
              <React.Fragment key={reservation.id}>
                <AppointmentRecord detail={reservation} />
              </React.Fragment>
            );
          })}

          {reservations.length === 0 && (
            <Col className="text-center">
              <span className='text-muted'>尚無預約紀錄</span>
            </Col>
          )}
        </Col>
      </Row>
      <Row className="py-5">
        <Col className="d-flex justify-content-center">
          <Pagination data={reservations} activePage={activePage} setActivePage={setActivePage}/>
        </Col>
      </Row>
    </>
  );
}
