import {Switch, BrowserRouter, Route} from "react-router-dom";
import './App.css';
import {RoomsPage} from "./pages/rooms";
import {RoomPage} from "./pages/RoomPage";
import {LoginPage} from "./pages/LoginPage";
import {useParams, useLocation} from "react-router-dom/cjs/react-router-dom";

function App() {

    return (
    <div className="App">
      <BrowserRouter>
          <Switch>
              <Route path={"/login"}>
                  <LoginPage/>
              </Route>


              <Route path={"/rooms"}>
                  <RoomsPage/>
              </Route>

              <Route path={"/room/:id"}>
                  <RoomPage/>
              </Route>

          </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
