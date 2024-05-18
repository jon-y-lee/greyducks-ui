import WeeklyCalendar from "./WeeklyCalendar";
import React, {useEffect, useState} from "react";
import Typography from "@mui/material/Typography";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import IconButton from "@mui/material/IconButton";
import {Chip, Grid, Slider} from "@mui/material";
import MonthlyCalendar from "./MonthlyCalendar";
import {UserService, UserSetting} from "../../services/UserService";
import Profile from "../Profile";
import {Profiler} from "inspector";
import Test from "./test";

const Calendar = () => {

    const [date, setDate] = useState(new Date())
    const [calendarScope, setCalendarScope] = useState(0)
    const [profiles, setProfiles] = useState(Array.of() )

    useEffect(() => {
        UserService.userSettings().then((userSettingsResponse: UserSetting) => {
            console.log("test test user settings:" + JSON.stringify(userSettingsResponse))
            console.log("test test profiles settings:" + JSON.stringify(userSettingsResponse.profiles))
            setProfiles(userSettingsResponse.profiles)
            userSettingsResponse.profiles.map((prof) => {
                console.log("test test profiles settings:" + JSON.stringify(prof))
            })
        });

    }, [])
    const marks = [
        {
            value: 0,
            label: 'Week',
        },
        {
            value: 100,
            label: 'Month',
        },
    ];

    function valuetext(value: number) {
        return `${value}°C`;
    }

    // @ts-ignore
    return (
        <>
            <Grid container>
                <Grid item xs={12} md={3}>
                    <Slider
                        sx={{width: '40%', ml: '10%', mr: '10%'}}
                        defaultValue={0}
                        getAriaValueText={valuetext}
                        step={100}
                        marks={marks}
                        onChange={(event, value) => {
                            setCalendarScope(value as number)
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>

                    <div style={{display: 'inline'}}>
                        <IconButton onClick={() => {
                            console.log("previous")
                            const prev = new Date(date);
                            if (calendarScope == 50) {
                                prev.setDate(date.getDate() - 7);
                            } else if (calendarScope == 100) {
                                prev.setMonth(date.getMonth() - 1);
                            }

                            setDate(prev);
                        }}>
                            <ArrowBackIosIcon/>
                        </IconButton>
                        <Typography sx={{display: 'inline'}} textAlign={"center"} variant={"h3"} pl={'5vw'}
                                    pr={'5vw'}>{date.toLocaleString('en-us',
                            {
                                month: 'long'
                            })}

                        </Typography>
                        <IconButton onClick={() => {
                            const prev = new Date(date);
                            if (calendarScope == 50) {
                                prev.setDate(date.getDate() + 7);
                            } else if (calendarScope == 100) {
                                prev.setMonth(date.getMonth() + 1);
                            }
                            setDate(prev);
                        }}>
                            <ArrowForwardIosIcon/>

                        </IconButton>


                    </div>
                </Grid>
                <Grid item xs={12} md={3}>
                    {profiles.map((p: any) => {
                        // let prof = JSON.parse(p)
                        // let prof = JSON.parse(p);
                        // console.log("t: " + (typeof prof))
                        // return <> {JSON.stringify(p.name)}</>
                        return <Chip label={p.name} sx={{backgroundColor: p.color}}/>

                    })}
                </Grid>
            </Grid>
            {calendarScope == 0 ?
                <WeeklyCalendar date={date}/>
                : calendarScope == 100 ?
                    <MonthlyCalendar date={date}/> : <></>
            }
            {/*<Test/>*/}
        </>

    )
}

export default Calendar