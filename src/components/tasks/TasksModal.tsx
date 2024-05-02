import React, {useEffect, useState} from 'react';
import {Backdrop, Box, Button, CircularProgress, Grid, Modal, Radio, TextField} from "@mui/material";
import Typography from "@mui/material/Typography";
import {Profile, UserService, UserSetting} from "../../services/UserService";
import {Task, TaskList} from "../../contexts/tasks/Task";
import {TasksService} from "../../services/TasksService";


interface TasksEditModalInterface {
    initTask: Task,
    taskListId: String|null,
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

    useEffect(
        () => {
            console.log("setting task list id1" + taskListId)

            if (initTask) {
                console.log("setting task list id2")

                setTask({...initTask, taskListId: taskListId!!})
            }
        },[initTask, taskListId]
    );

    const [taskName, setTaskName] = React.useState('');

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setTaskName(event.target.value);
    };

    return (
        <Modal
            open={taskListId != null}
            onClose={() => handleClose()}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Add a new Task
                </Typography>
                <Typography id="modal-modal-description" sx={{mt: 2}}>
                    <TextField id="outlined-basic" label="Enter a title" variant="outlined"
                               value={task!!.title}
                               onBlur={(text: any) => {
                                   setTask({...task, title: text.target.value});
                               }}
                    />
                </Typography>

                <Button onClick={() => {
                    TasksService.createTask(taskListId!!, task).then((tl: any) => {
                        handleClose()
                    })
                }} disabled={task?.title == null}>Add</Button>
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
        </Modal>
    );
}

export default TasksModal;
