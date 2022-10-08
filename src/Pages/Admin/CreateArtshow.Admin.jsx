import React, { useState, useEffect } from 'react';
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
    CardContent,
    FormControl,
    InputLabel,
    Select,
    Checkbox,
    ListItemText,
    OutlinedInput,
    CircularProgress
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
var _ = require('lodash');

const {
    aws_user_files_s3_bucket_region: region,
    aws_user_files_s3_bucket: bucket
} = config;
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250
        }
    }
};
const names = [
    'Oliver Hansen',
    'Van Henry',
    'April Tucker',
    'Ralph Hubbard',
    'Omar Alexander',
    'Carlos Abbott',
    'Miriam Wagner',
    'Bradley Wilkerson',
    'Virginia Andrews',
    'Kelly Snyder'
];
export default function ArtworkUpload(props) {
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
    let [artists, setArtists] = useState([]);
    const [formFeedback, setFormFeedback] = useState(null);
    const [personName, setPersonName] = React.useState([]);
    const [personIds, setPersonIds] = React.useState([]);

    const handleChange = (event, key) => {
        const { name, id } = key.props.artistobj;
        const {
            target: { value }
        } = event;
        let newVals = personIds;
        //adding an id for the first time
        if (newVals.length === 0) {
            newVals.push(id);
            //everything after the first time
        } else {
            //if it already exits take it out
            if (newVals.includes(id)) {
                var index = newVals.indexOf(id);
                if (index !== -1) {
                    newVals.splice(index, 1);
                }
                //if it doesnt then add it
            } else {
                newVals.push(id);
            }
        }
        setPersonName(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value
        );
        setPersonIds(newVals);
    };
    console.log(personIds, personName);
    useEffect(() => {
        getAllArtists();
    }, []);

    const closeDialog = () => {
        setFormFeedback(null);
    };

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
                Authorization: `${props.user
                    .getSignInUserSession()
                    .getAccessToken()
                    .getJwtToken()}`
            }
        };
        const { NextToken, ...rest } = await API.get(apiName, path, myInit);
        nextToken = NextToken;
        setArtists(
            rest.Users.filter((el) => {
                return el.Attributes[0].Value !== props.user.attributes.sub;
            })
        );
    }
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
            time_period_showing_start: StartDateShowing
                ? StartDateShowing.$d.toISOString().substring(0, 10)
                : '',
            time_period_reception_start: StartDateOpening
                ? StartDateOpening.$d.toISOString().substring(0, 10)
                : '',
            time_period_showing_end: EndDateShowing
                ? EndDateShowing.$d.toISOString().substring(0, 10)
                : EndDateShowing,
            time_period_reception_end: EndDateOpening
                ? EndDateOpening.$d.toISOString().substring(0, 10)
                : '',
            artists: personIds
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
                        setPersonIds([]);
                        setPersonName([]);
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
                        console.log('CreateArtShow line 293 err: ', err);
                    });
            })
            .catch((err) => {
                console.log('CreateArtShow line 297 err: ', err);
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
                                        <Grid item md={12} xs={12}>
                                            <Divider />
                                        </Grid>
                                        <Grid item md={12} xs={12}>
                                            <Typography
                                                sx={{ fontSize: 14 }}
                                                gutterBottom>
                                                Pick Artist
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} rowSpacing={5}>
                                            {artists.length === 0 ? (
                                                <Box sx={{ display: 'flex' }}>
                                                    <CircularProgress />
                                                </Box>
                                            ) : (
                                                <FormControl
                                                    sx={{ m: 1, width: '100%' }}
                                                    error={
                                                        personName.length === 0
                                                    }>
                                                    <InputLabel
                                                        style={{
                                                            width: '100%'
                                                        }}
                                                        id='demo-multiple-checkbox-label'>
                                                        Artists
                                                    </InputLabel>
                                                    <Select
                                                        labelId='demo-multiple-checkbox-label'
                                                        id='demo-multiple-checkbox'
                                                        multiple
                                                        value={personName}
                                                        onChange={handleChange}
                                                        input={
                                                            <OutlinedInput label='Artists' />
                                                        }
                                                        renderValue={(
                                                            selected
                                                        ) =>
                                                            selected.join(', ')
                                                        }
                                                        MenuProps={MenuProps}>
                                                        {artists.map(
                                                            (artist) => {
                                                                let name =
                                                                    _.find(
                                                                        artist.Attributes,
                                                                        (
                                                                            el,
                                                                            i
                                                                        ) => {
                                                                            return (
                                                                                el.Name ===
                                                                                'name'
                                                                            );
                                                                        }
                                                                    ).Value +
                                                                    ' ' +
                                                                    _.find(
                                                                        artist.Attributes,
                                                                        (
                                                                            el,
                                                                            i
                                                                        ) => {
                                                                            return (
                                                                                el.Name ===
                                                                                'family_name'
                                                                            );
                                                                        }
                                                                    ).Value;
                                                                return (
                                                                    <MenuItem
                                                                        artistobj={{
                                                                            id: artist.Username,
                                                                            name: name
                                                                        }}
                                                                        key={
                                                                            artist.Username
                                                                        }
                                                                        value={
                                                                            name
                                                                        }>
                                                                        <Checkbox
                                                                            checked={
                                                                                personName.indexOf(
                                                                                    name
                                                                                ) >
                                                                                -1
                                                                            }
                                                                        />
                                                                        <ListItemText
                                                                            primary={
                                                                                name
                                                                            }
                                                                        />
                                                                    </MenuItem>
                                                                );
                                                            }
                                                        )}
                                                    </Select>
                                                </FormControl>
                                            )}
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
                                                    Images.length === 0 ||
                                                    personName.length === 0
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
