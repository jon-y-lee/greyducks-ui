import React, {useEffect, useState} from 'react';
import {Backdrop, Box, Button, CircularProgress, Grid, Modal, Radio, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import {Profile, UserService, UserSetting} from "../../services/UserService";
import {Task, TaskList} from "../../contexts/tasks/Task";
import {TasksService} from "../../services/TasksService";
import Drawer from "@mui/material/Drawer";


interface TasksEditModalInterface {
    initTask: Task,
    taskListId: string | null,
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

const TasksModal = (tasksEditModalInterface: TasksEditModalInterface) => {
    const {handleClose, initTask, taskListId} = tasksEditModalInterface;
    const [backdropOpen, setBackdropOpen]: any = useState(false);
    const [task, setTask] = useState<Task>(initTask)
    const [title, setTitle] = useState<String>(initTask?.title);

    useEffect(
        () => {
            console.log("setting task list id1" + taskListId)

            if (initTask) {
                console.log("setting task list id2")

                setTask({...initTask, taskListId: taskListId!!})
            }
        }, [initTask, taskListId]
    );

    const [taskName, setTaskName] = React.useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTaskName(event.target.value);
    };

    return (
        <Drawer
            anchor={'right'}
            transitionDuration={700}
            open={taskListId != null}
            onClose={() => handleClose}
        >

            <Box
                sx={{ width: { xs: '100%', md:'50vw' }, p: '1rem'}}
            >
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Add a new Task
                </Typography>
                <Typography id="modal-modal-description" sx={{mt: 2}}>
                    <TextField id="outlined-basic" label="Enter a title" variant="outlined"
                               value={task!!.title}
                               onChange={(title) => setTitle(title.target.value)}
                               inputProps={{maxLength: 25}}
                               onBlur={(text: any) => {
                                   setTask({...task, title: text.target.value});
                               }}
                    />
                </Typography>

                <Button onClick={() => {
                    TasksService.createTask(taskListId!!, task).then((tl: any) => {
                        handleClose()
                    })
                }} disabled={title == null || title.length == 0}>Add</Button>
                <Button onClick={() => {
                    handleClose()
                }}>Cancel</Button>
                <Backdrop
                    sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                    open={backdropOpen}
                    onClick={() => setBackdropOpen(false)}
                >
                    <CircularProgress color="inherit"/>
                </Backdrop>
            </Box>
        </Drawer>
    );
}

export default TasksModal;
