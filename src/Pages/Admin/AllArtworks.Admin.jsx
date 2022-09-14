import React, { useState, useEffect } from 'react';
import { MenuItem, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import ExitToApp from '@mui/icons-material/ExitToApp';
import { DataGrid } from '@mui/x-data-grid';
import {
    listArtworksWithArtshowsAdminWithStatus,
    listArtshowDescriptions
} from '../../graphql/queries';
import {
    createArtshowArtwork,
    updateArtshowArtwork
} from '../../graphql/mutations';
import { API, graphqlOperation, Storage } from 'aws-amplify';
export default function AllArtworksAdmin() {
    const [artworks, setArtworks] = useState([]);
    const [mainImageUrlFromArtworks, setMainImageUrlFromArtworks] = useState(
        []
    );

    const [descriptions, setDescriptions] = useState([]);

    useEffect(() => {
        getAllArworks();
    }, []);
    useEffect(() => {
        getAllArtshowSelections();
    }, []);

    useEffect(() => {
        getMainUrls();
    }, [artworks]);
    const refreshFunction = () => {
        getAllArworks();
    };
    async function getAllArworks() {
        await API.graphql(
            graphqlOperation(listArtworksWithArtshowsAdminWithStatus)
        )
            .then((el) => {
                setArtworks(el.data.listArtworks.items);
            })
            .catch((err) => console.log(err));
    }
    async function getAllArtshowSelections() {
        await API.graphql(graphqlOperation(listArtshowDescriptions))
            .then((el) => {
                setDescriptions(el.data.listArtshows.items);
            })
            .catch((err) => console.log(err));
    }
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
    const renderTable = () => {
        const columns = [
            { field: 'title', headerName: 'Title', width: 150 },
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
                field: 'status',
                headerName: 'Status',
                width: 200
            },
            {
                field: 'description',
                headerName: 'Description',
                width: 200
            },
            {
                field: 'goToDetail',
                headerName: 'Details',
                width: 200,
                renderCell: (params) => (
                    <a href={`/all-artworks/${params.value}`}>Go to Detail</a>
                )
            },
            {
                field: 'setArtshow',
                headerName: 'Apply to Artshow',
                width: 300,
                renderCell: (params) => (
                    <TextField
                        select
                        style={{ width: '100%' }}
                        value={params.value.artshow}
                        label='Artshow'
                        error={!params.value.artshow}
                        onChange={(e) =>
                            onUpdateArtshow({
                                artshowID: descriptions.filter((el) => {
                                    return el.description === e.target.value;
                                })[0].id,
                                artworkID: params.value.artworkID,
                                id: params.value.id
                            })
                        }>
                        {descriptions.length >= 1 ? (
                            descriptions.map((el, i) => {
                                return (
                                    <MenuItem key={i} value={el.description}>
                                        {el.description}
                                    </MenuItem>
                                );
                            })
                        ) : (
                            <MenuItem value={'NO ARTSHOWS'}>
                                NO ARTSHOWS
                            </MenuItem>
                        )}
                    </TextField>
                )
            }
        ];
        let rows = [];
        artworks.map((artwork, index1) => {
            //first get the attributes
            let userObjToPush = {};
            userObjToPush.id = index1 + 1;
            userObjToPush.status = artwork.status;
            userObjToPush.title = artwork.title;
            userObjToPush.description = artwork.description;
            userObjToPush.image = mainImageUrlFromArtworks[index1];
            userObjToPush.goToDetail = artwork.id;
            userObjToPush.setArtshow = {
                artworkID: artwork.id,
                artshowID:
                    artwork.artshows &&
                    artwork.artshows.items &&
                    artwork.artshows.items.length > 0 &&
                    artwork.artshows.items[0] &&
                    artwork.artshows.items[0].artshow &&
                    artwork.artshows.items[0].artshow.id
                        ? artwork.artshows.items[0].artshow.id
                        : '',
                artshow:
                    artwork.artshows &&
                    artwork.artshows.items &&
                    artwork.artshows.items.length > 0 &&
                    artwork.artshows.items[0] &&
                    artwork.artshows.items[0].artshow &&
                    artwork.artshows.items[0].artshow.description
                        ? artwork.artshows.items[0].artshow.description
                        : '',
                id:
                    artwork.artshows &&
                    artwork.artshows.items &&
                    artwork.artshows.items.length > 0 &&
                    artwork.artshows.items[0] &&
                    artwork.artshows.items[0].id
                        ? artwork.artshows.items[0].id
                        : ''
            };

            return rows.push(userObjToPush);
        });
        const onUpdateArtshow = async (updateObj) => {
            if (!updateObj.id) {
                let createInputs = {
                    artshowID: updateObj.artshowID,
                    artworkID: updateObj.artworkID
                };
                await API.graphql(
                    graphqlOperation(createArtshowArtwork, {
                        input: createInputs
                    })
                )
                    .then((el) => console.log('upload successful', el))
                    .catch((err) => {
                        console.log('AllArtworksAdmin line 199 err: ', err);
                    });
                refreshFunction();
            } else {
                let updateInputs = {
                    id: updateObj.id,
                    artshowID: updateObj.artshowID,
                    artworkID: updateObj.artworkID
                };
                
                await API.graphql(
                    graphqlOperation(updateArtshowArtwork, {
                        input: updateInputs
                    })
                )
                    .then((el) => {
                        console.log('success!', el);
                    })
                    .catch((err) => {
                        console.log('AllArtworks err 218', err);
                    });
                refreshFunction();
            }
        };
        return (
            <DataGrid
                rows={rows}
                rowHeight={150}
                autoHeight
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
            />
        );
    };
    if (artworks.length === 0) {
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
        return renderTable();
    }
}
