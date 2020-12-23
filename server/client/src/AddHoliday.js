import React, { Component } from 'react';
import axios from "axios";
import cleaner from 'deep-cleaner';
import './AddHoliday.css';
import Button from '@material-ui/core/Button';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker, } from '@material-ui/pickers';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import { Redirect } from 'react-router-dom';
import Alert from './Alert';

class AddHoliday extends Component {
  state = {
    DateHoliday: null, Alert: null, colorAlert: '', header: '', AlertText: '', icon: '',
    AllPackages: '', table: false, HolidayFamilyPackages: [],
    FamilyAllPackages: null, NormalAllPackages: null, navigaToHome: false,
    FamilyPackagesCollected: null, NormalPackagesCollected: null,
    FamilyPackageNotCollected: null, NormalPackagesNotCollected: null,
    Name: '', Y: '', DateOFHoliday: null, HolidaysList: [], holidayToSearch: null, HolidayValue: null
  }

  cancelAlert = () => { this.setState({ Alert: null }) }
  ALert = (colorAlert, AlertText, icon, header) => {
    this.setState({ Alert: true, colorAlert: colorAlert, header: header, AlertText: AlertText, icon: icon })
  }

  componentDidMount() { this.LastHoliday() }
  LastHoliday = () => {
    axios.get('/LastHoliday')
      .then(res => {
        this.setState({ HolidaysList: res.data });
      })
      .catch()
  }

  ResToTable = people => {
    if (people.length > 0) {
      this.setState({ table: true })
      return people.map((people, index) => {
        return (
          <tr key={index}>
            <td>{people.PersonID}</td>
            <td>{people.LastName}</td>
            <td>{people.FirstName}</td>
          </tr>
        )
      })
    }
  }

  clearPosInputs = () => { this.setState({ Name: '', Y: '', DateHoliday: null }) }
  clear = () => {
    this.setState({
      FamilyAllPackages: null, FamilyPackagesCollected: null, FamilyPackageNotCollected: null,
      NormalAllPackages: null, NormalPackagesCollected: null, NormalPackagesNotCollected: null
    })
  }

  AllPackages = () => {
    var obj = { Holidays: this.state.holidayToSearch }
    if (obj.Holidays === undefined) { } else { obj.Holidays = obj.Holidays.Holidays }
    cleaner(obj); return obj;
  }

  isDisabled = () => {
    var date = new Date(), yyyy = date.getFullYear();
    return (this.state.Name === '' || this.state.Y < Number(yyyy) || this.state.Y > Number(yyyy) + 1 || this.state.DateOFHoliday === null)
  }
  isDisabled2 = () => { return (this.state.HolidayValue === null || this.state.HolidayValue === undefined) }

  DateOFHoliday = date => {
    var today = new Date(date);
    var ThisY = new Date().toISOString().substring(0, 4);
    var dd = checkTime(today.getDate());
    var mm = checkTime(today.getMonth() + 1)
    var yyyy = today.getFullYear();
    function checkTime(i) { if (i < 10) { i = "0" + i; } return i; }
    if (Number(yyyy) < Number(ThisY) || Number(yyyy) > Number(ThisY) + 1) { }
    else {
      var dateTime = dd + '/' + mm + '/' + yyyy;
      this.setState({ DateOFHoliday: dateTime })
    }
  }

  DateHoliday = date => {
    this.setState({ DateOFHoliday: null })
    this.setState({ DateHoliday: date })
    if (date !== null) {
      if (date.toString() !== 'Invalid Date') {
        this.DateOFHoliday(date)
      }
    }
  };

