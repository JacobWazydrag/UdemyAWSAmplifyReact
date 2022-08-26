/* eslint-disable */
// WARNING: DO NOT EDIT. This file is automatically generated by AWS Amplify. It will be overwritten.

const awsmobile = {
    "aws_project_region": "us-east-2",
    "aws_cognito_identity_pool_id": "us-east-2:446af370-b93f-4ded-81f9-47e8cd035ad3",
    "aws_cognito_region": "us-east-2",
    "aws_user_pools_id": "us-east-2_nynTdimU1",
    "aws_user_pools_web_client_id": "1ttu6ammm4lcq0ig6pk71lt70o",
    "oauth": {
        "domain": "xfvhs58rx9xr-staging.auth.us-east-2.amazoncognito.com",
        "scope": [
            "phone",
            "email",
            "openid",
            "profile",
            "aws.cognito.signin.user.admin"
        ],
        "redirectSignIn": "http://localhost:3000/",
        "redirectSignOut": "http://localhost:3000/",
        "responseType": "code"
    },
    "federationTarget": "COGNITO_USER_POOLS",
    "aws_cognito_username_attributes": [
        "EMAIL"
    ],
    "aws_cognito_social_providers": [
        "FACEBOOK",
        "GOOGLE",
        "AMAZON"
    ],
    "aws_cognito_signup_attributes": [
        "EMAIL"
    ],
    "aws_cognito_mfa_configuration": "OFF",
    "aws_cognito_mfa_types": [
        "SMS"
    ],
    "aws_cognito_password_protection_settings": {
        "passwordPolicyMinLength": 8,
        "passwordPolicyCharacters": [
            "REQUIRES_LOWERCASE",
            "REQUIRES_NUMBERS",
            "REQUIRES_SYMBOLS",
            "REQUIRES_UPPERCASE"
        ]
    },
    "aws_cognito_verification_mechanisms": [
        "EMAIL"
    ],
    "aws_user_files_s3_bucket": "udemyawsamplifyreact-storage-48843bf6102759-staging",
    "aws_user_files_s3_bucket_region": "us-east-2",
    "aws_appsync_graphqlEndpoint": "https://xeiz2i4rvvgxhjs7ch3uvaziqu.appsync-api.us-east-2.amazonaws.com/graphql",
    "aws_appsync_region": "us-east-2",
    "aws_appsync_authenticationType": "AMAZON_COGNITO_USER_POOLS",
    "aws_cloud_logic_custom": [
        {
            "name": "AdminQueries",
            "endpoint": "https://iiy6mcnm2j.execute-api.us-east-2.amazonaws.com/staging",
            "region": "us-east-2"
        }
    ]
};


export default awsmobile;
