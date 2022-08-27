import React, { useState, useEffect } from 'react';
import {
    Button,
    ButtonGroup,
    Card,
    CardContent,
    CardHeader,
    Grid,
    Skeleton,
    Typography
} from '@mui/material';
import PublishIcon from '@mui/icons-material/Publish';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { deleteArtwork, updateArtwork } from '../../graphql/mutations';
import { API, graphqlOperation } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';

export default function ArtworkInfo(props) {
    const [artwork, setArtwork] = useState({});

    useEffect(() => {
        setArtwork(props.detail);
    }, [props.detail]);

    let navigate = useNavigate();

    const removeArtwork = async (id) => {
        await API.graphql(graphqlOperation(deleteArtwork, { input: { id } }))
            .then((el) => {
                setTimeout(() => {
                    navigate('/artwork', { replace: true });
                }, 500);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const updateArtworkStatus = async (id) => {
        await API.graphql(
            graphqlOperation(updateArtwork, {
                input: { id: id, status: 'PUBLISHED' }
            })
        )
            .then((el) => {
                setTimeout(() => {
                    props.refreshAction()
                }, 500);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    return (
        <>
            {Object.keys(props.detail).length === 0 ? (
                <Skeleton>
                    <Card style={{ maxWidth: 500, minWidth: 200 }}>
                        <CardHeader
                            title='Publish Your Artwork Here'
                            subheader='By pressing Publish you set your artwork to be approved. You cannot edit it after it is published.'></CardHeader>
                        <CardContent>
                            <Grid container>
                                <Grid item xs={6}>
                                    <Typography> Price: </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography> $</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography> Title: </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography> </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography> Description: </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography> </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography>Status: </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography></Typography>
                                </Grid>
                            </Grid>
                            <ButtonGroup
                                style={{ marginTop: '20px' }}
                                disableElevation
                                variant='contained'>
                                <Button
                                    style={{ marginRight: '10px' }}
                                    variant='contained'
                                    endIcon={<PublishIcon />}>
                                    Publish
                                </Button>
                                <Button
                                    style={{ marginRight: '10px' }}
                                    variant='contained'
                                    color='error'
                                    endIcon={<DeleteForeverIcon />}>
                                    Delete forever
                                </Button>
                            </ButtonGroup>
                        </CardContent>
                    </Card>
                </Skeleton>
            ) : (
                <Card style={{ maxWidth: 500, minWidth: 200 }}>
                    <CardHeader
                        title='Publish Your Artwork Here'
                        subheader='By pressing Publish you set your artwork to be approved. You cannot edit it after it is published.'></CardHeader>
                    <CardContent>
                        <Grid container>
                            <Grid item xs={6}>
                                <Typography> Price: </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography> ${artwork.price}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography> Title: </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography> {artwork.title}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography> Description: </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography> {artwork.description}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography>Status: </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography>{artwork.status}</Typography>
                            </Grid>
                        </Grid>
                        <ButtonGroup
                            style={{ marginTop: '20px' }}
                            disableElevation
                            variant='contained'>
                            <Button
                                onClick={() => {
                                    updateArtworkStatus(props.detail.id);
                                }}
                                style={{ marginRight: '10px' }}
                                variant='contained'
                                endIcon={<PublishIcon />}>
                                Publish
                            </Button>
                            <Button
                                onClick={() => removeArtwork(props.detail.id)}
                                style={{ marginRight: '10px' }}
                                variant='contained'
                                color='error'
                                endIcon={<DeleteForeverIcon />}>
                                Delete forever
                            </Button>
                        </ButtonGroup>
                    </CardContent>
                </Card>
            )}
        </>
    );
}