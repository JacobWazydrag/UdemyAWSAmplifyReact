import React, { useState, useEffect } from 'react';
import { Storage } from 'aws-amplify';
import { AmplifyS3Image } from '@aws-amplify/ui-react/legacy';
import { Authenticator } from '@aws-amplify/ui-react';
import {
    Box,
    Card,
    CardActions,
    CardContent,
    Divider,
    Typography
} from '@mui/material';
import PictureNotFound from '../../Assets/404Painting.jpg';
import { Auth } from 'aws-amplify';
var _ = require('lodash');

export const ArtworkUpdateImage = (props) => {
    let [error, setError] = useState('');
    let [keys, setKeys] = useState('');
    const initializeForm = () => {
        if (
            props &&
            props.detail &&
            props.detail.image1 &&
            props.detail.image1.key
        ) {
            setKeys(props.detail.image1.key);
        }
    };
    useEffect(() => {
        initializeForm();
    }, [props]);
    const onLoadedImage = (e) => {
        if (e && e.returnValue === true) {
            setError('Error');
        }
    };
    async function uploadPhoto(file, id) {
        Storage.put(id, file, {
            contentType: file.type,
            level: 'public'
        })
            .then((result) => {
                console.log(result);
                // for the sake of the demo, force a reload to see the uploaded picture
                window.location.reload();
            })
            .catch((err) => console.log(err));
    }
    return (
        <Authenticator>
            {({ signOut, user }) => (
                <>
                    {keys && _.size(props.detail) !== 0 ? (
                        <Card {...props}>
                            <CardContent>
                                <Box
                                    sx={{
                                        alignItems: 'center',
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}>
                                    {error ? (
                                        <img
                                            src={PictureNotFound}
                                            style={{
                                                height: 300,
                                                width: '100%'
                                            }}
                                        />
                                    ) : (
                                        <AmplifyS3Image
                                            imgProps={{
                                                style: {
                                                    height: 300,
                                                    width: '100%'
                                                },
                                                onError: onLoadedImage
                                            }}
                                            level='public'
                                            imgKey={keys}
                                        />
                                    )}

                                    <Typography
                                        color='textPrimary'
                                        gutterBottom
                                        variant='h5'>
                                        {user.attributes.name}
                                    </Typography>
                                    <Typography
                                        color='textSecondary'
                                        variant='body2'>
                                        {`${
                                            user.attributes.city
                                                ? user.attributes.city
                                                : ''
                                        } ${
                                            user.attributes.zoneinfo
                                                ? user.attributes.zoneinfo
                                                : ''
                                        }`}
                                    </Typography>
                                    <Typography
                                        color='textSecondary'
                                        variant='body2'>
                                        {user.timezone}
                                    </Typography>
                                </Box>
                            </CardContent>
                            <Divider />
                            <CardActions>
                                <input
                                    type='file'
                                    accept='image/*'
                                    onChange={(e) =>
                                        uploadPhoto(e.target.files[0], keys)
                                    }
                                />
                            </CardActions>
                        </Card>
                    ) : (
                        <div>nothing</div>
                    )}
                </>
            )}
        </Authenticator>
    );
};
