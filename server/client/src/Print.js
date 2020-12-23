import React, { Component } from 'react';
import ReactToPrint from 'react-to-print';
import ComponentToPrint from './ComponentToPrint';

class Print extends Component {
    render() {
        return (
          <div>
            <ReactToPrint
              trigger={() => <button >הדפסת תלוש</button>}
              content={() => this.componentRef}
            />
            <div style={{ display: "none" }}><ComponentToPrint ListObject={this.props.ListObject} Person={this.props.Person} ref={el => (this.componentRef = el)} /></div>
          </div> 
        );
      }
    }

export default Print;