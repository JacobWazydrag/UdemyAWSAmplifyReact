import React, { useEffect, useState } from 'react';
import { listArtworks } from '../../graphql/queries';
import { API, graphqlOperation } from 'aws-amplify';

export default function Artwork() {
    const [hasError, setErrors] = useState(false);
    const [artworks, setArtworks] = useState(null);
    useEffect(() => {
        if (!artworks) {
            API.graphql(graphqlOperation(listArtworks))
                .then((el) => {
                    setArtworks(el.data.listArtworks);
                })
                .catch((err) => setErrors(err));
        }
    });
    console.log(artworks, hasError);
    return <div>Artwork</div>;
}
