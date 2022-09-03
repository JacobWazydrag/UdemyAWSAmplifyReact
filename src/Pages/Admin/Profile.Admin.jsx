import React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { Box } from '@mui/material';
import { Amplify } from 'aws-amplify';
import { Authenticator, withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from '../../aws-exports';
import { AccountFormAdmin } from './AccountForm.Admin';
import { AccountProfileAdmin } from './AccountProfile.Admin';

Amplify.configure(awsExports);

function ProfileAdmin() {
    return (
        <Authenticator>
            {({ signOut, user }) => (
                <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Paper
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}>
                                <Box
                                    component='main'
                                    sx={{
                                        flexGrow: 1,
                                        py: 8
                                    }}>
                                    <Container maxWidth='lg'>
                                        <Grid container spacing={3}>
                                            <Grid item lg={4} md={6} xs={12}>
                                                <AccountProfileAdmin />
                                            </Grid>
                                            <Grid item lg={8} md={6} xs={12}>
                                                <AccountFormAdmin />
                                            </Grid>
                                        </Grid>
                                    </Container>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
            )}
        </Authenticator>
    );
}

export default withAuthenticator(ProfileAdmin);