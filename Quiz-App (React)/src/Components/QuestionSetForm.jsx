import React, { Component } from 'react';
import JqxInput from '../assets/jqwidgets-react/react_jqxinput.js';
import JqxTooltip from '../assets/jqwidgets-react/react_jqxtooltip.js';
import JqxDropDownList from '../assets/jqwidgets-react/react_jqxdropdownlist.js';
import $ from 'jquery';
import  '../App.css';

class QuestionSetForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            option_id : 2
        }
    }

    selectOperation = () => {
        let topic_name = this.refs.topic_name.val();
        let question_title = this.refs.question_title.val();
        let question_description = this.refs.question_description.val();
        let option_data = [];
        for (var i = 0; i < this.intTextBox; i++) {
            var id_name = "option" + (i + 1);
            option_data[i] = document.getElementById(id_name).value;
        }
        let answer = this.refs.answer.val();
        let status = this.refs.status.val();

        if (question_title === "") {
            this.refs.question_title.focus();
            document.getElementById("validate-question_title").style.display = "inline-block";
        } else if (question_description === "") {
            this.refs.question_description.focus();
            document.getElementById("validate-question_description").style.display = "inline-block";
        } else if (document.getElementById("option1").value === "") {
            document.getElementById("option1").focus();
            document.getElementById("validate-option1").style.display = "inline-block";
        } else if (document.getElementById("option2").value === "") {
            document.getElementById("option2").focus();
            document.getElementById("validate-option2").style.display = "inline-block";
        } else if (answer === "") {
            this.refs.answer.focus();
            document.getElementById("validate-answer").style.display = "inline-block";
        } else {
            if (!this.props.question_id) {
              this.props.addQuestion(topic_name, question_title, question_description, option_data.join(','), answer, status);
            } else {
                this.props.updateQuestion(topic_name, question_title, question_description, option_data.join(','), answer, status);
            }
        }
        
    }

    pasteData = () => {
        var self = this;
        let data ={
            "id": this.props.question_id
        };
        $.ajax({
            type: "GET",
            url:"http://localhost:8000/Quiz/question_set",
            data: data,
            success: function(data){
                setTimeout(() => {
                    var option = data[0].options.split(",");
                    self.refs.topic_name.val(data[0].topic_name);
                    self.refs.question_title.val(data[0].question_title);
                    self.refs.question_description.val(data[0].question_description);
                    var createOptionField = option.length - 2;
                    while (createOptionField > 0) {
                        self.addOptionInput();
                        createOptionField -= 2;
                    }
                    var len = option.length;
                    while (len > 0) {
                        var idName = "option" + len;
                        document.getElementById(idName).value = option[len-1];
                        len--;
                    }
                    self.refs.answer.val(data[0].answer);
                    self.refs.status.val(data[0].status);
                });
            } 
        });
    }

    getAvailableTopic = () => {
        var returnedData;
          $.ajax({
            type: "GET",
            async: false,
            url:"http://localhost:8000/Quiz/quiz_topics",
            success: function(data){
                returnedData = data;
            }
        });
        return returnedData.map((data) => {
                return data.topic_name;
            });
    }
    intTextBox = 2;

    addOptionInput = () => {
        if (this.intTextBox < 9) {
            this.intTextBox++;
            var objNewDiv = document.createElement('span');
            objNewDiv.setAttribute('id', 'div_' + this.intTextBox);
            objNewDiv.innerHTML = '<input type="text" id="option' + this.intTextBox + '" name="option' + this.intTextBox + '" placeholder="Enter Option"/>';
            document.getElementById('content').appendChild(objNewDiv);

            this.intTextBox++;
            objNewDiv = document.createElement('span');
            objNewDiv.setAttribute('id', 'div_' + this.intTextBox);
            objNewDiv.innerHTML = '<input type="text" id="option' + this.intTextBox + '" name="option' + this.intTextBox + '" placeholder="Enter Option"/>';
            document.getElementById('content').appendChild(objNewDiv);
        }
    }

    removeOptionInput = () => {
        if(2 < this.intTextBox) {
            document.getElementById('content').removeChild(document.getElementById('div_' + this.intTextBox));
            this.intTextBox--;
            document.getElementById('content').removeChild(document.getElementById('div_' + this.intTextBox));
            this.intTextBox--;
        } 
    }

    componentDidMount() {
        this.refs.question_title.on('keypress', (event) => {
            document.getElementById("validate-question_title").style.display = "none";
        });

        this.refs.question_description.on('keypress', (event) => {
            document.getElementById("validate-question_description").style.display = "none";
        });

        this.refs.answer.on('keypress', (event) => {
            document.getElementById("validate-answer").style.display = "none";
        });

        document.getElementById("option1").addEventListener("keypress", function () {
            document.getElementById("validate-option1").style.display = "none"});

            document.getElementById("option2").addEventListener("keypress", function () {
                document.getElementById("validate-option2").style.display = "none"});    
    }

    render() {
        if (this.props.question_id) {
            this.pasteData();
        }
        let source = this.getAvailableTopic();

        let status = ["Enabled", "Disabled"];
        return (
            <div className='question-set-model'>
               
               <JqxDropDownList ref='topic_name' width={"70%"} className="drop-down"
                    height={45}  template={'arctic'} source={source} 
                    selectedIndex={1} placeHolder={'Select'}
               />
                <JqxInput ref='question_title' width={"70%"} height={35}  template={'arctic'}
                  placeHolder={'Enter Question Title'}
                />
                <i className="fa fa-asterisk" id="validate-question_title"></i>
                <JqxInput ref='question_description' width={"70%"} height={35}  template={'arctic'}
                  placeHolder={'Question Description'}
                />
                <i className="fa fa-asterisk" id="validate-question_description"></i>
                <input type="text" id="option1" name="option1" placeholder="Enter Option"/>
                <i className="fa fa-asterisk" id="validate-option1"></i>
                <input type="text" id="option2" name="option2" placeholder="Enter Option"/>
                <i className="fa fa-asterisk" id="validate-option2"></i>

                <div id="content"></div>

                <div className="add-option-model">
                    <JqxTooltip ref='myTooltip'
                        position={'mouse'} name={'movieTooltip'} content={'Add More Option'} 
                        className="option-icon" >
                        <i className="fa fa-plus-circle" 
                            onClick={() => {this.addOptionInput()}}
                        ></i>
                    </JqxTooltip>
                    <JqxTooltip ref='myTooltip'
                        position={'mouse'} name={'movieTooltip'} content={'Remove previous added Option'} 
                        className="option-icon" >
                        <i className="fa  fa-minus-circle" 
                            onClick={() => {this.removeOptionInput()}}
                        ></i>
                    </JqxTooltip>
                </div>

                <JqxInput ref='answer' width={"70%"} height={35}  template={'arctic'}
                  placeHolder={'Enter answer of this question'}
                />
                <i className="fa fa-asterisk" id="validate-answer"></i>
                <JqxDropDownList ref='status' width={"70%"} className="drop-down"
                    height={45}  template={'arctic'} source={status} 
                    selectedIndex={0} placeHolder={'Select'}
                    autoDropDownHeight={true} dropDownVerticalAlignment={'top'}
               />
                
                <i className="fa  fa-save" onClick={this.selectOperation}>save</i>
            </div>
        );
    }
}

export default QuestionSetForm;