import React, {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, Grid} from "@mui/material";
import {Event} from "../../contexts/event/Event"
import Typography from "@mui/material/Typography";
import {getCurrentWeek, getSaturdayOfCurrentWeek, getSundayOfCurrentWeek} from "../../utils/DateUtils";
import {CalendarService} from "../../services/CalendarService";
import {useNavigate} from "react-router-dom";
import Box from "@mui/material/Box";
import {isEmpty} from "radash";
import LoadingBackDrop from "../backdrops/LoadingBackDrop";
import FloatingAddButton from "../FloatingAddButton";
import EventDrawer from "./EventDrawer";
import {UserService, UserSetting} from "../../services/UserService";

const WeeklyCalendar = () => {

    const [weeklyEvents, setWeeklyEvents] = useState<Map<number, Event[]>>(new Map());
    const [calendarColors, setCalendarColors] = useState<any>({});
    const navigate = useNavigate();
    const [currentWeek, setCurrentWeek] = useState<any>({});
    const [backdropOpen, setBackdropOpen]: any = useState(false);
    // const [openEventModal, setOpenEventModal] = useState(false)
    const [openEventInfoDrawer, setOpenEventInfoDrawer] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState({} as Event)
    const [userSetting, setUserSettings] = useState<UserSetting>({} as UserSetting)

    useEffect(() => {
        refreshEvents()
    }, [currentWeek, calendarColors])

    useEffect(() => {

        setCurrentWeek(getCurrentWeek());

        UserService.userSettings().then(userSettingsResponse => {
            setUserSettings(userSettingsResponse)
        });

        CalendarService.getCalendarColors().then(calendarColors => {
            setCalendarColors(calendarColors);
        }).catch(error => {
            console.log(error);
        })
    }, [])

    const refreshEvents = () => {
        const sunday = getSundayOfCurrentWeek();
        const saturday = getSaturdayOfCurrentWeek();

        if (isEmpty(sunday) || isEmpty(saturday)) return;

        setBackdropOpen(true)
        CalendarService.getCalendarEvents(sunday.toISOString(), saturday.toISOString()).then((events: Map<number, Event[]>) => {
            console.log("********** CALENDARD EVENTS")

            // let keys = events.keys();
            UserService.userSettings().then(userSettingsResponse => {
                events.forEach((values, key) => {
                    console.log(values, key)
                    for (var profile of userSettingsResponse?.profiles) {
                        for (var event of values) {
                            if (profile.id == event?.assigneeId) {
                                console.log("assignee color:" + profile.color)
                                event.assigneeColor = profile.color
                                event.assigneeInitials = profile.name
                            }
                        }
                    }
                })
                setWeeklyEvents(events);
            })
        }).catch(error => {
            console.log(error)
        }).finally(() => {
            setBackdropOpen(false)
        })
    }
    const extractWeeklyEvents = (day: number) => {
        return weeklyEvents.has(day) ? weeklyEvents.get(day) : [];
    }

    const extractEndTime = (event: Event) => {
        const endDate = new Date(event.end.dateTime);

        const endHours = (endDate.getHours() % 13 == 0) ? 1 : endDate.getHours() % 13;
        const endHoursAMPM = endDate.getHours() >= 12 ? 'PM' : 'AM';

        return (<>
                {endHours}:{endDate.getMinutes().toString().padStart(2, '0')} {endHoursAMPM}
            </>
        )
    }
    const extractStartTime = (event: Event) => {
        const startDate = new Date(event.start.dateTime);
        const startHours = (startDate.getHours() % 13 == 0) ? 1 : startDate.getHours() % 13;
        const startHoursAMPM = startDate.getHours() >= 12 ? 'PM' : 'AM';

        return (
            <>
                {startHours}:{startDate.getMinutes().toString().padStart(2, '0')} {startHoursAMPM}
            </>
        )
    }

    const formatEventCard = (event: Event) => {
        let color = event.assigneeColor || 'lightgray';
        if (event.colorId !== null && event.colorId !== undefined) {
            if (calendarColors) {
                color = calendarColors?.[event.colorId]?.background
            }
        }
        return (
            <Card sx={{width: '100%', marginBottom: '10px'}} onClick={() => {
                setSelectedEvent(event)
                setOpenEventInfoDrawer(true)
            }}>
                <CardHeader
                    sx={{padding: '5px', backgroundColor: color}}
                    titleTypographyProps={{textAlign: 'left', fontSize: '1rem'}}
                    subheaderTypographyProps={{textAlign: 'left', fontSize: '0.8rem'}}
                    title={extractStartTime(event)}
                    subheader={extractEndTime(event)}
                />
                <CardContent sx={{padding: '8px', textAlign: 'left'}}>
                    <Typography variant="body2" color="text.secondary">
                        {event.summary ? event.summary : "No Title"}<br/>
                        {event.description}
                        {event.assigneeInitials} - {event.assigneeColor}
                    </Typography>
                </CardContent>

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
                                    <Typography
                                        sx={{display: "inline-block", textAlign: 'right', pr: '1vw', fontSize: 30}}>
                                        {dayInfo?.day}
                                    </Typography>
                                    <Typography
                                        sx={{display: "inline-block", textAlign: 'right', pr: '1vw', fontSize: 15}}>
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
            {/*<EventModal open={openEventModal} handleClose={() => {*/}
            {/*    setOpenEventModal(false)*/}
            {/*    refreshEvents()*/}
            {/*}}*/}
            {/*            event={null}*/}
            {/*            handleCancel={() => {*/}
            {/*                setOpenEventModal(false)*/}
            {/*            }}*/}
            {/*/>*/}
            <FloatingAddButton setOpen={() => setOpenEventInfoDrawer(true)}/>
            <EventDrawer open={openEventInfoDrawer}
                         userSetting={userSetting}
                         event={selectedEvent}
                         handleCancel={() => {
                             console.log("cancel")
                             setOpenEventInfoDrawer(false)
                             setSelectedEvent({} as Event)
                         }}
                         handleClose={() => {
                             console.log("close")
                             setOpenEventInfoDrawer(false)
                             setSelectedEvent({} as Event)
                         }}
            />
        </div>
    );
};

export default WeeklyCalendar;