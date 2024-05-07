import * as React from 'react';
import {useContext, useEffect} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import {Link, useNavigate} from "react-router-dom";
import Drawer from '@mui/material/Drawer';
import {Divider, List, ListItem, ListItemButton, makeStyles, styled, useTheme} from "@mui/material";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LoginModal from "./LoginModal";
import {AuthContext, getUserContextFromLocalStore, UserAuthentication} from '../contexts/auth/AuthContext';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import RamenDiningIcon from '@mui/icons-material/RamenDining';
import SettingsIcon from '@mui/icons-material/Settings';
import {googleLogout} from "@react-oauth/google";
import {LOCAL_STORE_KEYS} from "./Constants";

const pages: any = [];
const navOptions = [
    {
        name: 'Calendar',
        path: '/calendar',
        element: <CalendarMonthIcon/>
    },
    {
        name: 'Tasks',
        path: '/tasks',
        element: <TaskAltIcon/>

    },
    {
        name: 'Recipes',
        path: '/recipes',
        element: <RamenDiningIcon/>
    }
]

function ResponsiveAppBar() {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const [open, setOpen] = React.useState(false);
    const [login, setLogin] = React.useState(false);
    const [date, setDate] = React.useState(new Date());
    const [pictureSource, setPictureSource] = React.useState('');
    const userContext = useContext(AuthContext);
    const navigate = useNavigate();
    const [user, setUser] = React.useState<UserAuthentication>({} as UserAuthentication);

    useEffect(() => {
        var user = getUserContextFromLocalStore();
        console.log("  APP BAR:" + JSON.stringify(user))

        let pictureSource = user?.picture;
        if (pictureSource == null || pictureSource == undefined) {
            pictureSource = "";
        }

        console.log("Picutre:" + pictureSource);
        setUser(user)
        setPictureSource(pictureSource)
    }, [userContext]);

    setTimeout(() => {
        setDate(new Date())
    }, 10000)

    const theme = useTheme();

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const DrawerHeader = styled('div')(({theme}) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    }));

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleOpenLogin = () => {
        setLogin(true)
    }

    const handleCloseLogin = () => {
        setLogin(false)
    }

    const logOut = () => {
        googleLogout();
        handleCloseUserMenu()
        userContext?.toggleAuth(null,
            null,
            null,
            null,
            null,
            null,
            null);
        localStorage.removeItem(LOCAL_STORE_KEYS.USER_PRINCIPLE);

        navigate("/")
    };
    const profile = () => {
        handleCloseUserMenu()
        navigate("/profile")
    };

    return (
                <>
                    {/*user {JSON.stringify(user)}*/}
                    <Box sx={{display: 'flex'}}>
                        <AppBar position="static" style={{backgroundColor: "white"}} elevation={0}>
                            <Container maxWidth="xl">
                                <Toolbar disableGutters>
                                    {
                                        userContext?.token ?
                                            <IconButton
                                                size="large"
                                                edge="start"
                                                color="inherit"
                                                aria-label="menu"
                                                sx={{
                                                    mr: 2,
                                                    color: 'grey',
                                                }}
                                                onClick={() => setOpen(!open)}
                                            >
                                                <MenuIcon/>
                                            </IconButton>
                                            : null}
                                    <Typography
                                        variant="h6"
                                        noWrap
                                        sx={{
                                            mr: 2,
                                            display: {md: 'flex'},
                                            fontWeight: 700,
                                            letterSpacing: '.3rem',
                                            color: 'black',
                                            textDecoration: 'none',
                                        }}
                                        component={Link}
                                        to={"/"}
                                    >
                                        GrayDuck
                                    </Typography>

                                    <Box sx={{flexGrow: 1, display: {xs: 'flex', md: 'none'}}}>
                                        <IconButton
                                            size="large"
                                            aria-label="account of current user"
                                            aria-controls="menu-appbar"
                                            aria-haspopup="true"
                                            onClick={handleOpenNavMenu}
                                            color="inherit"
                                        >
                                            <MenuIcon/>
                                        </IconButton>
                                        <Menu
                                            id="menu-appbar"
                                            anchorEl={anchorElNav}
                                            anchorOrigin={{
                                                vertical: 'bottom',
                                                horizontal: 'left',
                                            }}
                                            keepMounted
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'left',
                                            }}
                                            open={Boolean(anchorElNav)}
                                            onClose={handleCloseNavMenu}
                                            sx={{
                                                display: {xs: 'block', md: 'none'},
                                            }}
                                        >
                                            {pages.map((page: any) => (
                                                <MenuItem key={page.name} onClick={handleCloseNavMenu}>
                                                    <Typography textAlign="center">{page.name}</Typography>
                                                </MenuItem>
                                            ))}
                                        </Menu>
                                    </Box>
                                    <AdbIcon sx={{display: {xs: 'flex', md: 'none'}, mr: 1}}/>
                                    <Typography
                                        variant="h5"
                                        noWrap
                                        component="a"
                                        href="#app-bar-with-responsive-menu"
                                        sx={{
                                            mr: 2,
                                            display: {xs: 'flex', md: 'none'},
                                            flexGrow: 1,
                                            fontFamily: 'monospace',
                                            fontWeight: 700,
                                            letterSpacing: '.3rem',
                                            color: 'grey',
                                            textDecoration: 'none',
                                        }}
                                    >
                                    </Typography>
                                    <Box sx={{flexGrow: 1, display: {xs: 'none', md: 'flex'}}}>
                                        {pages.map((page: any) => (
                                            <Button
                                                key={page.name}
                                                component={Link}
                                                to={page.path}
                                                sx={{my: 2, color: 'grey'}}
                                            >
                                                {page.name}
                                            </Button>
                                        ))}
                                    </Box>
                                    <Typography
                                        variant="h6"
                                        noWrap
                                        sx={{
                                            letterSpacing: '.1rem',
                                            textAlign: 'right',
                                            color: 'black',
                                            mr: '10px'
                                        }}
                                    >
                                        {
                                            date.toLocaleDateString(undefined, {
                                                month: 'long',
                                                day: 'numeric',
                                                hour: 'numeric',
                                                minute: 'numeric'

                                            })}
                                    </Typography>

                                    <Box sx={{flexGrow: 0}}>
                                        {user?.token ?
                                            <>
                                                <Tooltip title="Open settings">
                                                    <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                                        <Avatar src={pictureSource}/>
                                                    </IconButton>
                                                </Tooltip>
                                            </> :
                                            // background-image: linear-gradient(to left, violet, indigo, blue, green, yellow, orange, red);
                                            <Button
                                                sx={{
                                                    // outlineColor: 'linear-gradient(to right bottom, #36EAEF, #6B0AC9)',
                                                    // outlineColor: 'red',
                                                    // px: 2,
                                                    // color: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 25%, rgba(209,0,255,1) 81%)',
                                                    // backgroundColor: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 25%, rgba(209,0,255,1) 81%)',
                                                    // backgroundColor: 'linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 25%, rgba(209,0,255,1) 81%)'
                                                    // background: 'linear-gradient(to right bottom, #36EAEF, #6B0AC9)',
                                                }}
                                                key={"login"} onClick={handleOpenLogin} variant={'outlined'}
className={'loginbutton'}
                                            >Login</Button>
                                        }

                                        <Menu
                                            sx={{mt: '45px'}}
                                            id="menu-appbar"
                                            anchorEl={anchorElUser}
                                            anchorOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            keepMounted
                                            transformOrigin={{
                                                vertical: 'top',
                                                horizontal: 'right',
                                            }}
                                            open={Boolean(anchorElUser)}
                                            onClose={handleCloseUserMenu}
                                        >
                                            <MenuItem key={'logout'} onClick={logOut}>
                                                <Typography textAlign="center">logout</Typography>
                                            </MenuItem>
                                            <MenuItem key={'profile'} onClick={profile}>
                                                <Typography textAlign="center">profile</Typography>
                                            </MenuItem>

                                        </Menu>
                                    </Box>
                                </Toolbar>
                            </Container>
                        </AppBar>
                        <Drawer
                            variant="temporary"
                            anchor="left"
                            open={open}
                            onClose={handleDrawerClose}

                        >
                            {/*ModalProps={{ onBackdropClick: handleDrawerClose() }}*/}

                            <DrawerHeader>
                                <IconButton onClick={handleDrawerClose}>
                                    {theme.direction === 'rtl' ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
                                </IconButton>
                            </DrawerHeader>
                            <Divider/>
                            <List>
                                {navOptions.map((option, index) => (
                                    <ListItem key={option.name} sx={{display: 'block'}}>
                                        <ListItemButton
                                            sx={{
                                                minHeight: 48,
                                                justifyContent: open ? 'initial' : 'center',
                                                px: 2.5,
                                            }}
                                            component={Link}
                                            to={option.path}
                                            onClick={handleDrawerClose}
                                        >
                                            {option.element}
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                            <Divider/>
                            <List>
                                <ListItem key={'settings'} sx={{display: 'block'}}>
                                    <ListItemButton
                                        sx={{
                                            minHeight: 48,
                                            justifyContent: open ? 'initial' : 'center',
                                            px: 2.5,
                                        }}
                                        component={Link}
                                        to={'/settings'}
                                        onClick={handleDrawerClose}
                                    >
                                        <SettingsIcon/>
                                    </ListItemButton>
                                </ListItem>
                            </List>
                        </Drawer>
                    </Box>
                    <LoginModal open={login} handleClose={handleCloseLogin}/>
                </>
    );
}

export default ResponsiveAppBar;