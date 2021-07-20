import { red, orange } from '@material-ui/core/colors';
import { createTheme } from '@material-ui/core/styles';

// A custom theme for this app
const theme = createTheme({

    palette: {
        type: "dark",
        primary: {
            main: '#039be5',
        },
        secondary: orange,
        },
        error: {
            main: red.A400,
        }
});

export default theme;