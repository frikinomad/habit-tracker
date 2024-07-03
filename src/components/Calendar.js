import React, { useState } from 'react';

const Calendar = () => {
    const [selectedDate, setSelectedDate] = useState('');

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    return (
        <div>
            <label htmlFor="date">Select a date:</label>
            <input type="date" id="date" onChange={handleDateChange} value={selectedDate} />
        </div>
    );
};

export default Calendar;