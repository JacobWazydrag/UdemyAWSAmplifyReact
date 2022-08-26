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
        }
        type
        description
        status
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
    listArtshowArtworks(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
