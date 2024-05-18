import React, {useEffect, useState} from 'react';
import {Avatar, Card, CardActionArea, CardContent, CardHeader, Grid} from "@mui/material";
import {Event} from "../../contexts/event/Event"
import Typography from "@mui/material/Typography";
import {getWeekHeaderInfo} from "../../utils/DateUtils";
import {CalendarService} from "../../services/CalendarService";
import LoadingBackDrop from "../backdrops/LoadingBackDrop";
import FloatingAddButton from "../FloatingAddButton";
import EventDrawer from "./EventDrawer";
import {UserService, UserSetting} from "../../services/UserService";
import {addDays, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, startOfMonth, startOfWeek} from 'date-fns';

interface MonthlyCalendarInterface {
    date?: Date
}

const MonthlyCalendar = (monthlyCalendarInterface: MonthlyCalendarInterface) => {

    const {date} = monthlyCalendarInterface;
    const [monthlyEvents, setMonthlyEvents] = useState<Map<number, Event[]>>(new Map());
    const [calendarColors, setCalendarColors] = useState<any>({});
    const [currentMonth, setCurrentMonth] = useState<any>(new Date());
    const [backdropOpen, setBackdropOpen]: any = useState(false);
    const [openEventInfoDrawer, setOpenEventInfoDrawer] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState({} as Event)
    const [userSetting, setUserSettings] = useState<UserSetting>({} as UserSetting)

    useEffect(() => {
        setMonthlyEvents(new Map())
        refreshEvents()
    }, [currentMonth, calendarColors])

    useEffect(() => {
        setCurrentMonth(date)

        UserService.userSettings().then(userSettingsResponse => {
            setUserSettings(userSettingsResponse)
        });

        CalendarService.getCalendarColors().then(calendarColors => {
            setCalendarColors(calendarColors);
        }).catch(error => {
            console.log(error);
        })

        refreshEvents()
    }, [date])

    const refreshEvents = () => {
        setMonthlyEvents(new Map())
        if (date != null || date != undefined) {
            const start = startOfMonth(date)
            const end = endOfMonth(date)

            CalendarService.getCalendarEvents(start.toISOString(), end.toISOString()).then((events: Map<number, Event[]>) => {

                // let keys = events.keys();
                UserService.userSettings().then(userSettingsResponse => {
                    events.forEach((values, key) => {
                        for (var profile of userSettingsResponse?.profiles) {
                            for (var event of values) {
                                if (profile.id == event?.assigneeId) {
                                    event.assigneeId = profile.id
                                    event.assigneeColor = profile.color
                                    event.assigneeInitials = profile.name
                                }
                            }
                        }
                    })
                    setMonthlyEvents(events);
                })
            }).catch(error => {
                console.log(error)
            }).finally(() => {
                setBackdropOpen(false)
            })
        }
    }

    const renderDateColor = (day: number, date: Date, currentMonth: number) => {
        if (isSameDay(day, date)) {
            return 'darkolivegreen'
        }
        if (isSameMonth(day, currentMonth)) {
            return '#ffffff'
        } else {
            return '#f0f0f0'
        }
    }

    const renderDays = () => {
        const days = [];
        const date = new Date();
        const startDate = startOfWeek(startOfMonth(currentMonth));
        const endDate = endOfWeek(endOfMonth(currentMonth));

        let day = startDate;

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                const formattedDate = format(day, 'd');
                const cloneDay = day;
                days.push(
                    <Grid item xs={12} md={12 / 7} key={day} onClick={() => console.log(cloneDay)}>
                        <Card sx={{width: {md: '100%'}, marginBottom: '10px', height: {md: '12vh'}}} onClick={() => {
                        }}>
                            <CardHeader
                                avatar={
                                    <Avatar sx={{
                                        bgcolor: renderDateColor(day, date, currentMonth),
                                        color: isSameDay(day, date) ? 'white' : '#000000',
                                    }} aria-label="recipe">
                                        {formattedDate}
                                    </Avatar>
                                }

                                sx={{
                                    padding: '5px',
                                }}
                                titleTypographyProps={{textAlign: 'left', fontSize: '1rem'}}
                                subheaderTypographyProps={{textAlign: 'left', fontSize: '0.8rem'}}
                                title={''}
                                subheader={''}
                            />
                            <CardContent sx={{padding: '8px', textAlign: 'left'}}>

                                {monthlyEvents.has(day.getDate()) ?
                                    monthlyEvents.get(day.getDate())?.map((evt) => {
                                        return (
                                            <Card
                                                sx={{backgroundColor: evt.assigneeColor ? evt.assigneeColor : 'lightgray'}}>
                                                <CardActionArea onClick={() => {
                                                    setSelectedEvent(evt)
                                                    setOpenEventInfoDrawer(true)
                                                }}>
                                                    {evt.summary}
                                                </CardActionArea>
                                            </Card>
                                        )
                                    })
                                    // <>aa</>
                                    :
                                    <></>
                                }
                            </CardContent>

                        </Card>
                    </Grid>
                );
                day = addDays(day, 1);
            }
        }

        return days;
    };

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

    const headerInfo = getWeekHeaderInfo();
    var dayIndex = Array(7).fill(0).map(Number.call, Number)

    return (
        <div>
            <div>
                <Grid container spacing={0} sx={{padding: '6px'}}>
                    {
                        dayIndex.map((index, v) => {
                            return (<Grid item xs={3} sm={3} md={12 / 7} lg={12 / 7}>
                                <Typography
                                    sx={{
                                        display: {xs: "none", sm: "inline-block"},
                                        textAlign: 'right',
                                        pr: '1vw',
                                        fontSize: 30
                                    }}>
                                    {headerInfo[v].day}
                                </Typography>
                            </Grid>)
                        })
                    }
                </Grid>
                <Grid container spacing={0} sx={{padding: '6px'}}>
                    {renderDays()}
                </Grid>
            </div>
            <LoadingBackDrop
                isOpen={backdropOpen}/>
            <FloatingAddButton setOpen={() => setOpenEventInfoDrawer(true)}/>
            <EventDrawer open={openEventInfoDrawer}
                         userSetting={userSetting}
                         event={selectedEvent}
                         handleCancel={() => {
                             setOpenEventInfoDrawer(false)
                             setSelectedEvent({} as Event)
                         }}
                         handleClose={() => {
                             setOpenEventInfoDrawer(false)
                             setSelectedEvent({} as Event)
                         }}
            />
        </div>
    );
};

export default MonthlyCalendar;