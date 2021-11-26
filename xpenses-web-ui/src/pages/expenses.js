import {Box, Container, useMediaQuery, useTheme} from "@mui/material";
import AppTopBar from "../components/AppTopBar";
import Grid from "@mui/material/Grid";
import React, {useEffect, useMemo, useState} from "react";
import Typography from "@mui/material/Typography";
import {YearFilter} from "../components/YearlyFilter";
import moment from "moment";
import {useAuth} from "../features/auth/authSlice";
import {useExpensesForSummaryQuery} from "../generated/graphql";
import {groupByDays} from "../utils/dataTransformers";
import {ExpenseCard, SkeletonExpenseCard} from "../components/ExpenseCard";

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
function CardList({data, isMedium}) {
    let expenseSX = isMedium ?
        {
            maxHeight: "calc(100vh - 138px)",
            overflowY: "auto" ,
            paddingLeft: "4px",
            paddingRight: "4px"
        } : {}

    if (!data) {
        return <Grid item xs={12} md={8}>
            <Box sx={expenseSX}>
                { [2,3,2,2].map((it, idx) =>
                    <SkeletonExpenseCard key={`skeleton-card-${idx}`} lines={it}/>) }
            </Box>
        </Grid>
    }

    console.log("CARD LIST render");
    return <Grid item xs={12} md={8} sx={{position: "relative"}}>
        <Box sx={expenseSX}>
            {data.map(it => <ExpenseCard key={`expense-card-${it.name}`} item={it}/>)}
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

    const handleYear = (event, newYear) => {
        setYear({
            val: newYear,
            dateFrom: moment.utc(`${newYear}-01-01`),
            dateTo: moment.utc(`${newYear}-01-01`).add(1, 'year')
        })
        setData(null)
    }

    const [search, setSearch] = useState("")

    const MemoCardList = useMemo(() => CardList, [data, isMedium])

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

    useEffect(() => {transformData(yeardata)}, [search])

    console.log("Search value", search, yeardata)
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppTopBar title="Expenses" search={{value: search, onChange: setSearch}}/>
            <Container component="main" maxWidth="lg" sx={{mt:2, mb:2}}>
                <Grid container spacing={2}>
                    <HeaderBar filter={year.val} onChange={handleYear}/>
                    <MemoCardList data={data} isMedium={isMedium}/>
                </Grid>
            </Container>
        </Box>
    )
}