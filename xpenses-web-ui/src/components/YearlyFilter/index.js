import moment from "moment";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import React from "react";

export function YearFilter(props) {
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
                [curYear-5,curYear-4,curYear-3,curYear-2,curYear-1,curYear].map(
                    year => <ToggleButton key={`ytb-${props.id}-${year}`} value={`${year}`}>{year}</ToggleButton>)
            }
        </ToggleButtonGroup>
    )
}

