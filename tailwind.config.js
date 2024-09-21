/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{html,js}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Helvetica', 'Arial', 'sans-serif'],
			},
			colors: {
				customGray: '#2D3748',
			},
			boxShadow: {
				card: '0 10px 40px -12px rgba(16,24,40,.1)',
			},
			borderColor: {
				card: '#d4d4d8',
			},
			textColor: {
				card: '#27272a',
			},
			backgroundColor: {
				card: '#fff',
			},
		},
	},
	plugins: [],
};
