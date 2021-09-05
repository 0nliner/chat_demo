import {Switch, BrowserRouter, Route} from "react-router-dom";
import './App.css';
import {RoomsPage} from "./pages/rooms";
import {RoomPage} from "./pages/RoomPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
          <Switch>
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
