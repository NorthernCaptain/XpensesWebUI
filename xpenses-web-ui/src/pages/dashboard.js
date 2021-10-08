/**
 * Copyright 2021, Northern Captain
 */
import React, {useEffect, useState} from 'react';
import {Container, Paper, Box, useTheme, useMediaQuery} from "@mui/material";
import Grid from "@mui/material/Grid"
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import AppTopBar from "../components/AppTopBar";
import {useAuth} from "../features/auth/authSlice";
import {useExpensesForSummaryQuery} from "../generated/graphql";
import moment from "moment";
import {groupByMonthYear, groupByTopCategoryAndYear} from "../utils/dataTransformers";
import MonthlySummaryChart from "../components/MonthlySummaryChart";
import CategorySummaryChart from "../components/CategorySummaryChart";

function DashboardCard(props) {
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
                [curYear-3,curYear-2,curYear-1,curYear].map(year => <ToggleButton key={`ytb-${props.key}-${year}`} value={`${year}`}>{year}</ToggleButton>)
            }
        </ToggleButtonGroup>
        )
}

export default function Dashboard(props) {
    const auth = useAuth()

    const [dateFrom, setDateFrom] = useState(moment().subtract(1, "year").startOf("year").startOf("day"))
    const [dateTo, setDateTo] = useState(moment().endOf("year").endOf("day"))
    const [yearData, setYearData] = useState(null)
    const [catData, setCatData] = useState(null)
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
        <Box sx={{ flexGrow: 1 }}>
            <AppTopBar title="Dashboard"/>
            <Container component="main" maxWidth="lg" sx={{mt:2, mb:2}}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={12} sx={{display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap'}}>
                        <YearFilter
                            key="first"
                            color="cc1"
                            value={firstYear.val}
                            onChange={handleFirstYear}
                        />
                        <YearFilter
                            key="second"
                            color="cc2"
                            value={secondYear.val}
                            onChange={handleSecondYear}
                            sx={{ml: 2}}
                        />
                    </Grid>
                    <DashboardCard xs={12} md={6}>
                        <MonthlySummaryChart data={yearData}/>
                    </DashboardCard>
                    <DashboardCard xs={12} md={6}>
                        <CategorySummaryChart data={catData}/>
                    </DashboardCard>
                </Grid>
            </Container>
        </Box>
    )
}