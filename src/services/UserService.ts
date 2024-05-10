import axios from "axios";
import {UserAuthentication} from "../contexts/auth/AuthContext";
import {LOCAL_STORE_KEYS} from "../components/Constants";
import {BASE_API_URI} from "./ServiceConstants";

const API_URL = BASE_API_URI

export interface UserSetting {
    id: string,
    name: string,
    email: string,
    profiles: Profile[]
}

export interface Profile {
    id: string,
    name: string,
    color: string
}

export const UserService = {

    async userInfo(access_token: string) {
        return axios
            .get(API_URL + "profile", {
                headers: {
                    Authorization: `Bearer ` + access_token,
                    Accept: 'application/json'
                }
            })
            .then((res) => {
                // console.log("User found " + JSON.stringify(res.data))
                const userPrinciple = {
                    name: res.data?.name,
                    token: access_token,
                    email: res.data?.email,
                    id: res.data?.email,
                    given_name: res.data?.given_name,
                    family_name: res.data?.family_name,
                    picture: res.data?.picture,
                }

                console.log("User found " + JSON.stringify(userPrinciple))
                return userPrinciple;
            })
    },

    async userSettings() {
        return axios
            .get(API_URL + "settings", {
                headers: {
                    Accept: 'application/json'
                }
            })
            .then((res) => {
                return res.data as UserSetting
            })
    },

    async saveUserProfile(profile: Profile) {
        return axios
            .put(API_URL + "settings/profiles", JSON.stringify(profile),{
                headers: {
                    Accept: 'application/json',
                    "Content-Type": 'application/json'
                },
            })
            .then((res) => {
                return res.data as UserSetting
            })
    },

    deleteUserProfile(profile: Profile) {
        return axios
            .delete(API_URL + "settings/profiles/" + profile.id,{
                headers: {
                    Accept: 'application/json',
                    "Content-Type": 'application/json'
                },
            })
            .then((res) => {
                return res.data as UserSetting
            })

    }
};