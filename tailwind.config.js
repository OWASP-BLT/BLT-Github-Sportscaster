/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'tv-blue': '#1a1a2e',
                'tv-deep': '#16213e',
                'tv-accent': '#ffd700',
            },
            animation: {
                'pulse-live': 'live-pulse 1s ease-in-out infinite',
            },
            keyframes: {
                'live-pulse': {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.3' },
                }
            }
        },
    },
    plugins: [],
}
