import React from 'react';
import '../App.css';

class Popup extends React.Component {
  
  render() {
    if(!this.props.show) {
      return null;
    }
    return (
      <div className="popup-model">
        <div className="popup-contents">
          <div className="popup-header">
            <i className="fa fa-close" onClick={this.props.onClose}></i>
          </div>
          <div>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

export default Popup;