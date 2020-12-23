import React, { Component } from 'react';
import './GeneralPopup.css';
import Button from '@material-ui/core/Button';

class GeneralPopup extends Component {
  componentDidMount() {
    if (this.props.remove) { this.props.remove(); }
    document.body.addEventListener('keypress', this.UsefunEnter);
  }
  componentWillUnmount() {
    document.body.removeEventListener('keypress', this.UsefunEnter);
    if (this.props.add) { this.props.add(); }
  }
  UsefunBuotten = () => { this.fun() }
  UsefunEnter = e => {
    if (e.keyCode === 13) {
      this.fun()
    }
  }
  fun = () => {
    this.props.cancel();
    this.props.ActionFun();
  }
  render() {
    return (
      <div className='GeneralPopup'>
        <div className='backgroundPop'>
          <div className='Pop'>
            <h2>{this.props.QuestionText}</h2>
            <Button variant="contained" className="btn1" onMouseDown={this.UsefunBuotten}>{this.props.ActionText}</Button>
            <Button variant="contained" className="btn2" onMouseDown={() => { this.props.cancel() }}>ביטול</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default GeneralPopup;