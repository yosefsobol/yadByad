import React, { Component } from "react";
import "./App.css";
import Persons from './Persons';
import Home from './Home';
import NotFound from './NotFound';
import AddPerson from './AddPerson';
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import Update from './Update';
import AddHoliday from './AddHoliday';
import PackageDistribution from './PackageDistribution';
import Login from './Login';
import Reister from './Register';
import Logout from './Logout';
import UpdateCiti from './UpdateCiti';
// import VVV from './vvv';
class App extends Component {

  state = { OnePerson: undefined, fsw: null, user: null, manager: null, division: null }

  setUser = user => {
    if (user === null) { this.setState({ manager: user, user: user, division: user, fsw: user }) }
    else {
      if (user.role === 'מנהלראשי' & user.nickname === 'יוסי') { this.setState({ manager: user, user: user, fsw: user }) }
      else {
        if (user.role === 'מנהלראשי') { this.setState({ manager: user, user: user }) }
        if (user.role === 'מזכירות') { this.setState({ user: user }) }
        ;
      } this.setState({ division: user })
    }
  }

  Newtime = () => {
    var today = new Date();
    var dd = checkTime(today.getDate());
    var mm = checkTime(today.getMonth() + 1)
    var yyyy = today.getFullYear();
    var h = today.getHours();
    var m = checkTime(today.getMinutes());
    function checkTime(i) { if (i < 10) { i = "0" + i; } return i; }
    var dateTime = dd + '/' + mm + '/' + yyyy + ' ' + h + ':' + m;
    return dateTime
  }

  find = EditPerson => {
    this.setState({ OnePerson: EditPerson })
  }

  componentDidMount() {
    let user = null
    let Token = sessionStorage.getItem('Token');
    let role = sessionStorage.getItem('role');
    let nickname = sessionStorage.getItem('nickname');
    if (Token !== null & role !== null & nickname !== null) {
      user = { Token: Token, role: role, nickname: nickname }
    }
    this.setUser(user)
  }

  render() {

    return (
      <div className="App"> <BrowserRouter>
        {this.state.division ? <div className="topnavAPP">
          <Link to='/Home'>  <i className="fas fa-home"></i></Link> </div> : ''}
        {this.state.division ? <div className="topnavAPPLogout">
          <Link id='Logout' to='/Logout'><i className="fas fa-sign-out-alt"></i></Link> </div> : ''}
        <Switch>
          <Route exact path='/Home' render={() => <Home fsw={this.state.fsw} manager={this.state.manager} division={this.state.division} User={this.state.user} />} />
          {/* <Route exact path='/VVV' render={() => <VVV User={this.state.user}/>} /> */}
          <Route exact path='/UpdateCiti' render={() => <UpdateCiti User={this.state.user} />} />
          <Route exact path='/AddHoliday' render={() => <AddHoliday User={this.state.user} />} />
          <Route exact path='/Persons' render={() => <Persons find={this.find} User={this.state.user} />} />
          <Route exact path='/AddPerson' render={() => <AddPerson Newtime={this.Newtime} find={this.find} User={this.state.user} />} />
          <Route exact path='/Update' render={() => <Update User={this.state.user} OnePerson={this.state.OnePerson} />} />
          <Route exact path='/PackageDistribution' render={() => <PackageDistribution Newtime={this.Newtime} User={this.state.division} />} />
          <Route exact path='/' render={() => <Login setUser={this.setUser} />} />
          <Route exact path='/Reister' render={() => <Reister setUser={this.setUser} User={this.state.user} />} />
          <Route exact path='/Logout' render={() => <Logout setUser={this.setUser} />} />
          <Route component={NotFound} />
        </Switch>
      </BrowserRouter>
      </div>
    );
  }
}

export default App;