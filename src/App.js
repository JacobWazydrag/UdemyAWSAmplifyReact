import './App.css';
import { Amplify } from 'aws-amplify';
import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';
import { Routes, Route } from 'react-router-dom';
import Artshow from './Pages/User/Artshow';
import ArtshowDetail from './Pages/User/ArtshowDetail';
import Artwork from './Pages/User/Artwork';
import ArtworkDetail from './Pages/User/ArtworkDetail';
import Home from './Pages/User/Home';
import { createTheme, ThemeProvider } from '@mui/material';
import Layout from './Components/Layout';
import Profile from './Pages/User/Profile';
import ArtworkUpload from './Pages/User/ArtworkUpload';
Amplify.configure(awsExports);

export default function App() {
    const theme = createTheme({});
    return (
        <Authenticator socialProviders={['google', 'facebook', 'amazon']}>
            {({ signOut, user }) =>
                user.getSignInUserSession().getAccessToken().payload[
                    'cognito:groups'
                ] &&
                user
                .getSignInUserSession()
                .getAccessToken()
                .payload['cognito:groups'].includes('Admin') ? (
                    <main>
                        <h1>
                            Hello {user.username} Admin!, please develope these
                            routes.
                        </h1>
                        <button onClick={signOut}>Sign out</button>
                    </main>
                ) : (
                    <ThemeProvider theme={theme}>
                        <Layout user={user} signout={signOut}>
                            <Routes>
                                <Route path='/' element={<Home />} />
                                <Route path='/artshow' element={<Artshow />} />
                                <Route
                                    path='/artshow-detail/:id'
                                    element={<ArtshowDetail />}
                                />
                                <Route path='/artwork' element={<Artwork />} />
                                <Route
                                    path='/artwork-detail/:id'
                                    element={<ArtworkDetail />}
                                />
                                <Route path='/profile' element={<Profile />} />
                                <Route
                                    path='/upload-artwork'
                                    element={<ArtworkUpload />}
                                />
                            </Routes>
                        </Layout>
                    </ThemeProvider>
                )
            }
        </Authenticator>
    );
}
