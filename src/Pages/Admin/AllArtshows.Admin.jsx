import React, { useState, useEffect } from 'react';
import { Stack, Alert } from '@mui/material';
import Button from '@mui/material/Button';
import ExitToApp from '@mui/icons-material/ExitToApp';
import { DataGrid } from '@mui/x-data-grid';
import { listArtshows } from '../../graphql/queries';
import Badge from '@mui/material/Badge';
import BurstModeIcon from '@mui/icons-material/BurstMode';
import { API, graphqlOperation, Storage } from 'aws-amplify';
export default function AllArtshowsAdmin() {
    const [artShows, setArtshows] = useState([]);
    const [mainImageUrlFromArtworks, setMainImageUrlFromArtworks] = useState(
        []
    );
    const [formFeedback, setFormFeedback] = useState(null);
    const closeDialog = () => {
        setFormFeedback(null);
    };

    useEffect(() => {
        getAllArtshows();
    }, []);

    useEffect(() => {
        getMainUrls();
    }, [artShows]);

    const refreshFunction = () => {
        getAllArtshows();
    };
    async function getAllArtshows() {
        await API.graphql(graphqlOperation(listArtshows))
            .then((el) => {
                setArtshows(el.data.listArtshows.items);
            })
            .catch((err) => console.log(err));
    }

    const returnMyUrlsForMainImage = async (image) => {
        return new Promise((resolve, reject) => {
            Storage.get(image.image1.key, { level: 'public' })
                .then((url) => resolve(url))
                .catch((err) => console.log(err));
        });
    };
    const getMainUrls = () => {
        let promises = [];
        artShows.map((image, i) => {
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

    // return <div>working....</div>;

    // const onSubmit = async (params, event) => {
    //     let value;

    //     if (params.field === 'price') {
    //         value = parseFloat(params.value.trim().replace(/\$/g, ''));
    //     } else if (params.field === 'dimensionsH') {
    //         value = parseFloat(
    //             typeof params.value === 'string'
    //                 ? params.value.trim()
    //                 : params.value
    //         );
    //     } else if (params.field === 'dimensionsW') {
    //         value = parseFloat(
    //             typeof params.value === 'string'
    //                 ? params.value.trim()
    //                 : params.value
    //         );
    //     } else if (params.field === 'isFramed') {
    //         if (params.value.toUpperCase() === 'YES') {
    //             value = true;
    //         } else if (params.value.toUpperCase() === 'NO') {
    //             value = false;
    //         } else {
    //             getAllArworks();
    //             return alert('type yes or no');
    //         }
    //     } else {
    //         value = params.value;
    //     }

    //     const inputs = {};
    //     inputs[params.field] = value;
    //     inputs.id = params.id;
    //     inputs.status = 'EDITED';

    //     API.graphql(graphqlOperation(updateArtwork, { input: inputs }))
    //         .then((el) => {
    //             getAllArworks();
    //             setFormFeedback('success');
    //         })
    //         .catch((err) => {
    //             console.log('ArtworkUpdateTable line 85 err: ', err);
    //             getAllArworks();
    //             return alert('There was an error!');
    //         });
    // };

    const renderTable = () => {
        const columns = [
            {
                field: 'image',
                headerName: 'Main Artwork Image',
                width: 200,
                renderCell: (params) => (
                    <img
                        style={{ width: '100%', height: 150 }}
                        src={params.value}
                        alt='test'
                    />
                )
            },
            {
                field: 'images',
                headerName: 'Artworks',
                width: 200,
                align: 'center',
                renderCell: (params) => (
                    <Badge badgeContent={params.value.length} color='primary'>
                        <BurstModeIcon
                            style={{ fontSize: 50 }}
                            color='action'
                        />
                    </Badge>
                )
            },
            { editable: true, field: 'title', headerName: 'Title', width: 150 },
            {
                editable: true,
                field: 'description',
                headerName: 'Description',
                width: 150
            },
            {
                editable: true,
                field: 'time_period_showing_start',
                headerName: 'Showing Start Date',
                width: 150
            },
            {
                editable: true,
                field: 'time_period_showing_end',
                headerName: 'Showing End Date',
                width: 150
            },
            {
                editable: true,
                field: 'time_period_reception_start',
                headerName: 'Reception Start Date',
                width: 150
            },
            {
                editable: true,
                field: 'time_period_reception_end',
                headerName: 'Reception End Date',
                width: 150
            },
            {
                editable: true,
                field: 'locationContactInformationName',
                headerName: 'Location Name',
                width: 150
            },
            {
                editable: true,
                field: 'locationContactInformationPhone',
                headerName: 'Location Phone',
                width: 150
            },
            {
                editable: true,
                field: 'locationContactInformationAddress',
                headerName: 'Location Address',
                width: 150
            },
            {
                editable: true,
                field: 'locationContactInformationCity',
                headerName: 'Location City',
                width: 150
            },
            {
                editable: true,
                field: 'locationContactInformationState',
                headerName: 'Location State',
                width: 150
            },
            {
                editable: true,
                field: 'locationContactInformationZipcode',
                headerName: 'Location Zip',
                width: 150
            },
            {
                editable: true,
                field: 'locationContactInformationEmail',
                headerName: 'Location Email',
                width: 150
            },
            {
                editable: true,
                field: 'locationContactInformationWebsite',
                headerName: 'Location Website',
                width: 150
            },
            {
                field: 'status',
                headerName: 'Status',
                width: 200
            },
            {
                field: 'goToDetail',
                headerName: 'Details',
                width: 200,
                renderCell: (params) => (
                    <a href={`/all-artworks/${params.value}`}>Go to Detail</a>
                )
            }
        ];
        let rows = [];
        artShows.map((artshow, index1) => {
            //first get the attributes
            let userObjToPush = {};
            userObjToPush.id = artshow.id;
            userObjToPush.status = artshow.status;
            userObjToPush.title = artshow.title;
            userObjToPush.description = artshow.description;
            userObjToPush.time_period_showing_start = artshow.time_period_showing_start;
            userObjToPush.time_period_reception_start = artshow.time_period_reception_start;
            userObjToPush.time_period_showing_end = artshow.time_period_showing_end;
            userObjToPush.time_period_reception_end = artshow.time_period_reception_end;
            userObjToPush.locationContactInformationName =
                artshow.locationContactInformationName;
            userObjToPush.locationContactInformationPhone =
                artshow.locationContactInformationPhone;
            userObjToPush.locationContactInformationAddress =
                artshow.locationContactInformationAddress;
            userObjToPush.locationContactInformationCity =
                artshow.locationContactInformationCity;
            userObjToPush.locationContactInformationState =
                artshow.locationContactInformationState;
            userObjToPush.locationContactInformationZipcode =
                artshow.locationContactInformationZipcode;
            userObjToPush.locationContactInformationEmail =
                artshow.locationContactInformationEmail;
            userObjToPush.locationContactInformationWebsite =
                artshow.locationContactInformationWebsite;
            userObjToPush.image = mainImageUrlFromArtworks[index1];
            userObjToPush.images = artshow.artworks.items;
            userObjToPush.goToDetail = artshow.id;

            return rows.push(userObjToPush);
        });
        // const onUpdateArtshow = async (updateObj) => {
        //     if (!updateObj.id) {
        //         let createInputs = {
        //             artshowID: updateObj.artshowID,
        //             artworkID: updateObj.artworkID
        //         };
        //         await API.graphql(
        //             graphqlOperation(createArtshowArtwork, {
        //                 input: createInputs
        //             })
        //         )
        //             .then((el) => console.log('upload successful', el))
        //             .catch((err) => {
        //                 console.log('AllArtworksAdmin line 199 err: ', err);
        //             });
        //         refreshFunction();
        //     } else {
        //         let updateInputs = {
        //             id: updateObj.id,
        //             artshowID: updateObj.artshowID,
        //             artworkID: updateObj.artworkID
        //         };

        //         await API.graphql(
        //             graphqlOperation(updateArtshowArtwork, {
        //                 input: updateInputs
        //             })
        //         )
        //             .then((el) => {
        //                 console.log('success!', el);
        //             })
        //             .catch((err) => {
        //                 console.log('AllArtworks err 218', err);
        //             });
        //         refreshFunction();
        //     }
        // };
        return (
            <DataGrid
                rows={rows}
                rowHeight={150}
                autoHeight
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
                // onCellEditCommit={(params, event) => {
                //     onSubmit(params, event);
                // }}
            />
        );
    };
    console.log(artShows);
    if (artShows.length === 0) {
        return (
            <div
                style={{
                    display: 'flex',
                    height: '300px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column'
                }}>
                <h2>No Artworks yet...</h2>
                <br></br>
                <Button href='/home' variant='contained' color='secondary'>
                    Go Back Home
                    <ExitToApp />
                </Button>
            </div>
        );
    } else {
        return (
            <>
                {renderTable()}
                <Stack sx={{ width: '100%' }} spacing={2}>
                    {formFeedback && (
                        <Alert
                            severity={formFeedback}
                            onClose={() => {
                                closeDialog();
                            }}>
                            {formFeedback
                                ? formFeedback === 'success'
                                    ? 'Saved!'
                                    : 'Error!'
                                : ''}
                        </Alert>
                    )}
                </Stack>
            </>
        );
    }
}
