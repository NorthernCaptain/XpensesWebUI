import {Box, Divider, List, ListItem, ListItemAvatar, ListItemText, Paper, Typography, Skeleton} from "@mui/material";
import Avatar from "../Avatar";
import React from "react";

export function ExpenseCard({item}) {
    return (
        <Paper elevation={4} sx={{p: 2, mb: 1, mt: 1}}>
            <Box sx={{display: "flex", alignItems: "center", justifyContent: "space-between"}} mr={2}>
                <Typography variant="h6" color="textPrimary" sx={{alignSelf: "center", textAlign: "start", fontWeight: "normal"}}>{item.name}</Typography>
                <Typography variant="h6" color="textPrimary" sx={{alignSelf: "center", textAlign: "end"}}>${item.amount}</Typography>
            </Box>
            <List>
                {item.items.map((it, idx) =>
                    <Box key={`ex-card-${idx}`}>
                    <ListItem secondaryAction={
                        <Typography variant="body" color="textSecondary" >${Math.round(it.amount/10)/10}</Typography>
                    }>
                        <ListItemAvatar>
                            <Avatar width="32px" name={it.user.short_name}/>
                        </ListItemAvatar>
                        <ListItemText
                            primary={it.category.parent ? `${it.category.parent.name}/${it.category.name}` : it.category.name}
                            secondary={it.description}
                        />
                    </ListItem>
                    {idx+1 !== item.items.length && <Divider variant="middle" component="li" />}
                    </Box>
                )}
            </List>
        </Paper>
    )
}

export function SkeletonExpenseCard({lines = 3}) {
    let item = { items: []}
    for(let i = 0;i< lines;i++) {
        item.items.push(i)
    }

    return (
        <Paper elevation={4} sx={{p: 2, mb: 1, mt: 1}}>
            <Box sx={{display: "flex", alignItems: "center", justifyContent: "space-between"}} mr={2}>
                <Typography variant="h6" color="textPrimary" sx={{alignSelf: "center", textAlign: "start", fontWeight: "normal", width: "80%"}}><Skeleton/></Typography>
                <Typography variant="h6" color="textPrimary" sx={{alignSelf: "center", textAlign: "end", width: "10%"}}><Skeleton/></Typography>
            </Box>
            <List>
                {item.items.map((it, idx) =>
                    <Box key={`ex-card-${idx}`}>
                        <ListItem secondaryAction={
                            <Typography variant="body" color="textSecondary" ><Skeleton/></Typography>
                        }>
                            <ListItemAvatar>
                                <Skeleton variant="circular" width={32} height={32}/>
                            </ListItemAvatar>
                            <ListItemText
                                primary={<Skeleton/>}
                                secondary={<Skeleton/>}
                            />
                        </ListItem>
                        {idx+1 !== item.items.length && <Divider variant="middle" component="li" />}
                    </Box>
                )}
            </List>
        </Paper>
    )
}
