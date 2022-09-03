import React, { useEffect, useState } from 'react';
import { Storage } from 'aws-amplify';
import _ from 'underscore';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // requires a loader
import { Carousel } from 'react-responsive-carousel';

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
        <div style={{ maxHeight: 600, maxWidth: 600 }}>
            {imageUrls.length === 0 ? null : (
                <Carousel>
                    {imageUrls.map((el, i) => {
                        return (
                            <div key={i}>
                                <img src={el.original} alt={'image_' + i}/>
                            </div>
                        );
                    })}
                </Carousel>
            )}
        </div>
    );
}
