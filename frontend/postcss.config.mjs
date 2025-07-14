// postcss.config.mjs
const config = {
  plugins: {
    // Hata mesajının belirttiği gibi, 'tailwindcss' yerine '@tailwindcss/postcss' kullanıyoruz.
    // Bu, Tailwind CSS'in PostCSS ile doğru entegrasyonu için gerekli.
    "@tailwindcss/postcss": {},
    autoprefixer: {},
  },
};

export default config;
