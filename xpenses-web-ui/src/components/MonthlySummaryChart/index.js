/**
 * Copyright 2021, Northern Captain
 */

import React from 'react';
import { Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts';
import {Typography, Box} from "@mui/material";

function ChartLine({type, label}) {
    console.log("PROPS", type, label)
    if(!label) return null
    if(type === 'bar') return <Bar dataKey={label.name} fill={label.color}  />
    if(type === 'line') return <Line type="monotone" dataKey={label.name} stroke={label.color} strokeWidth={2} />
    return null
}

export default function MonthlySummaryChart({data, type = 'bar', title}) {
    if(!data) return (
        <>
            <Typography variant="subtitle2" color="textSecondary" align="center">{title}</Typography>
            <Box sx={{display: "flex", alignItems: "center", height: "90%", justifyContent: "center"}}>
                <Typography variant="subtitle2" color="error" align="center">No data</Typography>
            </Box>
        </>
    )

    return (
        <>
            <Typography variant="subtitle2" color="textSecondary" align="center">{title}</Typography>
            <ResponsiveContainer width="100%" height="92%">
                <ComposedChart
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
                    { type === 'bar' && <Bar dataKey={data.labels[0].name} fill={data.labels[0].color}  /> }
                    { type === 'line' && <Line dataKey={data.labels[0].name} stroke={data.labels[0].color} strokeWidth={2} /> }
                    { data.labels[1] && type === 'bar' && <Bar dataKey={data.labels[1].name} fill={data.labels[1].color}  />}
                    { data.labels[1] && type === 'line' && <Line dataKey={data.labels[1].name} stroke={data.labels[1].color} strokeWidth={2} />}
                </ComposedChart>
            </ResponsiveContainer>
        </>
    )
}