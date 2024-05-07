import {getUserContextFromLocalStore, UserAuthentication} from "../contexts/auth/AuthContext";
import axios from "axios";
import {Event} from "../contexts/event/Event";
import {LOCAL_STORE_KEYS} from "../components/Constants";

// const GOOGLE_CALENDAR_EVENTS_URI = 'https://www.googleapis.com/calendar/v3/calendars/primary/events'
// const API_URL = 'https://oauth2.googleapis.com/token'
const API_URL = 'http://localhost:8081/token'

export const GoogleTokenService = {

    async getAccessTokenFromCode(code: String) {
        return axios
            .post(API_URL, {code},{
                headers: {
                    Accept: 'application/json',
                }
            })
            .catch(error => {
                if (error?.response?.status == 401) {
                    throw error;
                }
            })
            .then((res: any) => {

                console.log("Got Toekn From Code: " + JSON.stringify(res.data))
                return res.data;
            })

    },
};