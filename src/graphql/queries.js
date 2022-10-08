/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getArtshow = /* GraphQL */ `
    query GetArtshow($id: ID!) {
        getArtshow(id: $id) {
            id
            artworks {
                items {
                    id
                    artshowID
                    artworkID
                    createdAt
                    updatedAt
                    owner
                }
                nextToken
            }
            type
            description
            status
            createdAt
            updatedAt
            owner
        }
    }
`;
export const listArtshows = /* GraphQL */ `
    query ListArtshows(
        $filter: ModelArtshowFilterInput
        $limit: Int
        $nextToken: String
    ) {
        listArtshows(filter: $filter, limit: $limit, nextToken: $nextToken) {
            items {
                id
                artworks {
                    nextToken
                    items {
                        artwork {
                            id
                        }
                    }
                }
                title
                description
                status
                locationContactInformationName
                locationContactInformationPhone
                locationContactInformationAddress
                locationContactInformationCity
                locationContactInformationState
                locationContactInformationZipcode
                locationContactInformationEmail
                locationContactInformationWebsite
                time_period_showing_start
                time_period_reception_start
                time_period_showing_end
                time_period_reception_end
                artists
                image1 {
                    bucket
                    region
                    key
                }
                createdAt
                updatedAt
                owner
            }
            nextToken
        }
    }
`;
export const getArtwork = /* GraphQL */ `
    query GetArtwork($id: ID!) {
        getArtwork(id: $id) {
            id
            artshows {
                items {
                    id
                    artshowID
                    artworkID
                    createdAt
                    updatedAt
                    owner
                }
                nextToken
            }
            title
            UOM
            artistNameFirst
            artistNameLast
            dimensionsH
            dimensionsW
            mediumOthersExplained
            mediums
            isFramed
            status
            price
            image1 {
                bucket
                region
                key
            }
            image2 {
                bucket
                region
                key
            }
            image3 {
                bucket
                region
                key
            }
            createdAt
            updatedAt
            owner
        }
    }
`;
export const listArtworks = /* GraphQL */ `
    query ListArtworks(
        $filter: ModelArtworkFilterInput
        $limit: Int
        $nextToken: String
    ) {
        listArtworks(filter: $filter, limit: $limit, nextToken: $nextToken) {
            items {
                id
                artshows {
                    nextToken
                }
                title
                UOM
                artistNameFirst
                artistNameLast
                dimensionsH
                dimensionsW
                mediumOthersExplained
                mediums
                isFramed
                status
                price
                image1 {
                    bucket
                    region
                    key
                }
                image2 {
                    bucket
                    region
                    key
                }
                image3 {
                    bucket
                    region
                    key
                }
                createdAt
                updatedAt
                owner
            }
            nextToken
        }
    }
`;
export const getArtshowArtwork = /* GraphQL */ `
    query GetArtshowArtwork($id: ID!) {
        getArtshowArtwork(id: $id) {
            id
            artshowID
            artworkID
            artshow {
                id
                artworks {
                    nextToken
                }
                type
                description
                status
                createdAt
                updatedAt
                owner
            }
            artwork {
                id
                artshows {
                    nextToken
                }
                title
                description
                status
                price
                image1 {
                    bucket
                    region
                    key
                }
                image2 {
                    bucket
                    region
                    key
                }
                image3 {
                    bucket
                    region
                    key
                }
                createdAt
                updatedAt
                owner
            }
            createdAt
            updatedAt
            owner
        }
    }
`;
export const listArtshowArtworks = /* GraphQL */ `
    query ListArtshowArtworks(
        $filter: ModelArtshowArtworkFilterInput
        $limit: Int
        $nextToken: String
    ) {
        listArtshowArtworks(
            filter: $filter
            limit: $limit
            nextToken: $nextToken
        ) {
            items {
                id
                artshowID
                artworkID
                artshow {
                    id
                    type
                    description
                    status
                    createdAt
                    updatedAt
                    owner
                }
                artwork {
                    id
                    title
                    description
                    status
                    price
                    createdAt
                    updatedAt
                    owner
                }
                createdAt
                updatedAt
                owner
            }
            nextToken
        }
    }
`;
export const listArtworksWithArtshowsAdminWithStatus = /* GraphQL */ `
    query listArtworksWithArtshowsAdminWithStatus {
        listArtworks(limit: 999) {
            items {
                artshows(limit: 999) {
                    items {
                        id
                        artshow {
                            title
                            description
                            status
                            locationContactInformationName
                            locationContactInformationPhone
                            locationContactInformationAddress
                            locationContactInformationCity
                            locationContactInformationState
                            locationContactInformationZipcode
                            locationContactInformationEmail
                            locationContactInformationWebsite
                            time_period_showing_start
                            time_period_reception_start
                            time_period_showing_end
                            time_period_reception_end
                            artists
                            image1 {
                                bucket
                                region
                                key
                            }
                            updatedAt
                            createdAt
                            id
                            owner
                        }
                    }
                }
                owner
                title
                dimensionsH
                dimensionsW
                UOM
                status
                price
                artistNameFirst
                artistNameLast
                mediums
                mediumOthersExplained
                isFramed
                updatedAt
                id
                createdAt
                image1 {
                    bucket
                    key
                    region
                }
                image2 {
                    bucket
                    key
                    region
                }
                image3 {
                    bucket
                    key
                    region
                }
            }
        }
    }
`;
export const listArtshowTitles = /* GraphQL */ `
    query MyQuery {
        listArtshows(limit: 99999999) {
            nextToken
            items {
                title
                id
            }
        }
    }
`;
