import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import { Grid, Typography } from '@mui/material';
import Alert from '@mui/material/Alert';

function FileUpload(props) {
    const [ImageUrls, setImageURLs] = useState([]);
    const [Images, setImages] = useState([]);

    const onDrop = (files) => {
        let srcToUse = URL.createObjectURL(files[0]);
        setImageURLs([...ImageUrls, srcToUse]);
        setImages([...Images, files[0]]);
        props.refreshFunction([...Images, files[0]]);
    };

    const onDelete = (image) => {
        const currentIndex = Images.indexOf(image);
        const currentIndexUrl = ImageUrls.indexOf(image);

        let newImages = [...Images];
        let newImageUrls = [...ImageUrls];
        newImages.splice(currentIndex, 1);
        newImageUrls.splice(currentIndexUrl, 1);

        setImages(newImages);
        setImageURLs(newImageUrls);
        props.refreshFunction(newImages);
    };

    const thumbsContainer = {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 16
    };
    const thumb = {
        display: 'inline-flex',
        borderRadius: 2,
        border: '1px solid #eaeaea',
        marginBottom: 8,
        marginRight: 8,
        width: 350,
        height: 350,
        padding: 4,
        boxSizing: 'border-box'
    };
    const thumbInner = {
        display: 'flex',
        minWidth: 0,
        overflow: 'hidden'
    };

    const img = {
        display: 'block',
        width: 'auto',
        height: '100%'
    };

    return (
        <Grid
            container
            columns={1}
            style={{
                display: 'flex',
                justifyContent: 'space-between',
                cursor: 'pointer'
            }}>
            <Dropzone
                accept={{ 'image/*': [] }}
                onDrop={onDrop}
                multiple={false}
                maxSize={800000000}
                maxFiles={3}>
                {({
                    getRootProps,
                    getInputProps,
                    isFocused,
                    isDragAccept,
                    isDragReject
                }) => (
                    <div
                        style={{
                            width: '100%',
                            height: '240px',
                            border: isDragAccept
                                ? '3px dashed #00e676'
                                : isDragReject
                                ? '3px dashed #ff1744'
                                : '3px dashed grey',
                            backgroundColor: isDragAccept
                                ? '#dcf9e3'
                                : isDragReject
                                ? '#dfa0a0'
                                : '#efefef',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '50px'
                        }}
                        {...getRootProps()}>
                        <input {...getInputProps()} />

                        {isDragAccept ? (
                            <Alert severity='success'>
                                Great! Let go to start uploading
                            </Alert>
                        ) : isDragReject ? (
                            <Alert severity='error'>
                                Only allowed to upload images.
                            </Alert>
                        ) : (
                            <Typography variant='h5'>
                                <AddIcon style={{ fontSize: '3rem' }}></AddIcon>
                                Drag 'n' drop your artwork here, or click!
                            </Typography>
                        )}
                    </div>
                )}
            </Dropzone>

            <aside style={thumbsContainer}>
                {ImageUrls.map((image, index) => (
                    <>
                        <ClearIcon
                            style={{
                                fontSize: 35,
                                color: 'red',
                                cursor: 'pointer'
                            }}
                            onClick={() => onDelete(image)}
                        />
                        <div style={thumb} key={index}>
                            <div style={thumbInner}>
                                <img
                                    style={img}
                                    src={image}
                                    alt={`productImg-${index}`}
                                />
                            </div>
                        </div>
                    </>
                ))}
            </aside>
        </Grid>
    );
}

export default FileUpload;
