import { Row, Col } from "react-bootstrap";
import React from "react";
import { useEffect, useState } from "react";
import { getSaleList } from "@/api/member";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";

import PurchasedItem from "./items/PurchasedItem";
import Pagination from "../assembly/Pagination";

export default function Expense() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [salesRecords, setRalesRecords] = useState([]);
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
      getSaleList(session.user.memberId)
        .then((res) => {
          setRalesRecords(res.data.list ?? []);
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
  console.log(salesRecords);
  return (
    <>
      <Row>
        <Col className="d-flex flex-column gap-2">
          {salesRecords
            .slice((activePage - 1) * pageSize, activePage * pageSize)
            .map((detail, i) => {
              return (
                <React.Fragment key={detail.id}>
                  <PurchasedItem detail={detail} />
                </React.Fragment>
              );
            })}

          {salesRecords.length === 0 && (
            <Col className="text-center">
              <span className='text-muted'>尚無消費紀錄</span>
            </Col>
          )}
        </Col>
      </Row>
      <Row className="py-5">
        <Col className="d-flex justify-content-center">
          <Pagination
            data={salesRecords}
            activePage={activePage}
            setActivePage={setActivePage}
          />
        </Col>
      </Row>
    </>
  );
}
