import React from 'react';
import Button from '@mui/material/Button';
import ExitToApp from '@mui/icons-material/ExitToApp';
export default function AllArtshowsAdmin() {
    return (
        <div
            style={{
                display: 'flex',
                height: '300px',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column'
            }}>
            <h2>No Artshows yet...</h2>
            <br></br>
            <Button href='/home' variant='contained' color='secondary'>
                Go Back Home
                <ExitToApp />
            </Button>
        </div>
    );
}
