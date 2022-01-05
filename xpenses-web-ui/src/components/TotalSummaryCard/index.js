import Typography from "@mui/material/Typography";
import {Box} from "@mui/material";
import React from "react";

/**
 * Card that shows a summary of expenses for the year and a filtered summary
 * @param year
 * @param totalAmount
 * @param filterAmount
 * @param theme
 * @param filter
 * @return {JSX.Element}
 * @constructor
 */
export function TotalSummaryCard({year, totalAmount, filterAmount, theme, filter}) {
    return <>
        <Typography variant="subtitle2" color="textSecondary" align="center" mb={3}>Total Spent</Typography>
        <Box  sx={{display: "flex", justifyContent: "space-between"}} mb={1} ml={2} mr={2}>
            <Box sx={{display: "flex", alignItems: "center"}}>
                <Box sx={{width: 16, height: 16, backgroundColor: theme.palette.cc1.main}} mr={1}/>
                <Typography variant="h6" color="textSecondary" align="start" sx={{lineHeight: "unset"}}>
                    {year}:
                </Typography>
            </Box>
            <Typography variant="h6" color="textSecondary" align="end" sx={{fontWeight: "bold"}}>
                ${totalAmount}
            </Typography>
        </Box>
        {filter && <Box sx={{display: "flex", justifyContent: "space-between"}} mb={1} ml={2} mr={2}>
            <Box sx={{display: "flex", alignItems: "center"}}>
                <Box sx={{width: 16, height: 16, backgroundColor: theme.palette.primary.main}} mr={1}/>
                <Typography variant="h6" color="textSecondary" align="start" sx={{lineHeight: "unset"}}>
                    {filter} ({Math.round(filterAmount/totalAmount*100)}%):
                </Typography>
            </Box>
            <Typography variant="h6" color="textSecondary" align="end" sx={{fontWeight: "bold"}}>
                ${filterAmount}
            </Typography>
        </Box>
        }
    </>
}
