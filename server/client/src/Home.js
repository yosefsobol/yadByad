import React, { Component } from 'react';
import './Home.css';
import { Redirect } from 'react-router-dom';
import Button from '@material-ui/core/Button';

class Home extends Component {
  state = { u: null, navigateToPersons: false, navigaToAddPerson: false, navigateToUpdateCiti: false, navigaToAddHoliday: false, navigateToPackageDistribution: false, navigateToReister: false }

  navigate = (state) => { this.setState({ [state]: true }) }

  render() {
    if (this.state.navigateToPersons) { return <Redirect to='./Persons' /> }
    if (this.state.navigaToAddPerson) { return <Redirect to='./AddPerson' /> }
    if (this.state.navigateToPackageDistribution) { return <Redirect to='./PackageDistribution' /> }
    if (this.state.navigaToAddHoliday) { return <Redirect to='./AddHoliday' /> }
    if (this.state.navigateToReister) { return <Redirect to='./Reister' /> }
    if (this.state.navigateToUpdateCiti) { return <Redirect to='./UpdateCiti' /> }

    return (
      <div className='Home'>
        <div className='topHome'>
          {this.props.division ? <h2>שלום  {this.props.division.nickname} </h2> : ''}
        </div>
        <div className='imgbackground'></div>
        <div id='buttons' className='buttons'>
          {this.props.User && <div><Button className='buttonAddPerson' variant="contained"
            color="primary"
            size="large" onClick={() => { this.navigate('navigaToAddPerson') }}><i style={{ marginLeft: '15px' }} className="fas fa-User-plus"></i> הוספת נזקק חדש</Button></div>}
          {this.props.User && <div><Button className='buttonPersons' variant="contained"
            color="primary"
            size="large" onClick={() => { this.navigate('navigateToPersons') }}><i style={{ marginLeft: '15px' }} className="fas fa-search"></i> חיפושים שונים</Button></div>
          }
          {this.props.User && <div><Button className='buttonAddPerson' variant="contained"
            color="primary"
            size="large" onClick={() => { this.navigate('navigaToAddHoliday') }}><i style={{ marginLeft: '15px' }} className="fas fa-user-plus"></i>ניהול חג</Button></div>}
          {this.props.division && <div><Button className='buttonPersons' variant="contained"
            color="primary"
            size="large" onClick={() => { this.navigate('navigateToPackageDistribution') }}><i style={{ marginLeft: '15px' }} className="fas fa-search"></i>עידכון איסוף חבילה</Button></div>}
          {this.props.manager &&
            <div><Button className='buttonAddPerson' variant="contained"
              color="primary"
              size="large" onClick={() => { this.navigate('navigateToReister') }}><i style={{ marginLeft: '15px' }} className="fas fa-search"></i>הוספת עובד</Button></div>
          }
          {this.props.fsw &&
            <div><Button className='buttonPersons' variant="contained"
              color="primary"
              size="large" onClick={() => { this.navigate('navigateToUpdateCiti') }}><i style={{ marginLeft: '15px' }} className="fas fa-search"></i>FSW</Button></div>
          }
        </div>
      </div>
    );
  }
}

export default Home;