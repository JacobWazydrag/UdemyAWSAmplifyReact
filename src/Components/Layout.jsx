import React, { useState, useEffect } from 'react';
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
import ChatIcon from '@mui/icons-material/Chat';
import { makeStyles } from '@mui/styles';
import { useLocation, useNavigate } from 'react-router-dom';
import ArtSpaceLogo from '../Assets/ArtSpace_Logo.webp';
import InfoIcon from '@mui/icons-material/Info';
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
export default function Layout({ children, user, signout }) {
    const isMobile = useMediaQuery({ query: `(max-width: 760px)` });
    const [hamburgerVisible, sethamburgerVisible] = useState(isMobile);
    const [isNavOpen, setIsNavOpen] = useState(false);

    useEffect(() => {
        sethamburgerVisible(isMobile);
    }, [isMobile]);
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
        },
        {
            text: 'Chat',
            icon: <ChatIcon color='primary' />,
            path: '/chat'
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
                                Artist Portal
                            </Typography>
                        ) : null
                    ) : (
                        <Typography
                            style={{
                                padding: 10
                            }}
                            variant='h5'>
                            Artist Portal
                        </Typography>
                    )}
                </div>
                <List>
                    {menuItems.map((item) => (
                        <ListItem
                            disabled={
                                !user.attributes.profile ||
                                !user.attributes.phone_number ||
                                !user.attributes.family_name ||
                                !user.attributes.name ||
                                !user.attributes['custom:profile_pic']
                            }
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
                                primary={
                                    user.attributes.name +
                                    ' ' +
                                    user.attributes.family_name
                                }
                                secondary={'Artist'}></ListItemText>
                            {!user.attributes.profile ||
                            !user.attributes.phone_number ||
                            !user.attributes.family_name ||
                            !user.attributes.name ||
                            !user.attributes['custom:profile_pic'] ? (
                                <InfoIcon style={{ color: 'orangered' }} />
                            ) : null}
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
