import {Box, Container, useMediaQuery, useTheme} from "@mui/material";
import AppTopBar from "../components/AppTopBar";
import Grid from "@mui/material/Grid";
import React, {useEffect, useState} from "react";
import Typography from "@mui/material/Typography";
import {YearFilter} from "../components/YearlyFilter";
import moment from "moment";
import {useAuth} from "../features/auth/authSlice";
import {useExpensesForSummaryQuery} from "../generated/graphql";
import {groupByDays, groupByMonthYear, groupByTopCategoryAndYear} from "../utils/dataTransformers";
import {DashboardCard} from "../components/DashboardCard";
import MonthlySummaryChart from "../components/MonthlySummaryChart";
import CategorySummaryChart from "../components/CategorySummaryChart";
import {ExpenseCardList} from "../components/ExpenseCardList";
import {TotalSummaryCard} from "../components/TotalSummaryCard";

/**
 * Dim out top or bottom edge of the outer container
 * Used for scrollable lists
 * @param {boolean} isTop
 * @param {boolean} show
 * @return {JSX.Element|null}
 * @constructor
 */
function DimOut({isTop, show}) {
    if(!show) return null;
    let sx = {
        position: "absolute",
        left: 0,
        right: 0,
        height: 24,
        background: `linear-gradient(${isTop ? 0 : 180}deg,hsla(0,0%,100%,.05) 25%, #f8faf9)`
    }
    if(isTop) {sx.top = 16} else {sx.bottom = 0}
    return <Box sx={sx}/>
}


/**
 * Expenses header with year filter
 * @param filter
 * @param onChange
 * @return {JSX.Element}
 * @constructor
 */
function HeaderBar({filter, onChange}) {
    return <Grid item xs={12} md={12} sx={{display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap'}}>
        <Typography variant="body" color="textSecondary"
                    sx={{alignSelf: "center", textAlign: "start", flexGrow: 1}}
        >Expenses for the year</Typography>
        <YearFilter
            id="first_year"
            color="cc1"
            value={filter}
            onChange={onChange}
        />
    </Grid>
}

/**
 * Calc total amount from the months data
 * @param monthData
 * @param year
 * @return {number}
 */
function getTotalAmount(monthData, year) {
    let total = 0
    for(let month of monthData.data) {
        total += month[year.val] ? month[year.val] : 0
    }
    return total
}

/**
 * Expenses page
 * @param props
 * @return {JSX.Element}
 * @constructor
 */
export default function ExpensesPage(props) {

    const auth = useAuth()
    const theme = useTheme();
    const isMedium = useMediaQuery(theme.breakpoints.up('md'));

    let [year, setYear] = useState({
        val: moment().year().toString(),
        dateFrom: moment().startOf("year").startOf("day"),
        dateTo: moment().startOf("year").startOf("day").add(1, "year")
    })
    let [data, setData] = useState(null)
    let [byMonth, setByMonth] = useState(null)
    let [allByMonth, setAllByMonth] = useState(null)
    let [totalAmount, setTotalAmount] = useState(0)
    let [filterAmount, setFilterAmount] = useState(0)
    let [byCategory, setByCategory] = useState(null)
    let [version, setVersion] = useState(0)

    const handleYear = (event, newYear) => {
        setYear({
            val: newYear,
            dateFrom: moment.utc(`${newYear}-01-01`),
            dateTo: moment.utc(`${newYear}-01-01`).add(1, 'year')
        })
        setData(null)
        setTotalAmount(0)
        setFilterAmount(0)
    }

    const [search, setSearch] = useState("")

    /**
     * Transform expenses list into a list of days
     * @param yeardata
     */
    const transformData = (yeardata) => {
        let rawData = yeardata.expenses
        let monthLabels = [{name: year.val, color: theme.palette.cc1.main}]
        if(search) {
            let src = search.toLowerCase()
            rawData = rawData.filter(it=> it.description.toLowerCase().includes(src)
                || it.category.name.toLowerCase().includes(src)
                || it.category.parent?.name.toLowerCase().includes(src))
            monthLabels = [{name: year.val, color: theme.palette.primary.main}]
        }
        let data = groupByDays(rawData)
        let monthData = groupByMonthYear(rawData, monthLabels)
        setByMonth(monthData)
        setFilterAmount(getTotalAmount(monthData, year))
        let categoryData = groupByTopCategoryAndYear(rawData, [{name: year.val, color: theme.palette.cc1.main}])
        setByCategory(categoryData)
        setData(data)
        setVersion(version+1)
    }

    const onDataLoaded = (data) => {
        let rawData = data.expenses
        let monthData = groupByMonthYear(rawData, [{name: year.val, color: theme.palette.cc1.main}])
        setTotalAmount(getTotalAmount(monthData, year))
        setAllByMonth(monthData)
        transformData(data)
    }

    /**
     * Query for expenses if year changes
     */
    const { data: yeardata } = useExpensesForSummaryQuery({
        variables: {
            groupCode: auth.groupCode,
            dateFrom: year.dateFrom,
            dateTo: year.dateTo,
            type: -1 //expenses only, ignore the income
        },
        skip: !year.val,
        onCompleted: onDataLoaded
    });

    useEffect(() => { if(yeardata) transformData(yeardata) }, [search])

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppTopBar title="Expenses" search={{value: search, onChange: setSearch}}/>
            <Container component="main" maxWidth="lg" sx={{mt:2, mb:2}}>
                <Grid container spacing={2}>
                    <HeaderBar filter={year.val} onChange={handleYear}/>
                    <Grid item xs={12} md={4}>
                        <DashboardCard xs={12} md={12} mb={2} h={search ? 160 : 120}>
                            <TotalSummaryCard
                                year={year.val}
                                totalAmount={totalAmount}
                                filter={search}
                                filterAmount={filterAmount}
                                theme={theme}/>
                        </DashboardCard>
                        <DashboardCard xs={12} md={12} mb={2}>
                            <MonthlySummaryChart data={byMonth} title="Spent Monthly"/>
                        </DashboardCard>
                        <DashboardCard xs={12} md={12}>
                            <CategorySummaryChart data={byCategory}/>
                        </DashboardCard>
                    </Grid>
                    <ExpenseCardList data={data} isMedium={isMedium} isLoading={!data} version={version}/>
                </Grid>
            </Container>
        </Box>
    )
}