import React from "react";
import { Row, Col } from "react-bootstrap";
import { useEffect, useState } from "react";
import { getDepositList } from "@/api/member";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";

import RechargeRecord from "./items/RechargeRecord";

import Pagination from "../assembly/Pagination";

export default function Recharge() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [depositsRecords, setDepositsRecords] = useState([]);
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
      getDepositList(session.user.memberId)
        .then((res) => {
          // console.log(res);
          setDepositsRecords(res.data.list ?? []);
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

  console.log(depositsRecords);
  return (
    <>
      <Row>
        <Col className="d-flex flex-column gap-2">
          {depositsRecords
            .slice((activePage - 1) * pageSize, activePage * pageSize)
            .map((deposit, i) => {
              return (
                <React.Fragment key={deposit.id}>
                  <RechargeRecord detail={deposit} />
                </React.Fragment>
              );
            })}

          {depositsRecords.length === 0 && (
            <Col className="text-center">
              <span className='text-muted'>尚無儲值紀錄</span>
            </Col>
          )}
        </Col>
      </Row>
      <Row className="py-5">
        <Col className="d-flex justify-content-center">
          <Pagination
            data={depositsRecords}
            activePage={activePage}
            setActivePage={setActivePage}
          />
        </Col>
      </Row>
    </>
  );
}
