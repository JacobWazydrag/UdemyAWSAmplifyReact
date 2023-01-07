import React, { useState, useEffect } from 'react';
import { Stack, Alert } from '@mui/material';
import Button from '@mui/material/Button';
import ExitToApp from '@mui/icons-material/ExitToApp';
import { DataGrid } from '@mui/x-data-grid';
import { listArtshows } from '../../graphql/queries';
import { listArtworksWithNoArtshows } from '../../graphql/queries';
import {
    updateArtshow,
    updateArtwork,
    createArtshowArtwork
} from '../../graphql/mutations';
import Badge from '@mui/material/Badge';
import BurstModeIcon from '@mui/icons-material/BurstMode';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import Box from '@mui/material/Box';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { Grid, TextField, ListItemText, FormGroup } from '@mui/material';
var _ = require('lodash');
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
};

export default function AllArtshowsAdmin() {
    const [artShows, setArtshows] = useState([]);
    const [artworks, setArtworks] = useState([]);
    const [mainImageUrlFromArtworks, setMainImageUrlFromArtworks] = useState(
        []
    );
    const [formFeedback, setFormFeedback] = useState(null);
    const [Open, setOpen] = React.useState(false);
    const [OpenImages, setOpenImages] = React.useState(false);
    const [Date, setDate] = useState({ input: '', value: '', params: {} });
    const [Images, setImages] = useState({});

    const handleOpen = (params, event) => {
        setDate({ input: params.field, value: params.value, params: params });
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
        setDate({ input: '', value: '', params: {} });
    };

    const handleOpenImageModal = (params, event) => {
        setImages(params);
        setOpenImages(true);
    };
    const handleCloseImageModal = () => {
        setOpenImages(false);
        // setDate({ input: '', value: '', params: {} });
    };

    const dateChange = (newDate) => {
        let newDateObj = Date;
        newDateObj.value = newDate;
        let newParams = Date.params;
        newParams.value = newDate.$d.toISOString().substring(0, 10);
        setDate(newDateObj);
        onSubmit(newParams);
    };

    const closeDialog = () => {
        setFormFeedback(null);
    };

    useEffect(() => {
        getAllArworks();
    }, []);

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

    async function getAllArworks() {
        await API.graphql(graphqlOperation(listArtworksWithNoArtshows))
            .then((el) => {
                setArtworks(el.data.listArtworks.items);
            })
            .catch((err) => console.log(err));
    }
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

    const onUpdateArtshow = async (artshowID, artworkID) => {
        let createInputs = {
            artshowID: artshowID,
            artworkID: artworkID
        };
        await API.graphql(
            graphqlOperation(createArtshowArtwork, {
                input: createInputs
            })
        )
            .then((el) => {
                console.log('upload successful');
                updateArtworkAfterAssociation(
                    artworkID,
                    artshowID,
                    'create'
                );
            })
            .catch((err) => {
                console.log('AllArtworksAdmin line 199 err: ', err);
            });
        // refreshFunction();
    };
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

    const onSubmit = async (params, event) => {
        let value;

        value = params.value;

        const inputs = {};
        inputs[params.field] = value;
        inputs.id = params.id;
        inputs.status = 'EDITED';

        API.graphql(graphqlOperation(updateArtshow, { input: inputs }))
            .then((el) => {
                getAllArtshows();
                setFormFeedback('success');
                setTimeout(() => {
                    setFormFeedback(null);
                }, 2000);
            })
            .catch((err) => {
                console.log('ArtworkUpdateTable line 85 err: ', err);
                getAllArtshows();
                return alert('There was an error!');
            });
    };

    const renderTable = () => {
        const columns = [
            {
                field: 'status',
                headerName: 'Status',
                width: 200,
                cellClassName: (params) => {
                    return `super-app-theme--${params.row.status}`;
                }
            },
            { editable: true, field: 'title', headerName: 'Title', width: 200 },
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
                editable: true,
                renderCell: (params) => (
                    <Badge badgeContent={params.value.length} color='primary'>
                        <BurstModeIcon
                            style={{ fontSize: 50 }}
                            color='action'
                        />
                    </Badge>
                )
            },
            {
                editable: true,
                field: 'description',
                headerName: 'Description',
                width: 200
            },
            {
                editable: true,
                field: 'time_period_showing_start',
                headerName: 'Showing Start Date',
                width: 200
            },
            {
                editable: true,
                field: 'time_period_showing_end',
                headerName: 'Showing End Date',
                width: 200
            },
            {
                editable: true,
                field: 'time_period_reception_start',
                headerName: 'Reception Start Date',
                width: 200
            },
            {
                editable: true,
                field: 'time_period_reception_end',
                headerName: 'Reception End Date',
                width: 200
            },
            {
                editable: false,
                field: 'locationContactInformationName',
                headerName: 'Location Name',
                width: 200
            },
            {
                editable: false,
                field: 'locationContactInformationPhone',
                headerName: 'Location Phone',
                width: 200
            },
            {
                editable: false,
                field: 'locationContactInformationAddress',
                headerName: 'Location Address',
                width: 200
            },
            {
                editable: false,
                field: 'locationContactInformationCity',
                headerName: 'Location City',
                width: 200
            },
            {
                editable: false,
                field: 'locationContactInformationState',
                headerName: 'Location State',
                width: 200
            },
            {
                editable: false,
                field: 'locationContactInformationZipcode',
                headerName: 'Location Zip',
                width: 200
            },
            {
                editable: false,
                field: 'locationContactInformationEmail',
                headerName: 'Location Email',
                width: 200
            },
            {
                editable: false,
                field: 'locationContactInformationWebsite',
                headerName: 'Location Website',
                width: 200
            },
            {
                field: 'goToDetail',
                headerName: 'Details',
                width: 200,
                renderCell: (params) => (
                    <a href={`/all-artshows/${params.value}`}>Go to Detail</a>
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
            userObjToPush.time_period_showing_start =
                artshow.time_period_showing_start;
            userObjToPush.time_period_reception_start =
                artshow.time_period_reception_start;
            userObjToPush.time_period_showing_end =
                artshow.time_period_showing_end;
            userObjToPush.time_period_reception_end =
                artshow.time_period_reception_end;
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

        return (
            <DataGrid
                rows={rows}
                rowHeight={100}
                autoHeight
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
                getCellClassName={(params) => {
                    if (params.isEditable) {
                        return `super-app-theme--editable`;
                    } else {
                        return `super-app-theme--not-editable`;
                    }
                }}
                onCellEditCommit={(params, event) => {
                    if (params.field === 'images') {
                        return;
                    } else if (params.field.includes('time')) {
                        return;
                    } else {
                        onSubmit(params, event);
                    }
                }}
                onCellEditStart={(params, event) => {
                    if (params.field.includes('time')) {
                        handleOpen(params, event);
                    } else if (params.field === 'images') {
                        handleOpenImageModal(params, event);
                    }
                }}
                sx={{
                    '& .MuiDataGrid-root': {
                        borderRadius: 2,
                        fontSize: 16
                    },
                    '& .MuiDataGrid-main': { borderRadius: 2 },
                    '& div[data-rowIndex][role="row"]:nth-of-type(5n-4)': {
                        color: 'black',
                        fontSize: 15
                    },
                    '& .MuiDataGrid-cell': {
                        placeContent: 'center'
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: '#3C6478',
                        color: 'whitesmoke',
                        fontSize: 16
                    },
                    '& .super-app-theme--Staged': {
                        bgcolor: '#f58b4cb5',
                        '&:hover': {
                            bgcolor: '#F58B4C'
                        }
                    },
                    '& .super-app-theme--editable': {
                        cursor: 'pointer'
                    },
                    '& .super-app-theme--not-editable': {
                        cursor: 'not-allowed'
                    }
                }}
            />
        );
    };

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
                    {formFeedback && !Open && (
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
                    <div>
                        <Modal
                            open={Open}
                            onClose={handleClose}
                            aria-labelledby='modal-modal-title'
                            aria-describedby='modal-modal-description'>
                            <Box sx={style}>
                                <Grid item xs={6} rowSpacing={5}>
                                    <LocalizationProvider
                                        dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            label={_.startCase(
                                                Date.input
                                                    .split('_')
                                                    .slice(2)
                                                    .join(' ')
                                            )}
                                            value={Date.value}
                                            onChange={(newValue) => {
                                                dateChange(newValue);
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    style={{
                                                        width: '55%',
                                                        margin: 10
                                                    }}
                                                    error={!Date.value}
                                                />
                                            )}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                {formFeedback && Open && (
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
                            </Box>
                        </Modal>
                    </div>
                    <div>
                        <Modal
                            open={OpenImages}
                            onClose={handleCloseImageModal}
                            aria-labelledby='modal-modal-title'
                            aria-describedby='modal-modal-description'>
                            <Box sx={style}>
                                <Grid container>
                                    <Grid item xs={7}>
                                        <List
                                            sx={{
                                                width: '100%',
                                                maxWidth: 460,
                                                overflowY: 'auto',
                                                // position: 'relative',
                                                maxHeight: '360px',
                                                whiteSpace: 'nowrap'
                                            }}>
                                            {Images &&
                                            _.size(Images) > 0 &&
                                            Images.value &&
                                            Images.value.length > 0
                                                ? Images.value.map(
                                                      (artwork) => {
                                                          return (
                                                              <ListItem
                                                                  key={
                                                                      artwork
                                                                          .artwork
                                                                          .id
                                                                  }>
                                                                  <ListItemText
                                                                      primary={
                                                                          artwork
                                                                              .artwork
                                                                              .title
                                                                      }
                                                                      secondary={
                                                                          artwork
                                                                              .artwork
                                                                              .artistNameFirst +
                                                                          ' ' +
                                                                          artwork
                                                                              .artwork
                                                                              .artistNameLast
                                                                      }
                                                                  />
                                                              </ListItem>
                                                          );
                                                      }
                                                  )
                                                : null}
                                        </List>
                                    </Grid>
                                    <Grid item xs={5}>
                                        <FormGroup>
                                            {Images &&
                                                Images.row &&
                                                Images.row.id &&
                                                artworks.map((artwork) => {
                                                    return (
                                                        <ListItem
                                                            key={artwork.id}>
                                                            <IconButton
                                                                onClick={() => {
                                                                    onUpdateArtshow(
                                                                        Images
                                                                            .row
                                                                            .id,
                                                                        artwork.id
                                                                    );
                                                                }}>
                                                                <AddCircleIcon />
                                                            </IconButton>
                                                            <ListItemText
                                                                primary={
                                                                    artwork.title
                                                                }
                                                                secondary={
                                                                    artwork.artistNameFirst +
                                                                    ' ' +
                                                                    artwork.artistNameLast
                                                                }
                                                            />
                                                        </ListItem>
                                                    );
                                                })}
                                        </FormGroup>
                                    </Grid>
                                </Grid>

                                {formFeedback && Open && (
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
                            </Box>
                        </Modal>
                    </div>
                </Stack>
            </>
        );
    }
}
