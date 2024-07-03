import React, { Fragment } from 'react';
import spinner from './spinner.gif';

const Spinner = () => {
	return (
		<Fragment>
			<img
				src={spinner}
				alt='Loading...'
				style={{
					height: '75px',
					width: '75px',
					margin: 'auto',
					display: 'block',
					backgroundColor: 'grey',
				}}
			/>
		</Fragment>
	);
};

export default Spinner;
