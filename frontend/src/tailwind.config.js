/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './hooks/**/*.{js,ts,jsx,tsx,mdx}',
        './styles/**/*.scss',
    ],
    theme: {
        extend: {
            colors: {
                gray: {
                    100: '#F5F5F5',
                    200: '#E0E0E0',
                    300: '#CCCCCC',
                    700: '#4A5568',
                },
                purple: {
                    950: '#2A003B',
                    800: '#4C1D95',
                },
                blue: {
                    500: '#3B82F6',
                    600: '#2563EB',
                    700: '#1D4ED8',
                },
                red: {
                    700: '#B91C1C',
                }
            },
            spacing: {
                '2': '8px',
                '4': '16px',
                '5': '20px',
                '6': '24px',
                '8': '32px',
                '10': '40px',
                '20': '80px',
                '40': '160px',
            },
            borderRadius: {
                'xl': '0.75rem',
            },
            boxShadow: {
                'none': 'none',
            },
        },
    },
    plugins: [],
};