import React, { useEffect, useState } from 'react';
import { Storage } from 'aws-amplify';
import ImageGallery from 'react-image-gallery';
import _ from 'underscore';
import { Card } from '@mui/material';
import 'react-image-gallery/styles/css/image-gallery.css';
export default function ArtworkImage(props) {
    const [imageUrls, setImgUrls] = useState([]);
    useEffect(() => {
        getUrls();
    }, [props.detail]);

    const returnMyUrlsForMainImage = async (imageUrl) => {
        return new Promise((resolve, reject) => {
            Storage.get(imageUrl, { level: 'public' })
                .then((url) =>
                    resolve({
                        original: url,
                        thumbnail: url
                        // thumbnailHeight: 200,
                        // thumbnailWidth: 200,
                        // originalWidth: 100,
                        // originalHeight: 100
                    })
                )
                .catch((err) => console.log(err));
        });
    };

    const getUrls = async () => {
        let promises = [];
        _.forEach(props.detail, (value, key) => {
            if (key.includes('image')) {
                return promises.push(returnMyUrlsForMainImage(value.key));
            }
        });

        Promise.all(promises)
            .then((imageUrls) => {
                setImgUrls(imageUrls);
            })
            .catch((err) => {
                console.log('erre', err);
            });
    };
    console.log(imageUrls);
    return (
        <div>
            {imageUrls.length === 0 ? null : (
                <ImageGallery
                    showBullets={true}
                    showIndex={true}
                    showThumbnails={true}
                    lazyLoad={true}
                    showPlayButton={false}
                    items={imageUrls}
                />
            )}
        </div>
    );
}
