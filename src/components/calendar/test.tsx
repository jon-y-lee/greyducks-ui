import {useEffect} from "react";
import {UserService, UserSetting} from "../../services/UserService";


const Test = () => {

    useEffect(() => {
        console.log("Test")
        UserService.userSettings().then((userSettingsResponse: UserSetting) => {
            console.log("test test user settings:" + JSON.stringify(userSettingsResponse))
            console.log("test test profiles settings:" + JSON.stringify(userSettingsResponse.profiles))
            userSettingsResponse.profiles.map((prof) => {
                console.log("test test profiles settings:" + JSON.stringify(prof))
            })
        });

    })

    return (
        <></>
    )
}

export default Test;