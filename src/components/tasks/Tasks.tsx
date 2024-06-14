import React, {useContext, useEffect, useState} from 'react';
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    FormControlLabel,
    MenuProps,
    Stack,
    styled,
    Switch,
    SwitchProps
} from "@mui/material";
import {AuthContext} from "../../contexts/auth/AuthContext";
import {TasksService} from "../../services/TasksService";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import {Task, TaskList} from "../../contexts/tasks/Task";
import {Add, More} from "@mui/icons-material";
import TasksListModal from "./TasksListModal";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import TasksModal from "./TasksModal";
import AddIcon from "@mui/icons-material/Add";
import {UserService, UserSetting} from "../../services/UserService";
import LoadingBackDrop from "../backdrops/LoadingBackDrop";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import DeleteIcon from "@mui/icons-material/Delete";

import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from "@mui/icons-material/Check";

const Tasks = () => {

    const userContext = useContext(AuthContext);
    const [task, setTask] = useState<Task>({} as Task);
    const [tasksMap, setTasksMap] = useState<Record<string, any>>({});
    const [taskList, setTaskList] = useState<TaskList>({} as TaskList);
    const [taskLists, setTaskLists] = useState<TaskList[]>([]);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openTaskModal, setOpenTaskModal] = useState<string | null>(null);
    const [backdropOpen, setBackdropOpen]: any = useState(false);
    const [editMode, setEditMode] = useState(false);

    const [userSetting, setUserSettings] = useState<UserSetting>({} as UserSetting)

    const StyledMenu = styled((props: MenuProps) => (
        <Menu
            elevation={0}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            {...props}
        />
    ))(({theme}) => ({
        '& .MuiPaper-root': {
            // borderRadius: 15,
            marginTop: theme.spacing(-15),
            // minWidth: 180,
            // minHeight: 80,
            // backgroundColor: 'lightBlue',
            // color:
            //     theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
            // boxShadow:
            //     'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
            '& .MuiMenu-list': {
                // padding: '4px 0',
            },
            '& .MuiMenuItem-root': {
                '& .MuiSvgIcon-root': {
                    // fontSize: 28,
                    color: 'theme.palette.text.secondary',
                    // marginRight: theme.spacing(1.5),
                    // marginBottom: theme.spacing(1.5),
                },
                '&:active': {
                    backgroundColor: 'lightBlue',
                },
            },
        },
    }));

    const IOSSwitch = styled((props: SwitchProps) => (
        <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
    ))(({theme}) => ({
        width: 42,
        height: 26,
        padding: 0,
        '& .MuiSwitch-switchBase': {
            padding: 0,
            margin: 2,
            transitionDuration: '300ms',
            '&.Mui-checked': {
                transform: 'translateX(16px)',
                color: '#fff',
                '& + .MuiSwitch-track': {
                    backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
                    opacity: 1,
                    border: 0,
                },
                '&.Mui-disabled + .MuiSwitch-track': {
                    opacity: 0.5,
                },
            },
            '&.Mui-focusVisible .MuiSwitch-thumb': {
                color: '#33cf4d',
                border: '6px solid #fff',
            },
            '&.Mui-disabled .MuiSwitch-thumb': {
                color:
                    theme.palette.mode === 'light'
                        ? theme.palette.grey[100]
                        : theme.palette.grey[600],
            },
            '&.Mui-disabled + .MuiSwitch-track': {
                opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
            },
        },
        '& .MuiSwitch-thumb': {
            boxSizing: 'border-box',
            width: 22,
            height: 22,
        },
        '& .MuiSwitch-track': {
            borderRadius: 26 / 2,
            backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
            opacity: 1,
            transition: theme.transitions.create(['background-color'], {
                duration: 500,
            }),
        },
    }));

    const updateTasks = () => {
        setBackdropOpen(true)
        UserService.userSettings().then(userSettingsResponse => {
            setUserSettings(userSettingsResponse)

            TasksService.listTasks().then((taskLists: TaskList[]) => {

                for (var taskList of taskLists as TaskList[]) {
                    for (var profile of userSettingsResponse?.profiles) {
                        if (profile.id == taskList.assignedProfileId) {
                            taskList.assignedProfileColor = profile.color;
                            taskList.assignedProfileInitial = profile.name;
                        }
                    }
                }

                setTaskLists(taskLists)

                var promises = [];
                for (var taskList of taskLists as TaskList[]) {
                    promises.push(TasksService.listTasksByTaskListId(taskList.id))
                }

                Promise.all(promises).then((values) => {

                    var updatedTaskMap: Record<string, any> = {};
                    for (var task of values.flat() as Task[]) {
                        var taskArray = updatedTaskMap[task.taskListId as string]
                        if (taskArray == null) {
                            taskArray = [];
                        }
                        taskArray.push(task)
                        updatedTaskMap[task.taskListId as string] = taskArray;
                    }

                    setTasksMap(updatedTaskMap)
                })
            }).finally(() => {
                setBackdropOpen(false)
            }).catch(() => {
                console.error("unable to get tasks")
            })
        }).catch(res => console.log("Unable to get user settings"))
    }

    useEffect(() => {
        updateTasks()
    }, [])

    const handleAddTask = (taskListId: string) => {
        console.log("Adding Task to taskList " + taskListId)
        setOpenTaskModal(taskListId)
    };

    const deleteTask = (id: String, taskListId: String) => {
        TasksService.deleteTask(taskListId, id)
        updateTasks();
    }

    function updateTaskChecked(task: Task, taskListId: String) {
        TasksService.updateTaskChecked(taskListId, task)
        updateTasks();
    }

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <div style={{
                overflowX: 'scroll',
                overflowY: 'hidden',
                height: '100vw',
                whiteSpace: 'nowrap',
                scrollbarWidth: 'none',

            }}>
                <Stack ml={5} mt={3} mr={5} justifyContent={'left'} direction="row" spacing={2}>
                    {taskLists?.map((taskList: TaskList) => {
                        return (
                            <Card sx={{
                                width: '350px',
                                display: 'flex',
                                flexDirection: 'column',
                                margin: '20px'
                            }} variant="outlined">
                                <CardContent>
                                    <CardHeader
                                        avatar={
                                            <Avatar sx={{bgcolor: taskList.assignedProfileColor}} aria-label="recipe">
                                                {taskList.assignedProfileInitial}
                                            </Avatar>
                                        }
                                        action={
                                            <IconButton aria-label="settings" onClick={() => {
                                                setTaskList(taskList)
                                                setOpenEditModal(true)
                                            }
                                            }>
                                                <MoreVertIcon/>
                                            </IconButton>
                                        }
                                        title={taskList?.title}
                                    />
                                    {tasksMap[taskList.id]?.sort((t1: Task, t2: Task) => t1!!.title!!.localeCompare(t2.title!!.toString(), 'en')).map((task: Task) => {
                                        return (
                                            <CardActions>
                                                <FormControlLabel
                                                    control={
                                                        editMode ?
                                                            <IconButton
                                                                onClick={() => deleteTask(task.id, task.taskListId)}>
                                                                <DeleteIcon/>
                                                            </IconButton>
                                                            :
                                                            <IOSSwitch sx={{m: 1}}
                                                                       onClick={() => {
                                                                           updateTaskChecked(task, task.taskListId)
                                                                       }
                                                                       }
                                                                       checked={task?.status != 'needsAction'}/>}
                                                    label={task?.title}
                                                />
                                            </CardActions>
                                        )
                                    })}

                                </CardContent>
                                <CardActions sx={{justifyContent: 'flex-end', marginTop: 'auto'}}>
                                    <IconButton onClick={() => {
                                        handleAddTask(taskList.id)
                                    }}><AddIcon sx={{borderRadius: "28px"}}/></IconButton>
                                </CardActions>
                            </Card>
                        )
                    })}
                </Stack>
            </div>

            <Button
                sx={{
                    position: 'fixed',   // Fixed position
                    bottom: '5vh',          // 16px from the bottom
                    right: '5vw',           // 16px from the right
                    backgroundColor: 'lightBlue',
                    borderRadius: 28,
                    height: 75,
                    width: 75,
                    zIndex: 1000         // To make sure it is above most other elements
                }}
                onClick={(evt) => {

                    if (editMode) {
                        setEditMode(false)
                    } else {
                        handleClick(evt)
                    }
                }}
            >
                {editMode ? <CheckIcon/> : <MoreVertIcon/>}
            </Button>
            <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                    'aria-labelledby': 'demo-customized-button',
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                <MenuItem onClick={() => {
                    // set edit mode
                    setEditMode(!editMode)
                    handleClose()
                }}
                          sx={{
                              borderRadius: 24, height: 60, width: 60, backgroundColor: 'lightblue',
                              opacity: '50%'
                          }}
                >
                    <EditIcon/>
                </MenuItem>
                <MenuItem onClick={() => {
                    setOpenEditModal(true);
                    handleClose()
                }}
                          sx={{
                              borderRadius: 24,
                              height: 60,
                              width: 60,
                              backgroundColor: 'lightblue',
                              opacity: '50%',
                              mt: 2
                          }}
                >
                    <Add/>
                </MenuItem>
            </StyledMenu>

            <TasksListModal
                initTaskList={taskList}
                open={openEditModal}
                handleClose={(taskList: TaskList) => {
                    setOpenEditModal(false)
                    if (taskList?.title != null) {
                        var updatedTaskList = taskLists;
                        updatedTaskList.push(taskList)
                        setTaskLists(updatedTaskList)
                    }
                    updateTasks()
                    setTaskList({} as TaskList)
                }
                }
                userSetting={userSetting}
            />
            <TasksModal initTask={task} taskListId={openTaskModal} handleClose={(task: Task) => {
                setOpenTaskModal(null)
                setTask({} as Task)
                updateTasks()
            }}
            />
            <LoadingBackDrop
                isOpen={backdropOpen}/>

        </div>
    );
};

export default Tasks;
