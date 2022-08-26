import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Auth, API, Storage } from 'aws-amplify';
import { AmplifyS3Image } from '@aws-amplify/ui-react/legacy';

export default function AllArtistsAdmin() {
    let [artists, setArtists] = useState([]);
    useEffect(() => {
        getAllArtists();
    }, []);
    Storage.list('', { level: 'private' })
        .then((result) => console.log(result))
        .catch((err) => console.log(err));
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
        setArtists(rest.Users);
    }

    const renderTable = () => {
        const columns = [
            {
                field: 'profile_image',
                headerName: 'Picture',
                width: 150,
                renderCell: (params) =>
                    params.value ? (
                        <AmplifyS3Image
                            imgProps={{ style: { height: 150, width: '100%' } }}
                            level='public'
                            imgKey={`profileImage/profile${params.value}.png`}
                        />
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
        return <div>Loading</div>;
    } else {
        return renderTable();
    }
}

// const columns = [
//     { field: 'id', headerName: 'ID', width: 90 },
//     {
//         field: 'firstName',
//         headerName: 'First name',
//         width: 150,
//         editable: true
//     },
//     {
//         field: 'lastName',
//         headerName: 'Last name',
//         width: 150,
//         editable: true
//     },
//     {
//         field: 'age',
//         headerName: 'Age',
//         type: 'number',
//         width: 110,
//         editable: true
//     },
//     {
//         field: 'fullName',
//         headerName: 'Full name',
//         description: 'This column has a value getter and is not sortable.',
//         sortable: false,
//         width: 160,
//         valueGetter: (params) => EXAMPLE OF GETTING STUFF FROM THE TABLE AND SHOWING IT
//             `${params.row.firstName || ''} ${params.row.lastName || ''}`
//     }
// // ];

// const rows = [
//     { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
//     { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
//     { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
//     { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
//     { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
//     { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
//     { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
//     { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
//     { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 }
// ];
