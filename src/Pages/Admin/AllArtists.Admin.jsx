import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { API } from 'aws-amplify';
import { AmplifyS3Image } from '@aws-amplify/ui-react/legacy';
import {
    Button,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Stack,
    Alert,
    Fade
} from '@mui/material';
import ExitToApp from '@mui/icons-material/ExitToApp';
var _ = require('underscore');

export default function AllArtistsAdmin(props) {
    let [artists, setArtists] = useState([]);
    let [artistsGroups, setArtistsGroups] = useState([]);
    const [formFeedback, setFormFeedback] = useState(null);

    useEffect(() => {
        getAllArtists();
    }, []);

    useEffect(() => {
        getGroups();
    }, [artists]);

    const closeDialog = () => {
        setFormFeedback(null);
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
                Authorization: `${props.user
                    .getSignInUserSession()
                    .getAccessToken()
                    .getJwtToken()}`
            }
        };
        const { NextToken, ...rest } = await API.get(apiName, path, myInit);
        nextToken = NextToken;
        setArtists(
            rest.Users.filter((el) => {
                return el.Attributes[0].Value !== props.user.attributes.sub;
            })
        );
    }

    async function listGroupsForUser(id) {
        return new Promise((resolve, reject) => {
            let apiName = 'AdminQueries';
            let path = '/listGroupsForUser';
            let myInit = {
                queryStringParameters: {
                    username: id
                },
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${props.user
                        .getSignInUserSession()
                        .getAccessToken()
                        .getJwtToken()}`
                }
            };
            API.get(apiName, path, myInit)
                .then((returnQuery) => {
                    resolve({ id: id, groups: returnQuery.Groups });
                })
                .catch((err) => console.log(err));
        });
    }

    const getGroups = () => {
        let promises = [];
        artists.map((artist, i) => {
            return promises.push(listGroupsForUser(artist.Username));
        });

        Promise.all(promises)
            .then((groupProms) => {
                setArtistsGroups(groupProms);
            })
            .catch((err) => {
                console.log('erre', err);
            });
    };

    async function addToGroup(id, group) {
        let apiName = 'AdminQueries';
        let path = '/addUserToGroup';
        let myInit = {
            body: {
                username: id,
                groupname: group
            },
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${props.user
                    .getSignInUserSession()
                    .getAccessToken()
                    .getJwtToken()}`
            }
        };
        return await API.post(apiName, path, myInit)
            .then((el) => {
                getGroups();
                setFormFeedback('success');
            })
            .catch((err) => {
                setFormFeedback('error');
                console.log(err);
            });
    }

    async function removeFromGroup(id, group) {
        let apiName = 'AdminQueries';
        let path = '/removeUserFromGroup';
        let myInit = {
            body: {
                username: id,
                groupname: group
            },
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${props.user
                    .getSignInUserSession()
                    .getAccessToken()
                    .getJwtToken()}`
            }
        };
        return await API.post(apiName, path, myInit)
            .then((el) => {
                getGroups();
                setFormFeedback('success');
            })
            .catch((err) => {
                setFormFeedback('error');
                console.log(err);
            });
    }

    const renderTable = () => {
        const columns = [
            {
                field: 'profile_image',
                headerName: 'Picture',
                width: 150,
                renderCell: (params) => (
                    <AmplifyS3Image
                        imgProps={{
                            style: { height: 150, width: '100%' }
                        }}
                        level='public'
                        imgKey={`profileImage/profile${params.value}.png`}
                    />
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
            },
            {
                field: 'setGroups',
                headerName: 'Assign Group',
                width: 150,
                renderCell: (params) => (
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={
                                        params.value.groups.includes('Admin')
                                            ? true
                                            : false
                                    }
                                    onChange={(e) => {
                                        if (e.target.checked === false) {
                                            removeFromGroup(
                                                params.value.id,
                                                'Admin'
                                            );
                                        } else {
                                            addToGroup(
                                                params.value.id,
                                                'Admin'
                                            );
                                        }
                                    }}
                                />
                            }
                            label='Admin'
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={
                                        params.value.groups.includes('Artists')
                                            ? true
                                            : false
                                    }
                                    onChange={(e) => {
                                        if (e.target.checked === false) {
                                            removeFromGroup(
                                                params.value.id,
                                                'Artists'
                                            );
                                        } else {
                                            addToGroup(
                                                params.value.id,
                                                'Artists'
                                            );
                                        }
                                    }}
                                />
                            }
                            label='Artists'
                        />
                    </FormGroup>
                )
            }
        ];
        let rows = [];
        artists.map((artist, index1) => {
            let myGroupsObj = _.filter(artistsGroups, (artistGroups) => {
                return artistGroups.id === artist.Username;
            })[0];
            let myGroupNames = myGroupsObj
                ? _.pluck(myGroupsObj.groups, 'GroupName')
                : [''];
            //first get the attributes
            let userObjToPush = {};
            userObjToPush.id = index1 + 1;
            userObjToPush.status = artist.UserStatus;
            userObjToPush.setGroups = {
                groups: myGroupNames,
                id: artist.Username
            };
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
            <>
                <DataGrid
                    rowHeight={100}
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[5]}
                    autoHeight
                    disableSelectionOnClick
                />
                <Fade in={!!formFeedback} >
                    <Stack sx={{ width: '100%' }} spacing={2}>
                        {formFeedback && (
                            <Alert
                                severity={formFeedback}
                                variant='filled'
                                onClose={() => {
                                    closeDialog();
                                }}>
                                {formFeedback
                                    ? formFeedback === 'success'
                                        ? 'Updated Role!'
                                        : 'Error in updating Role!'
                                    : ''}
                            </Alert>
                        )}
                    </Stack>
                </Fade>
            </>
        );
    };

    if (artists.length === 0 && artistsGroups.length === 0) {
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
                <Button href='/home' variant='contained' color='secondary'>
                    Go Back Home
                    <ExitToApp />
                </Button>
            </div>
        );
    } else {
        return renderTable();
    }
}
