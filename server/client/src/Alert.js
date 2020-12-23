import React, { Component } from 'react';
import './Alert.css';
import Button from '@material-ui/core/Button';

class Alert extends Component {
     componentDidMount(){
        if (this.props.remove) {this.props.remove();}
        document.body.addEventListener('keypress', this.f);
       }
      componentWillUnmount() { 
        document.body.removeEventListener('keypress', this.f);
        if (this.props.add) {this.props.add();}
    }

    f = e => {
      if (e.keyCode === 13) {
      this.props.cancelAlert()
    }}
    render() {
        return (
            <div className='Alert'>
            <div className='backgroundAlert'>
          <div id='Alert' className={this.props.colorAlert}>
          
           <p id='H1' style={{marginLeft:'5px'}}>{this.props.header}</p><p id='H1'><i className={this.props.icon}></i></p>
                     <h2>{this.props.AlertText}</h2>

        <Button variant="contained" onMouseDown={()=>{this.props.cancelAlert()}}>אישור</Button> 
          </div>
          </div> 
            </div>
        );
    }
}

export default Alert;