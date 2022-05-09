module.exports = {
    mode: 'jit',
    content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
    darkMode: 'media',
    theme: {
        borderRadius: {
            DEFAULT: '4px',
        },
        fontSize: {
            ft10: '10px',
            ft12: '12px',
            ft13: '13px',
            ft14: '14px',
            ft16: '16px',
            ft20: '20px',
            ft24: '24px',
            ft36: '36px',
            ft48: '48px',
        },
        extend: {
            fontFamily: {
                Rajdhani: ['Rajdhani'],
            },
            colors: {
                primary: '#397EEC',
            },
            spacing: {
                '4px': '4px',
                '6px': '6px',
                '8px': '8px',
                '10px': '10px',
                '12px': '12px',
                '14px': '14px',
                '16px': '16px',
                '24px': '24px',
                '32px': '32px',
            },
            inset: {
                '240px': '240px',
            },
            lineHeight: {
                '24px': '24px',
                '48px': '48px',
                '64px': '64px',
            },
            borderRadius: {
                none: '0',
                '4px': '4px',
                '12px': '12px',
            },
            boxShadow: {
                pagetitle: '0px 1px 0px #EBECED',
            },
        },
    },
    variants: {},
    plugins: [],
};
