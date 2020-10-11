import { ThemeOptions } from '@material-ui/core';

const globalTheme: ThemeOptions = {
    palette: {
        primary: {
            light : '#adb5bd',
            main : '#495057',
            dark : '#212529',
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
    }
}

export default globalTheme;