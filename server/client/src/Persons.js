import React, { Component } from 'react';
import './Persons.css';
import axios from "axios";
import { Redirect } from 'react-router-dom';
import cleaner from 'deep-cleaner';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import ReactToExcel from 'react-html-table-to-excel';

class Persons extends Component {

  state = {
    navigateToUpdate: false, End: false, AllRes: [], obj: null, arrayDisplay: '', skip: 0, valueHoliday: null, table: false,  PersonID: '', Situation: '', FirstName: '', res: undefined,
    mAgeKids: '', AdAgeKids: '', mYofBirth: '', adYofBirth: '', mNumOfChildren: '', adNumOfChildren: '',
    GetHolidaysList: [], oneHoliday: undefined, AllHolidays: '', LastName: '', adYofimmigrant: '', mYofimmigrant: '',
    MaritalStatus: '', Cities: [], City: null, Cell: '', Survivor: '', sector: '', SoupKitchen: '',
    Supported: '',allPersons:null, mDateOfUpdate: null, adDateOfUpdate: null, Population: '', arrayLength: '', Street: null, Streets: []
  }
  componentDidMount() {
      this.GetHolidaysData()
      this.setState({ Situation: true });
      document.body.addEventListener('keypress', this.UseSearchEnter);
  }
    componentWillUnmount() { document.body.removeEventListener('keypress', this.UseSearchEnter); }
    UseSearchBuotten = () => { this.Search() }
    UseSearchEnter = e => {
            if (e.keyCode === 13) {
                this.Search()
            }
        }
  ResToTable = (people, length) => {
    if (length === true){ this.setState({ arrayDisplay: people.length }) }
    return people.map((people, index) => {
      var apartmentNum = '', housenom = '', כתובת = '';
      function fix(value) { if (value === null || value === undefined) { return '' } else { return value }; }
      if (people.ApartmentNum === null || people.ApartmentNum === undefined) { } else { apartmentNum = people.ApartmentNum }
      if (people.Housenom === null || people.Housenom === undefined) { } else { housenom = people.Housenom }
      if (apartmentNum === '' || housenom === '') { } else { כתובת = apartmentNum + '/' + housenom }
      return (
        <tr key={index}
          onMouseDown={() => {
            this.props.find(people)
            this.setState({ navigateToUpdate: true });
          }}>
          <td>{index + 1}</td>
          <td>{people.PersonID}</td>
          <td>{people.LastName}</td>
          <td>{people.FirstName}</td>
          <td>{this.getAgefromData(people.DateOfBirth)}</td>
          <td>{people.NoOfPersons}</td>
          <td>{fix(people.Street) + '  ' + כתובת}</td>
          <td>{people.City}</td>
          <td>{people.Cell}</td>
          <td>{people.Population}</td>
          <td>{people.Income}</td>
          <td>{people.MaritalStatus}</td>
        </tr>
      )
    })
  }

  onScroll = () => {
    if (this.state.End === false) {
      if (document.getElementById("persons").scrollTop > document.getElementById("persons").scrollHeight - 800) {
        this.setState({ End: true })
        const config = { headers: { Authorization: `Bearer ${this.props.User.Token}` } };
        const url = `${'./FindWlimit/'}${this.state.skip}`;
        axios.post(url,
          this.state.obj, config)
          .then(r => {
            let a = [...this.state.AllRes]
            let b = r.data
            this.setState({ res: this.ResToTable(a.concat(b), true), AllRes: a.concat(b), skip: this.state.skip + 50 });
            if (r.data.length < 50 || r.data.length === 0) {
              alert('אין עוד נתונים')
            }
            else {
              this.setState({ table: true, End: false })
            }
          })
          .catch()
      }
    }
  }

