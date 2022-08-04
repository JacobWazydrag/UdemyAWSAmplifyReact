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
import { makeStyles } from '@mui/styles';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ArtSpaceLogo from '../Assets/ArtSpace_Logo.webp';

let drawerWidth = 240;

const useStyles = makeStyles({
    root: { display: 'flex' },
    page: {
        background: '#f9f9f9',
        width: '100%',
        padding: 50,
        marginBottom: 50
    },
    drawer: {
        width: drawerWidth,
        height: 'web-kit-available'
    },
    drawerPaper: {
        width: drawerWidth + 1
    },
    active: {
        background: '#f4f4f4'
    },
    drawerFooter: {
        position: 'absolute',
        bottom: '0px',
        width: drawerWidth,
        overflowWrap: 'break-word'
    }
});
export default function LayoutAdmin({ children, user, signout }) {
    const classes = useStyles();
    let navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { text: 'Home', icon: <HomeIcon color='primary' />, path: '/' },
        {
            text: 'All Artworks',
            icon: <PaletteIcon color='primary' />,
            path: '/all-artworks'
        },
        {
            text: 'All Artshows',
            icon: <StorefrontIcon color='primary' />,
            path: '/all-artshows'
        },
        {
            text: 'All Artists',
            icon: <GroupsIcon color='primary' />,
            path: '/all-artists'
        }
    ];
    return (
        <div className={classes.root}>
            {/* app bar */}
            <Drawer
                className={classes.drawer}
                variant='permanent'
                anchor='left'
                classes={{
                    paper: classes.drawerPaper
                }}>
                <div>
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
                    <Typography
                        style={{
                            padding: 10
                        }}
                        variant='h5'>
                        Admin Portal
                    </Typography>
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
                            <ListItemText primary={item.text}></ListItemText>
                        </ListItem>
                    ))}
                </List>
                <div className={classes.drawerFooter}>
                    <Divider style={{ width: 240 }} />
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
                            <ListItemText
                                primary={user.attributes.preferred_username}
                                secondary={'Admin'}></ListItemText>
                        </ListItem>
                        <ListItem button onClick={() => signout()}>
                            <ListItemIcon>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText primary={'Logout'}></ListItemText>
                        </ListItem>
                    </List>
                </div>
            </Drawer>
            <div className={classes.page}>{children}</div>
        </div>
    );
}
