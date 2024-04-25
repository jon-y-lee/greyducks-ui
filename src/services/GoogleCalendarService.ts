import {UserAuthentication} from "../contexts/auth/AuthContext";
import axios from "axios";
import {Event} from "../contexts/event/Event";
import {LOCAL_STORE_KEYS} from "../components/Constants";

const GOOGLE_CALENDAR_EVENTS_URI = 'https://www.googleapis.com/calendar/v3/calendars/primary/events'
const GOOGLE_CALENDAR_COLORS_URI = 'https://www.googleapis.com/calendar/v3/colors'
const API_URL = 'http://localhost:8081/events'

export const GoogleCalendarService = {

    async getCalendarColors() {

        let userContext: UserAuthentication | null = null;
        const userPrincipleString = localStorage.getItem(LOCAL_STORE_KEYS.USER_PRINCIPLE);
        if (userPrincipleString != null) {
            userContext = JSON.parse(userPrincipleString);
        }

        if (userContext) {
            return axios
                .get(GOOGLE_CALENDAR_COLORS_URI, {
                    headers: {
                        Authorization: `Bearer ${userContext.token}`,
                        Accept: 'application/json'
                    }
                })
                .catch(error => {
                    if (error?.response?.status == 401) {
                        throw error;
                    }
                })
                .then((res) => {

                    let colorMap = [];

                    for (const key in res?.data?.calendar) {
                        // Get the strongly typed value with this name:
                        const value = res?.data?.calendar[key];
                        colorMap.push(value)
                    }

                    console.log("ColorMap:" + JSON.stringify(colorMap))

                    return colorMap;
                })
        }
        return null
    },

    async getCalendarEvents(startDate: String, endDate: String) {

        let userContext: UserAuthentication | null = null;
        const userPrincipleString = localStorage.getItem(LOCAL_STORE_KEYS.USER_PRINCIPLE);
        if (userPrincipleString != null) {
            userContext = JSON.parse(userPrincipleString);
        }

        if (userContext) {
            return axios
                .get(API_URL + `?startTime=` +
                    startDate + '&endTime=' + endDate, {
                    headers: {
                        Authorization: `Bearer ${userContext.token}`,
                        Accept: 'application/json'
                    }
                })
                .catch(error => {
                    if (error?.response?.status == 401) {
                        throw error;
                    }
                })
                .then((res) => {
                    const weeklyEventMap = new Map<number, Event[]>();
                    res?.data['items'].map((item: any) => {
                        const startDateTime = new Date(item.start.dateTime);
                        const endDateTime = new Date(item.start.dateTime);
                        const startDate = startDateTime.getDay();

                        let eventList = weeklyEventMap.get(startDate);

                        if (eventList == null) {
                            eventList = new Array<Event>();
                            eventList.push(item)
                        } else {
                            eventList.push(item)
                        }
                        weeklyEventMap.set(startDate, eventList)
                    });

                    return weeklyEventMap;
                })

        }
        return new Map()
    },
};