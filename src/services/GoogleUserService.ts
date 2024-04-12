import axios from "axios";

const GOOGLE_USER_INFO_URI = 'https://www.googleapis.com/oauth2/v1/userinfo?access_token='
export const GoogleUserService = {

    async userInfo(access_token: string) {
        console.log("Requestiong user info:" + access_token)
        return axios
            .get(GOOGLE_USER_INFO_URI + access_token, {
                headers: {
                    Authorization: `Bearer ` + access_token,
                    Accept: 'application/json'
                }
            })
            .then((res) => {
                const userPrinciple = {
                    name: res.data?.name,
                    token: access_token,
                    email: res.data?.email,
                    id: res.data?.email,
                    given_name: res.data?.given_name,
                    family_name: res.data?.family_name,
                    picture: res.data?.picture,
                }
                return userPrinciple;
            })
    },
};