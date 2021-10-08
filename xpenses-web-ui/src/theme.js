import { red, orange } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: '#039be5',
        },
        secondary: orange,
        cc1: {
            main: '#82ca9d',
            contrastText: '#fff',
        },
        cc2: {
            main: '#8884d8',
            contrastText: '#fff',
        },
    },
    error: {
        main: red.A400,
    },
    components: {
        MuiAppBar: {
            defaultProps: {
                enableColorOnDark: true,
            },
        },
    }
});

export default theme;