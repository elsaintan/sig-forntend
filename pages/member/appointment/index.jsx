import { useState, useEffect, useRef } from "react";
import { Row, Col, Button, Dropdown, Form, Container, Image } from "react-bootstrap";
import Calendar from "react-calendar";
import { useRouter } from "next/router";
import "react-calendar/dist/Calendar.css";

import DefaultLayout from "@/components/layout/DefaultLayout";
import Icon from "@/components/Icon";


import { useAuth } from "@/hooks/useAuth";
import { getEmployee, getScheduleByEmployeeId } from "@/api/employee";
import { getStock } from "@/api/stock";
// import timeSlots from "@/data/timeSlots.json";



// NEED TO REPLACE DESCRIPTION AND AVATAR
function MemberCard({ employee, handleClickEmployee }) {
  if (!employee) return null;

  return (
    <Button
      onClick={() => handleClickEmployee(employee.id)}
      className="text-start bg-transparent border-0 p-0"
    >
      <Row className="flex-nowrap position-relative align-items-center rounded border border-light-gray p-2 gap-4">
        <Col xs={2} className="p-0">
          <div>
            <Image src={employee.avatar} alt="頭貼" width={60} height={60} className="rounded-circle object-fit-cover" />
          </div>
        </Col>
        <Col xs={8} className="p-0 ps-1">
          <p style={{ fontWeight: 600 }} className="fs-6 text-green ">{employee.name}</p>
          <p className="text-truncate">{employee.short_description}</p>
        </Col>
        <Col className="text-end p-0 position-absolute" style={{ right: '10px' }}>
          <Icon name="appointmentArrow" />
        </Col>
      </Row>
    </Button>
  )
}

function EmployeeList({ employeeList, handleClickEmployee }) {
  return (
    <div className="d-flex flex-column py-4 px-6 gap-4">
      <Row className="">
        請選擇您想預約的美容師
      </Row>
      {employeeList.map((employee) => (
        <MemberCard key={employee.id} employee={employee} handleClickEmployee={handleClickEmployee} />
      ))}
    </div>
  )
}

export default function Appointment() {

  const router = useRouter();
  const { session } = useAuth();
  const [employeeList, setEmployeeList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Save Employee data to local storage + push to next page
  const handleClickEmployee = (employeeId) => {
    const selectedEmployee = employeeList.find(emp => emp.id === employeeId);
    localStorage.setItem('selectedEmployee', JSON.stringify(selectedEmployee));
    router.push(`/member/appointment/${selectedEmployee.id}`);
  }

  useEffect(() => {
    if (!session?.user?.memberId) {
      router.push('/member');
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [employeeRes] = await Promise.all([getEmployee()]);
        // console.log('getEmployee res: ', employeeRes);
        setEmployeeList(employeeRes.data);
      } catch (error) {
        console.log('error: ', error);
        if (error?.response?.status === 500) {
          router.push('/systemError');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    console.log("Fetched")
  }, [session, router]);



  return (
    <DefaultLayout title="預約美髮服務" close className="px-0" isLoading={isLoading}>
      <EmployeeList employeeList={employeeList} handleClickEmployee={handleClickEmployee} />
    </DefaultLayout>
  );
}
