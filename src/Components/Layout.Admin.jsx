import React, { useEffect, useState } from 'react';
import {
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography
} from '@mui/material';
import PaletteIcon from '@mui/icons-material/Palette';
import HomeIcon from '@mui/icons-material/Home';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import GroupsIcon from '@mui/icons-material/Groups';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ChatIcon from '@mui/icons-material/Chat';
import { makeStyles } from '@mui/styles';
import { useLocation, useNavigate } from 'react-router-dom';
import ArtSpaceLogo from '../Assets/ArtSpace_Logo.webp';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import { useMediaQuery } from 'react-responsive';

let openDrawerWidth = 240;
let closedDrawerWidth = 50;

const useStyles = makeStyles({
    root: { display: 'flex' },
    page: {
        background: '#f9f9f9',
        width: '100%',
        padding: 50,
        marginBottom: 50
    },
    drawer: {
        width: openDrawerWidth,
        height: 'web-kit-available'
    },
    drawerPaper: {
        width: openDrawerWidth + 1
    },
    closedDrawer: {
        width: closedDrawerWidth,
        height: 'web-kit-available'
    },
    closedDrawerPaper: {
        overflow: 'hidden',
        maxWidth: 50,
        width: closedDrawerWidth + 1
    },
    active: {
        background: '#f4f4f4'
    },
    drawerFooter: {
        position: 'absolute',
        bottom: '0px',
        width: openDrawerWidth,
        overflowWrap: 'break-word'
    },
    closedDrawerFooter: {
        position: 'absolute',
        bottom: '0px',
        width: openDrawerWidth,
        overflowWrap: 'break-word'
    }
});
export default function LayoutAdmin({ children, user, signout }) {
    const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
    const [hamburgerVisible, sethamburgerVisible] = useState(isMobile);
    const [isNavOpen, setIsNavOpen] = useState(false);

    useEffect(() => {
        sethamburgerVisible(isMobile);
    }, [isMobile]);

    const classes = useStyles(isNavOpen);
    let navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { text: 'Home', icon: <HomeIcon color='primary' />, path: '/' },
        {
            text: 'Artworks',
            icon: <PaletteIcon color='primary' />,
            path: '/all-artworks'
        },
        {
            text: 'Artshows',
            icon: <StorefrontIcon color='primary' />,
            path: '/all-artshows'
        },
        {
            text: 'Artists',
            icon: <GroupsIcon color='primary' />,
            path: '/all-artists'
        },
        {
            text: 'Create Artshow',
            icon: <AddBoxIcon color='primary' />,
            path: '/create-artshow'
        },
        {
            text: 'Chat',
            icon: <ChatIcon color='primary' />,
            path: '/admin-chat'
        }
    ];
    return (
        <div className={classes.root}>
            <Drawer
                className={
                    hamburgerVisible
                        ? isNavOpen
                            ? classes.drawer
                            : classes.closedDrawer
                        : classes.drawer
                }
                variant='permanent'
                anchor='left'
                classes={{
                    paper: hamburgerVisible
                        ? isNavOpen
                            ? classes.drawerPaper
                            : classes.closedDrawerPaper
                        : classes.drawerPaper
                }}>
                <div>
                    {hamburgerVisible ? (
                        isNavOpen ? (
                            <MenuOpenIcon
                                style={{
                                    float: 'left',
                                    height: 50,
                                    width: 50,
                                    paddingLeft: 5,
                                    paddingright: 5,
                                    paddingTop: 5,
                                    marginRight: '10px',
                                    color: 'black'
                                }}
                                className='hamburger'
                                onClick={() =>
                                    setIsNavOpen(false)
                                }></MenuOpenIcon>
                        ) : (
                            <MenuIcon
                                style={{
                                    float: 'left',
                                    height: 50,
                                    width: 50,
                                    paddingLeft: 5,
                                    paddingright: 5,
                                    paddingTop: 5,
                                    marginRight: '10px',
                                    color: 'black'
                                }}
                                className='hamburger'
                                onClick={() => setIsNavOpen(true)}></MenuIcon>
                        )
                    ) : (
                        <img
                            style={{
                                float: 'left',
                                height: 50,
                                width: 50,
                                paddingLeft: 5,
                                paddingright: 5,
                                paddingTop: 5,
                                marginRight: '10px'
                            }}
                            src={ArtSpaceLogo}
                            alt='Artpsace Logo'
                        />
                    )}
                    {hamburgerVisible ? (
                        isNavOpen ? (
                            <Typography
                                style={{
                                    padding: 10
                                }}
                                variant='h5'>
                                Admin Portal
                            </Typography>
                        ) : null
                    ) : (
                        <Typography
                            style={{
                                padding: 10
                            }}
                            variant='h5'>
                            Admin Portal
                        </Typography>
                    )}
                </div>
                <List>
                    {menuItems.map((item) => (
                        <ListItem
                            button
                            onClick={() => navigate(item.path)}
                            key={item.text}
                            style={
                                location.pathname === item.path
                                    ? { background: '#f4f4f4' }
                                    : null
                            }>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            {hamburgerVisible ? (
                                isNavOpen ? (
                                    <ListItemText
                                        primary={item.text}></ListItemText>
                                ) : null
                            ) : (
                                <ListItemText
                                    primary={item.text}></ListItemText>
                            )}
                        </ListItem>
                    ))}
                </List>
                <div
                    className={
                        hamburgerVisible
                            ? isNavOpen
                                ? classes.drawerFooter
                                : classes.closedDrawerFooter
                            : classes.drawerFooter
                    }>
                    <Divider
                        style={{
                            width: hamburgerVisible
                                ? isNavOpen
                                    ? openDrawerWidth
                                    : closedDrawerWidth
                                : openDrawerWidth
                        }}
                    />
                    <List>
                        <ListItem
                            key={'admin-profile'}
                            button
                            onClick={() => navigate('/admin-profile')}
                            style={
                                location.pathname === '/admin-profile'
                                    ? { background: '#f4f4f4' }
                                    : null
                            }>
                            <ListItemIcon>
                                <AdminPanelSettingsIcon />
                            </ListItemIcon>
                            {hamburgerVisible ? (
                                isNavOpen ? (
                                    <ListItemText
                                        primary={
                                            user.attributes.preferred_username
                                        }
                                        secondary={'Admin'}></ListItemText>
                                ) : null
                            ) : (
                                <ListItemText
                                    primary={user.attributes.preferred_username}
                                    secondary={'Admin'}></ListItemText>
                            )}
                        </ListItem>
                        <ListItem button onClick={() => signout()}>
                            <ListItemIcon>
                                <LogoutIcon />
                            </ListItemIcon>
                            {hamburgerVisible ? (
                                isNavOpen ? (
                                    <ListItemText
                                        primary={'Logout'}></ListItemText>
                                ) : null
                            ) : (
                                <ListItemText primary={'Logout'}></ListItemText>
                            )}
                        </ListItem>
                    </List>
                </div>
            </Drawer>
            <div className={classes.page}>{children}</div>
        </div>
    );
}
