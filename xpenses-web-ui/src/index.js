/**
 * Copyright 2021, Northern Captain
 */
import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import App from './App';
import theme from './theme';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from 'react-router-dom';
import { Provider } from 'react-redux'
import store from './app/store'
import './index.css'

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <StyledEngineProvider injectFirst>
                <ThemeProvider theme={theme}>
                    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                    <CssBaseline />
                    <BrowserRouter basename="/xps">
                        <App />
                    </BrowserRouter>
                </ThemeProvider>
            </StyledEngineProvider>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root'),
);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals(console.log);
