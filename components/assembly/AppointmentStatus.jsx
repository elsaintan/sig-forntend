import React from "react";
import { Button } from "react-bootstrap";

// AppointmentStatus: 顯示時間段是否可預約
const AppointmentStatus = ({ date,time, status, onSelectTimeSlot }) => {
  return (
    <div>
      {status==='open' ? (
        <Button
          className="bg-white border-0 rounded-3 p-2 shadow"
          style={{ color: "#74C289", width: "85px" }}
          disabled={false}
          onClick={()=>onSelectTimeSlot(date,time)}
        >
          {time}
        </Button>
      ) : (
        <Button
          className="p-2 text-gray bg-transparent border-0"
          style={{ width: "85px" }}
          disabled
        >
          {status==='busy' ? '已額滿' : <span className="text-blue">公休日</span>}
        </Button>
      )}
    </div>
  );
};

export default AppointmentStatus;
