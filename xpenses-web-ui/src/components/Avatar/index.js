/**
 * Copyright 2021, Northern Captain
 */
import * as React from 'react';
import Typography from "@mui/material/Typography";

const colors = {
    "L": "orange",
    "I": "blue"
}

export default function Avatar({name, userId, width}) {
    const initials = name ? name[0].toUpperCase() : 'X'
    const w = width ? width : '24px'
    const color = colors[initials] ? colors[initials] : 'red'
    return (
        <Typography variant="subtitle2" component="div" sx={{
            textAlign: 'center',
            lineHeight: w,
            fontWeight: 'bold',
            background: color,
            color: 'white',
            borderRadius: w,
            width: w,
            height: w }}>
            {initials}
        </Typography>
    )
}