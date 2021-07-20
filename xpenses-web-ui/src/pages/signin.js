import React, {useState} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import {Paper} from "@material-ui/core";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {useDispatch, useSelector} from "react-redux";
import {loginAsync, useAuth} from "../features/auth/authSlice";
import emailValidator from 'email-validator'
import {Redirect} from "react-router";
import {useQuery} from "../utils/helpers";

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://github.com/NorthernCaptain">
                Northern Captain
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: theme.spacing(3)
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function SignIn() {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ passwordError, setPasswordError] = useState(null)
    const [ emailError, setEmailError] = useState(null)
    const loginError = useSelector(state => state.auth.error);
    const auth = useAuth()
    const userError = emailError || loginError;
    const queryParams = useQuery();


    if(auth.valid) return <Redirect to={queryParams.has("from") ? queryParams.get("from") : "/"} />

    function validate() {
        if(!email) {
            setEmailError("Email can't be empty!")
            return false
        }

        if(!emailValidator.validate(email)) {
            setEmailError("Incorrect email format!")
            return false
        }

        if(!password) {
            setPasswordError("Password can't be empty!")
            return false
        }

        if(password.length < 5) {
            setPasswordError("Password should be at least 5 symbols long.")
            return false
        }

        return true
    }

    function doLogin(event) {
        event.preventDefault();
        if(validate()) {
            dispatch(loginAsync({email: email, password: password}))
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <Paper className={classes.paper} elevation={6}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <form className={classes.form} noValidate onSubmit={doLogin}>
                    <TextField
                        value={email}
                        onInput={e=>{setEmail(e.target.value);setEmailError(null);}}
                        error={userError !== null}
                        helperText={userError}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        value={password}
                        onInput={e=> {setPassword(e.target.value); setPasswordError(null);}}
                        error={passwordError !== null}
                        helperText={passwordError}
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Sign In
                    </Button>
                </form>
            </Paper>
            <Box mt={8}>
                <Copyright />
            </Box>
        </Container>
    );
}