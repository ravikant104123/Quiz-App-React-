import React, { Component } from 'react';
import $ from 'jquery';
import JqxDropDownList from '../assets/jqwidgets-react/react_jqxdropdownlist.js';
import  '../App.css';

class StartQuizForm extends Component {
    state={
        category_name: null,
        topics_data: null
    }
    
    shouldStartQuiz = () => {
        let topic_name = this.refs.topic_name.val();
        var me = this;
        let data ={
            "topic_name": topic_name
        };
        $.ajax({
            type: "GET",
            url:"http://localhost:8000/Quiz/question_set",
            data: data,
            success: function(data){
                me.props.startQuiz(data);
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
        this.refs.category_name.on('change', (event) => {
            let category_name = this.refs.category_name.val();
            this.setState({category_name});
            this.getAvailableTopics();
            document.getElementById("topic-description").style.display = "none";
        });

        this.refs.topic_name.on('select', (event) => {
            // Do Something...
            document.getElementById("topic-description").style.display = "none";
        });

        this.refs.topic_name.on('change', (event) => {
            // Do Something...
            let topic_name = this.refs.topic_name.val();
            var topic_description;
            var i = 0;
            while (topic_name !== this.state.topics_data[i].topic_name) {
                i++;
            }
            
            topic_description = this.state.topics_data[i].topic_description;
            
            if (document.contains(document.getElementById('descrpt'))) {
                document.getElementById('topic-description').removeChild(document.getElementById("descrpt"));
            }
            var objNewDiv = document.createElement('div');
            objNewDiv.setAttribute('id', 'descrpt');
            objNewDiv.innerHTML = topic_description;
            document.getElementById('topic-description').appendChild(objNewDiv); 

            document.getElementById("topic-description").style.display = "block";
        });
    }

    getAvailableTopics = () => {
        let data ={
            "category_name": this.state.category_name
        };
        let value;
        $.ajax({
            type: "GET",
            data: data,
            async: false,
            url:"http://localhost:8000/Quiz/quiz_topics",
            success: function(data){
                value = data;
            }
        });
        this.refs.topic_name.clear();
        for (var i = 0; i < value.length; i++) {
            this.refs.topic_name.addItem(value[i].topic_name);
        }
        this.setState({topics_data: value});
    }

    render() {
        let source = this.getAvailableCategory();
        return (
            <div className='start-quiz-form'>
                <div id="topic-description"><h5>Topic Description</h5></div>
                <table>
                    <tbody>
                        <tr>
                            <th>
                                Select category :
                            </th>
                            <th className="start-quiz-drop-down">
                                <JqxDropDownList ref='category_name' 
                                    height={45}  template={'arctic'} source={source} 
                                     placeHolder={'Select'} 
                                    className="drop-down"
                                />
                            </th>
                        </tr>
                        <tr>
                            <th>
                                Select Topic :
                            </th>
                            <th className="start-quiz-drop-down">
                                <JqxDropDownList ref='topic_name' className="drop-down"
                                    height={45}  template={'arctic'}  
                                     placeHolder={'Select'}
                                />
                            </th>
                        </tr>
                    </tbody>
                </table>
                <i className="fa  fa-forward " onClick={this.shouldStartQuiz}>Go</i>
            </div>
        );
    }
}

export default StartQuizForm;