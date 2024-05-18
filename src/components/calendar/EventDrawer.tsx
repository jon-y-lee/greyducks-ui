import React, {useEffect, useState} from 'react';
// import {AuthContext} from "../contexts/auth/AuthContext";
import {useParams} from 'react-router-dom';
import {CalendarService} from "../../services/CalendarService";
import {Button, FormControl, Grid, InputLabel, Select, TextField} from "@mui/material";
import Box from "@mui/material/Box";
import {Event} from "../../contexts/event/Event";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import Drawer from "@mui/material/Drawer";
import {Profile, UserSetting} from "../../services/UserService";
import MenuItem from "@mui/material/MenuItem";

interface EventDrawerInterface {
    open: boolean,
    handleClose: Function,
    handleCancel: Function,
    event?: Event,
    userSetting?: UserSetting
}

const EventDrawer = (eventDrawerInterface: EventDrawerInterface) => {
    const {id} = useParams();
    const {open, event, userSetting, handleClose, handleCancel} = eventDrawerInterface;

    const [formData, setFormData] = useState({
        summary: '',
        startTime: '',
        endTime: '',
        description: '',
        assignee: '',
        assigneeInitials: '',
        assigneeColor: ''
    });
    const [edit, setEdit] = useState(false);

    useEffect(() => {
        console.log("Changed id:" + id)
    }, [id])

    useEffect(() => {
        console.log("Changed id:" + id)
    }, [id])

    useEffect(() => {
        console.log("Event chnages: " + JSON.stringify(event))
        if (event != null) {
            console.log('event?.assigneeId:' + event?.assigneeId)
            setFormData({
                summary: event?.summary,
                startTime: event?.start?.dateTime?.replace(":00-05:00", ""),
                endTime: event?.end?.dateTime?.replace(":00-05:00", ""),
                description: event?.description,
                assignee: event?.assigneeId,
                assigneeInitials: '',
                assigneeColor: ''
            });
        }

    }, [event])

    const handleSubmit = (event: any) => {
        event.preventDefault();
    };
    const handleChange = (event: any) => {
        const {name, value} = event.target;
        console.log("handle change........................" + name)
        setFormData({...formData, [name]: value});
    };

    const resetForm = () => {
        setFormData({
            summary: '',
            startTime: '',
            endTime: '',
            description: '',
            assignee: '',
            assigneeInitials: '',
            assigneeColor: ''
        })
    }
    return (
        <div>
            <Drawer
                anchor={'right'}
                transitionDuration={700}
                open={open}
                onClose={() => handleClose}
            >
                <Box
                    sx={{width: {xs: '100%', md: '50vw'}, p: '1rem'}}
                    role="presentation"
                    // onClick={toggleDrawer('right', false)}
                    // onKeyDown={toggleDrawer('right', false)}
                >
                    <Box component="form" onSubmit={handleSubmit}>
                        <Typography variant="h6">Event

                            <IconButton onClick={() => {
                                setEdit(!edit)
                            }}>
                                {!edit ?
                                    <EditIcon fontSize={"small"}/>
                                    :
                                    <CheckIcon fontSize={"small"}/>
                                }
                            </IconButton>
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    disabled={edit}
                                    label="Title"
                                    name="summary"
                                    value={formData.summary}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    disabled={edit}
                                    label="Start Time"
                                    type="datetime-local"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    disabled={edit}
                                    label="End Time"
                                    type="datetime-local"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleChange}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    disabled={edit}
                                    label="Description"
                                    multiline
                                    rows={4}
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>

                                <Typography id="modal-modal-assigned" variant="h6" component="h2" sx={{mt: 2}}>
                                    Who's event is this for? {formData.assignee}

                                    <FormControl fullWidth>
                                        <InputLabel>Pick a user</InputLabel>
                                        <Select
                                            value={formData.assignee}
                                            label="Assigned"
                                            name="assignee"
                                            onChange={handleChange}
                                        >
                                            {userSetting?.profiles?.map((profile: Profile) => {
                                                return (<MenuItem value={profile.id}>{profile.name}</MenuItem>)
                                            })}
                                        </Select>
                                    </FormControl>
                                </Typography>
                            </Grid>

                        </Grid>

                        <Button type="submit" onClick={() => {
                            var newEvent: Event = {
                                status: 'confirmed',
                                start: {
                                    dateTime: formData.startTime + ':00-05:00',
                                    timeZone: "America/Chicago"
                                },
                                end: {
                                    dateTime: formData.endTime + ':00-05:00',
                                    timeZone: "America/Chicago"
                                },
                                summary: formData.summary,
                                recurrence: 'false',
                                description: formData.description,
                                colorId: 0,
                                assigneeId: formData.assignee,
                                assigneeInitials: formData.assigneeInitials,
                                assigneeColor: formData.assigneeColor,
                            }

                            const requestEvent = {...event, ...newEvent};

                            console.log("Request:" + JSON.stringify(requestEvent))
                            if (requestEvent.id == null) {
                                    CalendarService.createEvent({...event, ...newEvent}).then(res => {
                                    console.log("Successfully saved event");
                                    resetForm()
                                    handleClose()
                                }).catch(error => console.log("Error"))
                            } else {
                                CalendarService.updateEvent({...event, ...newEvent}).then(res => {
                                    console.log("Successfully saved event");
                                    resetForm()
                                    handleClose()
                                }).catch(error => console.log(error))
                            }
                        }}>Save</Button>
                        <Button onClick={() => {
                            resetForm()
                            handleCancel()
                        }}>Cancel</Button>
                    </Box>

                </Box>
            </Drawer>
        </div>
    );
};

export default EventDrawer;
