import React, { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Grid,
    Paper,
    Autocomplete,
    Popper,
    FormControlLabel,
    Container,
    Card,
    CardHeader,
    Divider,
    CardContent,
    Typography
} from '@mui/material';
import FileUpload from '../../Components/FileUpload';
import { v4 as uuidv4 } from 'uuid';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import { createArtwork } from '../../graphql/mutations';
import config from '../../aws-exports';
import Checkbox from '@mui/material/Checkbox';
import MenuItem from '@mui/material/MenuItem';

const {
    aws_user_files_s3_bucket_region: region,
    aws_user_files_s3_bucket: bucket
} = config;

export default function ArtworkUpload(props) {
    const [TitleValue, setTitleValue] = useState('');
    const [mediumsOtherExplained, setMediumsOtherExplained] = useState('');
    const [PriceValue, setPriceValue] = useState(0);
    const [DimensionH, setDimensionHValue] = useState(0);
    const [DimensionW, setDimensionWValue] = useState(0);
    const [uom, setUOMValue] = useState('');
    const [mediums, setMediums] = useState([]);
    const [framed, setFramed] = useState(false);

    const [Images, setImages] = useState([]);

    const onTitleChange = (event) => {
        setTitleValue(event.currentTarget.value);
    };
    const onMediumsOtherExplainedChange = (event) => {
        setMediumsOtherExplained(event.currentTarget.value);
    };

    const onPriceChange = (event) => {
        setPriceValue(event.currentTarget.value);
    };

    const onDimensionHChange = (event) => {
        setDimensionHValue(event.currentTarget.value);
    };

    const onDimensionWChange = (event) => {
        setDimensionWValue(event.currentTarget.value);
    };

    const onUOMChange = (event) => {
        setUOMValue(event.target.value);
    };

    const onMediumsChange = (newMediums) => {
        setMediums(newMediums);
    };

    const updateImages = (newImages) => {
        setImages(newImages);
    };

    const handleIsFramed = (event) => {
        setFramed(event.target.checked);
    };

    const imagesToUpload = mediums.includes('Sculpture') ? 3 : 1;

    const uploadImageToS3 = async (image) => {
        let file = image;
        let extension = image.name.split('.')[1];
        let key = `images/${uuidv4()}.${extension}`;
        return new Promise((resolve, reject) => {
            Storage.put(key, file, {
                level: 'public',
                contentType: file.type
            })
                .then((res) => {
                    resolve({ bucket: bucket, region: region, key: key });
                })
                .catch((err) => {
                    console.log('err', err);
                });
        });
    };

    const onSubmit = async (event) => {
        event.preventDefault();

        const inputs = {
            title: TitleValue,
            dimensionsH: parseFloat(DimensionH),
            dimensionsW: parseFloat(DimensionW),
            UOM: uom,
            artistNameFirst: props.user.attributes.name,
            artistNameLast: props.user.attributes.family_name,
            mediums: mediums,
            mediumOthersExplained: mediumsOtherExplained,
            isFramed: framed,
            price: parseFloat(PriceValue),
            status: 'STAGED'
        };
        // first try to upload the images to a bucket
        let promises = [];
        Images.map((image, i) => {
            return promises.push(uploadImageToS3(image));
        });
        Promise.all(promises)
            .then((uploadedImgs) => {
                if (imagesToUpload === 1) {
                    inputs.image1 = uploadedImgs[0];
                } else {
                    inputs.image1 = uploadedImgs[0];
                    inputs.image2 = uploadedImgs[1];
                    inputs.image3 = uploadedImgs[2];
                }
                API.graphql(graphqlOperation(createArtwork, { input: inputs }))
                    .then((el) => {
                        setTitleValue('');
                        setPriceValue('');
                        setImages([]);
                        setMediumsOtherExplained('');
                        setPriceValue(0);
                        setDimensionHValue(0);
                        setDimensionWValue(0);
                        setUOMValue('');
                        setMediums([]);
                        setFramed(false);
                        return alert(
                            'Successfully uploaded! Navigate to Artworks to see your work!'
                        );
                    })
                    .catch((err) => {
                        console.log('ArtworkUpload line 146 err: ', err);
                        return alert('There was an error!');
                    });
            })
            .catch((err) => {
                console.log('erre', err);
            });
    };
    const PopperMy = function (props) {
        return (
            <Popper {...props} style={{ width: 250 }} placement='right-start' />
        );
    };

    return (
        <Paper
            style={{
                height: '100%',
                textAlign: 'center',
                marginLeft: 50,
                marginRight: 50,
                marginTop: 20,
                minWidth: 350
            }}
            elevation={3}>
            <Box
                component='main'
                sx={{
                    flexGrow: 1,
                    py: 8
                }}>
                <Container maxWidth='lg'>
                    <Grid container spacing={3}>
                        <Grid
                            item
                            lg={4}
                            md={6}
                            xs={12}
                            style={{ marginLeft: -60 }}>
                            <FileUpload
                                refreshFunction={updateImages}
                                images={Images}
                                multiple={
                                    mediums.includes('Sculpture') ? true : false
                                }
                            />
                        </Grid>
                        <Grid
                            item
                            lg={8}
                            md={6}
                            xs={12}
                            style={{ paddingLeft: 180 }}>
                            <Card>
                                <CardHeader
                                    style={{ textAlign: '-webkit-left' }}
                                    subheader='Fill in the required fields and click "Submit" when finished'
                                    title={`Upload Artwork`}
                                />
                                <Divider />
                                <CardContent
                                    style={{ textAlign: '-webkit-left' }}>
                                    <Grid container spacing={3}>
                                        <Grid item md={12} xs={12}>
                                            <Typography
                                                sx={{ fontSize: 14 }}
                                                gutterBottom>
                                                Give your artwork a title
                                            </Typography>
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            <TextField
                                                label={'Title'}
                                                onChange={onTitleChange}
                                                value={TitleValue}
                                                error={!TitleValue}
                                            />
                                        </Grid>
                                        <Grid item md={12} xs={12}>
                                            <Divider />
                                        </Grid>
                                        <Grid item md={12} xs={12}>
                                            <Typography
                                                sx={{ fontSize: 14 }}
                                                gutterBottom>
                                                What are the dimensions?
                                            </Typography>
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            <TextField
                                                label={'Height'}
                                                onChange={onDimensionHChange}
                                                value={DimensionH}
                                                type='number'
                                                error={!DimensionH}
                                            />
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            <TextField
                                                label={'Width'}
                                                onChange={onDimensionWChange}
                                                value={DimensionW}
                                                type='number'
                                                error={!DimensionW}
                                            />
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            <TextField
                                                style={{ minWidth: 225 }}
                                                select
                                                error={!uom}
                                                id='uom'
                                                value={uom}
                                                label='Unit of Measure'
                                                onChange={onUOMChange}>
                                                <MenuItem value={'Feet'}>
                                                    Feet
                                                </MenuItem>
                                                <MenuItem value={'Inches'}>
                                                    Inches
                                                </MenuItem>
                                                <MenuItem value={'Centimeters'}>
                                                    Centimeters
                                                </MenuItem>
                                            </TextField>
                                        </Grid>
                                        <Grid item md={12} xs={12}>
                                            <Divider />
                                        </Grid>
                                        <Grid item md={12} xs={12}>
                                            <Typography
                                                sx={{ fontSize: 14 }}
                                                gutterBottom>
                                                What mediums were used?
                                            </Typography>
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            <Autocomplete
                                                style={{ maxWidth: 225 }}
                                                PopperComponent={PopperMy}
                                                multiple
                                                id='tags-artTypes'
                                                options={artTypes}
                                                getOptionLabel={(option) =>
                                                    option
                                                }
                                                onChange={(event, value) =>
                                                    onMediumsChange(value)
                                                }
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        error={
                                                            mediums.length === 0
                                                        }
                                                        label='Mediums'
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        {mediums.includes('Other') ? (
                                            <Grid item md={6} xs={12}>
                                                <TextField
                                                    label={
                                                        'Explain other mediums'
                                                    }
                                                    onChange={
                                                        onMediumsOtherExplainedChange
                                                    }
                                                    value={
                                                        mediumsOtherExplained
                                                    }
                                                    error={
                                                        !mediumsOtherExplained
                                                    }
                                                />
                                            </Grid>
                                        ) : null}
                                        <Grid item md={12} xs={12}>
                                            <Divider />
                                        </Grid>
                                        <Grid item md={12} xs={12}>
                                            <Typography
                                                sx={{ fontSize: 14 }}
                                                gutterBottom>
                                                Is It Framed?
                                            </Typography>
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            <Grid container row='true'>
                                                <FormControlLabel
                                                    label='Framed'
                                                    control={
                                                        <Checkbox
                                                            checked={framed}
                                                            onChange={
                                                                handleIsFramed
                                                            }
                                                        />
                                                    }
                                                />
                                            </Grid>
                                        </Grid>
                                        <Grid item md={12} xs={12}>
                                            <Divider />
                                        </Grid>
                                        <Grid item md={12} xs={12}>
                                            <Typography
                                                sx={{ fontSize: 14 }}
                                                gutterBottom>
                                                What would you like to charge?
                                            </Typography>
                                        </Grid>
                                        <Grid item md={6} xs={12}>
                                            <TextField
                                                label={'Price $'}
                                                onChange={onPriceChange}
                                                value={PriceValue}
                                                type='number'
                                                error={!PriceValue}
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                                <Divider />
                                <Box
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        p: 2,
                                        textAlign: '-webkit-right'
                                    }}>
                                    <Grid item md={6} xs={12}>
                                        <Button
                                            disabled={
                                                !TitleValue ||
                                                !PriceValue ||
                                                !DimensionH ||
                                                !DimensionW ||
                                                !uom ||
                                                mediums.length === 0 ||
                                                Images.length !== imagesToUpload
                                            }
                                            variant='contained'
                                            onClick={onSubmit}>
                                            Submit
                                        </Button>
                                    </Grid>
                                </Box>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Paper>
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
    'Canvas Board',
    'Paper',
    'Wood',
    'Clay',
    'Plaster'
].sort();
