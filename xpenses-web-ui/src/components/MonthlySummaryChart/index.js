/**
 * Copyright 2021, Northern Captain
 */

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {Typography, Box} from "@mui/material";

export default function MonthlySummaryChart({data}) {
    if(!data) return (
        <>
            <Typography variant="subtitle2" color="textSecondary" align="center">Spent Monthly</Typography>
            <Box sx={{display: "flex", alignItems: "center", height: "90%", justifyContent: "center"}}>
                <Typography variant="subtitle2" color="error" align="center">No data</Typography>
            </Box>
        </>
    )

    return (
        <>
            <Typography variant="subtitle2" color="textSecondary" align="center">Spent Monthly</Typography>
            <ResponsiveContainer width="100%" height="92%">
                <BarChart
                    data={data.data}
                    margin={{
                        top: 5,
                        right: 10,
                        left: 10,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{fontSize: 10}} />
                    <YAxis tick={{fontSize: 10}} width={30} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey={data.labels[0].name} fill={data.labels[0].color} />
                    {data.labels[1] && <Bar dataKey={data.labels[1].name} fill={data.labels[1].color} />}
                </BarChart>
            </ResponsiveContainer>
        </>
    )
}