import React, { Component } from 'react';
import StartQuizForm from './StartQuizForm.jsx';
import Popup from './Popup.jsx';
import  '../App.css';
import {Route} from 'react-router-dom';
import Quiz from './Quiz.jsx';

class UserHome extends Component {
    state = {
        isOpen: false,
        startQuiz:false,
        paramsQuiz: [],
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
        return (
            <div className='UserHome-container'>
                <Popup show={this.state.isOpen}
                        onClose={this.closePopup}>
                        <StartQuizForm startQuiz={this.startQuiz}></StartQuizForm>
                </Popup>
                <div className="start-quiz-model" onClick={this.openPopup}>Start Quiz</div>
            </div>
        );
    }
}

export default UserHome;