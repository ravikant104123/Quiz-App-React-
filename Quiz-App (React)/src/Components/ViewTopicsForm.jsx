import React, { Component } from 'react';
import $ from 'jquery';
import '../App.css';

class ViewTopicsForm extends Component {
    
    componentDidMount() {
        this.sectionCheck(); 
    }


    sectionCheck = () => {
        document.getElementsByClassName("popup-contents")[0].style.width = '20%';
        document.getElementsByClassName("popup-contents")[0].style.margin = '8% 38%';
    }

    getAvailableCategory = () => {
        let data = {
            "id": this.props.category_id
        };
        var i = 0;
          $.ajax({
            type: "GET",
            data: data,
            async: false,
            url:"http://localhost:8000/Quiz/categories",
            success: function(data){
                let request ={
                    "category_name": data[0].categories
                };
                $.ajax({
                    type: "GET",
                    url:"http://localhost:8000/Quiz/quiz_topics",
                    data: request,
                    success: function(data){
                        setTimeout(()=>{
                            var len = data.length;
                            while (len > 0) {
                                var objNewDiv = document.createElement('div');
                                objNewDiv.setAttribute('id', 'div_' + i);
                                objNewDiv.innerHTML = data[i].topic_name;
                                document.getElementById('content').appendChild(objNewDiv);
                                len--;
                                i++;
                            }
                        })
                    }
                });
            }
        });
    }

    render() {
        this.getAvailableCategory();
        return (
            <div className='view-topic-form'>
                <div id="content"></div>
            </div>
        );
    }
}

export default ViewTopicsForm;