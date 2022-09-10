import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Auth, API } from 'aws-amplify';
import { AmplifyS3Image } from '@aws-amplify/ui-react/legacy';
import PictureNotFound from '../../Assets/404Painting.jpg';
import Button from '@mui/material/Button';
import ExitToApp from '@mui/icons-material/ExitToApp';
export default function AllArtistsAdmin(user) {
    let [artists, setArtists] = useState([]);
    let [error, setError] = useState('');
    useEffect(() => {
        getAllArtists();
    }, []);
    const onLoadedImage = (e) => {
        if (e && e.returnValue === true) {
            setError('Error');
        }
    };

    let nextToken;
    async function getAllArtists() {
        let apiName = 'AdminQueries';
        let path = '/listUsers';
        let myInit = {
            queryStringParameters: {
                limit: 0,
                token: nextToken
            },
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${(await Auth.currentSession())
                    .getAccessToken()
                    .getJwtToken()}`
            }
        };
        const { NextToken, ...rest } = await API.get(apiName, path, myInit);
        nextToken = NextToken;
        setArtists(
            rest.Users.filter((el) => {
                return el.Attributes[0].Value !== user.user.attributes.sub;
            })
        );
    }

    const renderTable = () => {
        const columns = [
            {
                field: 'profile_image',
                headerName: 'Picture',
                width: 150,
                renderCell: (params) =>
                    params.value ? (
                        error ? (
                            <img
                                src={PictureNotFound}
                                style={{ height: 150, width: '100%' }}
                            />
                        ) : (
                            <AmplifyS3Image
                                imgProps={{
                                    style: { height: 150, width: '100%' },
                                    onError: onLoadedImage
                                }}
                                level='public'
                                imgKey={`profileImage/profile${params.value}.png`}
                            />
                        )
                    ) : (
                        <div>loading</div>
                    )
            },
            { field: 'name', headerName: 'First Name', width: 150 },
            {
                field: 'family_name',
                headerName: 'Last name',
                width: 150
            },
            {
                field: 'email',
                headerName: 'Email',
                width: 200,
                editable: true
            },
            {
                field: 'phone_number',
                headerName: 'Phone Number',
                width: 200,
                editable: true
            },
            {
                field: 'preferred_username',
                headerName: 'Username',
                width: 200
            },
            {
                field: 'status',
                headerName: 'User Status',
                width: 200
            }
        ];
        let rows = [];
        artists.map((artist, index1) => {
            //first get the attributes
            let userObjToPush = {};
            userObjToPush.id = index1 + 1;
            userObjToPush.status = artist.UserStatus;
            artist.Attributes.map((attribute, index2) => {
                if (attribute.Name === 'name') {
                    userObjToPush.name = attribute.Value;
                } else if (attribute.Name === 'email') {
                    userObjToPush.email = attribute.Value;
                } else if (attribute.Name === 'family_name') {
                    userObjToPush.family_name = attribute.Value;
                } else if (attribute.Name === 'preferred_username') {
                    userObjToPush.preferred_username = attribute.Value;
                } else if (attribute.Name === 'phone_number') {
                    userObjToPush.phone_number = attribute.Value;
                } else if (attribute.Name === 'sub') {
                    userObjToPush.profile_image = attribute.Value;
                }
                return userObjToPush;
            });
            return rows.push(userObjToPush);
        });
        return (
            <DataGrid
                rowHeight={100}
                rows={rows}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[5]}
                autoHeight
                disableSelectionOnClick
            />
        );
    };

    if (artists.length === 0) {
        return (
            <div
                style={{
                    display: 'flex',
                    height: '300px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column'
                }}>
                <h2>No Artists yet...</h2>
                <br></br>
                <Button
                    href='/home'
                    variant='contained'
                    color='secondary'>
                    Go Back Home
                    <ExitToApp />
                </Button>
            </div>
        );
    } else {
        return renderTable();
    }
}
