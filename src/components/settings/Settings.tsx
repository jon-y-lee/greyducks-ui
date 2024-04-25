import React, {useContext, useEffect} from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import {Divider, Grid, ListItemIcon, ListItemText} from "@mui/material";
import GroupIcon from '@mui/icons-material/Group';
import ProfileManagement from "./ProfileManagement";
import {UserService, UserSetting} from "../../services/UserService";
import {AuthContext, getUserContextFromLocalStore} from "../../contexts/auth/AuthContext";

const Settings = () => {

    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const userContext = useContext(AuthContext);
    const [userSettings, setUserSettings] = React.useState<UserSetting>();

    const handleListItemClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        index: number,
    ) => {
        setSelectedIndex(index);
    };

    useEffect(() => {
        const fetchData = async () => {
            const token = userContext?.token ? userContext.token : getUserContextFromLocalStore().token;
            const data = await UserService.userSettings(token);
            return data
        }

        fetchData().then((res: UserSetting) => {
            console.log("User Settings:" + JSON.stringify(res))
            setUserSettings(res)
        });
    }, [])

    return (
        <Grid container spacing={0}>
            <Grid item xs={6} md={6}>
                <Box sx={{ml: '10%', mt: '5%', width: '25rem'}}>
                    <List component="nav" aria-label="main mailbox folders">
                        <ListItemButton
                            selected={selectedIndex === 0}
                            onClick={(event) => handleListItemClick(event, 0)}
                        >
                            <ListItemIcon>
                                <GroupIcon/>
                            </ListItemIcon>

                            <ListItemText primary="Profiles"/>
                        </ListItemButton>
                        {/*<ListItemButton*/}
                        {/*    selected={selectedIndex === 1}*/}
                        {/*    onClick={(event) => handleListItemClick(event, 1)}*/}
                        {/*>*/}
                        {/*    <ListItemIcon>*/}
                        {/*        <DraftsIcon/>*/}
                        {/*    </ListItemIcon>*/}
                        {/*    <ListItemText primary="Drafts"/>*/}
                        {/*</ListItemButton>*/}
                    </List>
                    <Divider/>
                    <List component="nav" aria-label="secondary mailbox folder">
                        <ListItemButton
                            selected={selectedIndex === 2}
                            onClick={(event) => handleListItemClick(event, 2)}
                        >
                            <ListItemText primary="Trash"/>
                        </ListItemButton>
                        <ListItemButton
                            selected={selectedIndex === 3}
                            onClick={(event) => handleListItemClick(event, 3)}
                        >
                            <ListItemText primary="Spam"/>
                        </ListItemButton>
                    </List>

                </Box>
            </Grid>
            <Grid item xs={6} md={6}>
                <Box sx={{mt: '5%', mr: '10%'}}>
                    {selectedIndex == 0 ? <ProfileManagement settings={userSettings}
                    updateSettings={(userSettings: UserSetting) => {
                        console.log("Settings updated")
                        setUserSettings(userSettings)
                    }}/> : null}
                </Box>
            </Grid>
        </Grid>
    );

    //
    // return (
    //     <div>
    //         Settings
    //     </div>
    // );
};

export default Settings;
