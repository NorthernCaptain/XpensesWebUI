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
import {ExpenseCard, SkeletonExpenseCard} from "../components/ExpenseCard";
import {ExpenseMonthSummary} from "../components/ExpenseMonthSummary";
import {DashboardCard} from "../components/DashboardCard";
import MonthlySummaryChart from "../components/MonthlySummaryChart";
import CategorySummaryChart from "../components/CategorySummaryChart";

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
 * List of expenses or skeleton cards if not loaded
 * @param data
 * @param isMedium
 * @return {JSX.Element}
 * @constructor
 */
function CardList({data, isMedium, isLoading}) {
    let expenseSX = isMedium ?
        {
            maxHeight: "calc(100vh - 138px)",
            overflowY: "auto" ,
            paddingLeft: "4px",
            paddingRight: "4px"
        } : {}

    if (isLoading) {
        return <Grid item xs={12} md={8}>
            <Box sx={expenseSX}>
                { [2,3,2,2].map((it, idx) =>
                    <SkeletonExpenseCard key={`skeleton-card-${idx}`} lines={it}/>) }
            </Box>
        </Grid>
    }

    if (!data) return null;

    return <Grid item xs={12} md={8} sx={{position: "relative"}}>
        <Box sx={expenseSX}>
            {data.map(it => it.items ? <ExpenseCard key={`expense-card-${it.name}`} item={it}/>
                : <ExpenseMonthSummary key={`expense-sum-${it.name}`} item={it}/>)}
        </Box>
        <DimOut isTop={true} show={isMedium}/>
        <DimOut isTop={false} show={isMedium}/>
    </Grid>
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
        >Expenses for Year</Typography>
        <YearFilter
            id="first_year"
            color="cc1"
            value={filter}
            onChange={onChange}
        />
    </Grid>
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
    let [byCategory, setByCategory] = useState(null)

    const handleYear = (event, newYear) => {
        setYear({
            val: newYear,
            dateFrom: moment.utc(`${newYear}-01-01`),
            dateTo: moment.utc(`${newYear}-01-01`).add(1, 'year')
        })
        setData(null)
    }

    const [search, setSearch] = useState("")

    /**
     * Transform expenses list into a list of days
     * @param yeardata
     */
    const transformData = (yeardata) => {
        let rawData = yeardata.expenses
        if(search) {
            rawData = rawData.filter(it=> it.description.includes(search)
                || it.category.name.includes(search)
                || it.category.parent?.name.includes(search))
        }
        let data = groupByDays(rawData)
        let monthData = groupByMonthYear(rawData, [{name: year.val, color: "#82ca9d"}])
        setByMonth(monthData)
        let categoryData = groupByTopCategoryAndYear(rawData, [{name: year.val, color: "#82ca9d"}])
        setByCategory(categoryData)
        setData(data)
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
        onCompleted: transformData
    });

    useEffect(() => { if(yeardata) transformData(yeardata) }, [search])

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppTopBar title="Expenses" search={{value: search, onChange: setSearch}}/>
            <Container component="main" maxWidth="lg" sx={{mt:2, mb:2}}>
                <Grid container spacing={2}>
                    <HeaderBar filter={year.val} onChange={handleYear}/>
                    <Grid item xs={12} md={4}>
                        <DashboardCard xs={12} md={12} mb={2}>
                            <MonthlySummaryChart data={byMonth} title="Spent Monthly"/>
                        </DashboardCard>
                        <DashboardCard xs={12} md={12}>
                            <CategorySummaryChart data={byCategory}/>
                        </DashboardCard>
                    </Grid>
                    <CardList data={data} isMedium={isMedium} isLoading={!data}/>
                </Grid>
            </Container>
        </Box>
    )
}