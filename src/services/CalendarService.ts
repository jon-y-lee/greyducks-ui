import axios from "axios";
import {Event} from "../contexts/event/Event";
import {BASE_API_URI} from "./ServiceConstants";

const GOOGLE_CALENDAR_EVENTS_URI = 'https://www.googleapis.com/calendar/v3/calendars/primary/events'
const GOOGLE_CALENDAR_COLORS_URI = 'https://www.googleapis.com/calendar/v3/colors'
const API_URL = BASE_API_URI + 'events'

export const CalendarService = {

    async getCalendarColors() {
        return axios
            .get(GOOGLE_CALENDAR_COLORS_URI, {
                headers: {
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
                    const value = res?.data?.calendar[key];
                    colorMap.push(value)
                }

                return colorMap;
            })

    },

    async getCalendarEvents(startDate: String, endDate: String) {

        return axios
            .get(API_URL + `?startTime=` +
                startDate + '&endTime=' + endDate, {
                headers: {
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
        return new Map()
    },

    async createEvent(event: Event) {
        return axios
            .post(API_URL, event)
            .catch(error => {
                if (error?.response?.status == 401) {
                    throw error;
                }
            })
            .then((res) => {
                console.log("result:" + JSON.stringify(res))
                return res?.data;
            })
    },

    async updateEvent(event: Event) {
        return axios
            .put(API_URL + "/" + event.id, event)
            .catch(error => {
                if (error?.response?.status == 401) {
                    throw error;
                }
            })
            .then((res) => {
                console.log("result:" + JSON.stringify(res))
                return res?.data;
            })
    },

};