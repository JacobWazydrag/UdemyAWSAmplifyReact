import React, { useEffect, useState, useRef } from 'react';
import API, { graphqlOperation } from '@aws-amplify/api';
import { listChatrooms } from '../../graphql/queries';
import { createMessage } from '../../graphql/mutations';
import { onCreateMessage } from '../../graphql/subscriptions';
import { makeStyles } from '@mui/styles';
import { AmplifyS3Image } from '@aws-amplify/ui-react/legacy';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Fab from '@mui/material/Fab';
import SendIcon from '@mui/icons-material/Send';
var _ = require('underscore');

const useStyles = makeStyles({
    table: {
        minWidth: 650
    },
    chatSection: {
        width: '100%',
        height: '80vh'
    },
    headBG: {
        backgroundColor: '#e0e0e0'
    },
    borderRight500: {
        borderRight: '1px solid #e0e0e0'
    },
    messageArea: {
        height: '70vh',
        overflowY: 'auto'
    }
});

const AdminChat = (props) => {
    let [artists, setArtists] = useState([]);
    const [chatRoom, setChatRoom] = useState({});
    const [TextInput, setTextTinput] = useState('');
    const [formFeedback, setFormFeedback] = useState(null);
    const messagesEndRef = useRef(null);

    const handleText = (event) => {
        setTextTinput(event.target.value);
    };
    const scrollToBottom = () => {
        messagesEndRef.current
            ? messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
            : console.log('whoo');
    };

    useEffect(() => {
        getAllArtists();
    }, []);

    useEffect(() => {
        if (artists && artists.length > 0 && artists[0].Username){
            checkChatrooms(artists[0].Username)
        }
    }, [artists]);

    useEffect(() => {
        if (_.size(chatRoom) > 0 && chatRoom.id) {
            scrollToBottom();
            console.log('yes',chatRoom.follower);
            const subscription = API.graphql({
                query: onCreateMessage
            }).subscribe({
                next: (data) => {
                    console.log(data, 'hereeeeeeee line 71');
                    refreshFunction(chatRoom.follower);
                    console.log('data: ', data);
                }
            });

            return () => {
                console.log('unscubscribed!');
                subscription.unsubscribe();
            };
        } else {
            console.log('no');
        }
    }, [chatRoom]);

    const refreshFunction = (username) => {
        checkChatrooms(username);
    };
    async function sendMessage() {
        const inputs = {
            authorFirst: props.user.attributes.name,
            authorLast: props.user.attributes.family_name,
            owner: props.user.attributes.sub,
            body: TextInput,
            chatroomMessagesId: chatRoom.id
        };
        if (!TextInput) {
            return;
        }
        await API.graphql(graphqlOperation(createMessage, { input: inputs }))
            .then((el) => {
                refreshFunction(props.user.attributes.sub);
                setTextTinput('');
            })
            .catch((err) => {
                console.log('Send Message err: ', err);
            });
    }
    async function checkChatrooms(username) {
        await API.graphql(
            graphqlOperation(listChatrooms, {
                filter: {
                    follower: { eq: username }
                }
            })
        )
            .then((el) => {
                setChatRoom(el.data.listChatrooms.items[0]);
            })
            .catch((err) => {
                console.log('Check Chatrooms err: ', err);
            });
    }

    let nextToken;
    async function getAllArtists() {
        let apiName = 'AdminQueries';
        let path = '/listUsers';
        let myInit = {
            queryStringParameters: {
                limit: 0,
                token: nextToken
            },
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${props.user
                    .getSignInUserSession()
                    .getAccessToken()
                    .getJwtToken()}`
            }
        };
        const { NextToken, ...rest } = await API.get(apiName, path, myInit);
        nextToken = NextToken;
        setArtists(
            rest.Users.filter((el) => {
                return el.Attributes[0].Value !== props.user.attributes.sub;
            })
        );
    }

    const classes = useStyles();
    return (
        <div>
            <Grid container>
                <Grid item xs={12}>
                    <Typography variant='h5' className='header-message'>
                        Chat
                    </Typography>
                </Grid>
            </Grid>
            <Grid container component={Paper} className={classes.chatSection}>
                <Grid item xs={3} className={classes.borderRight500}>
                    <List>
                        {artists.map((artist, index1) => {
                            let userObjToPush = {};
                            userObjToPush[artist.Username] = {};
                            artist.Attributes.map((attribute, index2) => {
                                if (attribute.Name === 'name') {
                                    userObjToPush[artist.Username].name =
                                        attribute.Value;
                                } else if (attribute.Name === 'family_name') {
                                    userObjToPush[artist.Username].familyName =
                                        attribute.Value;
                                } else if (attribute.Name === 'sub') {
                                    userObjToPush[artist.Username].sub =
                                        attribute.Value;
                                }
                            });

                            return (
                                <ListItem
                                    onClick={() => {
                                        checkChatrooms(artist.Username);
                                    }}
                                    button
                                    key={artist.Username}>
                                    <ListItemIcon>
                                        <AmplifyS3Image
                                            imgProps={{
                                                style: {
                                                    verticalAlign: 'middle',
                                                    width: '50px',
                                                    height: '50px',
                                                    borderRadius: '50%'
                                                }
                                            }}
                                            level='public'
                                            imgKey={`profileImage/profile${
                                                userObjToPush[artist.Username]
                                                    .sub
                                            }.png`}
                                        />
                                    </ListItemIcon>
                                    <ListItemText>
                                        {userObjToPush[artist.Username].name +
                                            ' ' +
                                            userObjToPush[artist.Username]
                                                .familyName}
                                    </ListItemText>
                                    <ListItemText
                                        secondary='online'
                                        align='right'></ListItemText>
                                </ListItem>
                            );
                        })}
                    </List>
                </Grid>
                <Grid item xs={9}>
                    <List className={classes.messageArea}>
                        {_.size(chatRoom) === 0 ? (
                            <ListItem key='1'>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <ListItemText
                                            align='center'
                                            primary='Start chatting by clicking a User to your left! '></ListItemText>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <ListItemText
                                            align='center'
                                            secondary='Type below and press enter or press the send button to send the message.'></ListItemText>
                                    </Grid>
                                </Grid>
                            </ListItem>
                        ) : (
                            <>
                                <ListItem key='1'>
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <ListItemText
                                                align='right'
                                                primary='Welcome to Artspace and Congratulations! If you have any questions or need help getting started just let me know!'></ListItemText>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <ListItemText
                                                align='right'
                                                secondary=''></ListItemText>
                                        </Grid>
                                    </Grid>
                                </ListItem>
                                {_.sortBy(
                                    chatRoom.messages.items,
                                    'createdAt'
                                ).map((message, index) => {
                                    return (
                                        <ListItem key={message.id}>
                                            <Grid container>
                                                <Grid item xs={12}>
                                                    <ListItemText
                                                        align={
                                                            message.owner ===
                                                            props.user.username
                                                                ? 'right'
                                                                : 'left'
                                                        }
                                                        primary={
                                                            message.body
                                                        }></ListItemText>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <ListItemText
                                                        align={
                                                            message.owner ===
                                                            props.user.username
                                                                ? 'right'
                                                                : 'left'
                                                        }
                                                        secondary={
                                                            new Date(
                                                                message.createdAt
                                                            ).toLocaleDateString() +
                                                            ' ' +
                                                            new Date(
                                                                message.createdAt
                                                            ).toLocaleTimeString()
                                                        }></ListItemText>
                                                </Grid>
                                            </Grid>
                                        </ListItem>
                                    );
                                })}
                            </>
                        )}
                        <div ref={messagesEndRef}></div>
                    </List>
                    <Divider />
                    <Grid container style={{ padding: '20px' }}>
                        <Grid item xs={11}>
                            <TextField
                                id='outlined-basic-email'
                                label='Type Something'
                                fullWidth
                                onChange={handleText}
                                value={TextInput}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        sendMessage();
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={1} align='right'>
                            <Fab color='primary' aria-label='add'>
                                <SendIcon />
                            </Fab>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
};

export default AdminChat;
