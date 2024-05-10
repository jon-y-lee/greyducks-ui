import React, {useEffect, useState} from 'react';
import {
    Backdrop,
    Box,
    Button,
    CircularProgress,
    FormControl,
    Grid,
    InputLabel,
    Modal,
    Radio, Select,
    TextField
} from "@mui/material";
import Typography from "@mui/material/Typography";
import {Profile, UserService, UserSetting} from "../../services/UserService";
import {Task, TaskList} from "../../contexts/tasks/Task";
import {TasksService} from "../../services/TasksService";
import MenuItem from "@mui/material/MenuItem";


interface TasksListEditModalInterface {
    initTaskList: TaskList,
    userSetting: UserSetting,
    open: boolean,
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

const TasksListModal = (tasksEditModalInterface: TasksListEditModalInterface) => {
    const {handleClose, initTaskList, userSetting, open} = tasksEditModalInterface;
    const [backdropOpen, setBackdropOpen]: any = useState(false);
    const [taskList, setTaskList] = useState<TaskList>(initTaskList)
    const [title, setTitle] = useState<String>(initTaskList?.title);
    const [assignedUser, setAssignedUser] = useState<string>("");

    useEffect(
        () => {
            if (initTaskList) {
                setTaskList(initTaskList)
                setTitle(initTaskList.title)
                if (initTaskList?.assignedProfileId){
                    setAssignedUser(initTaskList?.assignedProfileId)
                }
            }
        },
        [initTaskList]
    );

    // const [selectedColor, setSelectedColor] = React.useState('');

    const handleAssignedChange = (event: string) => {
        setAssignedUser(event);
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
                    Add a new List
                </Typography>
                <Typography id="modal-modal-description" sx={{mt: 2}}>
                    <TextField id="outlined-basic" label="Enter a Name" variant="outlined"
                               value={title}
                               onChange={(title) => setTitle(title.target.value)}
                               onBlur={(text: any) => {
                                   setTaskList({...taskList, title: text.target.value});
                               }}
                    />
                </Typography>

                <Typography id="modal-modal-assigned" variant="h6" component="h2" sx={{mt: 2}}>
                    Who's list is this for?

                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Pick a user</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={assignedUser}
                            label="Assigned"
                            onChange={(e) => handleAssignedChange(e.target.value)}
                        >
                            {userSetting?.profiles?.map((profile: Profile) => {
                                return (<MenuItem value={profile.id}>{profile.name}</MenuItem>)
                            })}

                        </Select>
                    </FormControl>
                </Typography>
                <Button
                    disabled={title == null || title?.length == 0}
                    onClick={() => {
                    taskList.title = title.toString();
                    taskList.assignedProfileId = assignedUser.toString()
                    TasksService.createOrUpdateTasks(taskList).then((tl: any) => {
                        setTitle("")
                        setAssignedUser("")
                        handleClose(tl)
                        setTaskList({} as TaskList)
                    })
                }}>Save</Button>
                <Button onClick={() => {
                    TasksService.deleteTaskList(taskList.id).then((tl: any) => {
                        setTitle("")
                        setAssignedUser("")
                        handleClose(tl)
                        setTaskList({} as TaskList)
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

export default TasksListModal;