  Search = () => {
    this.setState({ res: undefined, arrayLength: '', arrayDisplay: '', skip: 50, AllRes: [], End: false });
              const config = { headers: { Authorization: `Bearer ${this.props.User.Token}` } };
              const url = `${'./FindWlimit/'}${0}`;
              axios.post(url,
                this.SearchToServer(), config)
                .then(r => {
                  this.setState({ res: this.ResToTable(r.data, true), AllRes: r.data, arrayDisplay: r.data.length });
                  if (r.data.length === 0) {
                    this.setState({ table: false })
                    alert('אין נתונים תואמים')
                  }
                  else { this.setState({ table: true }) }
                })
                .catch()
              axios.post('./find/',
                this.SearchToServer(), config)
                .then(r => {
                  this.setState({ arrayLength: r.data.length, allPersons:this.ResToTable(r.data) });
                })
                .catch()
  }
  ClearSearchField = () => {
    this.setState({
      oneHoliday: '', PersonID: '', Situation: '', FirstName: '', mAgeKids: '', AdAgeKids: '', mYofBirth: '', mDateOfUpdate: null, adDateOfUpdate: null,
      adYofBirth: '', mNumOfChildren: '', adNumOfChildren: '', AllHolidays: '', Survivor: '', sector: '', Cell: '', LastName: '',
      SoupKitchen: '', valueHoliday: null, Street: null, Supported: '', Population: '', Cities: [], MaritalStatus: '', City: null, adYofimmigrant: '', mYofimmigrant: ''
    })
  }

  GetHolidaysData = () => {
    axios.get('/Holiday')
      .then(res => {
        this.setState({ GetHolidaysList: res.data });})
      .catch()
  }
  getAgefromData = date => {
    if (date === null || date === undefined || date === '') { return '' }
    else {
      const birth = new Date(date);
      var dd = birth.getDate();
      var mm = birth.getMonth() + 1
      var yy = birth.getFullYear();
      function calculate_age(birth_day, birth_month, birth_year) {
        const today_date = new Date();
        const today_year = today_date.getFullYear();
        const today_month = today_date.getMonth();
        const today_day = today_date.getDate();
        let age = today_year - birth_year;
        if (today_month < birth_month - 1) {
          age--;
        }
        if (birth_month - 1 === today_month && today_day < birth_day) {
          age--;
        }
        return age;
      }
      var numAge = calculate_age(dd, mm, yy)
      return numAge
    }
  }
  DateFun = date => {
    if (date === null) { return undefined } else {
      if (date.toString() === 'Invalid Date' || date === null) { return undefined } else { return date }
    }
  }
  numFun = value => {
    var numValue = Number(value)
    if (numValue > 0) { return numValue } else { return '' }
  }

  SearchToServer = () => {
    var mYofBirth = new Date(`${this.state.mYofBirth}-01-01T00:00:00.000Z`)
    var adYofBirth = new Date(`${this.state.adYofBirth}-01-01T00:00:00.000Z`)
    var mYofimmigrant = new Date(`${this.state.mYofimmigrant}-01-01T00:00:00.000Z`)
    var adYofimmigrant = new Date(`${this.state.adYofimmigrant}-01-01T00:00:00.000Z`)
    var mAgeKids = new Date(this.CreateInvalidDate(this.state.mAgeKids))
    var AdAgeKids = new Date(this.CreateInvalidDate(this.state.AdAgeKids))
    var city = undefined
    if (this.state.City === null) { } else { city = this.state.City.שם_ישוב }
    var Street = undefined
    if (this.state.Street === null) { } else { Street = this.state.Street }
    // נתונים לחיפוש שרת
    var obj = {
      PersonID: this.numFun(this.state.PersonID),
      DateOfBirth: { $gte: this.checkboxDate(mYofBirth), $lte: this.checkboxDate(adYofBirth) },
      immigrant: { $gte: this.checkboxDate(mYofimmigrant), $lte: this.checkboxDate(adYofimmigrant) },
      Famely: { '$elemMatch': { 'DateOfBirth': { '$lte': this.checkboxDate(mAgeKids), '$gte': this.checkboxDate(AdAgeKids) } } },
      NumKids: { $gte: this.numFun(this.state.mNumOfChildren), $lte: this.numFun(this.state.adNumOfChildren) },
      FirstName: {$regex: this.state.FirstName},
      // {FirstName:{ $regex: 'מזל' } }
      Cell: this.state.Cell,
      LastName: this.state.LastName,
      Population: this.state.Population,
      MaritalStatus: this.state.MaritalStatus,
      Situation: this.checkCheckbox(this.state.Situation),
      Survivor: this.checkCheckbox(this.state.Survivor),
      sector: this.checkCheckbox(this.state.sector),
      SoupKitchen: this.checkCheckbox(this.state.SoupKitchen),
      Supported: this.checkCheckbox(this.state.Supported),
      UpdateDate: { $gte: this.DateFun(this.state.mDateOfUpdate), $lte: this.DateFun(this.state.adDateOfUpdate) },
      City: city,
      Street: Street,
    }
    if (this.state.AllHolidays === true) {
      obj.Holidays = { Holidays: { "$exists": true, "$not": { "$size": 0 } } }
      obj.Holidays = obj.Holidays.Holidays
    } else {
      obj.Holidays = this.state.oneHoliday
      if (this.state.oneHoliday === undefined) { } else { obj.Holidays = obj.Holidays.Holidays }
    }
    cleaner(obj.FirstName)
    cleaner(obj.UpdateDate)
    cleaner(obj.Famely.$elemMatch.DateOfBirth)
    cleaner(obj.Famely.$elemMatch)
    cleaner(obj.Famely)
    cleaner(obj.NumKids)
    cleaner(obj.DateOfBirth)
    cleaner(obj.immigrant)
    cleaner(obj);
    this.setState({ obj: obj })
    return obj;
  }

