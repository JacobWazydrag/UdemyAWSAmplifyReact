import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import AddIcon from '@mui/icons-material/Add';
import Axios from 'axios';
function FileUpload(props) {
    const [ImageUrls, setImageURLs] = useState([]);
    const [Images, setImages] = useState([]);

    const onDrop = (files) => {
        let formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        };
        formData.append('file', files[0]);
        //save the Image we chose inside the Node Server
        // Axios.post('/api/product/uploadImage', formData, config)
        // .then(response => {
        // if (response.data.success) {
        let srcToUse = URL.createObjectURL(files[0]);
        setImageURLs([...ImageUrls, srcToUse]);
        setImages([...Images, files[0]]);
        props.refreshFunction([...Images, files[0]]);

        // } else {
        //     alert('Failed to save the Image in Server')
        // }
        // })
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

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Dropzone onDrop={onDrop} multiple={false} maxSize={800000000}>
                {({ getRootProps, getInputProps }) => (
                    <div
                        style={{
                            width: '300px',
                            height: '240px',
                            border: '1px solid lightgray',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        {...getRootProps()}>
                        {/* {console.log('getRootProps', { ...getRootProps() })} */}
                        {/* {console.log('getInputProps', { ...getInputProps() })} */}
                        <input {...getInputProps()} />
                        <AddIcon style={{ fontSize: '3rem' }} />
                    </div>
                )}
            </Dropzone>

            <div
                style={{
                    display: 'flex',
                    width: '350px',
                    height: '240px',
                    overflowX: 'scroll'
                }}>
                {ImageUrls.map((image, index) => (
                    <div key={index} onClick={() => onDelete(image)}>
                        {/* {console.log(image)} */}
                        <img
                            style={{
                                minWidth: '300px',
                                width: '300px',
                                height: '240px'
                            }}
                            src={image}
                            alt={`productImg-${index}`}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default FileUpload;
