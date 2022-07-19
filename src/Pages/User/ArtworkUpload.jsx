import React, { useState } from 'react';
import { Typography, Button, message, Input, Icon } from '@mui/material';
import FileUpload from '../../Components/FileUpload';
import Axios from 'axios';

const Artshows = [
    { key: 1, value: 'Africa' },
    { key: 2, value: 'Europe' },
    { key: 3, value: 'Asia' },
    { key: 4, value: 'North America' },
    { key: 5, value: 'South America' },
    { key: 6, value: 'Australia' },
    { key: 7, value: 'Antarctica' }
];

export default function ArtworkUpload() {
    const [TitleValue, setTitleValue] = useState('');
    const [DescriptionValue, setDescriptionValue] = useState('');
    const [PriceValue, setPriceValue] = useState(0);
    const [ArtshowValue, setArtshowValue] = useState(1);

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

    const onArtshowsSelectChange = (event) => {
        setArtshowValue(event.currentTarget.value);
    };

    const updateImages = (newImages) => {
        setImages(newImages);
    };
    const onSubmit = (event) => {
        event.preventDefault();

        if (
            !TitleValue ||
            !DescriptionValue ||
            !PriceValue ||
            !ArtshowValue ||
            !Images
        ) {
            return alert('fill all the fields first!');
        }

        const variables = {
            title: TitleValue,
            description: DescriptionValue,
            price: PriceValue,
            images: Images,
            artshows: ArtshowValue
        };

        Axios.post('/api/product/uploadProduct', variables).then((response) => {
            // if (response.data.success) {
            //     alert('Product Successfully Uploaded');
            //     props.history.push('/');
            // } else {
            //     alert('Failed to upload Product');
            // }
        });
    };

    return (
        <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <Typography level={2}> Upload Travel Product</Typography>
            </div>

            <form onSubmit={onSubmit}>
                {/* DropZone */}
                <FileUpload refreshFunction={updateImages} />

                <br />
                <br />
                <label>Title</label>
                <Input onChange={onTitleChange} value={TitleValue} />
                <br />
                <br />
                <label>Description</label>
                <textarea
                    onChange={onDescriptionChange}
                    value={DescriptionValue}
                />
                <br />
                <br />
                <label>Price($)</label>
                <Input
                    onChange={onPriceChange}
                    value={PriceValue}
                    type='number'
                />
                <br />
                <br />
                <select
                    onChange={onArtshowsSelectChange}
                    value={ArtshowValue}>
                    {Artshows.map((item) => (
                        <option key={item.key} value={item.key}>
                            {item.value}{' '}
                        </option>
                    ))}
                </select>
                <br />
                <br />

                <Button onClick={onSubmit}>Submit</Button>
            </form>
        </div>
    );
}
