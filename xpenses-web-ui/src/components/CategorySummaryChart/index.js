/**
 * Copyright 2021, Northern Captain
 */

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import {Box, Typography} from "@mui/material";
import {chartColors, chartPaleColors} from "../../config/colors";

export default function CategorySummaryChart({data, onClick}) {
    if(!data) return (
        <>
            <Typography variant="subtitle2" color="textSecondary" align="center">Spent by Category</Typography>
            <Box sx={{display: "flex", alignItems: "center", height: "90%", justifyContent: "center"}}>
                <Typography variant="subtitle2" color="error" align="center">No data</Typography>
            </Box>
        </>
    )

    return (
        <>
            <Typography variant="subtitle2" color="textSecondary" align="center">Spent by Category</Typography>
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
                    <XAxis dataKey="shortName" tick={{fontSize: 10}} />
                    <YAxis tick={{fontSize: 10}} width={30} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey={data.labels[0].name} fill={chartColors[0]}
                         onClick={(item, index)=>{if(onClick) onClick(item, index, data.labels[0].name)}}>
                        {data.data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                        ))}
                    </Bar>
                    {data.labels[1] && <Bar dataKey={data.labels[1].name} fill={chartPaleColors[0]}
                                            onClick={(item, index)=>{if(onClick) onClick(item, index, data.labels[1].name)}}>
                        {data.data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={chartPaleColors[index % chartPaleColors.length]} />
                        ))}
                    </Bar>}
                </BarChart>
            </ResponsiveContainer>
        </>
    )
}