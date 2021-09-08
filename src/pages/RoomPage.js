import react, {useCallback} from "react";
import {Box, Button, Container, Fab, Grid, makeStyles, TextareaAutosize, Typography} from "@material-ui/core";
import SendIcon from '@material-ui/icons/Send';
import {useParams} from "react-router-dom/cjs/react-router-dom";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import {authorizedFetch} from "../fetchFabric";


let useDialogStyles = makeStyles(theme => ({
    msg: {
        backgroundColor: "#1976d2",
        color: "white",
        minHeight: 30,
        maxWidth: 280,
        borderRadius: 5,
        margin: 10,
        padding: 10
    }
}));


function MyMsg ({datetime, text, from_user, sender_id}) {
    let classes = useDialogStyles();

    return (
        <Grid container justify={"flex-end"} style={{position: "relative", width: "100%", right: -15}}>
            <Box className={classes.msg} style={{right: 10}}>
                <Typography align="left" style={{marginBottom: 8}} variant="h6">
                    {from_user}
                </Typography>


                <Typography align="left">
                    {text}
                </Typography>

                <Typography style={{fontSize: "0.7em", marginTop: 15}} align="left">
                    {datetime}
                </Typography>
            </Box>
        </Grid>
    );
}

function OtherMsg ({datetime, text, from_user, sender_id}) {
    let classes = useDialogStyles();

    return (
        <Grid container
              justify={"flex-start"}
              style={{
                  position: "relative",
                  width: "100%",
                  left: -15,
              }}>

            <Box className={classes.msg} style={{left: 10, backgroundColor: "#16283a"}}>
                <Typography align="left" style={{marginBottom: 8}} variant="h6">
                    {from_user}
                </Typography>

                <Typography align="left">
                    {text}
                </Typography>

                <Typography style={{fontSize: "0.7em", marginTop: 15}} align="right">
                    {datetime}
                </Typography>
            </Box>
        </Grid>
    );
}

// todo: для удобства
// document.querySelector('#chat-message-input').focus();
// document.querySelector('#chat-message-input').onkeyup = function(e) {
//     if (e.keyCode === 13) {  // enter, return
//         document.querySelector('#chat-message-submit').click();
//     }
// };


export function RoomPage (props) {
    let classes = useDialogStyles();
    let {id} = useParams();
    let [messages, setMessages] = react.useState([]);
    const roomName = id;


    react.useEffect(async () => {
            await authorizedFetch({url:`http://127.0.0.1:8000/api/chat/dialogs/get_messages/${roomName}/`, data:{}
        }).then(
                async (response) => {
                    let data = await response.json();
                    console.log(data);
                    // TODO: хендлить ошибки
                    setMessages(data);
                }
            )
        }, []
    )

    console.log('ws://'
        + "localhost:8000"
        + '/ws/chat/'
        + roomName
        + '/'
        + `?token=${localStorage.getItem("access_token") ? localStorage.getItem("access_token") : window.location = "/login"}`);


    // window.location.host
    const {
        sendMessage,
        lastMessage,
        readyState,
    } = useWebSocket(
        'ws://'
        + "localhost:8000"
        + '/ws/chat/'
        + roomName
        + '/'
        + `?token=${localStorage.getItem("access_token") ? localStorage.getItem("access_token") : window.location = "/login"}`,
        {
            onOpen: () => {
                console.log("connected")
            },
            onClose: () => {
                console.error('Chat socket closed unexpectedly');
            },
            shouldReconnect: (closeEvent) => true,
            onMessage: (event) => {
                const data = JSON.parse(event.data);
                // todo: добавление нового сообщение в чат
                setMessages([...messages, data]);
            }
        }
    );

    function SendMessage (props) {

        const textarea_ref = react.useRef();

        function sendMessageF () {
            sendMessage(JSON.stringify({
                'message': textarea_ref.current.value
            }));
            textarea_ref.current.value = "";
        }

        return (
            <Grid container style={{
                position: "fixed",
                bottom: 0,
                width: "100%",
                minHeight: 40,
                // backgroundColor: "#dadada"
                backgroundColor: "white",
                boxShadow: "3px 0 7px 7px rgba(0, 0, 0, 0.2)"

            }}>

                <TextareaAutosize
                    rowsMin={1}
                    rowsMax={4}
                    style={{
                        border: "none",
                        // borderRadius: 30,
                        color: "#868686",
                        padding: 5,
                        width: "calc(100% - 50px)",
                        // margin: "auto"
                        position: "absolute",
                        left: 0
                    }} ref={textarea_ref}/>

                <Fab size="small" style={{position: "absolute", right: 5, bottom: 0, backgroundColor: "white", boxShadow: "none"}}
                     onClick={sendMessageF}
                >
                    <SendIcon/>
                </Fab>

            </Grid>
        );
    }


    //

    return (
        <Box>
            {/*<Header/>*/}
            <Container style={{
                bottom: 40,
                top: 40,
                height: "calc(100vh - 100px)",
                position: "absolute",
                overflowY: "scroll"
            }}>
                <Grid container
                      direction={"column"}>

                    {messages.map(message => message.from_user === localStorage.getItem("username")? <MyMsg {...message}/> :
                        <OtherMsg {...message}/>
                    )}

                </Grid>
            </Container>
            <SendMessage/>
        </Box>
    );
}