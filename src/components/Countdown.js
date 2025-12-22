import React, { useState, useEffect } from 'react';

const Countdown = ({ timeString, displayMode = 'inline' }) => {
  const parseTimeString = (str) => {
    const [hours, minutes, seconds] = str.split(':').map(Number);
    return (hours * 3600) + (minutes * 60) + seconds;
  };

  const [totalSeconds, setTotalSeconds] = useState(parseTimeString(timeString));

  useEffect(() => {
    if (totalSeconds <= 0) return;

    const interval = setInterval(() => {
      setTotalSeconds(prevSeconds => {
        if (prevSeconds <= 0) return 0;
        return prevSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [totalSeconds]);

  const formatTime = (seconds) => {
    if (seconds <= 0) return { hours: "00", minutes: "00", seconds: "00" };
    
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    const pad = (num) => num.toString().padStart(2, '0');

    return {
      hours: pad(h),
      minutes: pad(m),
      seconds: pad(s)
    };
  };

  const time = formatTime(totalSeconds);

  if (displayMode === 'display') {
    return (
      <div className="countdown-display">
        <span className="countdown-unit">{time.hours}</span>
        <span className="countdown-separator">:</span>
        <span className="countdown-unit">{time.minutes}</span>
        <span className="countdown-separator">:</span>
        <span className="countdown-unit">{time.seconds}</span>
      </div>
    );
  }

  // For card context, return inline format
  return (
    <span className="time-remaining">
      {time.hours} : {time.minutes} : {time.seconds}
    </span>
  );
};

export default Countdown;
