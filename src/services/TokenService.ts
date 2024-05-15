import axios from "axios";
import {BASE_API_URI} from "./ServiceConstants";

const API_URL = BASE_API_URI + 'token'

export const TokenService = {

    async getAccessTokenFromCode(code: String) {
        return axios
            .post(API_URL, {code}, {
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

    async refreshAccessToken(refreshCode: String) {
        return axios
            .post(API_URL + "/refresh", {"refresh_token": refreshCode})
            .catch(error => {
                if (error?.response?.status == 401) {
                    throw error;
                }
            })
            .then((res: any) => {
                console.log("Got Refresh Token From Code: " + JSON.stringify(res.data))
                return res.data;
            })

    },

};