  CreateInvalidDate = num => {
    if (num === isNaN || num === undefined || num === '') { return undefined }
    else {
      var today = new Date();
      var dd = checkTime(today.getDate());
      var mm = checkTime(today.getMonth() + 1)
      var Year = today.getFullYear() - num
      function checkTime(i) { if (i < 10) { i = "0" + i; } return i; }
      var dateTime = Year + '/' + mm + '/' + dd
      return dateTime
    }
  }

  checkboxDate = value => { if (value.toString() === 'Invalid Date') { return undefined } else { return value } }
  checkCheckbox = value => { if (value !== true) { value = undefined } else { return true } }
  renderTableHeader() {
    let header = ['/','ת.ז', 'שם משפחה', 'שם פרטי', 'גיל', 'מספר נפשות', 'כתובת', 'ישוב', 'טלפון', 'אוכלוסיה' , 'הכנסה','מצב משפחתית']
    return header.map((head, index) => {
      return <th key={index}>{head}</th>
    })
  }

  SetStateTargetvalue = (state, e) => { this.setState({ [state]: e.target.value }) }
  SetStateTargetchecked = (state, e) => { this.setState({ [state]: e.target.checked }) }
  SetStatedate = (state, date) => { this.setState({ [state]: date }) }

  City = (e, value) => {
    if (value === null || value === '' || value === [] || value === undefined) { this.setState({ City: undefined }); }
    else { this.setState({ City: value.שם_ישוב }); }
  }

