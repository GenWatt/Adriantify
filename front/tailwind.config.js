module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        screens: {
            sm: '480px',
            md: '768px',
            lg: '976px',
            xl: '1440px',
        },
        colors: {
            'secondary': '#15b7b9',
            'secondary-lighter': '#17d8db',
            'secondary-dark': '#299293',
            'primary': '#18181b',
            'primary-light': '#1d1d20',
            'primary-lighter': '#27272a',
            'text-primary': 'white',
            'text-error': '#ff1c25',
            'text-success': 'lightgreen',
        },
        fontFamily: {
            sans: ['Graphik', 'sans-serif'],
            serif: ['Merriweather', 'serif'],
        },
        extend: {
            spacing: {
                '128': '32rem',
                '144': '36rem',
            },
            borderRadius: {
                '4xl': '2rem',
            }
        }
    },
    plugins: [],
}