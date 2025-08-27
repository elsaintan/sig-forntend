import DefaultLayout from "@/components/layout/DefaultLayout";
import SpinnerButton from "@/components/utils/SpinnerButton";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Image, Row } from "react-bootstrap";

import { getStock } from "@/api/stock";


function ServiceItem({ stock, handleStockClick }) {
  return (
    <Row className="mx-0">
      <Col className="py-2 px-4">
        <Row className="mx-0">
          <Col xs={3} className="ps-0">
            <p style={{ fontSize: '14px' }} className=" text-light-green ">服務項目</p>
          </Col>
          <Col xs={9} className="ps-0">
            <p style={{ fontSize: '14px' }} className="">{stock.name}</p>
          </Col>
        </Row>
        <Row className="mx-0 mt-1">
          <Col xs={3} className="ps-0">
            <p style={{ fontSize: '14px' }} className=" text-light-green ">金額</p>
          </Col>
          <Col xs={3} className="ps-0">
            <p style={{ fontSize: '14px', fontWeight: 700 }} className="">${stock.retail_price}</p>
          </Col>
          <Col xs={3} className="ps-0">
            <p style={{ fontSize: '14px' }} className=" text-light-green ">美容時間</p>
          </Col>
          <Col xs={3} className="ps-0">
            <p style={{ fontSize: '14px' }} className="">{stock.duration}分鐘</p>
          </Col>
        </Row>
        {
          stock.description && (
            <Row className="mx-0 mt-1">
              <Col xs={3} className="ps-0">
                <p style={{ fontSize: '14px' }} className=" text-light-green ">備註</p>
              </Col>
              <Col xs={9} className="ps-0">
                <p style={{ fontSize: '14px' }} className="">{stock.description}</p>
              </Col>
            </Row>
          )
        }
        <Row className="mx-0 mt-2 d-flex justify-content-end">
          <Col xs="auto" className="ps-0">
            <Button style={{ borderRadius: '10px', }} className="py-2 px-4 border-0" onClick={() => handleStockClick(stock.id)}>
              選擇預約時間
            </Button>
          </Col>
        </Row>
      </Col>
    </Row >
  )
}


export default function Sid() {
  const [isLoading, setIsLoading] = useState(false);
  const [stockList, setStockList] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState([]);
  const { session } = useAuth();
  const router = useRouter();

  const handleStockClick = (stockId) => {
    // Save Employee data to local storage + push to next page
    const selectedStock = stockList.find(stockList => stockList.id === stockId);
    localStorage.setItem('selectedStock', JSON.stringify(selectedStock));
    router.push(`/member/appointment/schedule`);
  }

  // Function to retrieve a variable from local storage
  const getFromLocalStorage = (key) => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  };

  useEffect(() => {
    const selectedEmployee = getFromLocalStorage('selectedEmployee');
    setSelectedEmployee(selectedEmployee);
  }, []);

  useEffect(() => {
    if (!session?.user?.memberId) {
      router.push('/member');
      return;
    }
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch stock list
        const [stockRes] = await Promise.all([getStock()]);
        setStockList(stockRes.data.list);
      } catch (error) {
        // Enhanced error logging
        if (error?.response?.status === 500) {
          router.push('/systemError');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session, router]);

  return (
    <DefaultLayout title="請選擇服務項目" close goBack className="px-0" previousPath={'/member/appointment/'} isLoading={isLoading}>
      <Row className="mx-0 p-4">
        <Col className="p-0">
          <Row className="align-items-center gap-4 mx-0">
            <Col xs={2} className="">
              <div>
                <Image src={selectedEmployee.avatar} alt="頭貼" width={60} height={60} className="rounded-circle object-fit-cover" />
              </div>
            </Col>
            <Col xs={8} className="">
              <p style={{ fontWeight: 600 }} className="fs-6 text-green ">{selectedEmployee.name}</p>
              <p
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
                className="">{selectedEmployee.short_description}</p>
            </Col>
          </Row>
          <Row className="py-4 px-0 mx-0">
            <Col>
              <hr style={{ borderTop: '1px dashed' }} className="border-gray" />
            </Col>
          </Row>
          <Row className="px-0 mx-0 fs-xs">
            <p>{selectedEmployee.description}</p>
          </Row>
        </Col>
      </Row>
      <Row className="mx-0">
        <hr className="border-gray border-top border-1" />
      </Row>
      <Row className="mx-0 px-4 py-2">
        <Col>
          <p style={{ fontWeight: 600 }} className="fs-7 text-green ">請選擇服務項目</p>
        </Col>
      </Row>
      <Row className="mx-0">
        <hr className="border-gray border-top border-1" />
      </Row>

      {stockList.map((stock, index) => {
        return (
          <React.Fragment key={index}>
            <ServiceItem stock={stock} handleStockClick={handleStockClick} />
            <Row className="mx-0 py-2">
              <hr style={{ borderTop: '1px dashed' }} className="border-gray" />
            </Row >
          </React.Fragment>
        )
      })}

    </DefaultLayout >
  );
}
