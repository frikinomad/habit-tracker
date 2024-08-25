import React, { useState } from 'react';

const Calendar = () => {
    const [selectedDate, setSelectedDate] = useState('');

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    return (
        <div className="dark:bg-gray-900 dark:text-white p-4 rounded-lg">
          <label htmlFor="date" className="block mb-2 dark:text-white">Select a date:</label>
          <input
            type="date"
            id="date"
            onChange={handleDateChange}
            value={selectedDate}
            className="dark:bg-gray-800 dark:text-white border dark:border-gray-700 rounded-lg p-2"
          />
        </div>
      );
      
};

export default Calendar;