import React, { Component } from 'react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import JqxTooltip from '../assets/jqwidgets-react/react_jqxtooltip.js';
import JqxDropDownList from '../assets/jqwidgets-react/react_jqxdropdownlist.js';
import JqxButton from '../assets/jqwidgets-react/react_jqxbuttons.js'; 
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { AgGridReact } from "ag-grid-react";
import Popup from './Popup.jsx';
import QuestionSetForm from './QuestionSetForm.jsx';
import $ from 'jquery';
import  '../App.css';

class QuestionsSet extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
         
          isOpen: false,
          question_id: 0,
          columnDefs: [
            {
              headerName: "ID",
              field: "id",
              width: 80,
              filter: "agTextColumnFilter",
            },
            {
                headerName: "Topic Name",
                field: "topic_name",
                width: 200,
                filter: "agTextColumnFilter"             
            },
            {
              headerName: "Question Title",
              field: "question_title",
              filter: "agTextColumnFilter"             
            },
            {
                headerName: "Question Description",
                field: "question_description",
                width: 600,
                filter: "agTextColumnFilter"             
            },
            {
              headerName: "Delete",
              field: "Delete",
              width: 100,
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
            filter: true,
            editable: true
          },
          
          rowData: null,
          records: null
        };
      }

      onGridReady = () => {
        let me = this;
          $.ajax({
            type: "GET",
            url:"http://localhost:8000/Quiz/question_set",
            success: function(data){
              me.setState({rowData: data, records: data});
            }
        });
      };

      openPopup = (id) => {
        this.setState({
          isOpen: true,
          question_id: id
        });
      }

      closePopup = () => {
        this.setState({
          isOpen: false,
          question_id: 0
        });
      }

      addQuestion = (...arrayData) => {
        let me = this;
        let data = {
              "topic_name": arrayData[0],
              'question_title': arrayData[1],
              'question_description': arrayData[2],
              'options': arrayData[3],
              'answer': arrayData[4],
              'status': arrayData[5]
            };
        $.ajax({
          type: "POST",
          url:"http://localhost:8000/Quiz/question_set",
          data: data,
          success: function(data){
            me.onGridReady();
            me.closePopup();
          }
        });
      }

      updateQuestion = (...arrayData) => {
        let me = this;
        let data = {
            "id": this.state.question_id,
            "topic_name": arrayData[0],
            'question_title': arrayData[1],
            'question_description': arrayData[2],
            'options': arrayData[3],
            'answer': arrayData[4],
            'status': arrayData[5]
          };
        $.ajax({
          type: "PUT",
          url:"http://localhost:8000/Quiz/question_set",
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
          url:"http://localhost:8000/Quiz/question_set",
          data: id,
          success: function(){
              me.onGridReady();
          }
        });
      }

      componentDidMount() {
        let page_size = 0;
        let next = 0;
        let prev = 0;
        this.refs.page_size.on('change', (event) => {
            // Do Something...
            page_size = parseInt(this.refs.page_size.val(), 10);
            var insertData = [];
            insertData = insertData.concat(this.state.records);
            if (page_size > this.state.records.length) {
              this.setState({rowData: insertData.splice(0, this.state.records.length)});
            } else {
              this.setState({rowData: insertData.splice(next, page_size)});
            }
            
        });

        this.refs.next.on('click', () => {
            if ((next + page_size) < this.state.records.length) {
              next = next + page_size;
            } else {
              next = this.state.records.length;
            }
            var insertData = [];
            insertData = insertData.concat(this.state.records);
            this.setState({rowData: insertData.splice(next, page_size)});
        });

        this.refs.prev.on('click', () => {
          if ((next - page_size) < 0) {
            prev = 0;
          } else{
            prev = next - page_size;
            next = prev;
          }
         
          var insertData = [];
          insertData =insertData.concat(this.state.records);
          this.setState({rowData: insertData.splice(prev, page_size)});
      });
    }
    render() {
      let source = ["1", "2", "5", "10", "15"]
        return (
            <div className="quiz-question-model">

                <Popup show={this.state.isOpen}
                    onClose={this.closePopup}>
                    <QuestionSetForm addQuestion={this.addQuestion}
                        updateQuestion={this.updateQuestion}
                        question_id={this.state.question_id}
                    ></QuestionSetForm>
                </Popup>
                <div id="myGrid" style={{height: "300px", width: "1000px"}}
                        className="ag-theme-balham"
                >
                <JqxTooltip ref='myTooltip'
                    position={'mouse'} name={'movieTooltip'} content={'Add Question'} 
                    absolutePositionX={20}>
                    <i className="fa fa-plus-square-o" onClick={() => {this.openPopup(0)}}  ></i>
                </JqxTooltip>
                
                <span className="pagination">
                    <JqxButton ref='prev'template={'danger'} width={40} height={25} value={'<<'} />
                    <JqxDropDownList ref='page_size' width={100} height={25} 
                        source={source} placeHolder={'Page-Size'} template={'success'}
                    />
                    <JqxButton ref='next'  template={'danger'} width={40} height={25} value={'>>'} /> 
                </span>
                                  
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

export default QuestionsSet;