import { useState, useEffect, useRef } from "react";
import { Row, Col, Button, Dropdown, Form, Container, Image } from "react-bootstrap";
import Calendar from "react-calendar";
import { useRouter } from "next/router";
import { format, addDays, subDays } from "date-fns";
import { zhTW } from 'date-fns/locale';
import "react-calendar/dist/Calendar.css";

import DefaultLayout from "@/components/layout/DefaultLayout";
import Icon from "@/components/Icon";
import AppointmentStatus from "@/components/assembly/AppointmentStatus";
import AppointmentForm from "@/components/appointment/AppointmentForm";

import { useAuth } from "@/hooks/useAuth";
import { getEmployee, getScheduleByEmployeeId } from "@/api/employee";
import { getStock } from "@/api/stock";
import styles from "@/styles/module/marquee.module.scss";
// import timeSlots from "@/data/timeSlots.json";


const employeeRow = {
  avatar: '/image/memberThumbnail.png',
  name: '上遠野裕樹',
  description: '【20代～30代パーマ指名率NO.1!!】',
  id: 1
}

function MemberCard({ employeeRow }) {
  return (
    <Row className="flex-nowrap position-relative align-items-center rounded border border-light-gray p-2 gap-4">
      <Col xs={2} className="p-0">
        <div>
          <Image src={employeeRow.avatar} alt="頭貼" width={60} height={60} className="rounded-circle object-fit-cover" />
        </div>
      </Col>
      <Col xs={8} className="p-0 ps-1">
        <p className="fs-6">{employeeRow.name}</p>
        <p className="text-truncate">{employeeRow.description}</p>
      </Col>
      <Col className="text-end p-0 position-absolute" style={{ right: '10px' }}>
        <Button className="bg-transparent border-0 p-0" onClick={() => router.push(`/appointment/${employeeRow.id}`)}>
          <Icon name="appointmentArrow" />
        </Button>
      </Col>
    </Row>
  )
}

function EmployeeList() {
  return (
    <div className="d-flex flex-column p-6 gap-4">
      <Row className="">
        請選擇您想預約的美容師
      </Row>
      <MemberCard employeeRow={employeeRow} />
      <MemberCard employeeRow={employeeRow} />
      <MemberCard employeeRow={employeeRow} />
    </div>
  )
}

