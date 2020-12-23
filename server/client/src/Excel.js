import React, { Component } from 'react'
import './Persons.css';
import ReactToExcel from 'react-html-table-to-excel'
import axios from "axios";

class Excel extends Component {
  state = {data: []}

  componentDidMount() {
    axios.get('/people')
      .then(res => {
        this.setState({ data: res.data });
      })
      .catch(function (error) {
        console.log(error);
      })
  }


  renderTableData = () => {
    return this.state.data.map((person, index) => {
      return (
        <tr key={index}
          onDoubleClick={() => {
            this.props.find(person)
            console.log(person)
            this.setState({ navigateToUpdate: true });
          }}>
          <td>{person.PersonID}</td>
          <td>{person.FirstName}</td>
          <td>{person.LastName}</td>
          <td>{this.GetBirthDate(person.DateOfBirth)}</td>
          <td>{person.Sex}</td>
          <td>{person.MaritalStatus}</td>
          <td>{person.NoOfPersons}</td>
          <td>{person.time}</td>
          <td>{this.CheckSituation(person.Situation)}</td>
        </tr>
      )
    })
  }

  renderTableHeader() {
    let header = ['ת.ז', 'שם פרטי', 'שם משפחה', 'תאריך לידה', 'מין', 'מצב משפחתי', 'מספר נפשות', 'פתיחת כרטיס', 'פעיל']
    return header.map((head, index) => {
      return <th key={index}>{head}</th>
    })
  }

  render() {
    return (
      <div>
        <h1 id='title'>exportTOExcel</h1> 

        <div style={{    width: '150px',
    height: '30px',
    marginTop: '54px',
    marginRight: '488px'}}>
           <ReactToExcel
 className='btn'
 table='persons'
 filename ='yadByadData'
 sheet='sheet 1'
 buttonText='export' 
 />

    </div>

        <table id='persons' 
        // style={{display:'none'}}
        >  
          <tbody>
            <tr>{this.renderTableHeader()}</tr>
            {this.renderTableData()}
          </tbody>
        </table>
      </div>
    )
  }
}
export default Excel;
