import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';
import {useEffect, useState} from "react";

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const SearchIconBackWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 1),
    height: '100%',
    position: 'absolute',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    right: 0,
    top: 0,
}));

const searchInputDefaultWidth = '12ch'

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: 0,
        '&:focus': {
            width: searchInputDefaultWidth,
        },
        [theme.breakpoints.up('sm')]: {
            width: searchInputDefaultWidth,
            '&:focus': {
                width: '20ch',
            },
        },
    },
}));

export function SearchField({value, onChange}) {
    const [val, setVal] = useState(value)
    const onChangeHandler = (e) => {
        setVal(e.target.value)
    }

    useEffect(() => {
        let timer = setTimeout(() => {
            onChange(val)
        }, 500)
        return () => clearTimeout(timer)
    }, [val])

    let inpSx = val ? {'& .MuiInputBase-input': {width: searchInputDefaultWidth}} : null

    return <Search>
        <SearchIconWrapper>
            <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
            value={val}
            onChange={onChangeHandler}
            sx={inpSx}
        />
        {val && <SearchIconBackWrapper onClick={()=> {setVal(''); onChange(val)}}>
            <CancelIcon fontSize="small" sx={{opacity: 0.8}}/>
        </SearchIconBackWrapper>
        }
    </Search>
}
