/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
	theme: {
		extend: {
			backgroundImage: {
				"radial-gradient": "radial-gradient(circle, #0B8FAC, #043A46)",
				// 'linear-gradient': 'linear-gradient(to bottom right, #0B8FAC 20%, #043A46 80%)',
				"linear-gradient":
					"linear-gradient(to right bottom,#0B8FAC , #0B8FAC, #043A46)",
			},
			fontFamily: {
				inter: ["Inter"],
			},
			colors: {
				Primary: "#0B8FAC",
				lightPrimary:'#6ACAE0',
				Secondary: {
					darkGray: "#888888",
					lightGray: "#FAFAFA",
					mediumGray: "#666363",
				},
				black: {
					medium: "#3D3D3D",
					dark:'#011632'
				},
				blue: {
					dark: "#043A46",
					medium:'#1B3C74',
					light: "#C7E5EC",
				},
			},
		},
	},
	plugins: [require("tailwindcss-gradients")],
};
