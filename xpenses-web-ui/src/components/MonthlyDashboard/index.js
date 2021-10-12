/**
 * Copyright 2021, Northern Captain
 */
import React, {useEffect, useState} from 'react';
import {
    Container,
    Paper,
    Box,
    useTheme,
    useMediaQuery,
    TextField,
    FormControl,
    InputLabel,
    Select, OutlinedInput, MenuItem, Checkbox, ListItemText
} from "@mui/material";
import Grid from "@mui/material/Grid"
import {useAuth} from "../../features/auth/authSlice";
import moment from "moment";
import DatePicker from '@mui/lab/DatePicker';
import {useCategoriesQuery, useExpensesForSummaryLazyQuery, useExpensesForSummaryQuery} from "../../generated/graphql";
import {filterExpensesByCategories, groupByTopCategoryAndYear} from "../../utils/dataTransformers";
import {DashboardCard} from "../DashboardCard";
import CategorySummaryChart from "../CategorySummaryChart";

function MonthlyFilter(props) {
    let maxDate = moment().startOf("month")
    let minDate = moment().subtract(3, "year").startOf("year")
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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const ALL = 'ALL'

function CategoryFilter(props) {
    const items = props.items ? props.items : []

    const handleChange = (event) => {
        let value = event.target.value
        let result = []
        let allIdx = value.find(it=>it===0) !== undefined
        let wasAll = items.length === props.value.length
        let isAll = value.length - (allIdx ? 1 : 0) === items.length
        while(true) {
            //user unchecked ALL item -> reset all real items
            if (wasAll && isAll && !allIdx) {
                //empty result
                break
            }

            //user checked ALL item -> select all real items
            if (!wasAll && allIdx) {
                result.push(...items)
                break
            }

            //individual item set/unset handling
            for (let item of value) {
                if (item) result.push(items.find(i => props.getId(i) === item))
            }
            break
        }
        result.sort((a, b) => props.getName(a).localeCompare(props.getName(b)))
        if(props.onChange) props.onChange(result)
    }

    let values = props.value.map(props.getId)
    if(values.length === items.length) values.push(0)
    return (
        <FormControl sx={{ ml: 1, mt:1, width: 270 }}>
            <InputLabel size="small">Category</InputLabel>
            <Select
                multiple
                value={values}
                onChange={handleChange}
                input={<OutlinedInput size="small" label="Category" />}
                renderValue={(selected) => {
                    return props.value.length === items.length ? ALL :
                        selected.map(i =>{
                    return i ? props.getName(items.find(it=> props.getId(it)===i)) : ALL
                }).join(', ')}}
                MenuProps={MenuProps}
                size="small"
                sx={{width: 270}}
            >
                <MenuItem key='k-all' value={0}>
                    <Checkbox checked={props.value.length === items.length} />
                    <ListItemText primary={ALL} />
                </MenuItem>
                {items.map(it => {
                    const id = props.getId(it)
                    const name = props.getName(it)
                    return (
                        <MenuItem key={`cf-mi-key-${id}`} value={id} >
                            <Checkbox checked={!!props.value.find(i=> props.getId(i) === id)}/>
                            <ListItemText primary={name}/>
                        </MenuItem>
                    )
                }
                )}
            </Select>
        </FormControl>
    )
}

export function MonthlyDashboard(props) {
    const auth = useAuth()

    const [firstMonth, setFirstMonth] = useState(moment().startOf("month"))
    const [categories, setCategories] = useState([])
    const [allCategories, setAllCategories] = useState([])
    const [catData, setCatData] = useState(null)

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
        console.log("GOT DATA", data)
        let filtered = filterExpensesByCategories(data.expenses, categories)
        console.log("FILTERED", filtered)
        const grouped = groupByTopCategoryAndYear(filtered, [{name: firstMonth.format('YYYY'), color: "#8884d8"}])
        console.log("GRP", grouped)
        setCatData(grouped)
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

    return (
        <>
            <Grid item xs={12} md={12} sx={{display: 'flex', justifyContent: 'flex-end', flexWrap: 'wrap'}} className="monthly-filters">
                <MonthlyFilter value={firstMonth} onChange={setFirstMonth}/>
                <CategoryFilter value={categories} onChange={setCategories} items={allCategories} getId={(it)=>it.id} getName={(it)=>it.name}/>
            </Grid>
            <DashboardCard xs={12} md={8}>
                <CategorySummaryChart data={catData}/>
            </DashboardCard>
        </>
    )
}