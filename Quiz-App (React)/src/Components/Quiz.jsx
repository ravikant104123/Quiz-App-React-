import React, { Component } from 'react';
import  '../App.css';
import $ from 'jquery';
import QuizResult from './QuizResult.jsx';
import JqxButton from '../assets/jqwidgets-react/react_jqxbuttons.js';
import { Route} from 'react-router-dom';

class Quiz extends Component {
    state = {
        count: 0,
        answer: 0,
        finish: false,
        userOptions: [], 
    }

    componentDidMount() {
        this.refs.nextButton.on('click', (event) => {
            document.getElementById("quiz-instruction").style.display="none";
            let length = this.props.data.length;
            if (document.contains(document.getElementById('ques1'))) {

                document.getElementById("smileEmoji").style.display = "none";
                document.getElementById("frownEmoji").style.display = "none";
                document.getElementById('quiz-content').removeChild(document.getElementById("ques1"));
            }

            if (length > this.state.count) {
                var objNewDiv = document.createElement('div');
                objNewDiv.setAttribute('id', 'ques1');
                objNewDiv.innerHTML = this.props.data[this.state.count].question_description;
                document.getElementById('quiz-content').appendChild(objNewDiv);

                //for line breaking.
                var br = document.createElement('br');
                objNewDiv.appendChild(br);

                //for showing options of this questions.
                var option_data = this.props.data[this.state.count].options.split(',');
                option_data = option_data.filter(function (ar) {
                                return ar!=="";
                            });
                var optionlen = option_data.length;
                var i = 0;
                while (optionlen > 0) {
                    var label = document.createElement("label");
                    var radio = document.createElement("input");
                    radio.setAttribute('style',"width: 14px;height: 14px")
                    radio.type = "radio";
                    radio.name = "ans";
                    radio.id = option_data[i];
                    //console.log(option_data[i]+" "+option_data[i].length)
                    radio.value = option_data[i];
                    //radio.onclick = me.checkAnswer;
                    label.appendChild(radio);
                
                    label.appendChild(document.createTextNode(option_data[i]));
                    objNewDiv.appendChild(document.createElement("br"));
                    objNewDiv.appendChild(label);

                    i++;
                    optionlen--;
                }
                var cnt = this.state.count + 1;
                this.setState({count: cnt})

            document.getElementsByClassName('nextButton')[0].style.display="none";
            document.getElementsByClassName('submitButton')[0].style.display="block";
            } else {
                this.setState({finish: true});
            }
        });

        this.refs.submitButton.on('click', (event) => {
            document.getElementsByClassName('nextButton')[0].style.display="block";
            document.getElementsByClassName('submitButton')[0].style.display="none";
            
            var value;
            $('input[name=ans]').prop('disabled', true);
            if (document.querySelector("input[name=ans]:checked")) {
                value = document.querySelector("input[name=ans]:checked").value;
            } else {
                value = "not attempt";
            }
            this.setState({userOptions: [...this.state.userOptions, value]});
            if (value.trim() === this.props.data[this.state.count - 1].answer.trim()) {
                var answer = this.state.answer + 1;
                this.setState({answer});
                document.getElementById("smileEmoji").style.display = "block";
            } else {
                document.getElementById("frownEmoji").style.display = "block";
            }
        });
    }

    render() {
        if (this.state.finish === true) {
            return <Route to= '/quizResult' children={() =>
              <QuizResult totalQuestion={this.props.data.length} result={this.state.answer}
                  data={this.props.data} userOptions={this.state.userOptions}/>}
            />
          }
        return (
            <div className='quiz-model'>
                <div className="split left">
                        <JqxButton ref='nextButton' className="nextButton"
                        value={'Next'} template={'success'}/>
                     <div id="quiz-content">
                        <div id="quiz-instruction">
                            <h5>Read The Instruction Carefully : </h5>
                            <ol>
                                <li>1.Once you choose the option then click on the <strong>"Submit" </strong> 
                                      button to move to the next question.</li><br/><br/>
                                <li>2.Once you click on the <strong>"next"</strong> button 
                                      you can't visit to the previous question.</li><br/><br/>
                                <li>3.If you are ready!! then please, click on the <strong>"next"</strong> button.</li><br/><br/>
                            </ol>
                        </div>
                     </div>
                     <JqxButton ref='submitButton' className="submitButton" value={'Submit'} 
                           template={'success'}/>
                </div>
                <div className="split right">
                        <i className="fa fa-smile-o" id="smileEmoji">  Correct!!</i>
                        <i className="fa fa-frown-o" id="frownEmoji">  Incorrect!!</i>
                        <div className="text-attempt-quiz">Attempt Quiz  
                            <div className="attempt-quiz">{this.state.count}/{this.props.data.length}</div>
                        </div>
                </div>
                
            </div>
        );
    }
}

export default Quiz;