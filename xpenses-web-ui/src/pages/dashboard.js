/**
 * Copyright 2021, Northern Captain
 */
import React, {useEffect, useState} from 'react';
import {Container, Paper, Box, useTheme, useMediaQuery, TextField} from "@mui/material";
import Grid from "@mui/material/Grid"
import AppTopBar from "../components/AppTopBar";
import "./dashboard.css"
import {YearlyDashboard} from "../components/YearlyDashboard";
import {MonthlyDashboard} from "../components/MonthlyDashboard";


export default function Dashboard(props) {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppTopBar title="Dashboard"/>
            <Container component="main" maxWidth="lg" sx={{mt:2, mb:2}}>
                <Grid container spacing={2}>
                    <YearlyDashboard/>
                    <MonthlyDashboard/>
                </Grid>
            </Container>
        </Box>
    )
}