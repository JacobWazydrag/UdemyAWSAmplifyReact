import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getArtwork } from '../../graphql/queries';
import { API, graphqlOperation } from 'aws-amplify';
import AllArtworkImage from './AllArtworkImage.Admin';
import AllArtworkInfo from './AllArtworkInfo.Admin';
import {
    Grid,
    Paper,
    Container,
    Box,
    Stack,
    Typography,
    Switch
} from '@mui/material';
import '@aws-amplify/ui-react/styles.css';
import { ArtworkUpdateFormAdmin } from './ArtworkUpdateForm.Admin';
import { ArtworkUpdateImageAdmin } from './ArtworkUpdateImage.Admin';
import { styled } from '@mui/material/styles';


export default function AllArtworksDetailAdmin() {
    const ID = useParams().id;
    const [artwork, setArtwork] = useState({});
    const [mode, setMode] = useState('View');
    useEffect(() => {
        API.graphql(graphqlOperation(getArtwork, { id: ID }))
            .then((el) => {
                setArtwork(el.data.getArtwork);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const refreshAction = () => {
        API.graphql(graphqlOperation(getArtwork, { id: ID }))
            .then((el) => {
                setArtwork(el.data.getArtwork);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const AntSwitch = styled(Switch)(({ theme }) => ({
        width: 28,
        height: 16,
        padding: 0,
        display: 'flex',
        '&:active': {
            '& .MuiSwitch-thumb': {
                width: 15
            },
            '& .MuiSwitch-switchBase.Mui-checked': {
                transform: 'translateX(9px)'
            }
        },
        '& .MuiSwitch-switchBase': {
            padding: 2,
            '&.Mui-checked': {
                transform: 'translateX(12px)',
                color: '#fff',
                '& + .MuiSwitch-track': {
                    opacity: 1,
                    backgroundColor:
                        theme.palette.mode === 'dark' ? '#177ddc' : '#1890ff'
                }
            }
        },
        '& .MuiSwitch-thumb': {
            boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
            width: 12,
            height: 12,
            borderRadius: 6,
            transition: theme.transitions.create(['width'], {
                duration: 200
            })
        },
        '& .MuiSwitch-track': {
            borderRadius: 16 / 2,
            opacity: 1,
            backgroundColor:
                theme.palette.mode === 'dark'
                    ? 'rgba(255,255,255,.35)'
                    : 'rgba(0,0,0,.25)',
            boxSizing: 'border-box'
        }
    }));
    const handleView = (mode) => {
        setMode(mode);
    };

    return (
        <>
            {mode === 'View' ? (
                <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Paper
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                <Stack
                                    direction='row'
                                    spacing={1}
                                    alignItems='center'>
                                    <Typography>View</Typography>
                                    <AntSwitch
                                        onChange={() => handleView('Edit')}
                                        inputProps={{
                                            'aria-label': 'ant design'
                                        }}
                                    />
                                    <Typography>Edit</Typography>
                                </Stack>
                                <Box
                                    component='main'
                                    sx={{
                                        flexGrow: 1,
                                        py: 8
                                    }}>
                                    <Container maxWidth='lg'>
                                        <Grid container>
                                            <Grid item lg={4} md={6} xs={12}>
                                                {Object.keys(artwork).length !==
                                                0 ? (
                                                    <AllArtworkImage
                                                        detail={artwork}
                                                    />
                                                ) : null}
                                            </Grid>
                                            <Grid
                                                item
                                                lg={8}
                                                md={6}
                                                xs={12}
                                                style={{ paddingLeft: 10 }}>
                                                <AllArtworkInfo
                                                    refreshAction={
                                                        refreshAction
                                                    }
                                                    detail={artwork}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Container>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            ) : (
                <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Paper
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                <Stack
                                    direction='row'
                                    spacing={1}
                                    alignItems='center'>
                                    <Typography>View</Typography>
                                    <AntSwitch
                                        onChange={() => handleView('View')}
                                        checked={mode === 'View' ? false : true}
                                        inputProps={{
                                            'aria-label': 'ant design'
                                        }}
                                    />
                                    <Typography>Edit</Typography>
                                </Stack>
                                <Box
                                    component='main'
                                    sx={{
                                        flexGrow: 1,
                                        py: 8
                                    }}>
                                    <Container maxWidth='lg'>
                                        <Grid container spacing={3}>
                                            <Grid item lg={4} md={6} xs={12}>
                                                <ArtworkUpdateImageAdmin
                                                    detail={artwork}
                                                    refreshAction={
                                                        refreshAction
                                                    }
                                                />
                                            </Grid>
                                            <Grid item lg={8} md={6} xs={12}>
                                                <ArtworkUpdateFormAdmin
                                                    detail={artwork}
                                                    refreshAction={
                                                        refreshAction
                                                    }
                                                />
                                            </Grid>
                                        </Grid>
                                    </Container>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            )}
        </>
    );
}
