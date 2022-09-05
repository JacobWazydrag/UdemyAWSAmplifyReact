import React, { useState } from 'react';
import { Typography, Button, TextField, Grid, Paper } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Autocomplete from '@mui/material/Autocomplete';
import FileUploadAdmin from '../../Components/FileUploadAdmin';
import { v4 as uuidv4 } from 'uuid';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import { createArtwork } from '../../graphql/mutations';
import config from '../../aws-exports';

const {
    aws_user_files_s3_bucket_region: region,
    aws_user_files_s3_bucket: bucket
} = config;

export default function ArtworkUpload() {
    const [TitleValue, setTitleValue] = useState('');
    const [DescriptionValue, setDescriptionValue] = useState('');
    const [PriceValue, setPriceValue] = useState(0);
    const [tags, setTags] = useState([]);
    const [status, setStatus] = useState('');
    const [Images, setImages] = useState([]);
    const [StartDate, setStartDate] = useState(null);
    const [EndDate, setEndDate] = useState(null);

    const onTitleChange = (event) => {
        setTitleValue(event.currentTarget.value);
    };

    const onDescriptionChange = (event) => {
        setDescriptionValue(event.currentTarget.value);
    };

    const updateImages = (newImages) => {
        setImages(newImages);
    };

    const onTagChange = (newTags) => {
        setTags(newTags);
    };

    const onStatusChange = (newStatus) => {
        console.log(newStatus);
        setStatus(newStatus);
    };

    const dateChangeStart = (newDate) => {
        setStartDate(newDate);
        // setStartDate(newDate.$d.toISOString().substring(0, 10));
    };

    const dateChangeEnd = (newDate) => {
        setEndDate(newDate);
        // setEndDate(newDate.$d.toISOString().substring(0, 10));
    };

    const uploadImageToS3 = async (image) => {
        let file = image;
        let extension = image.name.split('.')[1];
        let name = image.name.split('.')[0];
        let key = `images/${uuidv4()}${name}.${extension}`;
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
            // let url2 = Storage.get(key, { level: 'public' });
        });
    };

    const onSubmit = async (event) => {
        event.preventDefault();

        const inputs = {
            title: TitleValue,
            description: DescriptionValue,
            price: PriceValue,
            status: 'STAGED'
        };
        // first try to upload the images to a bucket
        let promises = [];
        Images.map((image, i) => {
            return promises.push(uploadImageToS3(image));
        });
        Promise.all(promises)
            .then((uploadedImgs) => {
                // console.log(
                //     'Yayy, all images are uploaded successfully',
                //     uploadedImgs
                // );
                inputs.image1 = uploadedImgs[0];
                inputs.image2 = uploadedImgs[1];
                inputs.image3 = uploadedImgs[2];
                API.graphql(graphqlOperation(createArtwork, { input: inputs }))
                    .then((el) => console.log('upload successful'))
                    .catch((err) => {
                        console.log('ArtworkUpload line 84 err: ', err);
                    });
                setTitleValue('');
                setDescriptionValue('');
                setPriceValue('');
                setImages([]);
                return alert(
                    'Successfully uploaded! Navigate to Artworks to see your work!'
                );
            })
            .catch((err) => {
                console.log('erre', err);
            });
    };

    return (
        <Paper
            style={{
                height: '100%',
                textAlign: 'center',
                marginLeft: 50,
                marginRight: 50,
                marginTop: 50,
                marginBottom: -50,
                minWidth: 350
            }}
            elevation={3}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Typography variant={'h2'}> Create Artshow</Typography>
            </div>
            <Grid container spacing={2}>
                <Grid
                    item
                    xs={6}
                    rowSpacing={5}
                    style={{ marginLeft: '-60px', marginTop: '50px' }}>
                    <Grid container direction='column' spacing={2}>
                        <Grid item xs={6} rowSpacing={1}>
                            <TextField
                                style={{ width: '55%' }}
                                label={'Description'}
                                onChange={onDescriptionChange}
                                value={DescriptionValue}
                                type='textarea'
                                error={!DescriptionValue}
                            />
                        </Grid>
                        <Grid item xs={6} rowSpacing={5}>
                            <TextField
                                style={{ width: '55%' }}
                                label={'Title'}
                                onChange={onTitleChange}
                                value={TitleValue}
                                error={!TitleValue}
                            />
                        </Grid>
                        <Grid item xs={6} rowSpacing={5}>
                            <TextField
                                select
                                style={{ width: '55%' }}
                                value={status}
                                label='Status'
                                error={!status}
                                onChange={(e) =>
                                    onStatusChange(e.target.value)
                                }>
                                <MenuItem value={'Live'}>Live</MenuItem>
                                <MenuItem value={'Staging'}>Staging</MenuItem>
                                <MenuItem value={'Complete'}>Complete</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid item xs={6} rowSpacing={5}>
                            <Autocomplete
                                multiple
                                id='tags-standard'
                                options={artTypes}
                                getOptionLabel={(option) => option}
                                onChange={(event, value) => onTagChange(value)}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        error={tags.length === 0}
                                        label='Types'
                                        style={{ width: '55%', margin: 10 }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={6} rowSpacing={5}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label='Start Date'
                                    value={StartDate}
                                    onChange={(newValue) => {
                                        dateChangeStart(newValue);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            style={{ width: '55%', margin: 10 }}
                                            error={!StartDate}
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item xs={6} rowSpacing={5}>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                    label='End Date'
                                    value={EndDate}
                                    onChange={(newValue) => {
                                        dateChangeEnd(newValue);
                                    }}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            style={{ width: '55%', margin: 10 }}
                                            error={!EndDate}
                                        />
                                    )}
                                />
                            </LocalizationProvider>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <FileUploadAdmin
                        refreshFunction={updateImages}
                        images={Images}
                    />
                </Grid>
            </Grid>
            <Button
                disabled={
                    !TitleValue ||
                    !DescriptionValue ||
                    !PriceValue ||
                    Images.length !== 1 ||
                    tags.length === 0
                }
                variant='contained'
                onClick={onSubmit}
                style={{ width: '100%' }}>
                Submit
            </Button>
        </Paper>
    );
}
const artTypes = [
    'Abstract',
    'Painting',
    'Sculpture',
    'Literature',
    'Architecture',
    'Cinema',
    'Music',
    'Theater',
    'Pencil Sketch',
    'Oil Painting',
    'Watercolor Painting',
    'Charcoal Drawing',
    'Mixed media painting',
    'Pencil Color Drawing',
    'Collage Painting',
    'Kalamkari Painting',
    'Scribble Art',
    'Nib Painting',
    'Ink-wash Painting',
    'Acrylic Painting',
    'Pastel Painting',
    'Glass Painting',
    'Fresco Painting',
    'Encaustic Painting',
    'Gouache Painting',
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
    'Sgraffito'
];
