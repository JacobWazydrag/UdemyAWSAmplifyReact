import React, { useState } from 'react';
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

export const AccountProfile = (props) => {
    let [error, setError] = useState('');
    const onLoadedImage = (e) => {
        if (e && e.returnValue === true) {
            setError('Error');
        }
    };
    async function uploadPhoto(file, id) {
        Storage.put(`profileImage/profile${id}.png`, file, {
            contentType: 'image/png',
            level: 'public'
        })
            .then((result) => {
                console.log(result);
                // for the sake of the demo, force a reload to see the uploaded picture
                window.location.reload();
            })
            .catch((err) => console.log(err));
        try {
            const user = await Auth.currentAuthenticatedUser();
            await Auth.updateUserAttributes(user, {
                'custom:profile_pic': `profileImage/profile${id}.png`
            });
            setError('success');
        } catch (error) {
            console.log(error);
            setError('error');
        }
    }
    return (
        <Authenticator>
            {({ signOut, user }) => (
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
                                    style={{ height: 300, width: '100%' }}
                                />
                            ) : (
                                <AmplifyS3Image
                                    imgProps={{
                                        style: { height: 300, width: '100%' },
                                        onError: onLoadedImage
                                    }}
                                    level='public'
                                    imgKey={`profileImage/profile${user.username}.png`}
                                />
                            )}

                            <Typography
                                color='textPrimary'
                                gutterBottom
                                variant='h5'>
                                {user.attributes.name}
                            </Typography>
                            <Typography color='textSecondary' variant='body2'>
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
                            <Typography color='textSecondary' variant='body2'>
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
                                uploadPhoto(e.target.files[0], user.username)
                            }
                        />
                    </CardActions>
                </Card>
            )}
        </Authenticator>
    );
};
