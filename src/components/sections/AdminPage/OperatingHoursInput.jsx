import React, { useState, useEffect, useCallback } from 'react';
import './OperatingHoursInput.css';

const OperatingHoursInput = ({ value, onChange }) => {
  const days = ['월', '화', '수', '목', '금', '토', '일', '공휴일'];
  const weekdays = ['월', '화', '수', '목', '금'];

  const getInitialState = () => {
    const initialState = {};
    days.forEach(day => {
      initialState[day] = { start: '', end: '', closed: false };
    });
    return initialState;
  };

  const [hours, setHours] = useState(getInitialState);

  const constructString = useCallback((currentHours) => {
    const parts = [];
    const weekdayHours = JSON.stringify({
      start: currentHours['월'].start,
      end: currentHours['월'].end,
      closed: currentHours['월'].closed,
    });

    const allWeekdaysSame = weekdays
      .slice(1)
      .every(
        day =>
          JSON.stringify({
            start: currentHours[day].start,
            end: currentHours[day].end,
            closed: currentHours[day].closed,
          }) === weekdayHours
      );

    if (allWeekdaysSame && !currentHours['월'].closed) {
      parts.push(`평일: ${currentHours['월'].start}~${currentHours['월'].end}`);
    } else {
      weekdays.forEach(day => {
        if (!currentHours[day].closed) {
          parts.push(`${day}: ${currentHours[day].start}~${currentHours[day].end}`);
        }
      });
    }

    ['토', '일', '공휴일'].forEach(day => {
      if (!currentHours[day].closed) {
        parts.push(`${day}: ${currentHours[day].start}~${currentHours[day].end}`);
      }
    });

    return parts.join(' | ');
  }, []);

  useEffect(() => {
    const newHours = getInitialState();
    if (value && value.trim() !== '') {
      const parts = value.split(' | ');
      parts.forEach(part => {
        const [dayInfo, timeInfo] = part.split(': ');
        if (!timeInfo) return;

        const [start, end] = timeInfo.split('~');
        if (!start || !end) return;

        if (dayInfo === '평일') {
          weekdays.forEach(day => {
            newHours[day] = { start, end, closed: false };
          });
        } else if (days.includes(dayInfo)) {
          newHours[dayInfo] = { start, end, closed: false };
        }
      });
    }
    setHours(newHours);
  }, [value]);

  const handleTimeChange = (day, part, time) => {
    const newHours = {
      ...hours,
      [day]: { ...hours[day], [part]: time },
    };
    setHours(newHours);
    onChange(constructString(newHours));
  };

  const handleClosedChange = (day, isClosed) => {
    const newHours = {
      ...hours,
      [day]: { ...hours[day], closed: isClosed },
    };
    if (isClosed) {
        newHours[day].start = '';
        newHours[day].end = '';
    }
    setHours(newHours);
    onChange(constructString(newHours));
  };

  return (
    <div className="operating-hours-input">
      {days.map(day => (
        <div key={day} className="day-row">
          <span className="day-label">{day}</span>
          <input
            type="time"
            value={hours[day]?.start || ''}
            onChange={(e) => handleTimeChange(day, 'start', e.target.value)}
            disabled={hours[day]?.closed}
          />
          <span>~</span>
          <input
            type="time"
            value={hours[day]?.end || ''}
            onChange={(e) => handleTimeChange(day, 'end', e.target.value)}
            disabled={hours[day]?.closed}
          />
          <label>
            <input
              type="checkbox"
              checked={hours[day]?.closed || false}
              onChange={(e) => handleClosedChange(day, e.target.checked)}
            />
            휴진
          </label>
        </div>
      ))}
    </div>
  );
};

export default OperatingHoursInput;
