import React, {useContext, useEffect, useState} from 'react';
import {AuthContext} from '../../contexts/auth/AuthContext';
import {GoogleTasksService} from "../../services/GoogleTasksService";
import {isEmpty} from "radash";
import {LAUNCH_PROCEDURES_METADATA_TASK_NAME} from "../Constants";
import {UserSetting} from "../../services/UserService";

interface ProfileManagementPros {
    settings: UserSetting | undefined
}

const ProfileManagement: React.FC<ProfileManagementPros> = ({settings}) => {

    const [token, setToken] = useState("");
    const userContext = useContext(AuthContext);

    useEffect(() => {
        const token = userContext?.token ? userContext.token : "";

        const fetchData = async () => {
            const data = await GoogleTasksService.getMetadataTask(token);
            return data
        }

        const metadataTaskList = fetchData();

        console.log("Metadata Task list:" + JSON.stringify(metadataTaskList))

        if (isEmpty(metadataTaskList)) {
            GoogleTasksService.createTaskList(token, LAUNCH_PROCEDURES_METADATA_TASK_NAME).then(res => console.log("Created new defautl task list: " + JSON.stringify(res)))
        }
    }, [])
    return (
        <div>
            asdfasdfasd <br/>{settings?.profiles.map(profile => {
                return <>{profile.name} ---- color ---- {profile.color}<br/></>
        })}
        </div>
    );
};

export default ProfileManagement;
