import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Divider,
    Grid,
    TextField,
    Alert,
    Stack,
    Tooltip,
    Popper,
    MenuItem,
    Checkbox,
    FormControlLabel,
    Autocomplete,
    CircularProgress
} from '@mui/material';
import 'react-phone-number-input/style.css';
import { Authenticator } from '@aws-amplify/ui-react';
import { Auth } from 'aws-amplify';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import { updateArtwork } from '../../graphql/mutations';

var _ = require('lodash');

export const ArtworkUpdateForm = (props) => {
    console.log(props.detail)
    const validProps = _.size(props.detail) !== 0;

    const [TitleValue, setTitleValue] = useState('');
    const [mediumsOtherExplained, setMediumsOtherExplained] = useState('');
    const [PriceValue, setPriceValue] = useState(0);
    const [DimensionH, setDimensionHValue] = useState('');
    const [DimensionW, setDimensionWValue] = useState('');
    const [uom, setUOMValue] = useState('');
    const [mediums, setMediums] = useState([]);
    const [framed, setFramed] = useState(false);
    const [formFeedback, setFormFeedback] = useState(null);

    const closeDialog = () => {
        setFormFeedback(null);
    };

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

    const handleIsFramed = (event) => {
        setFramed(event.target.checked);
    };

    const initializeForm = () => {
        if (validProps) {
            setTitleValue(props.detail.title);
            setMediumsOtherExplained(props.detail.mediumOthersExplained);
            setPriceValue(props.detail.price);
            setDimensionHValue(props.detail.dimensionsH);
            setDimensionWValue(props.detail.dimensionsW);
            setUOMValue(props.detail.UOM);
            setMediums(props.detail.mediums);
            setFramed(props.detail.isFramed);
        }
    };

    useEffect(() => {
        initializeForm();
    }, [props]);

    const onSubmit = async (event) => {
        event.preventDefault();

        const inputs = {
            title: TitleValue,
            dimensionsH: parseFloat(DimensionH),
            dimensionsW: parseFloat(DimensionW),
            UOM: uom,
            id: props.detail.id,
            // artistNameFirst: props.user.attributes.name,
            // artistNameLast: props.user.attributes.family_name,
            mediums: mediums,
            mediumOthersExplained: mediumsOtherExplained,
            isFramed: framed,
            price: parseFloat(PriceValue),
            status: 'STAGED'
        };

        API.graphql(graphqlOperation(updateArtwork, { input: inputs }))
            .then((el) => {
                props.refreshAction();
                setFormFeedback("success")
            })
            .catch((err) => {
                console.log('ArtworkUpdateFOrm line 84 err: ', err);
                return alert('There was an error!');
            });
    };
    const PopperMy = function (props) {
        return <Popper {...props} placement='right-start' />;
    };

    return (
        <Authenticator>
            {({ signOut, user }) => (
                <form autoComplete='on'>
                    <Card>
                        <CardHeader
                            subheader='Make edits to any of the fields and click "Update Details" when finished'
                            title={`Edit Artwork: ${TitleValue}`}
                        />
                        <Divider />
                        <CardContent>
                            {_.size(props.detail) !== 0 ? (
                                <Grid container spacing={3}>
                                    <Grid item md={6} xs={12}>
                                        <TextField
                                            label={'Title'}
                                            onChange={onTitleChange}
                                            value={TitleValue}
                                            error={!TitleValue}
                                        />
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
                                    <Grid item md={6} xs={6}>
                                        <Autocomplete
                                            PopperComponent={PopperMy}
                                            multiple
                                            id='tags-artTypes'
                                            options={artTypes}
                                            getOptionLabel={(option) => option}
                                            onChange={(event, value) =>
                                                onMediumsChange(value)
                                            }
                                            value={mediums}
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
                                        <Grid item md={12} xs={12}>
                                            <TextField
                                                label={'Explain other mediums'}
                                                onChange={
                                                    onMediumsOtherExplainedChange
                                                }
                                                value={mediumsOtherExplained}
                                                error={!mediumsOtherExplained}
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
                                                            framed !== undefined
                                                                ? framed
                                                                : false
                                                        }
                                                        onChange={
                                                            handleIsFramed
                                                        }
                                                    />
                                                }
                                            />
                                        </Grid>
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
                            ) : (
                                <Box sx={{ display: 'flex' }}>
                                    <CircularProgress />
                                </Box>
                            )}
                        </CardContent>
                        <Divider />
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'flex-end',
                                p: 2
                            }}>
                            <Tooltip
                                title={
                                    'title'
                                    // _.isEqual(values, userValues)
                                    //     ? 'No changes to update'
                                    //     : ''
                                }>
                                <span>
                                    <Button
                                        onClick={(e) => onSubmit(e)}
                                        color='primary'
                                        variant='contained'
                                        // disabled={_.isEqual(
                                        //     values,
                                        //     userValues
                                        // )}
                                    >
                                        Update details
                                    </Button>
                                </span>
                            </Tooltip>
                        </Box>
                    </Card>
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
                </form>
            )}
        </Authenticator>
    );
};
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
