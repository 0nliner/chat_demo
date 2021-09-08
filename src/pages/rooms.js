import react from "react";
import {
    Button,
    Chip,
    Container,
    Fab,
    Grid,
    ListItem,
    ListItemText,
    Modal, Paper,
    TextField
} from "@material-ui/core";
import {Typography} from "@material-ui/core";
import {authorizedFetch} from "../fetchFabric";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import {Autocomplete} from "@material-ui/lab";



function Room ({id}) {
    return (
        <Paper style={{margin: "10px 0", }}>
            {/*//backgroundColor: "rgb(216 216 216)",*/}
            <Grid item style={{ height: 70, borderRadius: 5, padding: 4}}
                onClick={(e)=>{window.location = `/room/${id}`}}
            >
                <Typography variant={"h5"} align={"left"}>
                    комната №{id}
                </Typography>
            </Grid>
        </Paper>

    );
}


export function RoomsPage () {
    const [rooms, setRooms] = react.useState([]);
    const [candidates, setCandidates] = react.useState([]);
    
    // const [isFocused, setFocused] = react.useState(false);
    const inputRef = react.useRef();
    const [inputValue, setInputValue] = react.useState('');
    const [usersToAdd, setUsersToAdd] = react.useState([]);


    const {
        sendMessage,
        lastMessage,
        readyState,
    } = useWebSocket(
        `ws://localhost:8000/ws/user_search/?token=${localStorage.getItem("access_token") ? localStorage.getItem("access_token") : window.location = "/login"}`,
        {
            onOpen: (e) => {
                console.log("connected");
            },
            onClose: (e) => {
                console.log("disconnected");
            },
            shouldReconnect: (e) => true,
            onMessage: (event) => {
                const data = JSON.parse(event.data);
                // todo: добавление нового сообщение в чат
                console.log(data.users);
                setCandidates(data.users);
            }
        }
    );

    react.useEffect(
        async () => {
            let func = await authorizedFetch({url:'http://127.0.0.1:8000/api/chat/dialogs/', data:{}}).then(
                async response => {
                    let data = await response.json();
                    setRooms(data);
                    console.log(data);
                }
            );
        }, []
    );

    const [showModal, setShowModal] = react.useState();

    const modal_body = (
        <Container maxWidth={"sm"} style={{height: "300px", backgroundColor: "white", position: "relative"}}>
            <Typography variant={"h6"} align={"center"}>Создать чат</Typography>
            <Grid container alignItems={"center"} justify={"center"} direction={"column"}>

                <Autocomplete ref={inputRef}
                              options={candidates}
                              style={{ width: 300, marginBottom: 20 }}
                              getOptionLabel={(candidate) => candidate && candidate.username? candidate.username : ""}
                              inputValue={inputValue}
                              onInputChange={(e)=>
                              {
                                  if (e && e.type === "change") {
                                      setInputValue(e.target.value);
                                      sendMessage(
                                          JSON.stringify({
                                              'substring': e.target.value
                                          })
                                      );
                                  }
                              }}
                              renderInput={(params)=><TextField {...params} label={"username"}/>}
                              renderOption={(candidate) => {
                                  console.log("candidate", candidate);
                                  return <UserItem key={`candidate_${candidate.id}`} {...candidate}/>
                              }}
                />

                {/* выделенные пользователи */}
                <Grid container direction={"row"} justify={"left"}>
                    {/* TODO: присутствуют баги, надо пофиксить */}
                    {usersToAdd.map(user => <Chip key={`user_${user.id}`}
                                                  label={user.username}
                                                  style={{margin: 5}}
                                                  onDelete={(e)=> {
                                                         let index = usersToAdd.findIndex(member => member.id === user.id);
                                                         let copy = [...usersToAdd];
                                                         copy.splice(index);
                                                         setUsersToAdd(copy);
                                                     }}
                    />)}
                </Grid>

                <Button variant={"contained"} color={"primary"}
                    onClick={async () => {
                        authorizedFetch({url:`http://127.0.0.1:8000/api/chat/dialogs/`, data:{
                            method: "POST",
                            body: {users: usersToAdd.map(user=>user.id)},
                        }
                    }).then(async response => {
                        let data = await response.json();
                        // TODO: добавить проверку ответа
                        console.log(data);
                        window.location = `room/${data.id}`
                        })
                    }}
                >
                    создать чат
                </Button>
            </Grid>
        </Container>
    );

    function UserItem ({id, username}) {
        return (
            <ListItem
                      onClick={(e) => {
                          setUsersToAdd([...usersToAdd, {id, username}]);
                          setInputValue("");
            }}>
                <Typography>
                    {username}
                </Typography>
            </ListItem>
        );
    }


    return (
        <div style={{position: "relative"}}>
            <Fab style={{position: "fixed", zIndex: 1, bottom: 10, right: 10}}
                onClick={(e)=>setShowModal(!showModal)}
            >
                <Typography variant={"h3"}>
                    +
                </Typography>
            </Fab>
            <Container>
                <Grid container justify={"center"} direction={"column"}>
                    {rooms.map(room_data => <Room key={room_data.id} {...room_data}/>)}
                </Grid>
            </Container>

            <Modal
                open={showModal}
                onClose={(e)=>setShowModal(!showModal)}
                style={{display:'flex', alignItems:'center', justifyContent:'center'}}
            >
                {modal_body}
            </Modal>
        </div>

    );
}