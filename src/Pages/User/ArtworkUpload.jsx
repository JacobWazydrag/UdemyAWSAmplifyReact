import React, { useState } from 'react';
import {
    Typography,
    Button,
    TextField,
    Grid,
    Paper,
    Autocomplete,
    Popper,
    FormControlLabel
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
        let name = image.name.split('.')[0];
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
                        console.log('ArtworkUpload line 84 err: ', err);
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
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Typography variant={'h2'}> Upload Artwork!</Typography>
            </div>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <FileUpload
                        refreshFunction={updateImages}
                        images={Images}
                        multiple={mediums.includes('Sculpture') ? true : false}
                    />
                </Grid>
                <Grid
                    item
                    xs={6}
                    rowSpacing={5}
                    style={{ marginLeft: '-60px', marginTop: '50px' }}>
                    <Grid container direction='column' spacing={2}>
                        <Grid item xs={6} rowSpacing={1}>
                            <TextField
                                style={{ width: '55%' }}
                                label={'Title'}
                                onChange={onTitleChange}
                                value={TitleValue}
                                error={!TitleValue}
                            />
                        </Grid>
                        <Grid item xs={6} rowSpacing={1}>
                            <TextField
                                style={{ width: '55%' }}
                                label={'Height'}
                                onChange={onDimensionHChange}
                                value={DimensionH}
                                type='number'
                                error={!DimensionH}
                            />
                        </Grid>
                        <Grid item xs={6} rowSpacing={1}>
                            <TextField
                                style={{ width: '55%' }}
                                label={'Width'}
                                onChange={onDimensionWChange}
                                value={DimensionW}
                                type='number'
                                error={!DimensionW}
                            />
                        </Grid>
                        <Grid item xs={6} rowSpacing={1}>
                            <TextField
                                select
                                style={{ width: '55%' }}
                                error={!uom}
                                id='uom'
                                value={uom}
                                label='Unit of Measure'
                                onChange={onUOMChange}>
                                <MenuItem value={'Feet'}>Feet</MenuItem>
                                <MenuItem value={'Inches'}>Inches</MenuItem>
                                <MenuItem value={'Centimeters'}>
                                    Centimeters
                                </MenuItem>
                            </TextField>
                        </Grid>
                        <Grid
                            item
                            xs={6}
                            rowSpacing={5}
                            style={{ display: 'flex' }}>
                            <Autocomplete
                                PopperComponent={PopperMy}
                                multiple
                                id='tags-artTypes'
                                options={artTypes}
                                getOptionLabel={(option) => option}
                                onChange={(event, value) =>
                                    onMediumsChange(value)
                                }
                                style={{
                                    marginLeft: 165,
                                    maxWidth: 374,
                                    width: '100%'
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        error={mediums.length === 0}
                                        label='Mediums'
                                    />
                                )}
                            />
                        </Grid>
                        {mediums.includes('Other') ? (
                            <Grid item xs={6} rowSpacing={1}>
                                <TextField
                                    style={{ width: '55%' }}
                                    label={'Explain other mediums'}
                                    onChange={onMediumsOtherExplainedChange}
                                    value={mediumsOtherExplained}
                                    error={!mediumsOtherExplained}
                                />
                            </Grid>
                        ) : null}
                        <Grid
                            item
                            xs={6}
                            rowSpacing={1}
                            style={{ marginLeft: '180px', padding: 10 }}>
                            <Grid container row='true'>
                                <FormControlLabel
                                    label='Framed'
                                    control={
                                        <Checkbox
                                            checked={framed}
                                            onChange={handleIsFramed}
                                        />
                                    }
                                />
                            </Grid>
                        </Grid>
                        <Grid item xs={6} rowSpacing={1}>
                            <TextField
                                style={{ width: '55%' }}
                                label={'Price $'}
                                onChange={onPriceChange}
                                value={PriceValue}
                                type='number'
                                error={!PriceValue}
                            />
                        </Grid>
                        <Grid item xs={6} rowSpacing={1}>
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
                                onClick={onSubmit}
                                style={{ width: '55%' }}>
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
}

// @model
// @auth(
//     rules: [
//         { allow: owner, operations: [create, update, read, delete] }
//         {
//             allow: groups
//             groups: ["Admin"]
//             operations: [create, update, read, delete]
//         }
//     ]
// ) {
// id: ID!
// artshows: [Artshow] @manyToMany(relationName: "ArtshowArtwork")
// title: String
// dimensionsL: Int
// dimensionsW: Int
// UOM: String
// status: String
// price: Int
// artistNameFirst: String
// artistNameLast: String
// mediums: [String]!
// image1: S3Object
// image2: S3Object
// image3: S3Object
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
