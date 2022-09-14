import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import SystemUpdateAltIcon from '@mui/icons-material/SystemUpdateAlt';
import ClearIcon from '@mui/icons-material/Clear';
import { Grid, Typography } from '@mui/material';
import Alert from '@mui/material/Alert';

export default function FileUpload(props) {
    const [ImageUrls, setImageURLs] = useState([]);
    const [Images, setImages] = useState([]);
    const multiple = props.multiple;
    const imagesToUpload = multiple ? 3 : 1;
    const onDrop = (files) => {
        if (Images.length === imagesToUpload) {
            return alert(
                'Only 3 images allowed. Please delete one to make room and continue uploading'
            );
        }
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

    if (props.images.length === 0) {
        Images.map((image, index) => {
            return onDelete(image);
        });
    }
    const thumbsContainer = {
        display: 'flex',
        flexDirection: 'column',
        marginTop: 16
        // textAlign: 'justify'
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
                cursor: 'pointer',
                placeContent: 'left'
            }}>
            <Dropzone
                accept={{ 'image/*': [] }}
                onDrop={onDrop}
                multiple={false}
                maxSize={800000000}
                maxFiles={imagesToUpload}>
                {({
                    getRootProps,
                    getInputProps,
                    isFocused,
                    isDragAccept,
                    isDragReject
                }) => (
                    <>
                        <div
                            style={{
                                width: '440px',
                                height: '240px',
                                transition:
                                    'outline-offset .15s ease-in-out, background-color .15s linear',
                                outlineOffset:
                                    isDragAccept || isDragReject
                                        ? '-20px'
                                        : '-10px',
                                outline: isDragAccept
                                    ? '2px dashed #92b0b3'
                                    : isDragReject
                                    ? '3px dashed #ff1744'
                                    : '2px dashed #92b0b3',
                                backgroundColor: isDragAccept
                                    ? 'white'
                                    : isDragReject
                                    ? '#dfa0a0'
                                    : '#c8dadf',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '50px'
                            }}
                            {...getRootProps()}>
                            <input {...getInputProps()} />

                            {isDragAccept ? (
                                <Typography variant='h5'>
                                    <SystemUpdateAltIcon
                                        style={{
                                            fontSize: '3rem',
                                            color: '#92b0b3'
                                        }}></SystemUpdateAltIcon>
                                    <p
                                        style={{
                                            fontWeight: 'bold',
                                            fontSize: '1rem'
                                        }}>
                                        Choose a file
                                    </p>{' '}
                                    <p
                                        style={{
                                            fontSize: '1rem'
                                        }}>
                                        or drag it here
                                    </p>
                                </Typography>
                            ) : isDragReject ? (
                                <Alert
                                    style={{ height: '35%', width: '75%' }}
                                    severity='error'>
                                    Only allowed to upload images.
                                </Alert>
                            ) : (
                                <>
                                    {Images.length === 1 ? (
                                        // <div
                                        //     style={{
                                        //         display: 'inline-flex',
                                        //         paddingLeft: 50,
                                        //         marginTop: '-50px'
                                        //     }}>
                                        //     <CheckCircleOutlineIcon
                                        //         style={{
                                        //             fontSize: 30,
                                        //             color: 'limegreen'
                                        //         }}></CheckCircleOutlineIcon>
                                        //     <Typography variant='h6'>
                                        //         {Images.length}/1 Images Staged!
                                        //     </Typography>
                                        // </div>
                                        <Typography variant='h5'>
                                            <SystemUpdateAltIcon
                                                style={{
                                                    fontSize: '3rem',
                                                    color: '#92b0b3'
                                                }}></SystemUpdateAltIcon>
                                            <p
                                                style={{
                                                    fontSize: '1rem'
                                                }}>
                                                {Images.length}/{imagesToUpload}{' '}
                                                Images Staged!
                                            </p>
                                        </Typography>
                                    ) : (
                                        <Typography variant='h5'>
                                            <SystemUpdateAltIcon
                                                style={{
                                                    fontSize: '3rem',
                                                    color: '#92b0b3'
                                                }}></SystemUpdateAltIcon>
                                            <p
                                                style={{
                                                    fontWeight: 'bold',
                                                    fontSize: '1rem'
                                                }}>
                                                Choose a file
                                            </p>{' '}
                                            <p
                                                style={{
                                                    fontSize: '1rem'
                                                }}>
                                                or drag it here
                                            </p>
                                        </Typography>
                                    )}
                                </>
                            )}
                        </div>
                    </>
                )}
            </Dropzone>
            <aside style={thumbsContainer}>
                {ImageUrls.map((image, index) => (
                    <div
                        style={{
                            display: 'inline-flex',
                            flexFlow: 'row-reverse',
                            cursor: 'pointer'
                        }}
                        key={index}>
                        <ClearIcon
                            style={{
                                fontSize: 35,
                                color: 'red'
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
                    </div>
                ))}
            </aside>
        </Grid>
    );
}
