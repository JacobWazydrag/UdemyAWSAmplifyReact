import React, { useState, useEffect } from 'react';
import {
    Card,
    CardActionArea,
    CardContent,
    CardHeader,
    Grid,
    InputLabel,
    MenuItem,
    Typography
} from '@mui/material';
import Select from '@mui/material/Select';
export default function ArtworkInfo(props) {
    const [artwork, setArtwork] = useState({});
    const [status, setStatus] = useState('');

    const handleChange = (event) => {
        setStatus(event.target.value);
    };

    useEffect(() => {
        setArtwork(props.detail);
    }, [props.detail]);



    return (
        <Card style={{ maxWidth: 500, minWidth: 200 }}>
            <CardHeader
                title='Publish Your Artwork Here'
                subheader='To publish attatch your atwork to an Artshow'></CardHeader>
            <CardContent>
                <Grid container>
                    <Grid item xs={6}>
                        <Typography> Price: </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography> ${artwork.price}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography> Title: </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography> {artwork.title}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography> Description: </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography> {artwork.description}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography>Status: </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography>{artwork.status}</Typography>
                    </Grid>
                </Grid>
            <CardActionArea style={{marginTop: 20}}>
            <InputLabel>Attach Artshow</InputLabel>
                <Select
                fullWidth
                    value={status}
                    label='Age'
                    onChange={handleChange}>
                    {/* <MenuItem value={'Staged'}>Staged</MenuItem>
                    <MenuItem value={'Published'}>Published</MenuItem> */}
                </Select>
            </CardActionArea>
            </CardContent>
        </Card>
    );
}
