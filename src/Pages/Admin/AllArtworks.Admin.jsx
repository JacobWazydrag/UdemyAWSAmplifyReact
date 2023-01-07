import React, { useState, useEffect } from 'react';
import { MenuItem, TextField, Stack, Alert } from '@mui/material';
import Button from '@mui/material/Button';
import ExitToApp from '@mui/icons-material/ExitToApp';
import { DataGrid } from '@mui/x-data-grid';
import {
    listArtworksWithArtshowsAdminWithStatus,
    listArtshowTitles
} from '../../graphql/queries';
import {
    createArtshowArtwork,
    updateArtshowArtwork,
    updateArtwork
} from '../../graphql/mutations';
import { API, graphqlOperation, Storage } from 'aws-amplify';
export default function AllArtworksAdmin() {
    const [artworks, setArtworks] = useState([]);
    const [mainImageUrlFromArtworks, setMainImageUrlFromArtworks] = useState(
        []
    );
    const [formFeedback, setFormFeedback] = useState(null);
    const [titles, setTitles] = useState([]);
    const closeDialog = () => {
        setFormFeedback(null);
    };

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
        await API.graphql(graphqlOperation(listArtshowTitles))
            .then((el) => {
                setTitles(el.data.listArtshows.items);
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

    const onSubmit = async (params, event) => {
        let value;

        if (params.field === 'price') {
            value = parseFloat(params.value.trim().replace(/\$/g, ''));
        } else if (params.field === 'dimensionsH') {
            value = parseFloat(
                typeof params.value === 'string'
                    ? params.value.trim()
                    : params.value
            );
        } else if (params.field === 'dimensionsW') {
            value = parseFloat(
                typeof params.value === 'string'
                    ? params.value.trim()
                    : params.value
            );
        } else if (params.field === 'isFramed') {
            if (params.value.toUpperCase() === 'YES') {
                value = true;
            } else if (params.value.toUpperCase() === 'NO') {
                value = false;
            } else {
                getAllArworks();
                return alert('type yes or no');
            }
        } else {
            value = params.value;
        }

        const inputs = {};
        inputs[params.field] = value;
        inputs.id = params.id;
        inputs.status = 'EDITED';

        API.graphql(graphqlOperation(updateArtwork, { input: inputs }))
            .then((el) => {
                getAllArworks();
                setFormFeedback('success');
            })
            .catch((err) => {
                console.log('ArtworkUpdateTable line 85 err: ', err);
                getAllArworks();
                return alert('There was an error!');
            });
    };
    const updateArtworkAfterAssociation = (artworkID, artshowID, action) => {
        const inputs = {};
        inputs.id = artworkID;
        inputs.artShow = action === 'create' ? artshowID : '';

        API.graphql(graphqlOperation(updateArtwork, { input: inputs }))
            .then((el) => {
                getAllArworks();
                setFormFeedback('success');
            })
            .catch((err) => {
                console.log('ArtworkUpdateTable line 85 err: ', err);
                getAllArworks();
                return alert('There was an error!');
            });
    };
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
            { editable: true, field: 'title', headerName: 'Title', width: 150 },
            { field: 'name', headerName: 'Name', width: 150 },
            {
                editable: true,
                field: 'isFramed',
                headerName: 'Framed',
                width: 150
            },
            {
                editable: true,
                field: 'dimensionsH',
                headerName: 'Height',
                width: 150
            },
            {
                editable: true,
                field: 'dimensionsW',
                headerName: 'Width',
                width: 150
            },
            {
                editable: true,
                field: 'UOM',
                headerName: 'Measure',
                width: 150
            },
            { editable: true, field: 'price', headerName: 'Price', width: 150 },
            {
                field: 'status',
                headerName: 'Status',
                width: 200
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
                                artshowID: titles.filter((el) => {
                                    return el.title === e.target.value;
                                })[0].id,
                                artworkID: params.value.artworkID,
                                id: params.value.id
                            })
                        }>
                        {titles.length >= 1 ? (
                            titles.map((el, i) => {
                                return (
                                    <MenuItem key={i} value={el.title}>
                                        {el.title}
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
        artworks.map((artwork, index1) => {
            //first get the attributes
            let userObjToPush = {};
            userObjToPush.id = artwork.id;
            userObjToPush.status = artwork.status;
            userObjToPush.title = artwork.title;
            userObjToPush.name =
                artwork.artistNameFirst + ' ' + artwork.artistNameLast;
            userObjToPush.isFramed = artwork.isFramed ? 'Yes' : 'No';
            userObjToPush.dimensionsH = artwork.dimensionsH;
            userObjToPush.dimensionsW = artwork.dimensionsW;
            userObjToPush.UOM = artwork.UOM;
            userObjToPush.price = '$ ' + artwork.price;
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
                    artwork.artshows.items[0].artshow.title
                        ? artwork.artshows.items[0].artshow.title
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
                    .then((el) => {
                        console.log('upload successful');
                        updateArtworkAfterAssociation(updateObj.artworkID, updateObj.artshowID, 'create');
                    })
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
                updateArtworkAfterAssociation(updateObj.artworkID, updateObj.artshowID, 'create');
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
                onCellEditCommit={(params, event) => {
                    onSubmit(params, event);
                }}
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
