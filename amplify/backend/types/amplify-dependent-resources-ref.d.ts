export type AmplifyDependentResourcesAttributes = {
    "auth": {
        "userPoolGroups": {
            "adminsGroupRole": "string",
            "artistsGroupRole": "string",
            "devGroupRole": "string"
        },
        "artspaceforms155ed2da155ed2da": {
            "IdentityPoolId": "string",
            "IdentityPoolName": "string",
            "HostedUIDomain": "string",
            "OAuthMetadata": "string",
            "UserPoolId": "string",
            "UserPoolArn": "string",
            "UserPoolName": "string",
            "AppClientIDWeb": "string",
            "AppClientID": "string",
            "CreatedSNSRole": "string",
            "GoogleWebClient": "string",
            "FacebookWebClient": "string",
            "AmazonWebClient": "string"
        }
    },
    "function": {
        "AdminQueries3d917b0f": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        }
    },
    "api": {
        "AdminQueries": {
            "RootUrl": "string",
            "ApiName": "string",
            "ApiId": "string"
        },
        "artspaceforms": {
            "GraphQLAPIIdOutput": "string",
            "GraphQLAPIEndpointOutput": "string"
        }
    },
    "storage": {
        "artspaceartistformimages": {
            "BucketName": "string",
            "Region": "string"
        }
    }
}