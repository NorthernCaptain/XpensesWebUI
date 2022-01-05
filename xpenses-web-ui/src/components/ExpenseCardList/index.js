import Grid from "@mui/material/Grid";
import {Box} from "@mui/material";
import {ExpenseCard, SkeletonExpenseCard} from "../ExpenseCard";
import {ExpenseMonthSummary} from "../ExpenseMonthSummary";
import React, {useMemo} from "react";
import {AutoSizer, CellMeasurer, CellMeasurerCache, List, WindowScroller} from 'react-virtualized';
import 'react-virtualized/styles.css';

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


export function ExpenseCardList({data, isMedium, isLoading, version}) {
    const cacheF = useMemo(() => {
        return new CellMeasurerCache({
            defaultHeight: 150,
            fixedWidth: true
        })
    }, [version])

    let expenseSX = isMedium ?
        {
            maxHeight: "calc(100vh - 138px)",
            height: "calc(100vh - 138px)",
            overflow: "hidden",
        } :
        { height: "100vh", overflow: "hidden" }

    function rowRenderer({index, isScrolling, key, parent, style}) {
        const it = data[index] // This comes from your list data

        return (
            <CellMeasurer
                cache={cacheF}
                columnIndex={0}
                key={key}
                parent={parent}
                rowIndex={index}
            >
                {({measure, registerChild}) => (
                    // 'style' attribute required to position cell (within parent List)
                    <div ref={registerChild} style={style}>
                        {it.items ? <ExpenseCard key={`expense-card-${it.name}`} item={it}/>
                            : <ExpenseMonthSummary key={`expense-sum-${it.name}`} item={it}/>
                        }
                    </div>
                )}
            </CellMeasurer>
        );
    }


    if (isLoading) {
        return <Grid item xs={12} md={8}>
            <Box sx={expenseSX}>
                {[2, 3, 2, 2].map((it, idx) =>
                    <SkeletonExpenseCard key={`skeleton-card-${idx}`} lines={it}/>)}
            </Box>
        </Grid>
    }

    if (!data) return null;

    return <Grid item xs={12} md={8} sx={{position: "relative"}}>
        <Box sx={expenseSX}>
            <AutoSizer>
                {({width, height}) => {
                    return <List
                        key={`exp-list-${version}`}
                        width={width}
                        height={height}
                        rowCount={data.length}
                        overscanRowCount={6}
                        deferredMeasurementCache={cacheF}
                        rowHeight={cacheF.rowHeight}
                        rowRenderer={rowRenderer}
                    />
                }}
            </AutoSizer>
        </Box>
        <DimOut isTop={true} show={true}/>
        <DimOut isTop={false} show={isMedium}/>
    </Grid>
}
