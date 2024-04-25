import React, {useEffect, useState} from 'react';
import {Backdrop, Box, Button, CircularProgress, Grid, Modal, Radio, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import {Profile, UserService, UserSetting} from "../../services/UserService";


interface ProfileManagementEditModalInterface {
    initProfile: Profile
    open: boolean,
    colors: any,
    handleClose: Function,
}

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const ProfileManagementEditModal = (profileManagementEditModalInterface: ProfileManagementEditModalInterface) => {
    const {handleClose, initProfile, colors, open} = profileManagementEditModalInterface;
    const [backdropOpen, setBackdropOpen]: any = useState(false);
    const [profile, setProfile] = useState<Profile>(initProfile)

    useEffect(
        () => {
            setProfile(initProfile)
            setSelectedValue(initProfile.color)
        },
        [initProfile]
    );

    const [selectedValue, setSelectedValue] = React.useState('#c2c2c2');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedValue(event.target.value);
        setProfile({...profile, color: event.target.value})
    };

    return (
        <Modal
            open={open}
            onClose={() => handleClose()}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Add a new Profile
                </Typography>
                <Typography id="modal-modal-description" sx={{mt: 2}}>
                    <TextField id="outlined-basic" label="Enter a Name" variant="outlined"
                               value={profile.name}
                               onBlur={(text) => {
                                   setProfile({...profile, name: text.target.value})
                               }}/>
                </Typography>
                <Typography id="modal-modal-description" sx={{mt: 3}}>
                    <>
                        <Typography id="modal-modal-title" variant="h6" component="h2">
                            Choose a Color
                        </Typography>
                        <Grid container spacing={1}>
                            {colors ? colors.map((color: any) => {
                                    return <Grid item xs={2} sm={2} md={2} lg={2}>
                                        <Radio
                                            checked={selectedValue === color.background}
                                            onChange={handleChange}
                                            value={color.background}
                                            name="radio-buttons"
                                            inputProps={{'aria-label': 'A'}}
                                            sx={{bgcolor: color.background}}
                                        />
                                    </Grid>
                                })
                                : null}
                        </Grid>
                    </>
                </Typography>
                <Button onClick={() => {
                    UserService.saveUserProfile(profile).then((userSetting: UserSetting) => {
                        handleClose(userSetting)
                        setProfile({} as Profile)
                    })
                }}>Save</Button>
                <Button onClick={() => {
                    UserService.deleteUserProfile(profile).then((userSetting: UserSetting) => {
                        handleClose(userSetting)
                        setProfile({} as Profile)
                    })
                }}>Delete</Button>

                <Backdrop
                    sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                    open={backdropOpen}
                    onClick={() => setBackdropOpen(false)}
                >
                    <CircularProgress color="inherit"/>
                </Backdrop>
            </Box>
        </Modal>
    );
}

export default ProfileManagementEditModal;
