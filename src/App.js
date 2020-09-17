import React from 'react';
import './App.css';
import './index.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import WeatherForecast from "./WeatherForecast"
import WeatherSchedule from "./WeatherSchedule"

function App() {
  return (
    <div className="App">
      <Router>
        <div className={"App-header"}>
          <nav>
            <ul>
              <li>
                <Link to="/WeatherForecast">Weather Forecast</Link>
              </li>
              <li>
                <Link to="/WeatherSchedule">Weather Schedule</Link>
              </li>
            </ul>
          </nav>
        </div>
        <div>
          <Switch>
            <Route path="/WeatherSchedule">
              <WeatherSchedule />
            </Route>
            <Route path="/WeatherForecast">
              <WeatherForecast />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
