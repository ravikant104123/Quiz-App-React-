import React, { Component } from 'react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import JqxTooltip from '../assets/jqwidgets-react/react_jqxtooltip.js';
import 'ag-grid-community/dist/styles/ag-theme-balham.css';
import { AgGridReact } from "ag-grid-react";
import $ from 'jquery';
import Popup from './Popup.jsx';
import QuizCategoryForm from './QuizCategoryForm.jsx';
import ViewTopicsForm from './ViewTopicsForm.jsx';
import "../App.css";

class QuestionCategories extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
         
          isOpen: false,
          category_id: 0,
          view_topic: false,
          columnDefs: [
            {
              headerName: "ID",
              field: "id",
              width: 80,
              filter: "agTextColumnFilter",
              editable: false
            },
            {
              headerName: "Quiz Category",
              field: "categories",
              width: 300,
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
                            this.deleteCategory(params)
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
                      <i className="fa  fa-pencil-square-o" onClick={() => {this.openPopup(params.data.id, false)}}></i>
                  </center>
                )}
           },
           {
             headerName: "View Topics", 
             field: "view" ,
             width: 150,
             sortable: false,
             editable: false,
             filter: false,
             cellRendererFramework: (params) => {
               return (
                 <center>
                        <i className="fa fa-eye"
                            onClick={() => {this.openPopup(params.data.id, true)}}  
                        ></i>
                 </center>
               )}
          }
        ],
          defaultColDef: {
            sortable: true,
            resizable: false,
            filter: true,
            editable: true,
            onCellValueChanged: (params) => {
                let me = this;
                let data = {
                      "id": params.data.id,
                      "categories": params.data.categories
                    };
                $.ajax({
                  type: "PUT",
                  url:"http://localhost:8000/Quiz/categories",
                  data: data,
                  success: function(data){
                    me.onGridReady();
                  }
                });
              }
          },
          
          rowData: null
        };
      }

      onGridReady = () => {
        let me = this;
          $.ajax({
            type: "GET",
            url:"http://localhost:8000/Quiz/categories",
            success: function(data){
              me.setState({rowData: data});
            }
        });
      };

      openPopup = (id, view_topic) => {
        this.setState({
          isOpen: true,
          category_id: id,
          view_topic: view_topic
        });
      }

      closePopup = () => {
        this.setState({
          isOpen: false,
          category_id: 0,
          view_topic: false
        });
      }

      deleteCategory = (params) => {
        let data={"id":params.data.id,
                  "categories":params.data.categories
                 };
        let me = this;
        $.ajax({
          type: "DELETE",
          url:"http://localhost:8000/Quiz/categories",
          data: data,
          success: function(){
              me.onGridReady();
          }
        });
      }

      updateCategory = (category) => {
        let me = this;
        let data = {
              "id":this.state.category_id,
              "categories": category
            };
        $.ajax({
          type: "PUT",
          url:"http://localhost:8000/Quiz/categories",
          data: data,
          success: function(data){
            me.onGridReady();
            me.closePopup();
          }
        });
      }

      addCategory = (category) => {
        let me = this;
        let data = {
              "categories": category
            };
        $.ajax({
          type: "POST",
          url:"http://localhost:8000/Quiz/categories",
          data: data,
          success: function(data){
            me.onGridReady();
            me.closePopup();
          }
        });
      }

    render() {
        return (
           <div className="quiz-category-model">

            {(this.state.isOpen)? <Popup show={this.state.isOpen} changeDimension={this.state.isOpen}
              onClose={this.closePopup}>
              {this.state.view_topic ? <ViewTopicsForm category_id={this.state.category_id}></ViewTopicsForm> :
                <QuizCategoryForm updateCategory={this.updateCategory} section={'category'}
                addCategory={this.addCategory} category_id={this.state.category_id}></QuizCategoryForm>
              }
            </Popup> : ''};

            <div id="myGrid" style={{height: "300px", width: "715px"}}
              className="ag-theme-balham"
            >
              <JqxTooltip ref='myTooltip'
                        position={'mouse'} name={'movieTooltip'} content={'Add more category'} 
                        absolutePositionX={20}>
                        <i className="fa fa-plus-square-o"
                            onClick={() => {this.openPopup(0, false)}}  
                        ></i>
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

export default QuestionCategories;