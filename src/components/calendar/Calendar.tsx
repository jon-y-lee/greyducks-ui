import React, {useEffect, useState} from 'react';
import {Card, CardContent, Grid} from "@mui/material";
import {Event} from "../../contexts/event/Event"
import Typography from "@mui/material/Typography";
import {getSaturdayOfCurrentWeek, getSundayOfCurrentWeek} from "../../utils/DateUtils";
import {GoogleCalendarService} from "../../services/GoogleCalendarService";
import {WEEK_INFO} from "../Constants";

const Calendar = () => {

    const [weeklyEvents, setWeeklyEvents] = useState<Map<number, Event[]>>(new Map());

    let sunday = getSundayOfCurrentWeek();
    let saturday = getSaturdayOfCurrentWeek();

    useEffect(() => {
        GoogleCalendarService.getCalendarEvents(sunday, saturday).then((events) => {
            return setWeeklyEvents(events);
        }).catch(error => {
            console.log(error)
        })
    }, [])

    const extractWeeklyEvents = (day: number) => {
        return weeklyEvents.has(day) ? weeklyEvents.get(day) : [];
    }

    const formatEventCard = (event: Event) => {
        return (
            <Card sx={{display: 'flex', marginBottom: '10px', backgroundColor: 'pink'}}>
                <CardContent sx={{flex: 'auto'}}>
                    <Typography sx={{fontSize: 12}} color="text.secondary">
                        {new Date(event.start.dateTime).toLocaleTimeString()} -
                        {new Date(event.end.dateTime).toLocaleTimeString()}
                    </Typography>
                    <Typography variant="body2">
                        <>
                            {event.summary}
                            {event.description}
                        </>
                    </Typography>
                </CardContent>
            </Card>
        )
    }

    return (
        <div>
            <br/>
            <div>
                <h2>My Schedule</h2>
                <Grid container spacing={1} sx={{padding: '6px'}}>
                    {
                        WEEK_INFO.map(weekInfo => {
                            return (<Grid item xs={12} sm={12} md={12 / 7}>
                                    <Typography sx={{fontSize: 18}}>
                                        {weekInfo?.displayName}
                                    </Typography>
                                    {
                                        extractWeeklyEvents(weekInfo?.id)?.map((event: Event) => {
                                            return formatEventCard(event);
                                        })
                                    }
                                </Grid>
                            )
                        })
                    }
                </Grid>
            </div>
        </div>
    );
};

export default Calendar;