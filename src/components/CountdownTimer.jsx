import React, { useEffect, useState } from 'react';

const pad = (v) => String(v).padStart(2, '0');

const CountdownTimer = ({ targetDate }) => {
  const calculate = () => {
    const now = new Date();
    const target = new Date(targetDate);
    const diff = target - now;
    if (isNaN(target.getTime()) || diff <= 0) {
      return { expired: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
    const seconds = Math.floor(diff / 1000) % 60;
    const minutes = Math.floor(diff / (1000 * 60)) % 60;
    const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return { expired: false, days, hours, minutes, seconds };
  };

  const [time, setTime] = useState(calculate());

  useEffect(() => {
    const id = setInterval(() => {
      setTime(calculate());
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDate]);

  if (time.expired) {
    return (
      <div className="inline-flex items-center text-sm text-red-700 bg-red-50 border border-red-100 px-2 py-1 rounded">
        <span className="mr-2">⏱️</span>
        <span className="font-medium">Đã kết thúc</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 text-sm text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-1 rounded">
      <div className="flex items-center gap-1">
        <span className="text-xs font-medium">{pad(time.days)}</span>
        <span className="text-[10px] text-indigo-500">d</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-xs font-medium">{pad(time.hours)}</span>
        <span className="text-[10px] text-indigo-500">h</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-xs font-medium">{pad(time.minutes)}</span>
        <span className="text-[10px] text-indigo-500">m</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-xs font-medium">{pad(time.seconds)}</span>
        <span className="text-[10px] text-indigo-500">s</span>
      </div>
    </div>
  );
};

export default CountdownTimer;
