/**
 * Copyright 2021, Northern Captain
 */
import * as React from 'react';
import Typography from "@mui/material/Typography";

export default function Avatar({name, userId, width}) {
    const initials = name ? name[0].toUpperCase() : 'X'
    const w = width ? width : '24px'
    return (
        <Typography variant="subtitle2" component="div" sx={{
            textAlign: 'center',
            background: 'orange',
            borderRadius: w,
            width: w,
            height: w }}>
            {initials}
        </Typography>
    )
}