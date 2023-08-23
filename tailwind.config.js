/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./src/pages/*.{js,ts,jsx,tsx,mdx}",
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			fontFamily: {
				primary: ["Oswald", "sans-serif"],
			},
			colors: {
				"brand-red": "#B01F22",
				"brand-blue": "#202246",
			},
		},
	},
	plugins: [],
}
