// File: src/components/DateTimeDisplay.js

import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import PropTypes from "prop-types";
import "../assets/css/RealTime.style.css";

const RealTimeComponent = ({
  dateFormat = "EEEE, dd/MM/yyyy",
  timeFormat = "hh:mm a '(GMT'xxx')'",
  updateInterval = 60000,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update the time at specified intervals
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, updateInterval);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [updateInterval]);

  return (
    <div className="realtime-container">
      <i className="fa-solid fa-calendar-day fa-2xl"></i>
      <div>
        <span className="realtime-day">{format(currentTime, dateFormat)}</span>
        <span className="realtime-time">{format(currentTime, timeFormat)}</span>
      </div>
    </div>
  );
};

RealTimeComponent.propTypes = {
  dateFormat: PropTypes.string,
  timeFormat: PropTypes.string,
  updateInterval: PropTypes.number,
};

const RealTime = React.memo(RealTimeComponent);
export default RealTime;
