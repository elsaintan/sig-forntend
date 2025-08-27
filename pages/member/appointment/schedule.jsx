import DefaultLayout from "@/components/layout/DefaultLayout";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { Button, Col, Dropdown, Row } from "react-bootstrap";
import { format, addDays, subDays } from "date-fns";
import { zhTW } from 'date-fns/locale';
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

import Icon from "@/components/Icon";
import AppointmentStatus from "@/components/assembly/AppointmentStatus";
import AppointmentForm from "@/components/appointment/AppointmentForm";

import styles from "@/styles/module/marquee.module.scss";
import { getScheduleByEmployeeId } from "@/api/employee";



export default function Schedule() {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(1);
  const router = useRouter();
  const [dates, setDates] = useState([]);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(7);
  const [timeSlotList, setTimeSlotList] = useState([]);
  const today = new Date();
  const [selectedReservationDate, setSelectedReservationDate] = useState(null);

  // 切換頁面
  useEffect(() => {
    if (!router.query.step) setSelectedTimeSlot(null);
  }, [router.query]);

  useEffect(() => {
    generateDates(selectedCalendarDate);
  }, [selectedCalendarDate]);

  // Fetch new data all time the component is loaded
  useEffect(() => {
    const selectedStock = getFromLocalStorage('selectedStock');
    const selectedEmployee = getFromLocalStorage('selectedEmployee');
    setSelectedStock(selectedStock);
    setSelectedEmployee(selectedEmployee);
  }, []);

  useEffect(() => {
    if (selectedEmployee && selectedStock) {
      const startDate = format(dates[0].rawDate, 'yyyy-MM-dd');
      const endDate = format(dates[dates.length - 1].rawDate, 'yyyy-MM-dd');
      changeTimeSlotList(selectedEmployee.id, startDate, endDate);
    }
  }, [selectedEmployee, dates, selectedStock]);

  // Utility function to retrieve a data from local storage
  const getFromLocalStorage = (key) => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  };

  // Formating Roy
  const formatDateWithChineseWeekday = (date) => {
    const weekday = format(date, 'E', { locale: zhTW });
    const chineseWeekday = weekday.replace('週', '');
    return `${format(date, 'M/d', { locale: zhTW })} (${chineseWeekday})`;
  };

  // Generate dates
  const generateDates = (startDate) => {
    const initialDates = Array.from({ length: 4 }, (_, i) => {
      const date = addDays(startDate, i);
      return {
        formattedDate: formatDateWithChineseWeekday(date),
        rawDate: date,
        apiDate: format(date, 'yyyy-MM-dd')
      };
    });
    setDates(initialDates);
  };

  // Select time
  const handleSelectTimeSlot = (date, time) => {
    const formattedDate = format(date, "yyyy/M/d (E)", { locale: zhTW });
    setSelectedTimeSlot(`${formattedDate} ${time}`);
    setSelectedReservationDate(`${format(date, "yyyy/M/d")} ${time}`);
    // router.push("/member/appointment?step=appointment-form");
  };

  // Scroll the date
  const handleScroll = (direction) => {
    if (direction === "left") {
      const newStartDate = subDays(dates[0].rawDate, 4);
      setSelectedCalendarDate(newStartDate);
      generateDates(newStartDate);
    } else {
      const newStartDate = addDays(dates[0].rawDate, 4);
      setSelectedCalendarDate(newStartDate);
      generateDates(newStartDate);
    }
  };

  // Get time slots
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
    <DefaultLayout title="請選擇日期時間" close goBack className="px-0" previousPath={`/member/appointment/${selectedEmployee.id}`} isLoading={isLoading}>
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
                  <div className="text-green fs-large fw-bold">{selectedCalendarDate.getFullYear()}</div>
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
                        style={{ color: "#8D8681" }}
                        variant="outline-success"
                        className={`px-2 fw-bold border-0 ${styles["btn-outline-success"]} text-nowrap`}
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
                  {/* <Button onClick={() => handleScroll("left")} className="p-0 bg-transparent border-0 text-light-green">
                  </Button> */}
                  <div className="d-flex mx-auto gap-2">
                    {dates.map((dateObj, index) => (
                        <div key={index} className="d-flex flex-column gap-2">
                            {timeSlotList[dateObj.apiDate]?.map((slot, slotIndex) => (
                                <AppointmentStatus
                                    key={slotIndex}
                                    date={dateObj.rawDate}
                                    time={slot.time}
                                    status={slot.status}
                                    onSelectTimeSlot={() => handleSelectTimeSlot(dateObj.rawDate, slot.time)}
                                />
                            ))}
                        </div>
                    ))}
                  </div>
                  {/* <Button onClick={() => handleScroll("right")} className="p-0 bg-transparent border-0 text-light-green">
                  </Button> */}
                </div>
              </Col>
            </Row>
          </>
        )
      }
    </DefaultLayout>
  )
}
