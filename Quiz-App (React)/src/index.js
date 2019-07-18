import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import Home from './Components/Home.jsx';
import { Route, BrowserRouter as Router } from 'react-router-dom';
import UserHome from './Components/UserHome.jsx';
import QuizResult from './Components/QuizResult.jsx';

const routing = (
    <Router>
      <div>
        <Route path="/" exact component={App} />
        <Route path="/home" component={Home} />
        <Route path="/userHome" component={UserHome} />
        <Route path="/quizResult" component={QuizResult} />
      </div>
    </Router>
  )

ReactDOM.render(routing, document.getElementById('root'));
registerServiceWorker();
