import { ThemeOptions } from '@material-ui/core';

const globalTheme: ThemeOptions = {
    palette: {
        primary: {
            light: '#adb5bd',
            main: '#495057',
            dark: '#212529',
            contrastText: '#fff'
        },
        secondary: {
            light: '#f8f9fa',
            main: '#e9ecef',
            dark: '#ced4da',
            contrastText: '#212529'
        }
    },
    typography: {
        fontFamily: '"NotoSansKR-Regular", "Sunflower", sans-serif'
    },
    // shadows: [
    //     // 23 default values of 'shadows' array from https://material-ui-1dab0.firebaseapp.com/customization/themes/
    //     '0px 11px 15px -7px red,0px 24px 38px 3px red,0px 9px 46px 8px red', // 24th value
    // ],
}

export default globalTheme;