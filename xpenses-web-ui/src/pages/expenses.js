import {Box, Container, useMediaQuery, useTheme} from "@mui/material";
import AppTopBar from "../components/AppTopBar";
import Grid from "@mui/material/Grid";
import React, {useState} from "react";
import Typography from "@mui/material/Typography";
import {YearFilter} from "../components/YearlyFilter";
import moment from "moment";
import {useAuth} from "../features/auth/authSlice";
import {useExpensesForSummaryQuery} from "../generated/graphql";
import {groupByDays} from "../utils/dataTransformers";
import {ExpenseCard, SkeletonExpenseCard} from "../components/ExpenseCard";

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

    const transformData = () => {
        let data = groupByDays(yeardata.expenses)
        setData(data)
    }

    const { data: yeardata, loading: year1loading, error: yearerror } = useExpensesForSummaryQuery({
        variables: {
            groupCode: auth.groupCode,
            dateFrom: year.dateFrom,
            dateTo: year.dateTo,
            type: -1 //expenses only, ignore the income
        },
        skip: !year.val,
        onCompleted: transformData
    });

    let expenseSX = isMedium ? {maxHeight: "calc(100vh - 140px)", overflowY: "auto" , paddingLeft: "4px", paddingRight: "4px"} : {}

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppTopBar title="Expenses"/>
            <Container component="main" maxWidth="lg" sx={{mt:2, mb:2}}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={12} sx={{display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap'}}>
                        <Typography variant="h7" color="textSecondary" sx={{alignSelf: "center", textAlign: "start", flexGrow: 1}}>Expenses for Year</Typography>
                        <YearFilter
                            id="first_year"
                            color="cc1"
                            value={year.val}
                            onChange={handleYear}
                        />
                    </Grid>
                    {!data && <Grid item xs={12} md={8}>
                        <Box sx={expenseSX}>
                            { [2,3,2,2].map((it, idx) => <SkeletonExpenseCard key={`skeleton-card-${idx}`} lines={it}/>) }
                        </Box>
                    </Grid>
                    }
                    {data && <Grid item xs={12} md={8}>
                        <Box sx={expenseSX}>
                            {data.map(it => <ExpenseCard key={`expense-card-${it.name}`} item={it}/>)}
                        </Box>
                    </Grid>
                    }
                </Grid>
            </Container>
        </Box>
    )
}