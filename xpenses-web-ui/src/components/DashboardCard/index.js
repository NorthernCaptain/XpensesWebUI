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

    return (
        <Grid item xs={props.xs} md={props.md}>
            <Paper elevation={4} sx={{p: paperP, height: isMedium ? 300 : 220 }}>
                {props.children}
            </Paper>
        </Grid>
    )
}

