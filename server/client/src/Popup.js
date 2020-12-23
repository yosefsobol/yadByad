import React from 'react';
import './Popup.css';
import Button from '@material-ui/core/Button';

class Popup extends React.Component {

  componentDidMount(){  if (this.props.remove) {this.props.remove();}}
  componentWillUnmount() {  if (this.props.add) {this.props.add();}}

    tow1 = () => {
        this.props.PopupHolidays('רגילה', this.props.holidayValue)
        this.props.closePopup()
    }

    tow2 = () => {
        this.props.PopupHolidays('משפחתית',this.props.holidayValue)
        this.props.closePopup()
    }
  render() {
    return (
<div className='GeneralPopup'>
<div className='backgroundPop'>
<div className='Pop'>
    <h2>{this.props.text}</h2>
<Button variant="contained" className="btn1" onMouseDown={this.tow1}>רגילה</Button>
<Button variant="contained" className="btn2" onMouseDown={this.tow2}>משפחתית</Button> 
</div>
</div> 
</div>
    );
  }
}


export default Popup;