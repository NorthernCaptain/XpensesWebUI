/**
 * Copyright 2021, Northern Captain
 */
import React, {useEffect, useState} from 'react';
import {
    TextField,
    Grid,
    Typography, useTheme, useMediaQuery, Box, IconButton, Paper
} from "@mui/material";
import {useAuth} from "../../features/auth/authSlice";
import moment from "moment";
import DatePicker from '@mui/lab/DatePicker';
import {useCategoriesQuery, useExpensesForSummaryLazyQuery} from "../../generated/graphql";
import {filterExpensesByCategories, groupByDays, groupByTopCategoryAndYear} from "../../utils/dataTransformers";
import {DashboardCard} from "../DashboardCard";
import CategorySummaryChart from "../CategorySummaryChart";
import {ExpenseCard} from "../ExpenseCard";
import {CategoryFilter} from "../CategoryFilter";
import {DeleteForeverOutlined} from "@mui/icons-material";
import {yellow} from "@mui/material/colors";

function MonthlyFilter(props) {
    let maxDate = moment().startOf("month")
    let minDate = moment().subtract(5, "year").startOf("year")
    const handleChange = (newDate) => {
        if((newDate.month() !== props.value.month() || newDate.year() !== props.value.year())
            && props.onChange) {
            props.onChange(newDate)
        }
    }
    return (
        <DatePicker
            views={['year', 'month']}
            minDate={minDate}
            maxDate={maxDate}
            value={props.value}
            onChange={handleChange}
            showTodayButton={true}
            renderInput={(params) => <TextField {...params} helperText={null} size="small" sx={{mt: 1, width: 270 }}/>}
        />
    )
}


export function MonthlyDashboard(props) {
    const auth = useAuth()
    const theme = useTheme();
    const isMedium = useMediaQuery(theme.breakpoints.up('md'));

    const [firstMonth, setFirstMonth] = useState(moment().startOf("month"))
    const [categories, setCategories] = useState([])
    const [allCategories, setAllCategories] = useState([])
    const [catData, setCatData] = useState(null)
    const [expenses, setExpenses] = useState([])
    const [catFilter, setCatFilter] = useState(null)
    const [filteredData, setFilteredData] = useState([])

    useCategoriesQuery({
        variables: {
            groupCode: auth.groupCode,
            typ: -1
        },
        skip: !auth,
        onCompleted: data => {
            let cats = []
            for(let item of data.categories) {
                if(!item.parent) cats.push(item)
            }
            cats.sort((a,b)=> a.name.localeCompare(b.name))
            setAllCategories(cats)
            if(categories.length === 0) {
                setCategories([...cats])
            }
        }
    });

    const transformData = data => {
        let filtered = filterExpensesByCategories(data.expenses, categories)
        console.log("FILTERED", filtered)
        setFilteredData(filtered)
        const grouped = groupByTopCategoryAndYear(filtered, [{name: firstMonth.format('YYYY-MM'), color: "#8884d8"}])
        setCatData(grouped)
        setCatFilter(null)
    }

    const [refreshExpenses] = useExpensesForSummaryLazyQuery({
        variables: {
            groupCode: auth.groupCode,
            type: -1 //expenses only, ignore the income
        },
        fetchPolicy: "network-only",
        onCompleted: transformData
    });

    useEffect(()=> {
        refreshExpenses({
            variables: {
                dateFrom: firstMonth.clone().startOf('month').toDate(),
                dateTo: firstMonth.clone().startOf('month').add(1, 'month').toDate(),
            }
        })
    }, [firstMonth, categories])

    useEffect(()=>{
        let inputData = filteredData
        if(catFilter) {
            inputData = filteredData.filter(it => it.category.id === catFilter.id || it.category.parent?.id === catFilter.id)
        }
        let dayData = groupByDays(inputData)
        setExpenses(dayData)
    }, [catFilter, filteredData])

    const handleCategoryClick = (item, index, name) => {
        console.log("Category clicked", item.category, index, name)
        setCatFilter(item.category)
    }

    let expenseSX = isMedium ? {maxHeight: 300, overflowY: "auto" , paddingLeft: "4px", paddingRight: "4px"}
        : {}

    let catFilterUI = null

    if(catFilter) {
        catFilterUI = <Paper elevation={4} sx={
            {
                display:'flex',
                justifyContent:'space-between',
                p: 2,
                mb: 1,
                backgroundColor: yellow[50],
            }}>
            <Typography variant="body" color="textSecondary" sx={{alignSelf: "center", textAlign: "start", flexGrow: 1}}>Filter: {catFilter.name}</Typography>
            <IconButton color="secondary" aria-label="clear filter" onClick={()=> setCatFilter(null)}>
                <DeleteForeverOutlined />
            </IconButton>
        </Paper>
    }

    return (
        <>
            <Grid item xs={12} md={12} sx={{display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap'}} className="monthly-filters">
                <Typography variant="body" color="textSecondary" sx={{alignSelf: "center", textAlign: "start", flexGrow: 1}}>Monthly stats</Typography>
                <MonthlyFilter value={firstMonth} onChange={setFirstMonth}/>
                <CategoryFilter value={categories} onChange={setCategories} items={allCategories} getId={(it)=>it.id} getName={(it)=>it.name}/>
            </Grid>
            <DashboardCard xs={12} md={8}>
                <CategorySummaryChart data={catData} onClick={handleCategoryClick}/>
            </DashboardCard>
            <Grid item xs={12} md={4}>
                <Box sx={expenseSX}>
                    {catFilterUI}
                    {expenses.map(it => <ExpenseCard key={`expense-card-${it.name}`} item={it}/>)}
                </Box>
            </Grid>
        </>
    )
}