import React, { Component } from 'react';
import JqxInput from '../assets/jqwidgets-react/react_jqxinput.js';
import JqxPasswordInput from '../assets/jqwidgets-react/react_jqxpasswordinput.js';
import JqxButton from '../assets/jqwidgets-react/react_jqxbuttons.js';
import 'font-awesome/css/font-awesome.min.css';
import  '../App.css';
import $ from 'jquery';
import {Redirect} from 'react-router-dom';

  
class LogIn extends Component {
    state = {
        loggedIn:false,
        type: ""
      }

    componentDidMount() {
        let me = this;
        this.refs.myButton.on('click', (event) => {
            let username = this.refs.userName.val();
            let password = this.refs.password.val();
            let data={
                "username":username,
                "password":password
            }
            $.ajax({
                type: "GET",
                url:"http://localhost:8000/Quiz/login",
                data: data,
                success: function(data){
                   if (!$.isEmptyObject(data)) {
                       //---call other page which are told.
                       //me.setState({loggedIn: true});
                       if (data[0].type === "admin") {
                          me.setState({type: data[0].type});
                       } else {
                          me.setState({type: data[0].type});
                       }
                       
                   }
                }
            });
        });
    }

    render() {
        if (this.state.type === "admin") {
            return <Redirect to='/home' />
        }
        
        if (this.state.type === "user") {
            return <Redirect to='/userHome' />
        }

        return (
            <div id="main-login-container">
                <div id="login-contents-align">
                    <div className="login-contents">
                        <img src={require('../userimage.png')} alt="no image found" id="login-modal-img" />
                        <JqxInput ref='userName' width={"100%"} height={35}  template={'arctic'}
                            placeHolder={'USER NAME'}
                        />
                        <JqxPasswordInput ref='password' width={"100%"} height={35}  template={'arctic'}
                            placeHolder={'PASSWORD'} showPasswordIcon={true}
                        />
                        <JqxButton ref='myButton' width={"25%"} style={{padding: "5px 0px"}}
                            value={'LOGIN'} template={'success'}
                        />  
                    </div>
                </div>
            </div>
        );
    }
}

export default LogIn;