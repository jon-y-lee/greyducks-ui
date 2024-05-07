import React, {useEffect, useState} from 'react';
import {Backdrop, Card, CardActions, CardContent, CardHeader, CircularProgress, Grid} from "@mui/material";
import {Event} from "../../contexts/event/Event"
import Typography from "@mui/material/Typography";
import {getCurrentWeek, getSaturdayOfCurrentWeek, getSundayOfCurrentWeek} from "../../utils/DateUtils";
import {GoogleCalendarService} from "../../services/GoogleCalendarService";
import EditIcon from '@mui/icons-material/Edit';
import {useNavigate} from "react-router-dom";
import Box from "@mui/material/Box";
import {isEmpty} from "radash";
import LoadingBackDrop from "../backdrops/LoadingBackDrop";
import RecipeModal from "../recipes/RecipeModal";
import EventModal from "./EventModal";
import FloatingAddButton from "../FloatingAddButton";

const WeeklyCalendar = () => {

    const [weeklyEvents, setWeeklyEvents] = useState<Map<number, Event[]>>(new Map());
    const [calendarColors, setCalendarColors] = useState<any>({});
    const navigate = useNavigate();
    const [currentWeek, setCurrentWeek] = useState<any>({});
    const [backdropOpen, setBackdropOpen]: any = useState(false);
    const [openEventModal, setOpenEventModal] = useState(false)

    useEffect(() => {
        // const sunday = currentWeek['0']?.isoString;
        // const saturday = currentWeek['6']?.isoString;
        const sunday = getSundayOfCurrentWeek();
        const saturday = getSaturdayOfCurrentWeek();

        if (isEmpty(sunday) || isEmpty(saturday)) return;
        console.log("Sunday:" + sunday)
        console.log("saturday:" + saturday)
        setBackdropOpen(true)
        GoogleCalendarService.getCalendarEvents(sunday.toISOString(), saturday.toISOString()).then((events) => {
            return setWeeklyEvents(events);
        }).catch(error => {
            console.log(error)
        }).finally(() => {
            setBackdropOpen(false)
        })

    }, [currentWeek, calendarColors])

    useEffect(() => {

        setCurrentWeek(getCurrentWeek());

        GoogleCalendarService.getCalendarColors().then(calendarColors => {
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
                <CardActions sx={{
                    alignSelf: "stretch",
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "flex-start",
                    p: '8px',
                    pt: '0px',
                    pb: '4px'
                }} disableSpacing>
                    <EditIcon fontSize={"small"} sx={{opacity: '30%'}}/>
                </CardActions>

            </Card>
        )
    }

    return (
        <div>
            <Typography textAlign={"center"} variant={"h3"} pl={'5vw'}>{new Date().toLocaleString('en-us',
                {
                    month: 'long'
                })}</Typography>
            <br/>
            <div>
                <Grid container spacing={0} sx={{padding: '6px'}}>
                    {
                        Object.keys(currentWeek).map((dayId) => {
                            const dayInfo = currentWeek[dayId]
                            return (<Grid item xs={12} sm={3} md={12 / 7} lg={12 / 7}>
                                    <Typography sx={{display: "inline-block", textAlign: 'right', pr: '1vw', fontSize: 30}}>
                                        {dayInfo?.day}
                                    </Typography>
                                    <Typography sx={{display: "inline-block", textAlign: 'right', pr: '1vw', fontSize: 15}} >
                                       {dayInfo?.date}
                                    </Typography>
                                    <Box sx={{p: '0.2vw', height: '100vh', overflow: 'scroll'}}>
                                    {
                                        extractWeeklyEvents(dayInfo?.id)?.map((event: Event) => {
                                            return formatEventCard(event);
                                        })
                                    }
                                    </Box>
                                </Grid>
                            )

                        })
                    }
                </Grid>
            </div>
            <LoadingBackDrop
                isOpen={backdropOpen}/>
            <EventModal open={openEventModal} handleClose={() => {
                setOpenEventModal(false)
                // setRecipe(null)
                // refreshRecipes()

            }}
                        event={null}
            />
            <FloatingAddButton setOpen={() => setOpenEventModal(true)}/>

        </div>
    );
};

export default WeeklyCalendar;