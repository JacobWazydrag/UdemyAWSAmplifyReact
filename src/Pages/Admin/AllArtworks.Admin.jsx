import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { listArtworks } from '../../graphql/queries';
import { API, graphqlOperation, Storage } from 'aws-amplify';
export default function AllArtworksAdmin() {
    const [artworks, setArtworks] = useState([]);
    const [mainImageUrlFromArtworks, setMainImageUrlFromArtworks] = useState(
        []
    );
    useEffect(() => {
        getAllArworks();
    }, []);

    useEffect(() => {
        getMainUrls();
    }, [artworks]);

    async function getAllArworks() {
        await API.graphql(graphqlOperation(listArtworks))
            .then((el) => {
                setArtworks(el.data.listArtworks.items);
            })
            .catch((err) => console.log(err));
    }
    const returnMyUrlsForMainImage = async (image) => {
        return new Promise((resolve, reject) => {
            Storage.get(image.image1.key, { level: 'public' })
                .then((url) => resolve(url))
                .catch((err) => console.log(err));
            // let url2 = Storage.get(key, { level: 'public' });
        });
    };
    const getMainUrls = () => {
        let promises = [];
        artworks.map((image, i) => {
            return promises.push(returnMyUrlsForMainImage(image));
        });

        Promise.all(promises)
            .then((imageUrls) => {
                setMainImageUrlFromArtworks(imageUrls);
            })
            .catch((err) => {
                console.log('erre', err);
            });
    };
    const renderTable = () => {
        const columns = [
            { field: 'title', headerName: 'Title', width: 150 },
            {
                field: 'image',
                headerName: 'Main Artwork Image',
                width: 200,
                renderCell: (params) => (
                    <img
                        style={{ width: '100%', height: 150 }}
                        src={params.value}
                        alt='test'
                    />
                )
            },
            {
                field: 'status',
                headerName: 'Status',
                width: 200
            },
            {
                field: 'description',
                headerName: 'Description',
                width: 200
            },
            {
                field: 'goToDetail',
                headerName: 'Details',
                width: 200,
                renderCell: (params) => (
                    <a href={`/all-artworks/${params.value}`}>Go to Detail</a>
                )
            }
        ];
        let rows = [];
        artworks.map((artwork, index1) => {
            //first get the attributes
            let userObjToPush = {};
            userObjToPush.id = index1 + 1;
            userObjToPush.status = artwork.status;
            userObjToPush.title = artwork.title;
            userObjToPush.description = artwork.description;
            userObjToPush.image = mainImageUrlFromArtworks[index1];
            userObjToPush.goToDetail = artwork.id;

            return rows.push(userObjToPush);
        });
        return (
            <DataGrid
                rows={rows}
                rowHeight={150}
                autoHeight
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
            />
        );
    };
    if (artworks.length === 0) {
        return <div>Loading</div>;
    } else {
        return renderTable();
    }
}
