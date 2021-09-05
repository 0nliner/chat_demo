import react from "react";
import {Container, Fab, Grid, Modal, TextField} from "@material-ui/core";
import {Typography} from "@material-ui/core";


function Room ({title, id}) {
    return (
        <Grid item style={{backgroundColor: "rgb(216 216 216)", height: 70, marginTop: 10, borderRadius: 5, padding: 4}}>
            <Typography variant={"h5"} align={"left"}>
                {title}
            </Typography>
        </Grid>
    );
}

export function RoomsPage () {
    let rooms = [
        {
            title: "test title",
            id: 0
        },
        {
            title: "test title 2",
            id: 1
        },
    ];

    const [showModal, setShowModal] = react.useState();

    const modal_body = (
        <Container style={{height: "100px", backgroundColor: "white", width: 200}}>
            <Grid container style={{ }}>
                <TextField label={"room_name"}/>
            </Grid>
        </Container>
    );

    return (
        <div style={{position: "relative"}}>
            <Fab style={{position: "fixed", zIndex: 1, bottom: 10, right: 10}}
                onClick={(e)=>setShowModal(!showModal)}
            >
                <Typography variant={"h3"}>
                    +
                </Typography>
            </Fab>
            <Container xs={"sm"}>
                <Grid container justify={"center"} direction={"column"}>
                    {rooms.map(room_data => <Room {...room_data}/>)}
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