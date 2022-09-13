import React, { useState, useEffect } from 'react';
import {
    Button,
    ButtonGroup,
    Card,
    CardContent,
    CardHeader,
    Grid,
    Skeleton,
    Typography,
    Divider,
    Box,
    Popper,
    TextField,
    MenuItem,
    Autocomplete,
    FormControlLabel,
    Checkbox
} from '@mui/material';
import PublishIcon from '@mui/icons-material/Publish';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { deleteArtwork, updateArtwork } from '../../graphql/mutations';
import { API, graphqlOperation } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';

export default function ArtworkInfo(props) {
    const [artwork, setArtwork] = useState({});

    useEffect(() => {
        setArtwork(props.detail);
    }, [props.detail]);

    let navigate = useNavigate();

    const removeArtwork = async (id) => {
        await API.graphql(graphqlOperation(deleteArtwork, { input: { id } }))
            .then((el) => {
                setTimeout(() => {
                    navigate('/artwork', { replace: true });
                }, 500);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const updateArtworkStatus = async (id) => {
        await API.graphql(
            graphqlOperation(updateArtwork, {
                input: { id: id, status: 'PUBLISHED' }
            })
        )
            .then((el) => {
                setTimeout(() => {
                    props.refreshAction();
                }, 500);
            })
            .catch((err) => {
                console.log(err);
            });
    };
    const PopperMy = function (props) {
        return <Popper {...props} placement='right-start' />;
    };
    return (
        <>
            {Object.keys(props.detail).length === 0 ? (
                <Skeleton>
                    <Card style={{ width: 'fit-content' }}>
                        <CardHeader
                            style={{ whiteSpace: 'nowrap' }}
                            title='Publish Your Artwork Here'
                            subheader='By pressing Publish you set your artwork to be approved. You cannot edit it after it is published.'
                        />
                        <Divider />
                        <CardContent>
                            <Grid container spacing={3}>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        label={'Title'}
                                        disabled={true}
                                        value={
                                            artwork.title ? artwork.title : ''
                                        }
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        label={'Height'}
                                        value={
                                            artwork.dimensionsH
                                                ? artwork.dimensionsH
                                                : ''
                                        }
                                        type='number'
                                        disabled={true}
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        label={'Width'}
                                        disabled={true}
                                        value={
                                            artwork.dimensionsW
                                                ? artwork.dimensionsW
                                                : ''
                                        }
                                        type='number'
                                    />
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        defaultValue={'Feet'}
                                        select
                                        id='uom'
                                        value={artwork.UOM ? artwork.UOM : ''}
                                        label='Unit of Measure'
                                        disabled={true}>
                                        <MenuItem value={'Feet'}>Feet</MenuItem>
                                        <MenuItem value={'Inches'}>
                                            Inches
                                        </MenuItem>
                                        <MenuItem value={'Centimeters'}>
                                            Centimeters
                                        </MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item md={6} xs={6}>
                                    {console.log(artwork.mediums)}
                                    <Autocomplete
                                        PopperComponent={PopperMy}
                                        multiple
                                        id='tags-artTypes'
                                        options={artTypes}
                                        getOptionLabel={(option) => option}
                                        disabled={true}
                                        value={
                                            artwork.mediums
                                                ? artwork.mediums
                                                : []
                                        }
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                label='Mediums'
                                            />
                                        )}
                                    />
                                </Grid>
                                {artwork.mediums &&
                                artwork.mediums.includes('Other') ? (
                                    <Grid item md={12} xs={12}>
                                        <TextField
                                            label={'Explain other mediums'}
                                            disabled={true}
                                            value={
                                                artwork.mediumOthersExplained
                                                    ? artwork.mediumOthersExplained
                                                    : ''
                                            }
                                        />
                                    </Grid>
                                ) : null}
                                <Grid item md={6} xs={12}>
                                    <Grid container row='true'>
                                        <FormControlLabel
                                            label='Framed'
                                            control={
                                                <Checkbox
                                                    checked={
                                                        artwork.isFramed !==
                                                        undefined
                                                            ? artwork.isFramed
                                                            : false
                                                    }
                                                    disabled={true}
                                                />
                                            }
                                        />
                                    </Grid>
                                </Grid>
                                <Grid item md={6} xs={12}>
                                    <TextField
                                        label={'Price $'}
                                        disabled={true}
                                        value={
                                            artwork.price ? artwork.price : 0
                                        }
                                        type='number'
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                        <Divider />
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                p: 2
                            }}>
                            {artwork.status === 'PUBLISHED' ? null : (
                                <>
                                    <ButtonGroup
                                        disableElevation
                                        variant='contained'>
                                        <Button
                                            onClick={() => {
                                                updateArtworkStatus(
                                                    props.detail.id
                                                );
                                            }}
                                            style={{ marginRight: '10px' }}
                                            variant='contained'
                                            endIcon={<PublishIcon />}>
                                            Publish
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                removeArtwork(props.detail.id)
                                            }
                                            style={{ marginRight: '10px' }}
                                            variant='contained'
                                            color='error'
                                            endIcon={<DeleteForeverIcon />}>
                                            Delete forever
                                        </Button>
                                    </ButtonGroup>
                                </>
                            )}
                        </Box>
                    </Card>
                </Skeleton>
            ) : (
                <Card style={{ width: 'fit-content' }}>
                    <CardHeader
                        style={{ whiteSpace: 'nowrap' }}
                        title='Publish Your Artwork Here'
                        subheader='By pressing Publish you set your artwork to be approved. You cannot edit it after it is published.'
                    />
                    <Divider />
                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid item md={12} xs={12}>
                                <Typography sx={{ fontSize: 14 }} gutterBottom>
                                    Your artworks title
                                </Typography>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <TextField
                                    label={'Title'}
                                    disabled={true}
                                    value={artwork.title ? artwork.title : ''}
                                />
                            </Grid>
                            <Grid item md={12} xs={12}>
                                <Divider />
                            </Grid>
                            <Grid item md={12} xs={12}>
                                <Typography sx={{ fontSize: 14 }} gutterBottom>
                                    The artworks dimensions
                                </Typography>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <TextField
                                    label={'Height'}
                                    value={
                                        artwork.dimensionsH
                                            ? artwork.dimensionsH
                                            : ''
                                    }
                                    type='number'
                                    disabled={true}
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <TextField
                                    label={'Width'}
                                    disabled={true}
                                    value={
                                        artwork.dimensionsW
                                            ? artwork.dimensionsW
                                            : ''
                                    }
                                    type='number'
                                />
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <TextField
                                    defaultValue={'Feet'}
                                    select
                                    id='uom'
                                    value={artwork.UOM ? artwork.UOM : ''}
                                    label='Unit of Measure'
                                    disabled={true}>
                                    <MenuItem value={'Feet'}>Feet</MenuItem>
                                    <MenuItem value={'Inches'}>Inches</MenuItem>
                                    <MenuItem value={'Centimeters'}>
                                        Centimeters
                                    </MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item md={12} xs={12}>
                                <Divider />
                            </Grid>
                            <Grid item md={12} xs={12}>
                                <Typography sx={{ fontSize: 14 }} gutterBottom>
                                    Mediums used to create
                                </Typography>
                            </Grid>
                            <Grid item md={6} xs={6}>
                                {console.log(artwork.mediums)}
                                <Autocomplete
                                    PopperComponent={PopperMy}
                                    multiple
                                    id='tags-artTypes'
                                    options={artTypes}
                                    getOptionLabel={(option) => option}
                                    disabled={true}
                                    value={
                                        artwork.mediums ? artwork.mediums : []
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label='Mediums'
                                        />
                                    )}
                                />
                            </Grid>
                            {artwork.mediums &&
                            artwork.mediums.includes('Other') ? (
                                <Grid item md={12} xs={12}>
                                    <TextField
                                        label={'Explain other mediums'}
                                        disabled={true}
                                        value={
                                            artwork.mediumOthersExplained
                                                ? artwork.mediumOthersExplained
                                                : ''
                                        }
                                    />
                                </Grid>
                            ) : null}
                            <Grid item md={12} xs={12}>
                                <Divider />
                            </Grid>
                            <Grid item md={12} xs={12}>
                                <Typography sx={{ fontSize: 14 }} gutterBottom>
                                    Is It Framed?
                                </Typography>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <Grid container row='true'>
                                    <FormControlLabel
                                        label='Framed'
                                        control={
                                            <Checkbox
                                                checked={
                                                    artwork.isFramed !==
                                                    undefined
                                                        ? artwork.isFramed
                                                        : false
                                                }
                                                disabled={true}
                                            />
                                        }
                                    />
                                </Grid>
                            </Grid>
                            <Grid item md={12} xs={12}>
                                <Divider />
                            </Grid>
                            <Grid item md={12} xs={12}>
                                <Typography sx={{ fontSize: 14 }} gutterBottom>
                                    What will be charged to a buyer
                                </Typography>
                            </Grid>
                            <Grid item md={6} xs={12}>
                                <TextField
                                    label={'Price $'}
                                    disabled={true}
                                    value={artwork.price ? artwork.price : 0}
                                    type='number'
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                    <Divider />
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            p: 2
                        }}>
                        {artwork.status === 'PUBLISHED' ? null : (
                            <>
                                <ButtonGroup
                                    disableElevation
                                    variant='contained'>
                                    <Button
                                        onClick={() => {
                                            updateArtworkStatus(
                                                props.detail.id
                                            );
                                        }}
                                        style={{ marginRight: '10px' }}
                                        variant='contained'
                                        endIcon={<PublishIcon />}>
                                        Publish
                                    </Button>
                                    <Button
                                        onClick={() =>
                                            removeArtwork(props.detail.id)
                                        }
                                        style={{ marginRight: '10px' }}
                                        variant='contained'
                                        color='error'
                                        endIcon={<DeleteForeverIcon />}>
                                        Delete forever
                                    </Button>
                                </ButtonGroup>
                            </>
                        )}
                    </Box>
                </Card>
            )}
        </>
    );
}
const artTypes = [
    'Oil',
    'Acrylic',
    'Watercolor',
    'Gouache',
    'Mixed Media',
    'Sculpture',
    'Relief',
    'Wood Burning',
    'Tempera',
    'Ink',
    'Crayon',
    'Oil Pastels',
    'Charcoal',
    'Colored Pencil',
    'Pastels',
    'Other',
    'Canvas Board',
    'Nib Painting',
    'Ink-wash Painting',
    'Glass Painting',
    'Fresco Painting',
    'Encaustic Painting',
    'Splash Painting',
    'Sand Painting',
    'Spray painting',
    'Board Painting',
    'Scroll Painting',
    'Pulling and Scrapping',
    'Body Painting',
    'Impasto Technique',
    'Casein Painting',
    'Warli Painting',
    'Pahad Painting',
    'Madhubani Painting',
    'Gond Paintings',
    'Patachitra Paintings',
    'Picchwai Painting',
    'Mughal Paintings',
    'Cavern Paintings',
    'Texture Painting',
    'Modernism',
    'Impressionism',
    'Expressionism',
    'Cubism',
    'Surrealism',
    'Chinese Painting',
    'The Japanese Painting',
    'Rajput Painting',
    'Mysore Painting',
    'Tanjore Painting',
    'Tenebrism Painting',
    'Display Painting',
    'Viewpoint Painting',
    'Consolidate Paintings',
    'Foreshortening',
    'Sfumato',
    'Sgraffito',
    'Paper',
    'Wood',
    'Clay',
    'Plaster'
].sort();
