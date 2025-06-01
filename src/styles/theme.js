export const colors = {
    primary: {
        purple: '#6822d0',
        seaBlue: '#759cff',
    },
    secondary: {
        lavender: '#7460FF',
    },
    tertiary: {
        seaGreen: '#5FFAB8',
        lightOrange: '#FA7D67',
    },
    grey: {
        dark: '#121724',
        light: '#e8e9fb',
    },
    common: {
        black: '#000000',
        white: '#FFFFFF',
    }
};

export const lightTheme = {
    background: {
        primary: colors.common.white,
        secondary: colors.grey.light,
        gradient: `linear-gradient(135deg, ${colors.grey.light} 0%, ${colors.common.white} 100%)`,
    },
    text: {
        primary: colors.grey.dark,
        secondary: colors.primary.purple,
        tertiary: colors.secondary.lavender,
    },
    border: colors.grey.light,
    accent: {
        primary: colors.primary.purple,
        secondary: colors.primary.seaBlue,
        tertiary: colors.tertiary.seaGreen,
    },
    card: {
        background: colors.common.white,
        shadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    button: {
        primary: colors.primary.purple,
        secondary: colors.primary.seaBlue,
        text: colors.common.white,
    }
};

export const darkTheme = {
    background: {
        primary: colors.grey.dark,
        secondary: '#1a1f2e',
        gradient: `linear-gradient(135deg, ${colors.grey.dark} 0%, #1a1f2e 100%)`,
    },
    text: {
        primary: colors.grey.light,
        secondary: colors.primary.seaBlue,
        tertiary: colors.tertiary.seaGreen,
    },
    border: '#2a2f3e',
    accent: {
        primary: colors.primary.seaBlue,
        secondary: colors.tertiary.seaGreen,
        tertiary: colors.tertiary.lightOrange,
    },
    card: {
        background: '#1a1f2e',
        shadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
    },
    button: {
        primary: colors.primary.seaBlue,
        secondary: colors.tertiary.seaGreen,
        text: colors.common.white,
    }
}; 