export default function Appointment() {
  const [dates, setDates] = useState([]);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(7);
  const containerRef = useRef(null);
  const router = useRouter();
  const { session, status } = useAuth();

  const [employeeList, setEmployeeList] = useState([]);
  const [stockList, setStockList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [timeSlotList, setTimeSlotList] = useState([]);
  const today = new Date();
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);
  const [selectedReservationDate, setSelectedReservationDate] = useState(null);

  const formatDateWithChineseWeekday = (date) => {
    const weekday = format(date, 'E', { locale: zhTW });
    const chineseWeekday = weekday.replace('週', '');
    return `${format(date, 'M/d', { locale: zhTW })} (${chineseWeekday})`;
  };

  useEffect(() => {
    if (!session?.user?.memberId) {
      router.push('/member');
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [employeeRes, stockRes] = await Promise.all([
          getEmployee(),
          getStock()
        ]);
        // console.log('getEmployee res: ', employeeRes);
        // console.log('getStock res: ', stockRes);
        setEmployeeList(employeeRes.data);
        setStockList(stockRes.data);
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
    generateDates(selectedCalendarDate);
  }, [session, router, selectedCalendarDate]);

  // 生成日期
  const generateDates = (startDate) => {
    const initialDates = Array.from({ length: 4 }, (_, i) => {
      const date = addDays(startDate, i);
      return {
        formattedDate: formatDateWithChineseWeekday(date),
        rawDate: date,
      };
    });
    setDates(initialDates);
  };


  // 切換頁面
  useEffect(() => {
    if (!router.query.step) setSelectedTimeSlot(null);
  }, [router.query]);

  // 選擇員工
  const handleSelectEmployee = async (employeeId) => {
    const employee = employeeList.find(emp => emp.id === employeeId); 
    setSelectedEmployee(employee);
  };

  // 選擇服務項目
  const handleSelectStock = async (stockId) => {
    const stock = stockList.list.find(stock => stock.id === stockId);
    setSelectedStock(stock);
  };

  // 選定時間
  const handleSelectTimeSlot = (date, time) => {
    const formattedDate = format(date, "yyyy/M/d (E)", { locale: zhTW });
    setSelectedTimeSlot(`${formattedDate} ${time}`);
    setSelectedReservationDate(`${format(date, "yyyy/M/d")} ${time}`);
    router.push("/member/appointment?step=appointment-form");
  };


  // 按下箭頭調整日期
  const handleScroll = (direction) => {
    setDates((prevDates) => {
      const newDate =
        direction === "left"
          ? subDays(prevDates[0].rawDate, 1)
          : addDays(prevDates[prevDates.length - 1].rawDate, 1);
      return direction === "left"
        ? [{ formattedDate: formatDateWithChineseWeekday(newDate), rawDate: newDate }, ...prevDates.slice(0, -1)]
        : [...prevDates.slice(1), { formattedDate: formatDateWithChineseWeekday(newDate), rawDate: newDate }];
    });
    setCurrentIndex((prevIndex) =>
      direction === "left" ? Math.max(prevIndex - 1, 0) : Math.min(prevIndex + 1, dates.length - 4)
    );
  };

  useEffect(() => {
    if (selectedEmployee && selectedStock) {
      changeTimeSlotList(selectedEmployee.id, dates[0].rawDate, dates[dates.length - 1].rawDate);
    }
  }, [selectedEmployee, dates, selectedStock]);

  // 取得時間段
  const changeTimeSlotList = async (employeeId, startDate, endDate) => {
    try {
      setIsLoading(true);
      const schedule = await getScheduleByEmployeeId(employeeId, startDate, endDate);
      const scheduleArr = schedule.data[employeeId].schedule_date;
      setTimeSlotList(scheduleArr);

    } catch (error) {
      console.log('error: ', error);
      if (error?.response?.status === 500) {
        router.push('/systemError');
      }
    } finally {
      setIsLoading(false);
    }
  }


  return selectedTimeSlot ? (
    <AppointmentForm selectedDateTime={selectedTimeSlot} selectedReservationDate={selectedReservationDate} selectedEmployee={selectedEmployee} selectedStock={selectedStock} />
  ) : (
    <DefaultLayout title="預約美髮服務" close className="px-0" isLoading={isLoading}>
      <Row className="px-4 pt-2">
        <Col className="d-flex align-items-center justify-content-center" xs={6}>
          <Dropdown >
            <Dropdown.Toggle variant="transparent" id="dropdown-employee" className="p-0 border-0 text-center" align="center">
              <p className="text-green d-inline-block text-center" style={{ letterSpacing: "2.5px" }}>
                {selectedEmployee ? selectedEmployee.name : "請選擇服務人員"}
              </p>
            </Dropdown.Toggle>
            <Dropdown.Menu className="p-2">
              {employeeList.map((employee, index) => (
                <Dropdown.Item
                  key={index}
                  eventKey={employee.id}
                  onClick={() => handleSelectEmployee(employee.id)}
                >
                  {employee.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>

        <Col className="d-flex align-items-center justify-content-center" xs={6}>
          <Dropdown >
            <Dropdown.Toggle variant="transparent" id="dropdown-employee" className="p-0 border-0 text-center" align="center">
              <p className="text-green d-inline-block text-center" style={{ letterSpacing: "2.5px" }}>
                {selectedStock ? selectedStock.name : "請選擇服務項目"}
              </p>
            </Dropdown.Toggle>
            <Dropdown.Menu className="p-2">
              {stockList.list && stockList.list.map((stock, index) => (
                <Dropdown.Item
                  key={index}
                  eventKey={stock.id}
                  onClick={() => handleSelectStock(stock.id)}
                >
                  {stock.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
      <EmployeeList />

      {
        selectedEmployee && selectedStock && (
          <>
            <Row className="px-4">
              <Col className="text-green py-2 text-center border-bottom" style={{ letterSpacing: "3.2px" }}>
                請選擇日期時間
              </Col>
            </Row>

            <Row className="py-2">
              <Col className="d-flex flex-column align-items-center">
                <div className="d-flex align-items-center gap-2">
                  <div className="text-green fs-large fw-bold">{today.getFullYear()}</div>
                  <Dropdown>
                    <Dropdown.Toggle variant="transparent" id="dropdown-calendar" className="p-0 border-0">
                      <Icon name="calendar" />
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="p-2">
                      <Calendar onChange={setSelectedCalendarDate} value={selectedCalendarDate} minDate={new Date()} />
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </Col>
            </Row>

            <Row className="px-2">
              <Col className="d-flex align-items-center">
                <Button onClick={() => handleScroll("left")} className="p-0 bg-transparent border-0 text-light-green">
                  {"<"}
                </Button>
                <div ref={containerRef} className="mx-auto overflow-hidden">
                  <div className="d-flex">
                    {dates.map((date, index) => (
                      <Button
                        key={index}
                        variant="outline-success"
                        className={`px-2 fw-bold border-0 ${styles["btn-outline-success"]} text-nowrap`}
                        style={{ color: "#8D8681" }}
                      >
                        {date.formattedDate}
                      </Button>
                    ))}
                  </div>
                </div>
                <Button onClick={() => handleScroll("right")} className="p-0 bg-transparent border-0 text-light-green">
                  {">"}
                </Button>
              </Col>
            </Row>

            <Row className="px-2">
              <Col className="d-flex py-2" style={{ backgroundColor: "#EEE" }}>
                <div className="d-flex w-100 overflow-auto" style={{ maxHeight: "calc(100vh - 250px)" }}>
                  <Button onClick={() => handleScroll("left")} className="p-0 bg-transparent border-0 text-light-green">
                  </Button>
                  <div className="d-flex mx-auto gap-2">
                    {Object.entries(timeSlotList).map(([date, slots], dateIndex) => (
                      <div key={dateIndex} className="d-flex flex-column gap-2">
                        {/* <h6>{date}</h6> */}
                        {slots.map((slot, slotIndex) => (
                          <AppointmentStatus
                            key={slotIndex}
                            date={date}
                            time={slot.time}
                            status={slot.status}
                            onSelectTimeSlot={() => handleSelectTimeSlot(date, slot.time)}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                  <Button onClick={() => handleScroll("right")} className="p-0 bg-transparent border-0 text-light-green">
                  </Button>
                </div>
              </Col>
            </Row>
          </>
        )
      }
    </DefaultLayout>
  );
}
