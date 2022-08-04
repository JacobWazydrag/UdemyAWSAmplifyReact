import React, { useEffect, useState } from 'react';
import { Storage } from 'aws-amplify';
import ImageGallery from 'react-image-gallery';
import _ from 'underscore';
import 'react-image-gallery/styles/css/image-gallery.css';

export default function AllArtworkImageAdmin(props) {
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
                console.log('error', err);
            });
    };
    
    return (
        <div style={{maxHeight: 600, maxWidth: 600}}>
            {imageUrls.length === 0 ? null : (
                <ImageGallery
                    showBullets={true}
                    showIndex={true}
                    showThumbnails={true}
                    lazyLoad={true}
                    showPlayButton={false}
                    items={imageUrls}
                ></ImageGallery>
            )}
        </div>
    );
}
