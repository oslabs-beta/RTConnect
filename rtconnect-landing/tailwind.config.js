/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './client/**/*.{html,js,jsx}',
    './components/**/*.{html,js,jsx}',
    './index.html'
  ],
	theme: {
		fontFamily: {
			inter: ['Inter', 'sans-serif'],
			nunito: ['Nunito', 'sans-serif']
		},
		extend: {
			screens: {
				contributors: { raw: '(min-width: 935px)' }
			}
		}
	},
	plugins: []
}
