/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateArtshow = /* GraphQL */ `
    subscription OnCreateArtshow($owner: String) {
        onCreateArtshow(owner: $owner) {
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
export const onUpdateArtshow = /* GraphQL */ `
    subscription OnUpdateArtshow($owner: String) {
        onUpdateArtshow(owner: $owner) {
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
export const onDeleteArtshow = /* GraphQL */ `
    subscription OnDeleteArtshow($owner: String) {
        onDeleteArtshow(owner: $owner) {
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
export const onCreateArtwork = /* GraphQL */ `
    subscription OnCreateArtwork($owner: String) {
        onCreateArtwork(owner: $owner) {
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
    }
`;
export const onUpdateArtwork = /* GraphQL */ `
    subscription OnUpdateArtwork($owner: String) {
        onUpdateArtwork(owner: $owner) {
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
    }
`;
export const onDeleteArtwork = /* GraphQL */ `
    subscription OnDeleteArtwork($owner: String) {
        onDeleteArtwork(owner: $owner) {
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
    }
`;
export const onCreateArtshowArtwork = /* GraphQL */ `
    subscription OnCreateArtshowArtwork($owner: String) {
        onCreateArtshowArtwork(owner: $owner) {
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
export const onUpdateArtshowArtwork = /* GraphQL */ `
    subscription OnUpdateArtshowArtwork($owner: String) {
        onUpdateArtshowArtwork(owner: $owner) {
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
export const onDeleteArtshowArtwork = /* GraphQL */ `
    subscription OnDeleteArtshowArtwork($owner: String) {
        onDeleteArtshowArtwork(owner: $owner) {
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

export const onCreateMessageByChatroomId = /* GraphQL */ `
    subscription MySubscription($chatroomMessagesId: ID!) {
        onCreateMessageByChatroomId(chatroomMessagesId: $chatroomMessagesId) {
            id
        }
    }
`;
export const onCreateMessage = /* GraphQL */ `
    subscription MySubscription {
        onCreateMessage {
            id
        }
    }
`;
