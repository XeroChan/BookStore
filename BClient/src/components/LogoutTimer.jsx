import React, { useState, useEffect } from "react";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Typography from "@mui/material/Typography";

const LogoutTimer = ({ initialTime = 180, onTimeout }) => {
  const [logoutTimer, setLogoutTimer] = useState(initialTime);

  useEffect(() => {
    let timer;

    // Start the timer
    const startTimer = () => {
      timer = setInterval(() => {
        setLogoutTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    };

    const resetTimer = () => {
      setLogoutTimer(initialTime); // Reset the timer
    };

    // Start the initial timer
    startTimer();

    // Set up event listeners for user activity
    const resetTimerOnActivity = () => {
      resetTimer();
    };

    document.addEventListener("mousemove", resetTimerOnActivity);
    document.addEventListener("keydown", resetTimerOnActivity);

    // Clean up event listeners and timer on component unmount
    return () => {
      clearInterval(timer);
      document.removeEventListener("mousemove", resetTimerOnActivity);
      document.removeEventListener("keydown", resetTimerOnActivity);
    };
  }, [initialTime]);

  useEffect(() => {
    // Check if the timer has reached 0
    if (logoutTimer === 0) {
      onTimeout();
    }
  }, [logoutTimer, onTimeout]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <AccessTimeIcon style={{ marginRight: "5px" }} />
      <Typography variant="subtitle1">
        Czas sesji: {formatTime(logoutTimer)}
      </Typography>
    </div>
  );
};

export default LogoutTimer;
