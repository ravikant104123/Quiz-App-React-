import React, { Component } from 'react';
import JqxInput from '../assets/jqwidgets-react/react_jqxinput.js';
import JqxDropDownList from '../assets/jqwidgets-react/react_jqxdropdownlist.js';
import $ from 'jquery';
import  '../App.css';

class QuizTopicForm extends Component {

    selectOperation = () => {
        let category_name = this.refs.category_name.val();
        let topic_name = this.refs.topic_name.val();
        let topic_description = this.refs.topic_description.val();

        if (topic_name === "") {
            this.refs.topic_name.focus();
            document.getElementById("validate-topic_name").style.display = "inline-block";
        } else if (topic_description === "") {
            this.refs.topic_description.focus();
            document.getElementById("validate-topic_description").style.display = "inline-block";
        } else {
            if (!this.props.topic_id) {
                this.props.addTopic(category_name, topic_name, topic_description);
            } else {
                this.props.updateTopic(category_name, topic_name, topic_description);
            }
        }
        
    }

    pasteData = () => {
        var self = this;
        let data ={
            "id": this.props.topic_id
        };
        $.ajax({
            type: "GET",
            url:"http://localhost:8000/Quiz/quiz_topics",
            data: data,
            success: function(data){
                setTimeout(()=>{
                    if(self.refs.category_name){
                        self.refs.category_name.val(data[0].category_name);
                    }
                    if(self.refs.topic_name){
                        self.refs.topic_name.val(data[0].topic_name);
                    }
                    if(self.refs.topic_description){
                        self.refs.topic_description.val(data[0].topic_description);
                    }
                })
            }
        });
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

    componentDidMount() {
        this.refs.topic_name.on('keypress', (event) => {
            document.getElementById("validate-topic_name").style.display = "none";
        });

        this.refs.topic_description.on('keypress', (event) => {
            document.getElementById("validate-topic_description").style.display = "none";
        });
    }
    
    render() {
        if (this.props.topic_id) {
            this.pasteData();
        }

        let source = this.getAvailableCategory();
        return (
            <div className='quiz-topic-model'>
               <JqxDropDownList ref='category_name' width={"70%"} className="drop-down"
                    height={45}  template={'arctic'} source={source} 
                    selectedIndex={1} placeHolder={'Select'}
               />
                <JqxInput ref='topic_name' width={"70%"} height={35}  template={'arctic'}
                  placeHolder={'Enter Topic Name'}
                />
                <i className="fa fa-asterisk" id="validate-topic_name"></i>
                <JqxInput ref='topic_description' width={"70%"} height={35}  template={'arctic'}
                  placeHolder={'Topic Description'}
                />
                <i className="fa fa-asterisk" id="validate-topic_description"></i>
                <i className="fa  fa-save" onClick={this.selectOperation}>save</i>
            </div>
        );
    }
}

export default QuizTopicForm;