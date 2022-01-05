import {Box, Paper, Typography} from "@mui/material";
import React from "react";
import {yellow} from "@mui/material/colors";

/**
 * Summary card showing the total expenses for a given month.
 * @param item
 * @return {JSX.Element}
 * @constructor
 */
export function ExpenseMonthSummary({item}) {
    return (
        <Paper elevation={0} sx={{p: 2, mr: 1, ml: 1, mb:2, backgroundColor: yellow[50], borderColor: yellow[600], borderWidth: 1, borderStyle: 'solid'}}>
            <Box sx={{display: "flex", alignItems: "center", justifyContent: "space-between"}} mr={2}>
                <Typography variant="h6" color="textSecondary" sx={{alignSelf: "center", textAlign: "start", fontWeight: "normal"}}>{item.name}</Typography>
                <Typography variant="h6" color="textSecondary" sx={{alignSelf: "center", textAlign: "end"}}>${item.amount}</Typography>
            </Box>
        </Paper>
    )
}
