import React from 'react';
import './ComponentToPrint.css'
import { QRCode } from 'react-qr-svg';

class ComponentToPrint extends React.Component {

  render() {
    return (
      <div className='ComponentToPrint'>
        <div>
          <div className="logo">
            <img className='img' src={'https://yadbeyad.org/wp-content/uploads/2017/03/%D7%99%D7%93-%D7%91%D7%99%D7%93-%D7%90%D7%99%D7%9B%D7%95%D7%AA-%D7%92%D7%91%D7%95%D7%94%D7%94.png'} style={{ width: '240px', height: '70px' }} alt='logo' />
            <h3>ת.ז: {'  ' + this.props.Person.PersonID}</h3>
            <div >
              <QRCode
                className='QRCode'
                level="Q"
                style={{ width: 150 }}
                value={JSON.stringify({
                  PersonID: this.props.Person.PersonID,
                  DateOFHoliday: this.props.ListObject.DateOFHoliday
                })}
              />
            </div>
            <h3>חבילה {' ' + this.props.ListObject.PackageType}</h3>
            <h6 style={{ marginTop: '35px', marginBottom: '0' }}>זמני החלוקה:</h6>
            <h6 style={{ marginTop: '5px', marginBottom: '0' }}> ביום שני 14.9.20</h6>
            <h6 style={{ marginTop: '2px', marginBottom: '0' }}>וביום שלישי 15.9.20</h6>
            <h6 style={{ marginTop: '3px', marginBottom: '0' }}> בשעות 10:00 עד 16:00</h6>

          </div>
        </div>
      </div>
    );
  }
}

export default ComponentToPrint;