  Search = (fun, State) => {
    const config = { headers: { Authorization: `Bearer ${this.props.User.Token}` } }
    axios.post('/find/',
      fun()
      , config)
      .then(r => {
        this.setState({ [State]: r.data.length });
        const MyHoliday = fun();
        const res = r.data
        let Family = []
        let PackageNotCollected = []
        let FamilyAllPackages = 0, FamilyPackagesCollected = 0, FamilyPackageNotCollected = 0, NormalAllPackages = 0, NormalPackagesCollected = 0, NormalPackagesNotCollected = 0;
        for (var i in res) {
          let Holiday = res[i].Holidays.find(x => x.Name === MyHoliday.Holidays.$elemMatch.Name & x.Y === MyHoliday.Holidays.$elemMatch.Y)
          if (Holiday.PackageType === "משפחתית") {
            FamilyAllPackages = FamilyAllPackages + 1
            Family.push({ PersonID: res[i].PersonID, LastName: res[i].LastName, FirstName: res[i].FirstName })
          }
          if (Holiday.Status === true & Holiday.PackageType === "משפחתית") { FamilyPackagesCollected = FamilyPackagesCollected + 1 }
          FamilyPackageNotCollected = FamilyAllPackages - FamilyPackagesCollected;
          if (Holiday.PackageType === "רגילה") { NormalAllPackages = NormalAllPackages + 1 }
          if (Holiday.Status === true & Holiday.PackageType === "רגילה") { NormalPackagesCollected = NormalPackagesCollected + 1 }
          NormalPackagesNotCollected = NormalAllPackages - NormalPackagesCollected
          if (Holiday.Status === false) {
            PackageNotCollected.push({ PersonID: res[i].PersonID, LastName: res[i].LastName, FirstName: res[i].FirstName })}
        }
        this.setState({
          FamilyAllPackages: FamilyAllPackages, FamilyPackagesCollected: FamilyPackagesCollected, FamilyPackageNotCollected: FamilyPackageNotCollected,
          NormalAllPackages: NormalAllPackages, NormalPackagesCollected: NormalPackagesCollected, NormalPackagesNotCollected: NormalPackagesNotCollected,
          HolidayFamilyPackages: this.ResToTable(Family), PackageNotCollected:this.ResToTable(PackageNotCollected)})
      })
      .catch()
  }

  renderTableHeader() {
    let header = ["ת.ז", "שם משפחה", "שם פרטי"]
    return header.map((head, index) => {
      return <th key={index}>{head}</th>
    })
  }

