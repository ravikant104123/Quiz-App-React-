import React from 'react';
import JqxInput from '../assets/jqwidgets-react/react_jqxinput.js';
import 'font-awesome/css/font-awesome.min.css';
import '../App.css';
import $ from 'jquery';

class QuizCategoryForm extends React.Component {

  selectOperation = () => {
    let category = this.refs.category.val();
    if (category === "") {
      this.refs.category.focus();
      document.getElementById("validate-input").style.display = "inline-block";
    } else {
      if (!this.props.category_id) {
        this.props.addCategory(category);
      } else {
        this.props.updateCategory(category);
      }
    }
    
  }

  addCategory = (category) => {
    this.props.addCategory(category);
  }

  pasteData = () => {
    var self = this;
    let data ={
        "id": this.props.category_id
    };
    $.ajax({
        type: "GET",
        url:"http://localhost:8000/Quiz/categories",
        data: data,
        success: function(data){
            setTimeout(()=> {
              self.refs.category.val(data[0].categories);
            })
          }
    });
  }

  componentDidMount() {
    this.refs.category.on('keypress', (event) => {
      document.getElementById("validate-input").style.display = "none";
    });    
    this.sectionCheck(); 
  }


  sectionCheck = () => {
    document.getElementsByClassName("popup-contents")[0].style.width = '35%';
    document.getElementsByClassName("popup-contents")[0].style.margin = '8% 38%';
  }

  render() {
    if (this.props.category_id) {
      this.pasteData();
   }
    return (
      <div className="quiz-category-model">
         <JqxInput ref='category' width={"70%"} height={35}  template={'arctic'}
                  placeHolder={'Enter Category Name'}
         />
         <i className="fa fa-asterisk" id="validate-input"></i> 
         <i className="fa fa-save" style={{width: "120px"}} onClick={this.selectOperation}>save</i>
      </div>
    );
  }
}

export default QuizCategoryForm;