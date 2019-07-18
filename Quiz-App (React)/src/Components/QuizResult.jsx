import React, { Component } from 'react';
import  './home.css';
import {Redirect} from 'react-router-dom';

class QuizResult extends Component {
    state = {
        logOut: false
    }

    logOut = () => {
        this.setState({logOut: true});
    }

    componentDidMount() {
        var length = this.props.data.length;
        var i = 0;
        var objNewDiv;
        var check;
        while (length > 0) {
            objNewDiv = document.createElement('div');
            objNewDiv.setAttribute('id', 'ques1');
            objNewDiv.innerHTML = this.props.data[i].question_description;
            document.getElementById('content').appendChild(objNewDiv);

            if ( this.props.userOptions[i].trim() === this.props.data[i].answer.trim()) {
                check = document.createElement('span');
                check.setAttribute('style',"font-size: 45px; color: green; float: right;");
                check.append("✔");
                objNewDiv.appendChild(check);
            } else {
                check = document.createElement('span');
                check.setAttribute('style',"font-size: 45px; color: red; float: right;");
                check.append("x");
                objNewDiv.appendChild(check);
            }

            //for showing options of this questions.
            var option_data = this.props.data[i].options.split(',');
            var optionlen = option_data.length;
            var j = 0;
            while (optionlen > 0) {
                var label = document.createElement("label");
                var radio = document.createElement("input");
                radio.setAttribute('style',"width: 14px;height: 14px;")
                //console.log(option_data[j]+" "+option_data[j].length+" "+typeof option_data[j]);
                radio.value = option_data[j];
                // radio.id = option_data[j];
                radio.type = "radio";

                if (this.props.userOptions[i].trim() === option_data[j].trim()) {
                    radio.checked = true;
                }

                label.appendChild(radio);
            
                label.appendChild(document.createTextNode(option_data[j]));
                objNewDiv.appendChild(document.createElement("br"));
                objNewDiv.appendChild(label);

                j++;
                optionlen--;
            }

            objNewDiv.appendChild(document.createElement('br'));

            //for marking whether it is correct or incorrect.
            var answer = document.createElement('span');
            answer.setAttribute('style',"color: green; padding-right: 35px;");
            var wrong = document.createElement('span');
            wrong.setAttribute('style',"color: red");
            if (this.props.userOptions[i].trim() !== this.props.data[i].answer.trim()) {
                answer.append("Answer : ", this.props.data[i].answer);
                objNewDiv.appendChild(answer);
                wrong.append("Selected : ", this.props.userOptions[i]);
              
                objNewDiv.appendChild(wrong);
            } else {
                answer.append("Answer : ", this.props.data[i].answer);
                objNewDiv.appendChild(answer);
            }

            //for horizontal line.
            var hr = document.createElement('hr');
            objNewDiv.appendChild(hr);
            i++;
            length--;
        } 
    }
    render() {
        if (this.state.logOut === true) {
            return <Redirect to= '/'/>
          }
        return (
            <div className='quiz-result'>
                <div className="log-out" onClick={this.logOut}>Log out</div>
                <div className="header-result">
                    <i className="fa fa-smile-o"> </i>
                        Congratulation!! Your final score is {this.props.result}<strong>/</strong>{this.props.totalQuestion}.
                </div>
                <div className="result-content">
                    <div id="content">
                    </div>
                </div>
            </div>
        );
    }
}

export default QuizResult