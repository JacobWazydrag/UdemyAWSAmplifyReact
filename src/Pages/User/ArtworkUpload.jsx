import React, { useState } from 'react';
import { Typography, Button, TextField, Grid, Paper } from '@mui/material';
import FileUpload from '../../Components/FileUpload';
import { v4 as uuidv4 } from 'uuid';
import { API, graphqlOperation, Storage } from 'aws-amplify';
import { createArtwork } from '../../graphql/mutations';
import config from '../../aws-exports';
// import ArtSpaceLogo from '../../Assets/ArtSpace_Logo.webp';
const {
    aws_user_files_s3_bucket_region: region,
    aws_user_files_s3_bucket: bucket
} = config;

export default function ArtworkUpload() {
    const [TitleValue, setTitleValue] = useState('');
    const [DescriptionValue, setDescriptionValue] = useState('');
    const [PriceValue, setPriceValue] = useState(0);

    const [Images, setImages] = useState([]);

    const onTitleChange = (event) => {
        setTitleValue(event.currentTarget.value);
    };

    const onDescriptionChange = (event) => {
        setDescriptionValue(event.currentTarget.value);
    };

    const onPriceChange = (event) => {
        setPriceValue(event.currentTarget.value);
    };

    const updateImages = (newImages) => {
        setImages(newImages);
    };

    const uploadImageToS3 = async (image) => {
        let file = image;
        let extension = image.name.split('.')[1];
        let name = image.name.split('.')[0];
        let key = `images/${uuidv4()}${name}.${extension}`;
        // let url = `https://${bucket}.s3.${region}.amazonaws.com/public/${`images/${uuidv4()}${name}.${extension}`}`;
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
            status: "STAGED"
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
                        console.log('err');
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
                {/* <img
                    style={{
                        float: 'left',
                        height: 100,
                        width: 100,
                        paddingLeft: 5,
                        paddingTop: 5
                    }}
                    src={ArtSpaceLogo}
                    alt='Artpsace Logo'
                /> */}
                <Typography variant={'h2'}> Upload Artwork!</Typography>
            </div>
            <Grid container direction='column' spacing={2}>
                <Grid item xs={6} rowSpacing={5}>
                    <TextField
                        style={{ width: '35%', margin: 10 }}
                        label={'Title'}
                        onChange={onTitleChange}
                        value={TitleValue}
                        error={!TitleValue}
                    />
                    <TextField
                        style={{ width: '35%', margin: 10 }}
                        label={'Description'}
                        onChange={onDescriptionChange}
                        value={DescriptionValue}
                        type='textarea'
                        error={!DescriptionValue}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        style={{ width: '35%', margin: 10 }}
                        label={'Price $'}
                        onChange={onPriceChange}
                        value={PriceValue}
                        type='number'
                        error={!PriceValue}
                    />
                </Grid>
            </Grid>
            <FileUpload refreshFunction={updateImages} images={Images} />
            <Button
                disabled={
                    !TitleValue ||
                    !DescriptionValue ||
                    !PriceValue ||
                    Images.length !== 3
                }
                variant='contained'
                onClick={onSubmit}
                style={{ width: '100%' }}>
                Submit
            </Button>
        </Paper>
    );
}