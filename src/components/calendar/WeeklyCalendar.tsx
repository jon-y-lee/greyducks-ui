import React, {useEffect, useState} from 'react';
import {Card, CardActions, CardContent, CardHeader, Grid} from "@mui/material";
import {Event} from "../../contexts/event/Event"
import Typography from "@mui/material/Typography";
import {getCurrentWeek} from "../../utils/DateUtils";
import {GoogleCalendarService} from "../../services/GoogleCalendarService";
import EditIcon from '@mui/icons-material/Edit';
import {useNavigate} from "react-router-dom";

const WeeklyCalendar = () => {

    const [weeklyEvents, setWeeklyEvents] = useState<Map<number, Event[]>>(new Map());
    const [calendarColors, setCalendarColors] = useState<any>({});
    const navigate = useNavigate();
    const [currentWeek, setCurrentWeek] = useState<any>({});

    useEffect(() => {
        const sunday = currentWeek['0']?.isoString;
        const saturday = currentWeek['6']?.isoString;

        GoogleCalendarService.getCalendarEvents(sunday, saturday).then((events) => {
            return setWeeklyEvents(events);
        }).catch(error => {
            console.log(error)
        })

    }, [currentWeek])

    useEffect(() => {

        setCurrentWeek(getCurrentWeek());

        GoogleCalendarService.getCalendarColors().then(calendarColors => {
            console.log(calendarColors)
            setCalendarColors(calendarColors);
        }).catch(error => {
            console.log(error);
        })
    }, [])

    const extractWeeklyEvents = (day: number) => {
        return weeklyEvents.has(day) ? weeklyEvents.get(day) : [];
    }

    const extractEndTime = (event: Event) => {
        const endDate = new Date(event.end.dateTime);

        const endHours = endDate.getHours() % 12;
        const endHoursAMPM = endDate.getHours() >= 12 ? 'PM' : 'AM';

        return (<>
                {endHours}:{endDate.getMinutes()} {endHoursAMPM}
            </>
        )
    }
    const extractStartTime = (event: Event) => {
        const startDate = new Date(event.start.dateTime);

        const startHours = startDate.getHours() % 12;
        const startHoursAMPM = startDate.getHours() >= 12 ? 'PM' : 'AM';

        return (
            <>
                {startHours}:{startDate.getMinutes()} {startHoursAMPM}
            </>
        )
    }

    const formatEventCard = (event: Event) => {

        let color = 'lightgray';

        if (event.colorId !== null && event.colorId !== undefined) {
            if (calendarColors) {
                color = calendarColors?.[event.colorId]?.background
            }
        }
        return (
            <Card sx={{width: '100%', marginBottom: '10px'}}>
                <CardHeader
                    sx={{padding: '5px', backgroundColor: color}}
                    titleTypographyProps={{textAlign: 'left', fontSize: '1rem'}}
                    subheaderTypographyProps={{textAlign: 'left', fontSize: '0.8rem'}}
                    title={extractStartTime(event)}
                    subheader={extractEndTime(event)}
                />
                <CardContent sx={{padding: '8px', textAlign: 'left'}}>
                    <Typography variant="body2" color="text.secondary">
                        {event.summary ? event.summary : "No Title"}
                        {event.description}
                    </Typography>
                </CardContent>
                <CardActions     sx={{
                    alignSelf: "stretch",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "flex-start",
                    p: '8px',
                    pt: '0px',
                    pb: '4px'
                }}disableSpacing>
                    <EditIcon fontSize={"small"} sx={{opacity: '30%'}}/>
                </CardActions>

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
                        Object.keys(currentWeek).map((dayId) => {
                            const dayInfo = currentWeek[dayId]
                            return (<Grid item xs={12} sm={12} md={12 / 7}>
                                    <Typography sx={{fontSize: 18}}>
                                        {dayInfo?.day} {dayInfo?.formattedDate}
                                    </Typography>
                                    {
                                        extractWeeklyEvents(dayInfo?.id)?.map((event: Event) => {
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

export default WeeklyCalendar;