  render() {
    const disabled = this.isDisabled();
    const disabled2 = this.isDisabled2();
    if (this.state.navigaToHome) { return <Redirect to='./Home' /> }
    return (
      <div className='AddHoliday' style={{ padding: '2vw' }}>
        <div className='ststusHolidays'>
          <h2>סטאטוס חבילות חג</h2>
          <div style={{ display: 'inline-block' }}>
            <div id='AutocompleteCity' className="group">
              <Autocomplete
                className="Autocomplete"
                value={this.state.HolidayValue}
                onChange={(e, value) => {
                  this.clear();
                  if (value === null || value === '' || value === []) {
                    this.setState({ HolidayValue: null })
                  }
                  else {
                    this.setState({ HolidayValue: value })
                    var Name = value.Name, Y = value.Y;
                    this.setState({ holidayToSearch: { Holidays: { '$elemMatch': { Name, Y } } } })
                  }
                }}
                options={this.state.HolidaysList}
                getOptionLabel={option => option.Name + ' - ' + option.Y}
                style={{ width: '150px' }}
                renderInput={params => <TextField
                 id='45'
                  onChange={ e => {
                    if (e.target.value === '') {
                      this.LastHoliday()
                    }
                    else {
                      axios.get('/Holiday/', { $regex: e.target.value })
                        .then(H => {
                          this.setState({ HolidaysList: H.data });
                        })
                        .catch(function () {
                          this.setState({ HolidaysList: [] });
                        })
                    }
                  }}
                  {...params}  label="אירוע" />}
              /> </div>
          </div>

          <div>
            <Button
              disabled={disabled2}
              style={{ margin: '15px' }} variant="contained" onClick={() => {
                this.setState({ table: false })
                this.Search(this.AllPackages, 'AllPackages');
              }}><i style={{ color: 'blue' }} className="fas fa-search"></i></Button>
          </div>

          <div>
            <h3>סה"כ: {` ${this.state.AllPackages}`}</h3>
            <table className='table'>
              <tbody>
                <tr><th></th>
                  <th>משפחתי</th>
                  <th>רגיל</th>
                </tr>
                <tr>
                  <td>סה"כ</td>
                  <td>{this.state.FamilyAllPackages}</td>
                  <td>{this.state.NormalAllPackages}</td>
                </tr>
                <tr>
                  <td>נלקח</td>
                  <td>{this.state.FamilyPackagesCollected}</td>
                  <td>{this.state.NormalPackagesCollected}</td>
                </tr>
                <tr>
                  <td>טרם נלקח</td>
                  <td>{this.state.FamilyPackageNotCollected}</td>
                  <td>{this.state.NormalPackagesNotCollected}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {this.state.table && <div className='ststusHolidaysfamley'>
          <h2>רשימת חבילות משפחתיות</h2>
          <div id='table'>
            <table id='persons'>
              <tbody>
                <tr>{this.renderTableHeader()}</tr>
                {this.state.HolidayFamilyPackages}
              </tbody>
            </table>
          </div>
        </div>}
        {this.state.table && <div className='PackageNotCollected'>
          <h2>רשימת חבילות שלא נלקחו</h2>
          <div id='table'>
            <table id='persons'>
              <tbody>
                <tr>{this.renderTableHeader()}</tr>
                {this.state.PackageNotCollected}
              </tbody>
            </table>
          </div>
        </div>}

        {/* ******************************************************************* */}
        <div className='ADD'>
          <h2>הוספת חג</h2>
          <input placeholder='שם חג' value={this.state.Name} onChange={(event) => { this.setState({ Name: event.target.value }) }}></input>
          <br />
          <br />
          <div className="group" id='HolidayDate'>
            <MuiPickersUtilsProvider utils={DateFnsUtils} ><KeyboardDatePicker labelstyle={{ right: '0' }} label="תאריך החג"
              format="dd/MM/yyyy" value={this.state.DateHoliday} style={{ verticalAlign: 'sub', width: '145px', right: '0', direction: 'rtl' }} onChange={this.DateHoliday} /></MuiPickersUtilsProvider>
          </div>
          <br />
          <br />
          <input placeholder='שנה' value={this.state.Y} type="number" onChange={(event) => { this.setState({ Y: event.target.value }) }}></input>
          <br />
          <br />

          <button disabled={disabled} onClick={() => {
            const config = { headers: { Authorization: `Bearer ${this.props.User.Token}` } }
            let length = null;
            let ALert = this.ALert
            let clearPosInputs = this.clearPosInputs
            axios.get('/Holiday')
              .then(res => {
                this.setState({ HolidaysList: res.data });
                length = res.data.length
                axios
                  .post('/Holiday', { ID: length + 1, Name: this.state.Name, Y: this.state.Y, DateOFHoliday: this.state.DateOFHoliday, Status: false, PackageType: undefined }, config)
                  .then(function (res) {
                    if (res.data.Status === '201') {
                      ALert('Alertgreen', 'החג נוסף בהצלחה!', 'far fa-thumbs-up')
                      clearPosInputs()
                    }
                    else {
                      ALert('Alertred', res.data.Results, 'fas fa-exclamation-circle', 'שגיאה')
                    }
                  })
                  .catch()
              })
              .catch()
          }}>הוסף</button>
        </div>
        {this.state.Alert && <Alert colorAlert={this.state.colorAlert} header={this.state.header} cancelAlert={this.cancelAlert} AlertText={this.state.AlertText} icon={this.state.icon} />}
      </div>
    );
  }
}
export default AddHoliday;