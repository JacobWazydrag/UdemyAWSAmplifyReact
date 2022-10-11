import React, { useEffect, useState, useRef } from 'react';
import API, { graphqlOperation } from '@aws-amplify/api';
import { listChatrooms } from '../../graphql/queries';
import { createChatroom, createMessage } from '../../graphql/mutations';
import '@aws-amplify/pubsub';
import { onCreateMessageByChatroomId } from '../../graphql/subscriptions';
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
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Fade from '@mui/material/Fade';
import { Alert, Stack } from '@mui/material';
const steps = [
    {
        label: 'Get Started',
        description: `Before you can start uploading your artwork, 
        you must go into your profile settings and fill out all the 
        information. Once you submit that information the links to start 
        the uploading process will be available.`
    },
    {
        label: 'Upload your artwork!',
        description:
            'Use the fields and image uploader to create artworks. These will then go through an approval process that will finally result in being added to an Artshow.'
    },
    {
        label: 'Await Approval',
        description: `Once your artwork is approved and attatched to an artshow you can check out your artshow in the Artshows tab.`
    }
];
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

const Chat = (props) => {
    const [chatRoom, setChatRoom] = useState({});
    const [activeStep, setActiveStep] = React.useState(0);
    const [TextInput, setTextTinput] = useState('');
    const [formFeedback, setFormFeedback] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current
            ? messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
            : console.log('whoo');
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatRoom]);

    const handleText = (event) => {
        setTextTinput(event.target.value);
    };

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
        createChatrooms();
    };

    const closeDialog = () => {
        setFormFeedback(null);
    };

    useEffect(() => {
        checkChatrooms();
    }, []);

    const refreshFunction = () => {
        checkChatrooms();
    };
    useEffect(() => {
        if (_.size(chatRoom) > 0 && chatRoom.id) {
            const subscription = API.graphql({
                query: onCreateMessageByChatroomId,
                variables: {
                    chatroomMessagesId: chatRoom.id
                }
            }).subscribe({
                next: (data) => {
                    refreshFunction();
                }
            });

            return () => {
                console.log('unscubscribed!');
                subscription.unsubscribe();
            };
        }
    }, [chatRoom]);
    async function checkChatrooms() {
        await API.graphql(
            graphqlOperation(listChatrooms, {
                filter: {
                    follower: { eq: props.user.username }
                }
            })
        )
            .then((el) => {
                setChatRoom(el.data.listChatrooms.items[0]);
            })
            .catch((err) => {
                console.log('Check Chatrooms error: ', err);
            });
    }
    async function createChatrooms() {
        const inputs = {
            follower: props.user.username,
            originator: 'cf0eca38-1976-480b-a2c6-68b04de9ddec',
            title: 'TEST'
        };
        await API.graphql(graphqlOperation(createChatroom, { input: inputs }))
            .then((el) => {
                refreshFunction();
            })
            .catch((err) => {
                console.log('Create Chat error: ', err);
            });
    }
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
                refreshFunction();
                setTextTinput('');
            })
            .catch((err) => {
                console.log('Send Message error: ', err);
            });
    }
    const classes = useStyles();
    console.log(chatRoom);
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
                        {admins.map((admin, index1) => {
                            return (
                                <ListItem button key={admin.sub}>
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
                                            imgKey={`profileImage/profile${admin.sub}.png`}
                                        />
                                    </ListItemIcon>
                                    <ListItemText>
                                        {admin.name + ' ' + admin.familyName}
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
                            <Fade in timeout={2500}>
                                <Box sx={{ maxWidth: 400 }}>
                                    <Stepper
                                        activeStep={activeStep}
                                        orientation='vertical'>
                                        {steps.map((step, index) => (
                                            <Step key={step.label}>
                                                <StepLabel
                                                    optional={
                                                        index === 2 ? (
                                                            <Typography variant='caption'>
                                                                Last step
                                                            </Typography>
                                                        ) : null
                                                    }>
                                                    {step.label}
                                                </StepLabel>
                                                <StepContent>
                                                    <Typography>
                                                        {step.description}
                                                    </Typography>
                                                    <Box sx={{ mb: 2 }}>
                                                        <div>
                                                            <Button
                                                                variant='contained'
                                                                onClick={
                                                                    handleNext
                                                                }
                                                                sx={{
                                                                    mt: 1,
                                                                    mr: 1
                                                                }}>
                                                                {index ===
                                                                steps.length - 1
                                                                    ? 'Finish'
                                                                    : 'Continue'}
                                                            </Button>
                                                            <Button
                                                                disabled={
                                                                    index === 0
                                                                }
                                                                onClick={
                                                                    handleBack
                                                                }
                                                                sx={{
                                                                    mt: 1,
                                                                    mr: 1
                                                                }}>
                                                                Back
                                                            </Button>
                                                        </div>
                                                    </Box>
                                                </StepContent>
                                            </Step>
                                        ))}
                                    </Stepper>
                                    {activeStep === steps.length && (
                                        <Paper
                                            square
                                            elevation={0}
                                            sx={{ p: 3 }}>
                                            <Typography>
                                                All steps completed -
                                                you&apos;re finished!
                                            </Typography>
                                            <Button
                                                onClick={handleReset}
                                                sx={{ mt: 1, mr: 1 }}>
                                                Get Started!
                                            </Button>
                                        </Paper>
                                    )}
                                </Box>
                            </Fade>
                        ) : (
                            <>
                                <ListItem key='1'>
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <ListItemText
                                                align='left'
                                                primary='Welcome to Artspace and Congratulations! If you have any questions or need help getting started just let me know!'></ListItemText>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <ListItemText
                                                align='left'
                                                secondary='09:30'></ListItemText>
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
            <Stack sx={{ width: '100%' }} spacing={2}>
                {formFeedback && (
                    <Alert
                        severity={formFeedback}
                        onClose={() => {
                            closeDialog();
                        }}>
                        {formFeedback
                            ? formFeedback === 'success'
                                ? 'Success!'
                                : 'Error!'
                            : ''}
                    </Alert>
                )}
            </Stack>
        </div>
    );
};
const admins = [
    {
        sub: 'cf0eca38-1976-480b-a2c6-68b04de9ddec',
        name: 'Jacob',
        familyName: 'AdminDrag'
    }
];
export default Chat;
