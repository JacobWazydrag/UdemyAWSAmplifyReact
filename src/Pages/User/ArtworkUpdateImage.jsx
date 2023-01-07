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
    CircularProgress
} from '@mui/material';
var _ = require('lodash');

export const ArtworkUpdateImage = (props) => {
    let [error, setError] = useState('');
    let [loading, setLoading] = useState(false);
    let [loadingKey, setLoadingKey] = useState('');

    const onLoadedImage = (e) => {
        if (e && e.returnValue === true) {
            setError('Error');
        }
    };
    async function uploadPhoto(file, id) {
        setLoading(true);
        setLoadingKey(id);
        Storage.put(id, file, {
            contentType: file.type,
            level: 'public'
        })
            .then((result) => {
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
            })
            .catch((err) => console.log(err));
    }

    const renderUploadInputs = () => {
        let returnInputs = _.map(props.detail, (value, key) => {
            console.log(key.includes('image'));
            if (key.includes('image')) {
                if (value) {
                    return (
                        <div key={key + 'div'}>
                            <>
                                <CardContent key={key + 'content'}>
                                    <Box
                                        key={key + 'box'}
                                        sx={{
                                            alignItems: 'center',
                                            display: 'flex',
                                            flexDirection: 'column'
                                        }}>
                                        {loading && loadingKey === value.key ? (
                                            <Box
                                                style={{
                                                    minHeight: 300,
                                                    minWidth: '100%'
                                                }}>
                                                <CircularProgress />
                                            </Box>
                                        ) : error ? (
                                            <Box
                                                style={{
                                                    minHeight: 300,
                                                    minWidth: '100%'
                                                }}>
                                                <CircularProgress />
                                            </Box>
                                        ) : (
                                            <AmplifyS3Image
                                                key={key + 's3image'}
                                                imgProps={{
                                                    style: {
                                                        height: 300,
                                                        width: '100%'
                                                    },
                                                    onError: onLoadedImage
                                                }}
                                                level='public'
                                                imgKey={value.key}
                                            />
                                        )}
                                    </Box>
                                </CardContent>
                                <Divider key={key + 'divider'} />
                                <CardActions key={key + 'cardActions'}>
                                    <input
                                        key={key + 'input'}
                                        type='file'
                                        accept='image/*'
                                        onChange={(e) =>
                                            uploadPhoto(
                                                e.target.files[0],
                                                value.key
                                            )
                                        }
                                    />
                                </CardActions>
                            </>
                        </div>
                    );
                }
            }
        });
        return returnInputs;
    };
    return (
        <Authenticator>
            {({ signOut, user }) => (
                <>
                    {_.size(props.detail) !== 0 ? (
                        <Card>{renderUploadInputs()}</Card>
                    ) : (
                        // )
                        <div>nothing</div>
                    )}
                </>
            )}
        </Authenticator>
    );
};
