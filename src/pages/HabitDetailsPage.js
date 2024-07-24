import React from 'react';
import HabitDetails from '../components/HabitDetails';

function HabitDetailsPage(id) {
    return (
        <div>
            <HabitDetails id={id} />
        </div>
    );
}

export default HabitDetailsPage;