  render() {
    if (this.state.navigateToUpdate) { return <Redirect to='./Update' /> }
    return (
      <div className='Persons'>
        <div id='Persons'>
          <div className='top'>
            <Button variant="contained" style={{ marginRight: '10px' }} onMouseDown={this.UseSearchBuotten}>
                <i style={{ color: 'blue' }} className="fas fa-search"></i></Button>
            <Button variant="contained" style={{ marginRight: '10px' }} onMouseDown={() => { this.ClearSearchField() }}><i style={{ color: 'red' }} className="fas fa-brush"></i></Button>
            <Button style={{ marginRight: '460px', padding: '0 10px' }} size="small" variant="contained">מציג:{this.state.arrayLength + ' / ' + this.state.arrayDisplay}</Button>
            {this.state.allPersons && <ReactToExcel id='Excel'
              className='fas fa-file-export'
              table='allPersons'
              //  fileExtension="xlsx"
              filename='yadByadData'
              sheet='sheet 1'
              buttonText='' />}
          </div>
          <div className='center'>
            <div className='DivSearch'>
              <h6 className='borderText'>פרמטרים לשאילתא</h6>
              <div className='divgroup' style={{ paddingTop: '5px' }}>
                <div className='margin2' style={{ height: '56px', paddingTop: '8px' }}>
                  <div className="group" style={{ float: 'right' }}>
                    <input value={this.state.PersonID} onChange={e => { this.SetStateTargetvalue('PersonID', e) }} dir='rtl' type="number" required />
                    <span className="highlight"></span>
                    <span className="bar"></span>
                    <label className='LABEL'>ת.ז:</label>
                  </div>
                  <div className="group" style={{ float: 'left' }}>
                    <input value={this.state.FirstName} onChange={e => { this.SetStateTargetvalue('FirstName', e) }} type="text" required />
                    <span className="highlight"></span>
                    <span className="bar"></span>
                    <label className='LABEL'>פרטי</label>
                  </div>
                </div>
                <div className='margin1' style={{ height: '60px', paddingTop: '10px' }}>
                  <div className="group" style={{ float: 'right', width: "90px", textAlign: 'right' }}>
                    <input style={{ width: "90px" }} value={this.state.LastName} onChange={e => { this.SetStateTargetvalue('LastName', e) }} type="text" required />
                    <span className="highlight" style={{ width: "90px" }}></span>
                    <span className="bar" style={{ width: "90px" }}></span>
                    <label className='LABEL' style={{ width: "90px" }}>משפחה</label>
                  </div>
                  <FormControl id='MaritalStatus' style={{ float: 'right', width: "120px", marginLeft: '5px', marginRight: '5px', marginTop: '1p000x' }}><InputLabel>מצב משפחתי</InputLabel>
                    <Select value={this.state.MaritalStatus} onChange={e => { this.SetStateTargetvalue('MaritalStatus', e) }}><MenuItem value=""><em>אחר</em></MenuItem>
                      <MenuItem value={'נשוי'}>נשוי</MenuItem><MenuItem value={'רווק'}>רווק</MenuItem>
                      <MenuItem value={'גרוש'}>גרוש</MenuItem><MenuItem value={'אלמן'}>אלמן</MenuItem></Select></FormControl>
                  <div className="group" style={{ float: 'left' }}>
                    <input style={{ width: "145px" }} value={this.state.Cell} onChange={e => { this.SetStateTargetvalue('Cell', e) }} dir='rtl' type="text" required />
                    <span style={{ width: "145px" }} className="highlight"></span>
                    <span style={{ width: "145px" }} className="bar"></span>
                    <label className='LABEL'>פלאפון</label>
                  </div>
                </div>
                <div className='margin2 Holidays MaritalStatus' style={{ height: '50px', paddingTop: '2px' }}>
                  <div id='AutocompleteCity' className="group" style={{ float: 'right' }}>
                    <Autocomplete style={{ width: 155 }}
                      className="Autocomplete"
                      value={this.state.City}
                      onChange={(e, value) => {
                        this.setState({ Streets: [], Street: null });
                        if (value === null || value === '' || value === []) {
                          this.setState({ City: null, Streets: [], Street: null });
                        }
                        else {
                          this.setState({ City: value, Streets: value.שם_רחוב });
                        }
                      }}
                      options={this.state.Cities}
                      getOptionLabel={option => option.שם_ישוב}
                      renderInput={params => <TextField
                        onChange={e => {
                          if (e.target.value === '') { }
                          else {
                            axios.post('/GetCities/', { שם_ישוב: { $regex: e.target.value } })
                              .then(city => {
                                this.setState({ Cities: city.data });
                              })
                              .catch()
                          }
                        }}
                        {...params} label="עיר" />}
                    /> </div>
                  <div id='AutocompleteCity' className="group" style={{ float: 'left' }}>
                    <Autocomplete style={{ width: 155 }}
                      value={this.state.Street}
                      className="Autocomplete"
                      onChange={(e, value) => {
                        if (value === null || value === '' || value === []) {
                          this.setState({ Street: null });
                        }
                        else {
                          this.setState({ Street: value });
                        }
                      }
                      }
                      options={this.state.Streets}
                      getOptionLabel={option => option}
                      renderInput={params => <TextField
                        {...params} label="רחוב" />}
                    /> </div>
                </div>
              </div>
              <div className='divgroup' >
                <div className='marginchecked'>
                  <div style={{ width: 'fit-content', display: 'block', paddingBottom: '8px' }}>
                    <div className="groupPersons">
                      <label className='labelCheckbox'>פעיל</label>
                      <input style={{ width: '15px' }} type="checkbox" checked={this.state.Situation} onChange={e => { this.SetStateTargetchecked('Situation', e) }} required />
                    </div>
                    <div className="groupPersons">
                      <label className='labelCheckbox'>נתמך</label>
                      <input style={{ width: '15px' }} type="checkbox" checked={this.state.Supported} onChange={e => { this.SetStateTargetchecked('Supported', e) }} required />
                    </div>
                    <div className="groupPersons" id={'checkboxinput'}>
                      <label className='labelCheckbox'>בית תמחוי</label>
                      <input style={{ width: '15px' }} type="checkbox" checked={this.state.SoupKitchen} onChange={e => { this.SetStateTargetchecked('SoupKitchen', e) }} required />
                    </div>
                    <div className="groupPersons">
                      <label className='labelCheckbox'>מגזר הערבי</label>
                      <input style={{ width: '15px' }} type="checkbox" checked={this.state.sector} onChange={e => { this.SetStateTargetchecked('sector', e) }} required />
                    </div>
                    <div className="groupPersons">
                      <label className='labelCheckbox'>ניצול</label>
                      <input style={{ width: '15px' }} type="checkbox" checked={this.state.Survivor} onChange={e => { this.SetStateTargetchecked('Survivor', e) }} required />
                    </div>
                  </div>
                </div>
                <div className='margin2 Holidays' style={{ paddingTop: '2px', height: '50px' }}>
                  <FormControl style={{ width: "145px", marginLeft: '5px', marginRight: '5px', float: 'right' }}><InputLabel>אוכלסיה</InputLabel>
                    <Select value={this.state.Population} onChange={e => { this.SetStateTargetvalue('Population', e) }}><MenuItem value=""><em>ריק</em></MenuItem>
                      <MenuItem value='נזקקת'>נזקקת</MenuItem><MenuItem value='רווחה'>רווחה</MenuItem></Select></FormControl>
                  <div className="group" id={'checkboxinput'} style={{ paddingTop: '5px' }}>
                    <label className='labelCheckbox'>חגים</label>
                    <input style={{ width: '15px' }} type="checkbox" checked={this.state.AllHolidays} onChange={e => { this.SetStateTargetchecked('AllHolidays', e) }} />
                  </div>
                  <div id='AutocompleteCity' className="group">
                    <Autocomplete
                      className="Autocomplete"
                      value={this.state.valueHoliday}
                      onChange={(e, value) => {
                        if (value === null || value === '' || value === []) {
                          this.setState({ oneHoliday: undefined });
                        }
                        else {
                          var Name = value.Name, Y = value.Y
                          this.setState({ valueHoliday: value, oneHoliday: { Holidays: { '$elemMatch': { Name, Y } } } })
                        }
                      }
                      }
                      options={this.state.GetHolidaysList}
                      getOptionLabel={option => option.Name + ' - ' + option.Y}
                      style={{ width: '130px' }}
                      renderInput={params => <TextField
                        {...params} label="חג ספציפי" />}
                    /> </div>
                </div>
                <div className='margin1' >
                  <span style={{ fontSize: '20px', textAlign: 'right', float: 'right', width: '110px', paddingTop: '10px' }}> שנת לידה:</span>
                  <div className="group">
                    <input maxLength="4" type="text" size='4' style={{ width: "135px" }} value={this.state.mYofBirth} onChange={e => { this.SetStateTargetvalue('mYofBirth', e) }} dir='rtl' required />
                    <span style={{ width: "135px" }} className="highlight"></span>
                    <span style={{ width: "135px" }} className="bar"></span>
                    <label className='LABEL'>משנת</label>
                  </div>
                  <div className="group" style={{ float: 'left' }}>
                    <input maxLength="4" type="text" size='4' style={{ width: "135px" }} value={this.state.adYofBirth} onChange={e => { this.SetStateTargetvalue('adYofBirth', e) }} dir='rtl' required />
                    <span style={{ width: "135px" }} className="highlight"></span>
                    <span style={{ width: "135px" }} className="bar"></span>
                    <label className='LABEL'>עד שנת</label>
                  </div>
                </div>
                <div className='margin2' >
                  <span style={{ fontSize: '20px', textAlign: 'right', float: 'right', width: '110px', paddingTop: '10px' }}>שנת עליה:</span>
                  <div className="group">
                    <input maxLength="4" type="text" size='4' style={{ width: "135px" }} value={this.state.mYofimmigrant} onChange={e => { this.SetStateTargetvalue('mYofimmigrant', e) }} dir='rtl' required />
                    <span style={{ width: "135px" }} className="highlight"></span>
                    <span style={{ width: "135px" }} className="bar"></span>
                    <label className='LABEL'>משנת </label>
                  </div>
                  <div className="group" style={{ float: 'left' }}>
                    <input maxLength="4" type="text" size='4' style={{ width: "135px" }} value={this.state.adYofimmigrant} onChange={e => { this.SetStateTargetvalue('adYofimmigrant', e) }} dir='rtl' required />
                    <span style={{ width: "135px" }} className="highlight"></span>
                    <span style={{ width: "135px" }} className="bar"></span>
                    <label className='LABEL'>עד שנת </label>
                  </div>
                </div>
                <div className='margin1'>
                  <span style={{ fontSize: '20px', textAlign: 'right', float: 'right', width: '110px', paddingTop: '10px' }}> גיל ילדים:</span>
                  <div className="group">
                    <input max="99" size='2' style={{ width: "135px" }} value={this.state.mAgeKids} onChange={e => { this.SetStateTargetvalue('mAgeKids', e) }} dir='rtl' type="number" required />
                    <span style={{ width: "135px" }} className="highlight"></span>
                    <span style={{ width: "135px" }} className="bar"></span>
                    <label className='LABEL'>מגיל</label>
                  </div>
                  <div className="group" style={{ float: 'left' }}>
                    <input max="99" size='2' style={{ width: "135px" }} value={this.state.AdAgeKids} onChange={e => { this.SetStateTargetvalue('AdAgeKids', e) }} dir='rtl' type="number" required />
                    <span style={{ width: "135px" }} className="highlight"></span>
                    <span style={{ width: "135px" }} className="bar"></span>
                    <label className='LABEL'>עד גיל</label>
                  </div>
                </div>
                <div className='margin2'>
                  <span style={{ fontSize: '20px', textAlign: 'right', float: 'right', width: '110px', paddingTop: '10px' }}>מספר ילדים:</span>
                  <div className="group">
                    <input max="99" size='2' style={{ width: "135px" }} value={this.state.mNumOfChildren} onChange={e => { this.SetStateTargetvalue('mNumOfChildren', e) }} dir='rtl' type="number" required />
                    <span style={{ width: "135px" }} className="highlight"></span>
                    <span style={{ width: "135px" }} className="bar"></span>
                    <label className='LABEL'>ממספר</label>
                  </div>
                  <div className="group" style={{ float: 'left' }}>
                    <input max="99" size='2' style={{ width: "135px" }} value={this.state.adNumOfChildren} onChange={e => { this.SetStateTargetvalue('adNumOfChildren', e) }} dir='rtl' type="number" required />
                    <span style={{ width: "135px" }} className="highlight"></span>
                    <span style={{ width: "135px" }} className="bar"></span>
                    <label className='LABEL'>עד מספר</label>
                  </div>
                </div>
                <div className='margin1 DateOfUpdate' style={{ borderBottom: 'none', paddingBottom: '20px', paddingTop: '3px' }}>
                  <span style={{ fontSize: '20px', textAlign: 'right', float: 'right', width: '110px', paddingTop: '17px' }}>תאריך עידכון:</span>
                  <div className="group">
                    <MuiPickersUtilsProvider utils={DateFnsUtils} ><KeyboardDatePicker labelstyle={{ right: '0' }} label="מתאריך"
                      format="dd/MM/yyyy" value={this.state.mDateOfUpdate} style={{ verticalAlign: 'sub', width: '135px', right: '0' }} onChange={(date) => { this.SetStatedate('mDateOfUpdate', date) }} /></MuiPickersUtilsProvider>
                  </div>
                  <div className="group" style={{ float: 'left' }}>
                    <MuiPickersUtilsProvider utils={DateFnsUtils} ><KeyboardDatePicker labelstyle={{ right: '0' }} label="עד תאריך "
                      format="dd/MM/yyyy" value={this.state.adDateOfUpdate} style={{ verticalAlign: 'sub', width: '135px', right: '0' }} onChange={(date) => { this.SetStatedate('adDateOfUpdate', date) }} /></MuiPickersUtilsProvider>
                  </div>
                </div>
              </div>
            </div>
            {this.state.table && <div id='table'>
              <table id='persons' onScroll={this.onScroll}>
                <tbody>
                  <tr>{this.renderTableHeader()}</tr>
                  {this.state.res}
                </tbody>
              </table>
            </div>}
            <table id='allPersons' style={{display:'none'}}>
                <tbody>
                  <tr>{this.renderTableHeader()}</tr>
                  {this.state.allPersons}
                </tbody>
              </table>
          </div>
        </div>
      </div>
    )
  }
}
export default Persons;