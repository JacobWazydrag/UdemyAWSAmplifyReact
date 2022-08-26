import './App.css';
import { Amplify } from 'aws-amplify';
import React from 'react';
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';
// import { Routes, Route } from 'react-router-dom';
// import Artshow from './Pages/User/Artshow';
// import ArtshowDetail from './Pages/User/ArtshowDetail';
// import Artwork from './Pages/User/Artwork';
// import ArtworkDetail from './Pages/User/ArtworkDetail';
// import Home from './Pages/User/Home';
import { createTheme, ThemeProvider } from '@mui/material';
import Layout from './Components/Layout';
// import Profile from './Pages/User/Profile';
// import ArtworkUpload from './Pages/User/ArtworkUpload';
// import AllArtistsAdmin from './Pages/Admin/AllArtists.Admin';
// import AllArtshowsAdmin from './Pages/Admin/AllArtshows.Admin';
// import AllArtworksAdmin from './Pages/Admin/AllArtworks.Admin';
// import HomeAdmin from './Pages/Admin/Home.Admin';
import LayoutAdmin from './Components/Layout.Admin';
// import AllArtistDetailAdmin from './Pages/Admin/AllArtistDetail.Admin';
// import AllArtworksDetailAdmin from './Pages/Admin/AllArtworksDetail.Admin';
// import ProfileAdmin from './Pages/Admin/Profile.Admin';

Amplify.configure(awsExports);

export default function App() {
    const theme = createTheme({});
    return (
        // <div>hello</div>
        <Authenticator socialProviders={['google', 'facebook', 'amazon']}>
            {({ signOut, user }) =>
                user.getSignInUserSession().getAccessToken().payload[
                    'cognito:groups'
                ] &&
                user
                .getSignInUserSession()
                .getAccessToken()
                .payload['cognito:groups'].includes('Admin') ? (
                    <ThemeProvider theme={theme}>
                        {console.log('user', user)}
                        <LayoutAdmin user={user} signout={signOut}>
                            {/* <Routes>
                                <Route path='/' element={<HomeAdmin />} />
                                <Route
                                    path='/all-artshows'
                                    element={<AllArtshowsAdmin />}
                                />
                                <Route
                                    path='/artshow-detail/:id'
                                    element={<ArtshowDetail />}
                                />
                                <Route
                                    path='/all-artworks'
                                    element={<AllArtworksAdmin />}
                                />
                                <Route
                                    path='/all-artworks/:id'
                                    element={<AllArtworksDetailAdmin />}
                                />
                                <Route
                                    path='/all-artists'
                                    element={<AllArtistsAdmin />}
                                />
                                <Route
                                    path='/all-artists/:id'
                                    element={<AllArtistDetailAdmin />}
                                />
                                <Route
                                    path='/admin-profile'
                                    element={<ProfileAdmin />}
                                />
                            </Routes> */}
                        </LayoutAdmin>
                    </ThemeProvider>
                ) : (
                    <ThemeProvider theme={theme}>
                        <Layout user={user} signout={signOut}>
                            {/* <Routes>
                                <Route path='/' element={<Home />} />
                                <Route path='/artshow' element={<Artshow />} />
                                <Route
                                    path='/artshow-detail/:id'
                                    element={<ArtshowDetail />}
                                />
                                <Route path='/artwork' element={<Artwork />} />
                                <Route
                                    path='/artwork/:id'
                                    element={<ArtworkDetail />}
                                />
                                <Route path='/profile' element={<Profile />} />
                                <Route
                                    path='/upload-artwork'
                                    element={<ArtworkUpload />}
                                />
                            </Routes> */}
                        </Layout>
                    </ThemeProvider>
                )
            }
        </Authenticator>
    );
}