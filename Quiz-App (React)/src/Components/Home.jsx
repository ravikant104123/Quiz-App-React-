import React, { Component } from 'react'
import { Route, NavLink, Switch, BrowserRouter as Router } from 'react-router-dom';
import JqxTooltip from '../assets/jqwidgets-react/react_jqxtooltip.js';
import QuestionCategories from './QuestionCategories.jsx';
import QuestionsSet from './QuestionsSet.jsx';
import QuizTopics from './QuizTopics.jsx';
import $ from 'jquery';
import Popup from './Popup.jsx';
import './home.css';
import Quiz from './Quiz.jsx';
import StartQuizForm from './StartQuizForm.jsx';


class Home extends Component {
  state = {
        isOpen: false,
        startQuiz:false,
        paramsQuiz: [],
  }

  getAvailableCategory = () => {
    var returnedData;
      $.ajax({
        type: "GET",
        async: false,
        url:"http://localhost:8000/Quiz/categories",
        success: function(data){
            returnedData = data;
        }
    });
    return returnedData.map((data) => {
            return data.categories;
        });
  }

  closePopup = () => {
    this.setState({
        isOpen: false
      });
  }

  openPopup = () => {
      this.setState({
        isOpen: true
      });
  }

  startQuiz = (params) => {
    this.setState({startQuiz: true, paramsQuiz: params});
  }
  
  
  render() {
    if (this.state.startQuiz === true) {
      return <Route to= '/startQuiz' children={() =>
        <Quiz data={this.state.paramsQuiz} />}
      />
    }
    let source = this.getAvailableCategory();
      return (
        <Router className="home-model">
          <Popup show={this.state.isOpen}
                    onClose={this.closePopup}>
                    <StartQuizForm startQuiz={this.startQuiz}></StartQuizForm>
          </Popup>
        <div >
          <ul>
            <li>
              <NavLink exact activeClassName="header" to="/questionCategories">
                <JqxTooltip ref='myTooltip'
                  position={'mouse'} name={'movieTooltip'} content={source}>
                  <div className="header-content">Quiz Categories</div>
                </JqxTooltip>
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName="header" to="/quizTopics">
                  <div className="header-content">Quiz Topics</div>
              </NavLink>
            </li>
            <li>
              <NavLink activeClassName="header" to="/questionsSet">
                <div className="header-content">Questions Set</div>
              </NavLink>
            </li>
            <li style={{float: 'right'}}>
              <div className="header-content" style={{cursor:'pointer', color: 'red'}} onClick={this.openPopup}>Start Quiz</div>
            </li>
          </ul>
          <hr id="end-navlink"/>
        <img src={require('../2.jpg')} alt="no image found" id="home-model-img" />

          <Switch>
            <Route path="/questionCategories" component={QuestionCategories} />
            <Route path="/quizTopics" component={QuizTopics} />
            <Route path="/questionsSet" component={QuestionsSet} />
          </Switch>
        </div>
      </Router>
      );
  }
}

export default Home