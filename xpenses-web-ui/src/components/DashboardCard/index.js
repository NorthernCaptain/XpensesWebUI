/**
 * Copyright 2021, Northern Captain
 */
import React from 'react';
import {Paper, useTheme, useMediaQuery} from "@mui/material";
import Grid from "@mui/material/Grid"

export function DashboardCard(props) {
    const theme = useTheme();
    const isMedium = useMediaQuery(theme.breakpoints.up('md'));
    const paperP = isMedium ? 2 : 1
    const height = props.h ? props.h : (isMedium ? 300 : 220)

    return (
        <Grid item xs={props.xs} md={props.md} mb={props.mb} mt={props.mt} >
            <Paper elevation={4} sx={{p: paperP, height: height, transition: theme.transitions.create('height')}}>
                {props.children}
            </Paper>
        </Grid>
    )
}

