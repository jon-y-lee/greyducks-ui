import * as React from 'react';
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
import {Link} from "react-router-dom";
import Drawer from '@mui/material/Drawer';
import {CSSObject, Divider, List, ListItem, ListItemButton, ListItemText, styled, Theme, useTheme} from "@mui/material";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LoginModal from "./LoginModal";
import {AuthContext} from '../contexts/auth/AuthContext';

const pages: any = [];
// const pages = [{
//     name: 'Calendar',
//     path: '/Calendar'
// }];

const settings = ['Profile', 'Logout'];
const navOptions = [
    {
        name: 'Calendar',
        path: '/calendar'
    },
    {
        name: 'Tasks',
        path: '/tasks'
    },
    {
        name: 'Recipes',
        path: '/recipes'
    }
]

function ResponsiveAppBar() {
    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const [open, setOpen] = React.useState(false);
    const [login, setLogin] = React.useState(false);

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


    return (
        <AuthContext.Consumer>
            {user => (
                <>
                    <Box sx={{display: 'flex'}}>
                        <AppBar position="static" style={{backgroundColor: "white"}} elevation={0}>
                            <Container maxWidth="xl">
                                <Toolbar disableGutters>
                                    {/*<AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />*/}
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

                                    <Typography
                                        variant="h6"
                                        noWrap
                                        sx={{
                                            mr: 2,
                                            // display: {xs: 'none', md: 'flex'},
                                            fontFamily: 'monospace',
                                            fontWeight: 700,
                                            letterSpacing: '.3rem',
                                            color: 'black',
                                            textDecoration: 'none',
                                        }}
                                        component={Link}
                                        to={"/"}
                                    >
                                        GreyDuck
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

                                    <Box sx={{flexGrow: 0}}>
                                        <Tooltip title="Open settings">
                                            <IconButton onClick={handleOpenUserMenu} sx={{p: 0}}>
                                                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg"/>
                                            </IconButton>
                                        </Tooltip>
                                        <Button key={"login"} onClick={handleOpenLogin}>Login</Button>
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
                                            {/*{settings.map((setting) => (*/}
                                            {/*    <MenuItem key={setting} onClick={handleCloseUserMenu}>*/}
                                            {/*        <Typography textAlign="center">{setting}</Typography>*/}
                                            {/*    </MenuItem>*/}
                                            {/*))}*/}
                                            <MenuItem key={'login'} onClick={handleCloseUserMenu}>
                                                <Typography textAlign="center">login</Typography>
                                            </MenuItem>

                                        </Menu>
                                    </Box>
                                </Toolbar>
                            </Container>
                        </AppBar>

                        <Drawer variant="persistent" open={open}>
                            <DrawerHeader>
                                <IconButton onClick={handleDrawerClose}>
                                    {theme.direction === 'rtl' ? <ChevronRightIcon/> : <ChevronLeftIcon/>}
                                </IconButton>
                            </DrawerHeader>
                            <Divider/>
                            <List>
                                {navOptions.map((option, index) => (
                                    <ListItem key={option.name} disablePadding sx={{display: 'block'}}>
                                        <ListItemButton
                                            sx={{
                                                minHeight: 48,
                                                justifyContent: open ? 'initial' : 'center',
                                                px: 2.5,
                                            }}
                                            component={Link}
                                            to={option.path}
                                        >
                                            <ListItemText primary={option.name} sx={{opacity: open ? 1 : 0}}/>
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                            <Divider/>
                            <List>
                                {['Settings'].map((text, index) => (
                                    <ListItem key={text} disablePadding sx={{display: 'block'}}>
                                        <ListItemButton
                                            sx={{
                                                minHeight: 48,
                                                justifyContent: open ? 'initial' : 'center',
                                                px: 2.5,
                                            }}
                                        >
                                            <ListItemText primary={text} sx={{opacity: open ? 1 : 0}}/>
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                        </Drawer>
                    </Box>
                    name {user?.name}
                    <LoginModal open={login} handleClose={handleCloseLogin}/>
                </>
            )}
        </AuthContext.Consumer>
    );
}

export default ResponsiveAppBar;