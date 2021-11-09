import {Checkbox, FormControl, InputLabel, ListItemText, MenuItem, OutlinedInput, Select} from "@mui/material";
import React from "react";

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

export function CategoryFilter(props) {
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
