// tailwind.config.js
module.exports = {
    content: ['./src/**/*.{js,jsx,ts,tsx}'],
    plugins: [],
    // This won't mangle Tailwind classes, but you can use PurgeCSS
    purge: {
        enabled: process.env.NODE_ENV === 'production',
        content: ['./src/**/*.{js,jsx,ts,tsx}'],
        options: {
            safelist: ['some-important-class']
        }
    },
    theme: {
        extend: {
            fontFamily: {
                orbitron: ['Orbitron', 'sans-serif'],
            },
        },
    },
};