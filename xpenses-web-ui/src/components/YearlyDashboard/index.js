/**
 * Copyright 2021, Northern Captain
 */

import React, {useEffect, useState} from "react";
import moment from "moment";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import {useExpensesForSummaryQuery} from "../../generated/graphql";
import {useAuth} from "../../features/auth/authSlice";
import {cumulativeYearGroup, groupByMonthYear, groupByTopCategoryAndYear} from "../../utils/dataTransformers";
import Grid from "@mui/material/Grid";
import MonthlySummaryChart from "../MonthlySummaryChart";
import CategorySummaryChart from "../CategorySummaryChart";
import {DashboardCard} from "../DashboardCard";
import Typography from "@mui/material/Typography";
import {Box, Divider} from "@mui/material";


function YearFilter(props) {
    let curYear = moment().year()
    return (
        <ToggleButtonGroup
            color={props.color}
            size="small"
            value={props.value}
            exclusive
            onChange={props.onChange}
            sx={props.sx}
        >
            {
                [curYear-5,curYear-4,curYear-3,curYear-2,curYear-1,curYear].map(year => <ToggleButton key={`ytb-${props.id}-${year}`} value={`${year}`}>{year}</ToggleButton>)
            }
        </ToggleButtonGroup>
    )
}

function YearSummary({data}) {
    if(!data) return <Typography variant="subtitle2" color="textSecondary" align="center" mb={4}>Total Spent</Typography>

    let percent = null
    if(data.labels.length > 1) {
        percent = (data.labels[0].amount - data.labels[1].amount) / data.labels[1].amount * 100
    }

    return (
        <>
            <Typography variant="subtitle2" color="textSecondary" align="center" mb={4}>Total Spent</Typography>
            {data?.labels.map((label, index) => (
                <Box  key={index} sx={{display: "flex", justifyContent: "space-between"}} mb={1+index*4} ml={2} mr={2}>
                    <Box sx={{display: "flex", alignItems: "center"}}>
                        <Box sx={{width: 16, height: 16, backgroundColor: label.color}} mr={1}/>
                        <Typography variant="h6" color="textSecondary" align="start" sx={{lineHeight: "unset"}}>
                            {label.name}:
                        </Typography>
                    </Box>
                    <Typography variant="h6" color="textSecondary" align="end">
                        ${label.amount}
                    </Typography>
                </Box>
            ))}
            {percent && (
                <>
                <Divider component="div" variant="middle"/>
                <Box sx={{display: "flex", justifyContent: "space-between"}} mt={1} ml={2} mr={2}>
                    <Box sx={{display: "flex", alignItems: "center"}}>
                        <Box sx={{width: 16, height: 16, backgroundColor: percent > 0 ? "red" : "green"}} mr={1}/>
                        <Typography variant="h6" color="textSecondary" align="start" sx={{lineHeight: "unset", fontWeight: "normal"}}>
                            Change:
                        </Typography>
                    </Box>
                    <Typography variant="h6" color="textSecondary" align="end">
                        {percent.toFixed(2)}%
                    </Typography>
                </Box>
                </>
            )}
        </>
    )
}

export function YearlyDashboard(props) {
    const auth = useAuth()
    const [yearData, setYearData] = useState(null)
    const [catData, setCatData] = useState(null)
    const [cumulativeData, setCumulativeData] = useState(null)

    const [firstYear, setFirstYear] = useState({
        val: moment().year().toString(),
        dateFrom: moment().startOf("year").startOf("day"),
        dateTo: moment().startOf("year").startOf("day").add(1, "year")
    })

    const [secondYear, setSecondYear] = useState({
        val: moment().subtract(1, "year").year().toString(),
        dateFrom: moment().subtract(1, "year").startOf("year").startOf("day"),
        dateTo: moment().startOf("year").startOf("day")
    })

    const transformData = () => {
        let data = []
        let labels = []
        console.log("Loaded", year1data, year2data)
        if(firstYear.val && year1data && year1data.expenses) {
            data.push(...year1data.expenses)
            labels.push({name: firstYear.val, color: "#82ca9d"})
        }
        if(secondYear.val && year2data && year2data.expenses) {
            data.push(...year2data.expenses)
            labels.push({name: secondYear.val, color: "#8884d8"})
        }
        console.log("XP Data", data)
        if(!labels.length) {
            setYearData(null)
            setCatData(null)
            return
        }
        const years = groupByMonthYear(data, [...labels])
        console.log("Transformed to months", years)
        setYearData(years)
        const categories = groupByTopCategoryAndYear(data, [...labels])
        console.log("Categories", categories)
        setCatData(categories)
        const cumulative = cumulativeYearGroup(data, [...labels])
        console.log("Cumulative", cumulative)
        setCumulativeData(cumulative)
    }

    const { data: year1data, loading: year1loading, error: year1error } = useExpensesForSummaryQuery({
        variables: {
            groupCode: auth.groupCode,
            dateFrom: firstYear.dateFrom,
            dateTo: firstYear.dateTo,
            type: -1 //expenses only, ignore the income
        },
        skip: !firstYear.val,
        onCompleted: transformData
    });

    const { data: year2data, loading: year2loading, error: year2error } = useExpensesForSummaryQuery({
        variables: {
            groupCode: auth.groupCode,
            dateFrom: secondYear.dateFrom,
            dateTo: secondYear.dateTo,
            type: -1 //expenses only, ignore the income
        },
        skip: !secondYear.val,
        onCompleted: transformData
    });

    const handleFirstYear = (event, newYear) => { setFirstYear({
        val: newYear,
        dateFrom: moment.utc(`${newYear}-01-01`),
        dateTo: moment.utc(`${newYear}-01-01`).add(1, 'year')
    })}
    const handleSecondYear = (event, newYear) => { setSecondYear({
        val: newYear,
        dateFrom: moment.utc(`${newYear}-01-01`),
        dateTo: moment.utc(`${newYear}-01-01`).add(1, 'year')
    })}

    useEffect(() => {transformData()}, [firstYear, secondYear])

    return (
        <>
            <Grid item xs={12} md={12} sx={{display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap'}}>
                <Typography variant="h7" color="textSecondary" sx={{alignSelf: "center", textAlign: "start", flexGrow: 1}}>Compare Year over Year</Typography>
                <YearFilter
                    id="first_year"
                    color="cc1"
                    value={firstYear.val}
                    onChange={handleFirstYear}
                />
                <YearFilter
                    id="second_year"
                    color="cc2"
                    value={secondYear.val}
                    onChange={handleSecondYear}
                    sx={{ml: 2}}
                />
            </Grid>
            <DashboardCard xs={12} md={6}>
                <CategorySummaryChart data={catData}/>
            </DashboardCard>
            <DashboardCard xs={12} md={6}>
                <MonthlySummaryChart data={yearData} title="Spent Monthly"/>
            </DashboardCard>
            <DashboardCard xs={12} md={9}>
                <MonthlySummaryChart data={cumulativeData} type="line" title="Week over week cumulative"/>
            </DashboardCard>
            <DashboardCard xs={12} md={3}>
                <YearSummary data={cumulativeData}/>
            </DashboardCard>
        </>
    )
}
