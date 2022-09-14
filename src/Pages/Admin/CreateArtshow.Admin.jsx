import React, { useState } from 'react';
import {
    Typography,
    Button,
    TextField,
    Grid,
    Paper,
    Container,
    Box,
    Card,
    CardHeader,
    Divider,
    CardContent
} from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FileUploadAdmin from '../../Components/FileUploadAdmin';
import { v4 as uuidv4 } from 'uuid';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import { createArtshow } from '../../graphql/mutations';
import config from '../../aws-exports';

const {
    aws_user_files_s3_bucket_region: region,
    aws_user_files_s3_bucket: bucket
} = config;

export default function ArtworkUpload() {
    const [TitleValue, setTitleValue] = useState('');
    const [DescriptionValue, setDescriptionValue] = useState('');
    const [PriceValue, setPriceValue] = useState(0);
    const [status, setStatus] = useState('Staged');
    const [Images, setImages] = useState([]);
    const [StartDateOpening, setStartDateOpening] = useState(null);
    const [EndDateOpening, setEndDateOpening] = useState(null);
    const [StartDateShowing, setStartDateShowing] = useState(null);
    const [EndDateShowing, setEndDateShowing] = useState(null);
    const [name, setName] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [address, setAddress] = useState('');
    const [zip, setZip] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [website, setWebsite] = useState('');

    const onTitleChange = (event) => {
        setTitleValue(event.currentTarget.value);
    };
    const onCityChange = (event) => {
        setCity(event.currentTarget.value);
    };
    const onStateChange = (event) => {
        setState(event.currentTarget.value);
    };
    const onAddressChange = (event) => {
        setAddress(event.currentTarget.value);
    };
    const onZipChange = (event) => {
        setZip(event.currentTarget.value);
    };
    const onPhoneChange = (event) => {
        setPhone(event.currentTarget.value);
    };
    const onEmailChange = (event) => {
        setEmail(event.currentTarget.value);
    };
    const onWebsiteChange = (event) => {
        setWebsite(event.currentTarget.value);
    };

    const onDescriptionChange = (event) => {
        setDescriptionValue(event.currentTarget.value);
    };

    const updateImages = (newImages) => {
        setImages(newImages);
    };

    const onNameChange = (newName) => {
        setName(newName);
    };

    const dateChangeStartOpening = (newDate) => {
        setStartDateOpening(newDate);
    };

    const dateChangeEndOpening = (newDate) => {
        setEndDateOpening(newDate);
    };
    const dateChangeStartShowing = (newDate) => {
        setStartDateShowing(newDate);
    };

    const dateChangeEndShowing = (newDate) => {
        setEndDateShowing(newDate);
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
            status: status,
            locationContactInformationName: name,
            locationContactInformationPhone: name
                ? locationsDetial[name].phone
                : '',
            locationContactInformationAddress: name
                ? locationsDetial[name].address
                : '',
            locationContactInformationCity: name
                ? locationsDetial[name].city
                : '',
            locationContactInformationState: name
                ? locationsDetial[name].state
                : '',
            locationContactInformationZipcode: name
                ? locationsDetial[name].zip
                : '',
            locationContactInformationEmail: name
                ? locationsDetial[name].email
                : '',
            locationContactInformationWebsite: name
                ? locationsDetial[name].website
                : '',
            time_period_showing_start: StartDateShowing.$d
                .toISOString()
                .substring(0, 10),
            time_period_reception_start: StartDateOpening.$d
                .toISOString()
                .substring(0, 10),
            ime_period_showing_end: EndDateShowing.$d
                .toISOString()
                .substring(0, 10),
            time_period_reception_end: EndDateOpening.$d
                .toISOString()
                .substring(0, 10),
            artists: ''
        };
        // first try to upload the images to a bucket
        let promises = [];
        Images.map((image, i) => {
            return promises.push(uploadImageToS3(image));
        });
        Promise.all(promises)
            .then((uploadedImgs) => {
                inputs.image1 = uploadedImgs[0];
                API.graphql(graphqlOperation(createArtshow, { input: inputs }))
                    .then((el) => {
                        setTitleValue('');
                        setCity('');
                        setState('');
                        setAddress('');
                        setZip('');
                        setPhone('');
                        setEmail('');
                        setWebsite('');
                        setDescriptionValue('');
                        setImages([]);
                        setName('');
                        setStartDateOpening(null);
                        setEndDateOpening(null);
                        setStartDateShowing(null);
                        setEndDateShowing(null);
                        return alert(
                            'Successfully uploaded! Navigate to Artworks to see your work!'
                        );
                    })
                    .catch((err) => {
                        console.log('CreateArtShow line 179 err: ', err);
                    });
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
                            <FileUploadAdmin
                                refreshFunction={updateImages}
                                images={Images}
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
                                    title={`Upload Artshow`}
                                />
                                <Divider />
                                <CardContent
                                    style={{ textAlign: '-webkit-left' }}>
                                    <Grid container spacing={3}>
                                        <Grid item md={12} xs={12}>
                                            <Typography
                                                sx={{ fontSize: 14 }}
                                                gutterBottom>
                                                Give your artshow a title
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} rowSpacing={5}>
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
                                                What is the description?
                                            </Typography>
                                        </Grid>
                                        <Grid
                                            item
                                            md={12}
                                            xs={12}
                                            rowSpacing={1}>
                                            <TextField
                                                fullWidth
                                                multiline
                                                minRows={4}
                                                maxRows={10}
                                                label={'Description'}
                                                onChange={onDescriptionChange}
                                                value={DescriptionValue}
                                                type='textarea'
                                                error={!DescriptionValue}
                                            />
                                        </Grid>
                                        <Grid item md={12} xs={12}>
                                            <Divider />
                                        </Grid>
                                        <Grid item md={12} xs={12}>
                                            <Typography
                                                sx={{ fontSize: 14 }}
                                                gutterBottom>
                                                Give some detail on the
                                                location.
                                            </Typography>
                                        </Grid>
                                        <Grid item md={6} xs={6} rowSpacing={5}>
                                            <TextField
                                                style={{ width: '100%' }}
                                                select
                                                value={name}
                                                label='Name'
                                                error={!name}
                                                onChange={(e) =>
                                                    onNameChange(e.target.value)
                                                }>
                                                <MenuItem
                                                    value={'ArtSpace Chicago'}>
                                                    ArtSpace Chicago
                                                </MenuItem>
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={6} rowSpacing={5}>
                                            <TextField
                                                disabled
                                                label={'Address'}
                                                value={
                                                    name
                                                        ? locationsDetial[name]
                                                              .address
                                                        : ''
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={6} rowSpacing={5}>
                                            <TextField
                                                disabled
                                                label={'City'}
                                                value={
                                                    name
                                                        ? locationsDetial[name]
                                                              .city
                                                        : ''
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={6} rowSpacing={5}>
                                            <TextField
                                                disabled
                                                label={'State'}
                                                value={
                                                    name
                                                        ? locationsDetial[name]
                                                              .state
                                                        : ''
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={6} rowSpacing={5}>
                                            <TextField
                                                disabled
                                                label={'Zipcode'}
                                                value={
                                                    name
                                                        ? locationsDetial[name]
                                                              .zip
                                                        : ''
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={6} rowSpacing={5}>
                                            <TextField
                                                disabled
                                                label={'Phone'}
                                                value={
                                                    name
                                                        ? locationsDetial[name]
                                                              .phone
                                                        : ''
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={6} rowSpacing={5}>
                                            <TextField
                                                disabled
                                                label={'Email'}
                                                value={
                                                    name
                                                        ? locationsDetial[name]
                                                              .email
                                                        : ''
                                                }
                                            />
                                        </Grid>
                                        <Grid item xs={6} rowSpacing={5}>
                                            <TextField
                                                disabled
                                                label={'Website'}
                                                value={
                                                    name
                                                        ? locationsDetial[name]
                                                              .website
                                                        : ''
                                                }
                                            />
                                        </Grid>
                                        <Grid item md={12} xs={12}>
                                            <Divider />
                                        </Grid>
                                        <Grid item md={12} xs={12}>
                                            <Typography
                                                sx={{ fontSize: 14 }}
                                                gutterBottom>
                                                Opeining and closing reception
                                                dates
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} rowSpacing={5}>
                                            <LocalizationProvider
                                                dateAdapter={AdapterDayjs}>
                                                <DatePicker
                                                    label='Start Date'
                                                    value={StartDateOpening}
                                                    onChange={(newValue) => {
                                                        dateChangeStartOpening(
                                                            newValue
                                                        );
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            style={{
                                                                width: '55%',
                                                                margin: 10
                                                            }}
                                                            error={
                                                                !StartDateOpening
                                                            }
                                                        />
                                                    )}
                                                />
                                            </LocalizationProvider>
                                        </Grid>
                                        <Grid item xs={6} rowSpacing={5}>
                                            <LocalizationProvider
                                                dateAdapter={AdapterDayjs}>
                                                <DatePicker
                                                    label='End Date'
                                                    value={EndDateOpening}
                                                    onChange={(newValue) => {
                                                        dateChangeEndOpening(
                                                            newValue
                                                        );
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            style={{
                                                                width: '55%',
                                                                margin: 10
                                                            }}
                                                            error={
                                                                !EndDateOpening
                                                            }
                                                        />
                                                    )}
                                                />
                                            </LocalizationProvider>
                                        </Grid>
                                        <Grid item md={12} xs={12}>
                                            <Divider />
                                        </Grid>
                                        <Grid item md={12} xs={12}>
                                            <Typography
                                                sx={{ fontSize: 14 }}
                                                gutterBottom>
                                                Showing start and end dates
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} rowSpacing={5}>
                                            <LocalizationProvider
                                                dateAdapter={AdapterDayjs}>
                                                <DatePicker
                                                    label='Start Date Showing'
                                                    value={StartDateShowing}
                                                    onChange={(newValue) => {
                                                        dateChangeStartShowing(
                                                            newValue
                                                        );
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            style={{
                                                                width: '55%',
                                                                margin: 10
                                                            }}
                                                            error={
                                                                !StartDateShowing
                                                            }
                                                        />
                                                    )}
                                                />
                                            </LocalizationProvider>
                                        </Grid>
                                        <Grid item xs={6} rowSpacing={5}>
                                            <LocalizationProvider
                                                dateAdapter={AdapterDayjs}>
                                                <DatePicker
                                                    label='End Date Showing'
                                                    value={EndDateShowing}
                                                    onChange={(newValue) => {
                                                        dateChangeEndShowing(
                                                            newValue
                                                        );
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            style={{
                                                                width: '55%',
                                                                margin: 10
                                                            }}
                                                            error={
                                                                !EndDateShowing
                                                            }
                                                        />
                                                    )}
                                                />
                                            </LocalizationProvider>
                                        </Grid>
                                        <Grid
                                            item
                                            xs={6}
                                            md={12}
                                            rowSpacing={5}>
                                            <Button
                                                disabled={
                                                    !StartDateOpening ||
                                                    !StartDateShowing ||
                                                    !EndDateOpening ||
                                                    !EndDateShowing ||
                                                    !name ||
                                                    !TitleValue ||
                                                    !DescriptionValue ||
                                                    Images.length === 0
                                                }
                                                variant='contained'
                                                onClick={onSubmit}
                                                style={{ width: '100%' }}>
                                                Submit
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </Paper>
    );
}

const locationsDetial = {
    'ArtSpace Chicago': {
        website: 'https://www.artspacechicago.com/',
        email: 'artspacechicago@gmail.com ',
        phone: '773-562-9760',
        address: '3418 W Armitage Ave Logan Square',
        city: 'Chicago',
        state: 'Illinois',
        zip: '60647'
    }
};
