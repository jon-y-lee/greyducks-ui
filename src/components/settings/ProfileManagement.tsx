import React, {useContext, useEffect, useState} from 'react';
import {AuthContext, getUserContextFromLocalStore} from '../../contexts/auth/AuthContext';
import {Profile, UserSetting} from "../../services/UserService";
import {Button, Card, CardHeader, Grid} from "@mui/material";
import Typography from "@mui/material/Typography";
import AddIcon from '@mui/icons-material/Add'
import ProfileManagementEditModal from "./ProfileManagementEditModal";
import {CalendarService} from "../../services/CalendarService";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FloatingAddButton from "../FloatingAddButton";

interface ProfileManagementPros {
    settings: UserSetting | undefined
    updateSettings: Function
}

const ProfileManagement: React.FC<ProfileManagementPros> = ({settings, updateSettings}) => {

    const [openEditProfileModal, setOpenEditProfileModal] = useState(false);
    const userContext = useContext(AuthContext);
    const [calendarColors, setCalendarColors] = useState<any>(null);
    const [profile, setProfile] = useState<Profile>({} as Profile);

    useEffect(() => {
        const token = userContext?.token ? userContext.token : getUserContextFromLocalStore().token;

        CalendarService.getCalendarColors().then(calendarColors => {
            console.log('cal colors:' + JSON.stringify(calendarColors))

            setCalendarColors(calendarColors);
        }).catch(error => {
            console.log(error);
        })
    }, [])
    return (
        <div>
            {/*<Grid container spacing={0} sx={{padding: '6px'}}>*/}
            {/*    <Grid item xs={12} sm={11} md={11} lg={11}/>*/}
            {/*    <Grid item xs={12} sm={1} md={1} lg={1}>*/}
            {/*        <Typography variant="h5" color="text.primary" style={{display: 'inline-block'}}>*/}
            {/*            <Button onClick={() => setOpenEditProfileModal(true)}><AddIcon/></Button>*/}
            {/*        </Typography>*/}
            {/*    </Grid>*/}

            {/*</Grid>*/}
            {settings?.profiles.map((profile: Profile) => {
                return <>
                    <Card sx={{minWidth: "10rem", mb: "1rem"}}>
                        <CardHeader
                            avatar={
                                <Avatar sx={{bgcolor: profile.color}}>
                                    {/*{profile.name}*/}
                                </Avatar>
                            }
                            action={
                                <IconButton aria-label="settings" onClick={() => {
                                    console.log("setting profile:" + JSON.stringify(profile))
                                    setProfile(profile)
                                    setOpenEditProfileModal(true);
                                }
                                }>
                                    <MoreVertIcon/>
                                </IconButton>
                            }
                            title={profile.name}
                        />
                    </Card>
                </>
            })}
            <FloatingAddButton setOpen={() => setOpenEditProfileModal(true)}/>

            <ProfileManagementEditModal open={openEditProfileModal}
                                        handleClose={(userSetting: UserSetting) => {
                                            setOpenEditProfileModal(false)
                                            setProfile({} as Profile)
                                            if (userSetting != undefined) {
                                                updateSettings(userSetting)
                                            }
                                        }}
                                        colors={calendarColors}
                                        initProfile={profile}
            />
        </div>
    );
};

export default ProfileManagement;
