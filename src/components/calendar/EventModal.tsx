import React, {useEffect, useState} from 'react';
import {Box, Button, Grid, Modal, TextField,} from '@mui/material';
import Typography from "@mui/material/Typography";
import {CalendarService} from "../../services/CalendarService";
import {Event} from "../../contexts/event/Event"


interface EventCreateModalInterface {
    event: Event | null,
    open: boolean,
    handleClose: Function,
    handleCancel: Function,

}

const style = {
    position: 'absolute' as 'absolute',
    top: '25%',
    left: '30%',
    transform: 'translate(-25%, -25%)',
    width: '80vw',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const EventModal = (eventCreateModalInterface: EventCreateModalInterface) => {
    const {handleClose, handleCancel, event, open} = eventCreateModalInterface;

    useEffect(() => {
        console.log("Recipe chnages: " + JSON.stringify(event))
        if (event != null) {
            // setForm(event);

            // if (recipe.ingredients?.length == 0) {
            //     handleAddIngredient()
            // }
        } else {
            // handleAddIngredient()
        }

    }, [event])

    // const [form, setForm] = useState<Event>(event || {} as Event);
    const [formData, setFormData] = useState({
        summary: '',
        startTime: '',
        endTime: '',
        description: '',
        assignee: '',
        assigneeInitials: '',
        assigneeColor: '',
    });

    const resetForm = () => {
        setFormData({
            summary: '',
            startTime: '',
            endTime: '',
            description: '',
            assignee: '',
            assigneeInitials: '',
            assigneeColor: '',
        })
    }

    const handleSubmit = (event: any) => {
        event.preventDefault();
    };
    const handleChange = (event: any) => {
        const {name, value} = event.target;
        setFormData({...formData, [name]: value});
    };

    return (
        <Modal
            open={open}
            onClose={() => handleClose()}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box component="form" onSubmit={handleSubmit} sx={style}>
                <Typography variant="h5">Event</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Title"
                            name="summary"
                            value={formData.summary}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
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
                            label="Description"
                            multiline
                            rows={4}
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Assignee"
                            name="assignee"
                            value={formData.assignee}
                            onChange={handleChange}
                        />
                    </Grid>
                </Grid>
                {formData.startTime}
                <Button type="submit" onClick={() => {
                    var event: Event = {
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
                        assigneeInitials: formData.assignee,
                        assigneeColor: formData.assigneeColor
                    }

                    CalendarService.createEvent(event).then(res => {
                        console.log("Successfully saved event");
                        resetForm()
                        handleClose()
                    }).catch(error => console.log("Error"))
                }}>Save</Button>
                <Button onClick={() => {
                    resetForm()
                    handleCancel()
                }}>Cancel</Button>
            </Box>
        </Modal>
    );
}

export default EventModal;
