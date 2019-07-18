import React, { Component } from 'react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import JqxTooltip from '../assets/jqwidgets-react/react_jqxtooltip.js';
import { AgGridReact } from "ag-grid-react";
import Popup from './Popup.jsx';
import QuizTopicForm from './QuizTopicForm.jsx';
import $ from 'jquery';
import  '../App.css';

class QuizTopics extends Component {
      constructor(props) {
        super(props);
    
        this.state = {
         
          isOpen: false,
          topic_id: 0,
          columnDefs: [
            {
              headerName: "ID",
              field: "id",
              width: 100,
              filter: "agTextColumnFilter"
            },
            {
              headerName: "Category Name",
              field: "category_name",
              filter: "agTextColumnFilter"             
            },
            {
                headerName: "Topic Name",
                field: "topic_name",
                filter: "agTextColumnFilter"             
            },
            {
                headerName: "Topic Description",
                field: "topic_description",
                width: 600,
                filter: "agTextColumnFilter",
                resizable: true,             
            },
            {
              headerName: "Delete",
              width: 100,
              field: "Delete",
              editable: false,
              sortable: false,
              filter: false,
              cellRendererFramework: (params) => {
                return (
                    <center>
                        <i className="fa  fa-trash-o" onClick={()=>{
                            this.deleteTopic(params)
                           }}>
                        </i>
                    </center>
                )}
            },
            {
              headerName: "Edit", 
              field: "Edit" ,
              width: 100,
              sortable: false,
              editable: false,
              filter: false,
              cellRendererFramework: (params) => {
                return (
                  <center>
                      <i className="fa  fa-pencil-square-o" onClick={() => {this.openPopup(params.data.id)}}></i>
                  </center>
                )}
           }
        ],
          defaultColDef: {
            sortable: true,
            resizable: false,
            filter: false,
          },
          
          rowData: null
        };
      }

      onGridReady = () => {
        let me = this;
          $.ajax({
            type: "GET",
            url:"http://localhost:8000/Quiz/quiz_topics",
            success: function(data){
              me.setState({rowData: data});
            }
        });
      };

      openPopup = (id) => {
        this.setState({
          isOpen: true,
          topic_id: id
        });
      }

      closePopup = () => {
        this.setState({
          isOpen: false,
          topic_id: 0
        });
      }

      addTopic = (...arrayData) => {
        let me = this;
        let data = {
              "category_name": arrayData[0],
              "topic_name": arrayData[1],
              "topic_description": arrayData[2]
            };
        $.ajax({
          type: "POST",
          url:"http://localhost:8000/Quiz/quiz_topics",
          data: data,
          success: function(data){
            me.onGridReady();
            me.closePopup();
          }
        });
      }

      updateTopic = (...arrayData) => {
        let me = this;
        let data = {
            "id": this.state.topic_id,
            "category_name": arrayData[0],
            "topic_name": arrayData[1],
            "topic_description": arrayData[2]
          };
        $.ajax({
          type: "PUT",
          url:"http://localhost:8000/Quiz/quiz_topics",
          data: data,
          success: function(data){
            me.onGridReady();
            me.closePopup();
          }
        });
      }

      deleteTopic = (params) => {
        let id={"id":params.data.id};
        let me = this;
        $.ajax({
          type: "DELETE",
          url:"http://localhost:8000/Quiz/quiz_topics",
          data: id,
          success: function(){
              me.onGridReady();
          }
        });
      }

    render() {
        return (
            <div className="quiz-topic-model">

                <Popup show={this.state.isOpen}
                    onClose={this.closePopup}>
                    <QuizTopicForm addTopic={this.addTopic}
                        updateTopic={this.updateTopic}
                        topic_id={this.state.topic_id}
                    ></QuizTopicForm>
                </Popup>

                

                <div id="myGrid" style={{height: "300px", width: "1000px"}}
                        className="ag-theme-balham"
                >
                
                <JqxTooltip ref='myTooltip'
                    position={'mouse'} name={'movieTooltip'} content={'Add Quiz Topic'} 
                    absolutePositionX={20}>
                    <i className="fa fa-plus-square-o" onClick={() => {this.openPopup(0)}}  ></i>
                </JqxTooltip>
                    <AgGridReact
                        columnDefs={this.state.columnDefs}
                        defaultColDef={this.state.defaultColDef}
                        floatingFilter={true}
                        rowData={this.state.rowData}
                        onGridReady={this.onGridReady}
                    />
                </div>
            </div>
        );
    }
}

export default QuizTopics;