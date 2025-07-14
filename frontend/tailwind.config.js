/** @type {import('tailwindcss').Config} */
module.exports = {
    // Karanlık modu 'class' stratejisiyle etkinleştiriyoruz
    darkMode: 'class', // Bu satır karanlık mod desteğini etkinleştirir
    content: [
        './app/**/*.{js,ts,jsx,tsx,mdx}',
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './hooks/**/*.{js,ts,jsx,tsx,mdx}',
        './styles/**/*.scss', // SCSS dosyalarınızı taradığından emin olun
        './src/**/*.{js,ts,jsx,tsx,mdx}', // Eğer src klasörü kullanıyorsanız bu da faydalı olabilir
    ],
    theme: {
        extend: {
            colors: {
                gray: {
                    100: '#F5F5F5',
                    200: '#E0E0E0',
                    300: '#CCCCCC',
                    700: '#4A5568',
                    // Karanlık mod renkleri
                    900: '#1a202c', // Koyu gri arka plan
                    950: '#0a0d11', // Navbar ve koyu arka planlar için
                },
                purple: {
                    950: '#2A003B', // Navbar arka planı
                    800: '#4C1D95', // Navbar hover veya vurgu
                    700: '#5A20B7', // Genel mor ton
                    900: '#21002D', // Sidebar için karanlık mod
                },
                blue: {
                    500: '#3B82F6', // Genel mavi ton (Butonlar, sınırlar)
                    600: '#2563EB', // Daha koyu mavi
                    700: '#1D4ED8', // Daha da koyu mavi
                    400: '#60A5FA', // Karanlık mod border
                    800: '#1e40af', // Karanlık mod hover
                },
                red: {
                    700: '#B91C1C', // Hata mesajları
                },
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
