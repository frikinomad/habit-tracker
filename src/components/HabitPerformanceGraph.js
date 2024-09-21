import React, { useState, useEffect } from 'react';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from 'recharts';

const HabitPerformanceGraph = ({ habits }) => {
	const [graphData, setGraphData] = useState([]);

	useEffect(() => {
		prepareGraphData();
	}, [habits]);

	const prepareGraphData = () => {
		if (habits.length === 0) return;

		// Find the earliest createdAt date
		const startDate = new Date(
			Math.min(...habits.map((h) => new Date(h.createdAt)))
		);
		console.log(startDate);
		const endDate = new Date();

		const data = [];
		const currentDate = new Date(startDate);

		while (currentDate <= endDate) {
			const dateString = currentDate.toISOString().split('T')[0];
			const dailyData = { date: dateString };

			habits.forEach((habit) => {
				if (new Date(habit.createdAt) <= currentDate) {
					dailyData[habit.name] = calculateStreakForDate(habit, dateString);
				}
			});

			data.push(dailyData);
			currentDate.setDate(currentDate.getDate() + 1);
		}

		setGraphData(data);
	};

	const calculateStreakForDate = (habit, targetDate) => {
		let streak = 0;
		const dates = Object.keys(habit.history).sort();
		const targetDateObj = new Date(targetDate);

		for (let i = dates.length - 1; i >= 0; i--) {
			const date = new Date(dates[i]);
			if (date > targetDateObj) continue;

			const action = habit.history[dates[i]].actionPerformed;
			if (action === 'finished') {
				streak++;
			} else {
				break;
			}
		}

		return streak;
	};

	return (
		<div className='w-full h-96 mt-8'>
			<h2 className='text-xl font-semibold mb-4'>Habit Streaks</h2>
			<ResponsiveContainer width='100%' height='100%'>
				<LineChart data={graphData}>
					<XAxis
						dataKey='date'
						tickFormatter={(tick) => new Date(tick).toLocaleDateString()}
						interval={Math.floor(graphData.length / 10)}
					/>
					<YAxis domain={[0, 'dataMax']} />
					<Tooltip
						formatter={(value, name) => [`${value} days`, name]}
						labelFormatter={(label) => new Date(label).toLocaleDateString()}
					/>
					<Legend />
					{habits.map((habit, index) => (
						<Line
							key={habit.id}
							type='stepAfter'
							dataKey={habit.name}
							stroke={`hsl(${index * 30}, 70%, 50%)`}
							strokeWidth={2}
							dot={false}
						/>
					))}
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
};

export default HabitPerformanceGraph;
