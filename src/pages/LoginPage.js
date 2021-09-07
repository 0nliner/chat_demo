import react from "react";
import {Button, Container, Grid, makeStyles, Typography} from "@material-ui/core";


let useStyles = makeStyles(theme => ({
    input: {
        backgroundColor: "#F2F2F2",
        color: "#6C6C6C",
        paddingLeft: 20,
        width: "calc(100% - 20px)",
        height: 35,
        border: "none",
        borderRadius: 10
    },
    logo: {
        color: "rgba(62, 89, 130, 1)",
        fontFamily: "Montserrat",
        fontWeight: "500",
        fontSize: "22px",
        marginTop: 20,
        letterSpacing: "0.500em",
        textShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    },
    btn: {
        backgroundColor: "rgba(41, 67, 103, 1)",
        color: "rgba(255, 255, 255, 1)",
        fontSize: "14px",
        textTransform: "none"
    }


}));

export function LoginPage (props) {
    let classes = useStyles();
    const email = react.useRef();
    const password = react.useRef();

    async function auth () {

        await fetch(`http://localhost:8000/auth/jwt/create/`,
            {
                method: "POST",
                headers: {
                        "Content-Type": "application/json"
                    },
                body: JSON.stringify({
                    username: email.current.value,
                    password: password.current.value
                })
            }).then(async (response) => {
                let data = await response.json();
                email.current.value = "";
                password.current.value = "";

                localStorage.setItem("access_token", data.access);
                localStorage.setItem("refresh_token", data.refresh);

                window.location = "/rooms";
        });
    }

    // const link = () => {
    //     window.location.assign('http://localhost:3000/registration');
    // };

    return (
        <Container maxWidth={"sm"}>

            <Typography variant={"h4"} className={classes.logo}>
                CHAT_EXAMPLE
            </Typography>

            <Typography variant={"h6"} style={{marginTop: 20, fontSize: "16px", fontWeight: "600"}}>
                Авторизуйтесь
            </Typography>

            <input className={classes.input}
                   placeholder={"username"}
                   ref={email}
                   style={{
                       marginBottom: 10,
                       marginTop: 40,
                   }}/>

            <input className={classes.input}
                   placeholder={"Пароль"}
                   ref={password}
                   type={"password"}
                   style={{
                       marginBottom: 40,
                   }}/>


            <Grid container justify={"center"} direction={"column"}>
                <Button className={classes.btn} onClick={auth} variant={"contained"} color={"primary"} style={{marginBottom: 10}}>
                    Войти
                </Button>

                {/*<Button className={classes.btn} onClick={link}  variant={"contained"} color={"primary"}>*/}
                {/*    Зарегистироваться*/}
                {/*</Button>*/}

                {/*<Typography variant={"caption"} style={{marginTop: 20, color: "rgba(128, 160, 206, 1)"}}>*/}
                {/*    Забыли пароль?*/}
                {/*</Typography>*/}

            </Grid>

        </Container>
    );
}