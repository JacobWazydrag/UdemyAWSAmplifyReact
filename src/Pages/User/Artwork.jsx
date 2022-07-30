import React, { useEffect, useState } from 'react';
import { listArtworks } from '../../graphql/queries';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import { Card, CardContent, CardMedia, Grid, Typography } from '@mui/material';

export default function Artwork() {
    // const [hasError, setErrors] = useState(false);
    const [artworks, setArtworks] = useState([]);
    const [mainImageUrlFromArtworks, setMainImageUrlFromArtworks] = useState(
        []
    );
    useEffect(() => {
        getArtworks();
    }, []);

    useEffect(() => {
        getMainUrls();
    }, [artworks]);

    const getArtworks = async () => {
        await API.graphql(graphqlOperation(listArtworks))
            .then((el) => {
                setArtworks(el.data.listArtworks.items);
            })
            .catch((err) => console.log(err));
    };

    const returnMyUrlsForMainImage = async (image) => {
        return new Promise((resolve, reject) => {
            Storage.get(image.image1.key, { level: 'public' })
                .then((url) => resolve(url))
                .catch((err) => console.log(err));
            // let url2 = Storage.get(key, { level: 'public' });
        });
    };
    const getMainUrls = () => {
        let promises = [];
        artworks.map((image, i) => {
            return promises.push(returnMyUrlsForMainImage(image));
        });

        Promise.all(promises)
            .then((imageUrls) => {
                setMainImageUrlFromArtworks(imageUrls);
            })
            .catch((err) => {
                console.log('erre', err);
            });
    };

    const renderCards = artworks.map((artwork, index) => {
        return (
            <Grid key={index} item>
                <Card sx={{ maxWidth: 345 }}>
                    <a href={`/artwork/${artwork.id}`}>
                        <CardMedia
                            component='img'
                            height='194'
                            image={mainImageUrlFromArtworks[index]}
                            alt='Paella dish'
                        />
                    </a>
                    <CardContent>
                        <Typography variant='body2' color='text.secondary'>
                        {artwork.title}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                            {artwork.price}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                            {artwork.status}
                        </Typography>
                    </CardContent>
                </Card>
            </Grid>
        );
    });

    return (
        <Grid container spacing={4}>
            {artworks.length === 0 && mainImageUrlFromArtworks.length === 0 ? (
                <div
                    style={{
                        display: 'flex',
                        height: '300px',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}>
                    <h2>No post yet...</h2>
                </div>
            ) : (
                <>{renderCards}</>
            )}
            
        </Grid>
    );
}
