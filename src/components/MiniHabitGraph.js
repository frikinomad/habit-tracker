import React from 'react';
import { Line, LineChart, ResponsiveContainer } from 'recharts';

const MiniHabitGraph = ({ history }) => {
	const data = Object.entries(history)
		.sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
		.map(([date, { actionPerformed }]) => ({
			date,
			value: actionPerformed === 'finished' ? 1 : 0,
		}));

	return (
		<div className='w-full h-16'>
			<ResponsiveContainer width='100%' height='100%'>
				<LineChart data={data}>
					<Line
						type='monotone'
						dataKey='value'
						stroke='#8884d8'
						strokeWidth={2}
						dot={false}
					/>
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
};

export default MiniHabitGraph;
