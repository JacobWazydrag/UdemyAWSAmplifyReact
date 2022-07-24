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
import FaceIcon from '@mui/icons-material/Face';
import LogoutIcon from '@mui/icons-material/Logout';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { makeStyles } from '@mui/styles';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

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
export default function Layout({ children, user, signout }) {
    const classes = useStyles();
    let navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        { text: 'Home', icon: <HomeIcon color='primary' />, path: '/' },
        {
            text: 'Artworks',
            icon: <PaletteIcon color='primary' />,
            path: '/artwork'
        },
        {
            text: 'Artshows',
            icon: <StorefrontIcon color='primary' />,
            path: '/artshow'
        },
        {
            text: 'Upload Artwork',
            icon: <FileUploadIcon color='primary' />,
            path: '/upload-artwork'
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
                    <Typography variant='h5'>Udemy Notes</Typography>
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
                            key={'profile'}
                            button
                            onClick={() => navigate('/profile')}
                            style={
                                location.pathname === '/profile'
                                    ? { background: '#f4f4f4' }
                                    : null
                            }>
                            <ListItemIcon>
                                <FaceIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary={user.attributes.preferred_username}
                                secondary={'Artist'}></ListItemText>
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
