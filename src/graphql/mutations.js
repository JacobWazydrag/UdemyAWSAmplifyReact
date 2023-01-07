/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createArtshow = /* GraphQL */ `
    mutation CreateArtshow(
        $input: CreateArtshowInput!
        $condition: ModelArtshowConditionInput
    ) {
        createArtshow(input: $input, condition: $condition) {
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
    }
`;

export const createChatroom = /* GraphQL */ `
    mutation CreateArtshow(
        $input: CreateChatroomInput!
        $condition: ModelChatroomConditionInput
    ) {
        createChatroom(input: $input, condition: $condition) {
            id
            messages {
                items {
                    id
                    authorFirst
                    authorLast
                    owner
                    body
                    updatedAt
                    createdAt
                }
                nextToken
            }
            title
            originator
            follower
            createdAt
            updatedAt
        }
    }
`;
export const createMessage = /* GraphQL */ `
    mutation CreateMessage(
        $input: CreateMessageInput!
        $condition: ModelMessageConditionInput
    ) {
        createMessage(input: $input, condition: $condition) {
            id
            chatroomMessagesId
            authorFirst
            authorLast
            owner
            body
            createdAt
            updatedAt
        }
    }
`;
export const updateArtshow = /* GraphQL */ `
    mutation UpdateArtshow(
        $input: UpdateArtshowInput!
        $condition: ModelArtshowConditionInput
    ) {
        updateArtshow(input: $input, condition: $condition) {
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
    }
`;
export const deleteArtshow = /* GraphQL */ `
    mutation DeleteArtshow(
        $input: DeleteArtshowInput!
        $condition: ModelArtshowConditionInput
    ) {
        deleteArtshow(input: $input, condition: $condition) {
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
export const createArtwork = /* GraphQL */ `
    mutation CreateArtwork(
        $input: CreateArtworkInput!
        $condition: ModelArtworkConditionInput
    ) {
        createArtwork(input: $input, condition: $condition) {
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
            artShow
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
export const updateArtwork = /* GraphQL */ `
    mutation UpdateArtwork(
        $input: UpdateArtworkInput!
        $condition: ModelArtworkConditionInput
    ) {
        updateArtwork(input: $input, condition: $condition) {
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
            artShow
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
export const deleteArtwork = /* GraphQL */ `
    mutation DeleteArtwork(
        $input: DeleteArtworkInput!
        $condition: ModelArtworkConditionInput
    ) {
        deleteArtwork(input: $input, condition: $condition) {
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
            artShow
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
export const createArtshowArtwork = /* GraphQL */ `
    mutation CreateArtshowArtwork(
        $input: CreateArtshowArtworkInput!
        $condition: ModelArtshowArtworkConditionInput
    ) {
        createArtshowArtwork(input: $input, condition: $condition) {
            id
            artshowID
            artworkID
            artshow {
                id
                artworks {
                    nextToken
                }
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
                status
                artShow
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
export const updateArtshowArtwork = /* GraphQL */ `
    mutation UpdateArtshowArtwork(
        $input: UpdateArtshowArtworkInput!
        $condition: ModelArtshowArtworkConditionInput
    ) {
        updateArtshowArtwork(input: $input, condition: $condition) {
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
                artShow
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
export const deleteArtshowArtwork = /* GraphQL */ `
    mutation DeleteArtshowArtwork(
        $input: DeleteArtshowArtworkInput!
        $condition: ModelArtshowArtworkConditionInput
    ) {
        deleteArtshowArtwork(input: $input, condition: $condition) {
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
                artShow
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
