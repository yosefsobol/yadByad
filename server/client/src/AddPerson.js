import React, { Component } from 'react';
import axios from "axios";
import { Redirect } from 'react-router-dom';
import "./AddPerson.css";
import { jssPreset, StylesProvider } from '@material-ui/core/styles';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import rtl from 'jss-rtl';
import { create } from 'jss';
import GeneralPopup from './GeneralPopup';
import Alert from './Alert';

const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
const theme = createMuiTheme({
  direction: 'rtl'
});

class AddPerson extends Component {

  state = {
    PersonID: '', navigaToHome: false, navigateToUpdate: false, Alert: null, colorAlert: '', header: '', 
    AlertText: '', icon: '', pop: null, QuestionText: '', ActionText: '', ActionFun: null,
  }

  componentDidMount() { this.add(); }
  remove = () => { document.body.removeEventListener('keypress', this.UseClickToAddPersonEnter) }
  add = () => { document.body.addEventListener('keypress', this.UseClickToAddPersonEnter) }
  componentWillUnmount() { this.remove() }
  UseClickToAddPersonEnter = e => { if (this.state.PersonID !== '') { if (e.keyCode === 13) { this.popAdd() } } }
  popAdd = () => { this.setState({ QuestionText: `האם ברצונך להוסיף נזקק חדש ?`, ActionFun: this.ClickToAddPerson, pop: true, ActionText: 'הוספה' }) }
  ALert = (colorAlert, AlertText, icon, header) => { this.setState({ Alert: true, colorAlert: colorAlert, header: header, AlertText: AlertText, icon: icon }) }
  ClickToAddPerson = () => {
    const config = { headers: { Authorization: `Bearer ${this.props.User.Token}` } }
    const PersonID = this.numFun(this.state.PersonID);
    const find = this.props.find;
    let ALert = this.ALert
    const navigateToUpdate = this.navigateToUpdate
    axios
      .post('/people', {
        PersonID: this.numFun(this.state.PersonID), FirstName: '', LastName: '', DateOfBirth: null, Sex: '',
        MaritalStatus: '', NoOfPersons: '', OpeningDate: this.props.Newtime(), UserOpn: this.props.User.nickname, Situation: true
        , demise: null, immigrant: null, Origin: null, residence: '', Cell: '', Phone: '', City: null, Street: null,
        Housenom: '', ApartmentNum: '', Code: '', Population: '', Income: '', Insurance: '', SupportNum: '', Studying: false,
        worker: false, SoupKitchen: false, sector: false, Note: '', Survivor: false, Supported: false, img: undefined, Famely: [], Holidays: [], NumKids: ''
      }, config)
      .then(function (res) {
        if (res.data.Status === '201') {
          ALert('Alertgreen', res.data.Results, 'far fa-thumbs-up')
          axios.post('/find/',
            { PersonID: PersonID }, config)
            .then(r => {
              const people = r.data.find(x => x.PersonID === PersonID)
              find(people)
              navigateToUpdate();
            })
            .catch(function (error) { })
        }
        else { ALert('Alertred', res.data.Results, 'fas fa-exclamation-circle', 'שגיאה') }
      })
      .catch(function (error) { })
  }
  cancelAlert = () => { this.setState({ Alert: null }) }
  cancel = () => { this.setState({ pop: null }) }
  numFun = value => {
    var numValue = Number(value)
    if (numValue > 0) { return numValue } else { return '' }
  }
  navigateToUpdate = () => { this.setState({ navigateToUpdate: true }); }
  isDisabled = () => { return (this.state.PersonID === '') }
  render() {
    const disabled = this.isDisabled();
    if (this.state.navigaToHome) { return <Redirect to='./Home' /> }
    if (this.state.navigateToUpdate) { return <Redirect to='./Update' /> }

    return (
      <div className='AddPerson'>

        <div className='b'>
          <div className='c'>
            <div className='icon'></div>
            <div className='d'>
              <div className='e'>
                <h1>הוספת נזקק</h1>
                <div className='f'>
                  <span>בשביל להתחיל אנא מלא ת.ז</span>
                </div>

              </div>
              <StylesProvider jss={jss}>
                <ThemeProvider theme={theme}>
                  <div className='g' dir="rtl">

                    <TextField label="ת.ז" variant="outlined" onChange={(event) => { this.setState({ PersonID: event.target.value }) }} type="number" required />

                  </div>
                </ThemeProvider>
              </StylesProvider>
              <div className='p'>
                <Button className='butadd' variant="contained" color="primary" size="large" disabled={disabled} onMouseDown={() => { this.popAdd(); }} >הוסף</Button>
                <Button className='butcon' variant="contained" color="primary" size="large" onMouseDown={() => { this.setState({ navigaToHome: true }) }}>ביטול</Button>
              </div>
            </div>
          </div>

        </div>
        {this.state.Alert && <Alert remove={this.remove} add={this.add} colorAlert={this.state.colorAlert} header={this.state.header} cancelAlert={this.cancelAlert} AlertText={this.state.AlertText} icon={this.state.icon} />}
        {this.state.pop && <GeneralPopup remove={this.remove} add={this.add} QuestionText={this.state.QuestionText} ActionText={this.state.ActionText} cancel={this.cancel} ActionFun={this.state.ActionFun} />}
      </div>
    );
  }
}

export default AddPerson;