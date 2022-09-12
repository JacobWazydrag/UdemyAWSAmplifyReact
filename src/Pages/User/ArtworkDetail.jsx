import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getArtwork } from '../../graphql/queries';
import { API, graphqlOperation } from 'aws-amplify';
import ArtworkImage from './ArtworkImage';
import ArtworkInfo from './ArtworkInfo';
import { Grid, Paper, Container, Box } from '@mui/material';
import '@aws-amplify/ui-react/styles.css';
import awsExports from '../../aws-exports';
import { ArtworkUpdateForm } from './ArtworkUpdateForm';
import { ArtworkUpdateImage } from './ArtworkUpdateImage';
import { Amplify } from 'aws-amplify';

Amplify.configure(awsExports);

export default function ArtworkDetail() {
    const ID = useParams().id;
    const [artwork, setArtwork] = useState({});
    const [mode, setMode] = useState('Edit');
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

    return (
        <>
            {mode === 'View' ? (
                <>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <h1>
                            {Object.keys(artwork).length !== 0
                                ? artwork.title
                                : 'No Artwork Here'}
                        </h1>
                    </div>
                    <Grid
                        container
                        columns={2}
                        spacing={20}
                        justifyContent={'center'}>
                        <Grid item>
                            {Object.keys(artwork).length !== 0 ? (
                                <ArtworkImage detail={artwork} />
                            ) : null}
                        </Grid>
                        <Grid item>
                            <ArtworkInfo
                                refreshAction={refreshAction}
                                detail={artwork}
                            />
                        </Grid>
                    </Grid>
                </>
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
                                <Box
                                    component='main'
                                    sx={{
                                        flexGrow: 1,
                                        py: 8
                                    }}>
                                    <Container maxWidth='lg'>
                                        <Grid container spacing={3}>
                                            <Grid item lg={4} md={6} xs={12}>
                                                <ArtworkUpdateImage
                                                    detail={artwork}
                                                />
                                            </Grid>
                                            <Grid item lg={8} md={6} xs={12}>
                                                <ArtworkUpdateForm
                                                    detail={artwork}
                                                    refreshAction={refreshAction}
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
