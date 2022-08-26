import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getArtwork } from '../../graphql/queries';
import { API, graphqlOperation } from 'aws-amplify';
import AllArtworkImageAdmin from './AllArtworkImage.Admin';
import AllArtworkInfoAdmin from './AllArtworkInfo.Admin';
import { Grid } from '@mui/material';

export default function AllArtworksDetailAdmin() {
    const ID = useParams().id;
    const [artwork, setArtwork] = useState({});
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
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <h1>
                    {Object.keys(artwork).length !== 0
                        ? artwork.title
                        : 'No Artwork Here'}
                </h1>
            </div>
            <Grid container columns={2} spacing={20} justifyContent={'center'}>
                <Grid item>
                    {Object.keys(artwork).length !== 0 ? (
                        <AllArtworkImageAdmin detail={artwork} />
                    ) : null}
                </Grid>
                <Grid item>
                    <AllArtworkInfoAdmin refreshAction={refreshAction} detail={artwork} />
                </Grid>
            </Grid>
        </>
    );
}

