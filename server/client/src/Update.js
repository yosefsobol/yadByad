import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import axios from "axios";
import "./Update.css";
import WebcamCapture from './WebcamCapture';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker, } from '@material-ui/pickers';
import Button from '@material-ui/core/Button';
import Famely from './Famely';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import Print from './Print';
import Popup from './Popup';
import ImgFiles from './ImgFiles';
import GeneralPopup from './GeneralPopup';
import Alert from './Alert';

class Update extends Component {

  state = {
    HolidaysNotToDelete: null, DisplayPopup: false, holidayValue: undefined, PersonID: '', FirstName: '', LastName: '', DateOfBirth: undefined
    , Sex: '', MaritalStatus: '', NoOfPersons: '', navigate: false, Situation: '', pop: null, QuestionText: '', ActionText: '', ActionFun: null,
    demise: null, FilesDisplay: null, FamelyDisplay: null, WebcamDisplay: null, HolidaysDisplay: null,
    immigrant: null, backgroundColorFamely: { backgroundColor: '#ddd', color: 'black' }, backgroundColorWebcam: null, backgroundColorFiles: null, backgroundColorHolidays: null,
    Origin: null, Alert: null, colorAlert: '', header: '', AlertText: '', icon: '', ButtonImg: null, States: [],
    residence: '', Cell: '', OpeningDate: '', UserOpn: '', Filevalue: '', City: null, Street: '', Housenom: '', ApartmentNum: '',
    Code: '', lkh_Street: '', Population: '', Income: '', Insurance: '', SupportNum: '', FileNameToDelete: '',
    Studying: false, worker: false, SoupKitchen: false, sector: false, Survivor: false, Supported: false, img: undefined,
    Famely: [], Holidays: [], Age: '', NumKids: '', HolidaysList: [], UpdateDate: '', File: '',
    FileName: '', Files: [], showFile: null, Note: '', Cities: [], Streets: []
  }

  changeUpdateDateAndUser   = () => { this.setState({ UpdateDate: this.gettime(new Date()), UserUpd: this.props.User.nickname }); }

  addImg = () => {
    let obj = { img: this.state.img, UpdateDate: new Date(), UserUpd: this.props.User.nickname }
    this.versatileUpdate(obj, 'התמונה נוספה בהצלחה')
  }

  versatileUpdate = (obj, textSuccess) => {
    const config = { headers: { Authorization: `Bearer ${this.props.User.Token}` } };
    const url = `${'./people/'}${this.props.OnePerson._id}`;
    const _this = this
    axios.put(url, obj, config)
      .then(function (res) {
        if (res.data.Status === '200') { _this.ALert('Alertgreen', textSuccess, 'far fa-thumbs-up'); _this.changeUpdateDateAndUser  () }
        else { _this.ALert('Alertred', res.data.Results, 'fas fa-exclamation-circle', 'שגיאה') }
      })
      .catch();
  }

  ClickToUpdate = () => {
    let obj = {
      FirstName: this.state.FirstName, LastName: this.state.LastName, DateOfBirth: this.state.DateOfBirth
      , Sex: this.state.Sex, MaritalStatus: this.state.MaritalStatus, NoOfPersons: this.state.NoOfPersons, Situation: this.state.Situation
      , demise: this.state.demise, immigrant: this.state.immigrant, Origin: this.originValueOrder(this.state.Origin), residence: this.state.residence,
      Cell: this.state.Cell, City: this.cityValueOrder(this.state.City), Street: this.state.Street, Housenom: this.state.Housenom,
      ApartmentNum: this.state.ApartmentNum, Code: this.numValueOrder(this.state.Code),
      Population: this.state.Population, Income: this.numValueOrder(this.state.Income), Insurance: this.numValueOrder(this.state.Insurance), SupportNum: this.numValueOrder(this.state.SupportNum),
      Studying: this.state.Studying, worker: this.state.worker, SoupKitchen: this.state.SoupKitchen, sector: this.state.sector,
      Survivor: this.state.Survivor, Supported: this.state.Supported, Famely: this.state.Famely
      , Note: this.state.Note, NumKids: this.numValueOrder(this.state.NumKids), UpdateDate: new Date(), UserUpd: this.props.User.nickname
    }
    this.versatileUpdate(obj, 'השינויים עודכנו בהצלחה')
  }

  PopupHolidays = (PackageType, value) => {
    let Holidays = [...this.state.Holidays]
    if (value === undefined || PackageType === undefined) { }
    else {
      value.PackageType = PackageType;
      Holidays.unshift(value);
      this.setState({ Holidays: Holidays });
      let obj = { Holidays: Holidays, UpdateDate: new Date(), UserUpd: this.props.User.nickname }
      this.versatileUpdate(obj, 'החג נוסף בהצלחה');
    }
  }
  ALert = (colorAlert, AlertText, icon, header) => {
    this.setState({ Alert: true, colorAlert: colorAlert, header: header, AlertText: AlertText, icon: icon })
  }
  cancelAlert = () => { this.setState({ Alert: null }) }

  DeleteFile = () => {
    const FileName = this.state.FileNameToDelete;
    const _this = this;
    let Files = this.state.Files
    let NewFiles = Files.filter(x => x.File !== FileName)
    this.setState({ Files: NewFiles })
    const url = `/delete/${FileName}`
    axios
      .delete(url)
      .then(res => {
        if (res.data.Status === 'Success') {
          _this.setState({ FileNameToDelete: '' })
          let obj = { Files: NewFiles, UpdateDate: new Date(), UserUpd: this.props.User.nickname }
          _this.versatileUpdate(obj, 'המסמך נמחק בהצלחה');
        }
      })
      .catch();
  }

  LastHoliday = () => {
    axios.get('/LastHoliday')
      .then(res => { this.setState({ HolidaysList: res.data }); })
      .catch()
  }
  Display = () => { this.setState({ showFile: false }) }
  cancel = () => { this.setState({ pop: null }) }
  dataRequired1 = () => {if (this.state.FirstName === '' || this.state.FirstName === undefined || this.state.LastName === undefined || this.state.LastName === '') return false}
  dataRequired2 = () => {
    const config = { headers: { Authorization: `Bearer ${this.props.User.Token}` } };
    const url = `${'./people/'}${this.props.OnePerson._id}`;
    const _this = this;
  axios.get(url , config)
  .then(P => {
    let Person = P.data.find(i => i._id === this.props.OnePerson._id)
    if (Person.FirstName === '' || Person.LastName === ''){
      _this.setState({ Alert: true, colorAlert: 'Alertred', header: 'שגיאה', AlertText: 'אין אפשרות לצאת ללא עדכון שם פרטי ומשפחה', icon: 'fas fa-exclamation-circle'})}       
      else { _this.navigate(); } })
  .catch()
}
  DeletingHoliday = () => {
    this.setState({ Holidays: this.state.HolidaysNotToDelete })
    let obj = { Holidays: this.state.HolidaysNotToDelete, UpdateDate: new Date(), UserUpd: this.props.User.nickname }
    this.versatileUpdate(obj, 'החג נמחק בהצלחה');
  }
  filesList() {
    let Files = this.state.Files
    if (Files.length > 0) {
      return Files.map((Object, index) => {
        return (
          <div className='file' key={index}>
            <button onMouseDown={() => { this.getImageFromServer(Object.File) }}>{Object.FileName}</button>
            <button onMouseDown={() => {
              this.setState({ QuestionText: `האם אתה בטוח שברצונך למחוק את מסמך ${Object.FileName}?`, FileNameToDelete: Object.File, ActionFun: this.DeleteFile, pop: true, ActionText: 'מחק' })
            }}>  <i className="fas fa-trash"></i>
            </button>
          </div>)
      })
    }
  }

  getImageFromServer = File => {
    axios
      .get(`/images/${File}`, { responseType: "blob" })
      .then(res => {
        if (res.status === 200) {
          const reader = new FileReader();
          reader.readAsDataURL(res.data);
          const _this = this;
          reader.onload = function () {
            const imageDataUrl = reader.result;
            _this.setState({ showFile: imageDataUrl });
          }
        }
      })
      .catch();
  };

  loadFilesToServer = () => {
    const _this = this;
    let formData = new FormData();
    formData.append("File", this.state.File);
    formData.append("FileName", this.state.FileName);
    axios
      .post("/addFiles", formData)
      .then(res => {
        if (res.status === 201) {
          let arayy = this.state.Files
          arayy.unshift({ FileName: res.data.body, File: res.data.File.filename })
          this.setState({ Files: arayy, FileName: '', Filevalue: '' })
          let obj = { Files: arayy, UpdateDate: new Date(), UserUpd: this.props.User.nickname }
          _this.versatileUpdate(obj, 'המסמך נוסף בהצלחה');
        } else { _this.ALert('Alertred', res.data.Results, 'fas fa-exclamation-circle', 'שגיאה') }
      })
  };

  remove = () => { document.body.removeEventListener('keypress', this.UseupdateEnter) }
  add = () => { document.body.addEventListener('keypress', this.UseupdateEnter) }
  componentWillUnmount() { this.remove() }
  UseupdateEnter =  e => {
    if (e.keyCode === 13) {
      this.popupdate()
    }
  }
  popupdate = () => {
    this.setState({ QuestionText: `האם ברצונך לעדכן את השינויים ?`, ActionFun: this.ClickToUpdate, pop: true, ActionText: 'עדכן' })
  }

  fillingInputsOnSavedData = people => {
    this.setState({
      PersonID: people.PersonID, FirstName: people.FirstName, LastName: people.LastName, DateOfBirth: people.DateOfBirth
      , Sex: people.Sex, MaritalStatus: people.MaritalStatus, NoOfPersons: people.NoOfPersons, Situation: people.Situation, demise: people.demise
      , immigrant: people.immigrant, img: people.img, Housenom: people.Housenom, ApartmentNum: people.ApartmentNum
      , Code: people.Code, Population: people.Population, Income: people.Income, Insurance: people.Insurance, SupportNum: people.SupportNum
      , Studying: people.Studying, worker: people.worker, SoupKitchen: people.SoupKitchen, sector: people.sector, Survivor: people.Survivor
      , Supported: people.Supported, Famely: people.Famely, Note: people.Note, OpeningDate: people.OpeningDate, UserOpn: people.UserOpn
      , UpdateDate: this.gettime(people.UpdateDate), UserUpd: people.UserUpd, Cell: people.Cell, residence: people.residence
    });
    if (people.Origin === null || people.Origin === undefined) { } else { this.setState({ States: [{ שם_ארץ: people.Origin }] , Origin: { שם_ארץ: people.Origin } }); }
    if (people.lkh_Street === undefined || people.lkh_Street === '') { } else { this.setState({ lkh_Street : people.lkh_Street }); }
    if (people.City === null || people.City === undefined) { } else {
      axios.post('/GetCities/', { שם_ישוב: { $regex: people.City } })
        .then(city => {
          this.setState({ City: { שם_ישוב: people.City }, Cities: [{ שם_ישוב: people.City }], Streets: city.data[0].שם_רחוב, Street: people.Street });
        })
        .catch()}
    if (people.Files === [] || people.Files === undefined) { } else {
      this.setState({ Files: people.Files });
    }
    if (people.Holidays === '' || people.Holidays === undefined || people.Holidays === []) { }
    else { this.setState({ Holidays: people.Holidays, FamelyDisplay: true }) }
  }

  componentDidMount() {
    if (this.props.OnePerson) {
      this.add();
      this.fillingInputsOnSavedData(this.props.OnePerson);
      this.GetFirstCities(); this.LastHoliday(); this.GetFirstStates();
    }
    else { this.navigate() }
  }
  onchangeDate = (date, state) => { this.setState({ [state]: date }) }
  onchangeValue = (e, state) => { this.setState({ [state]: e.target.value }) }
  onchangeChecked = (e, state) => { this.setState({ [state]: e.target.checked }) }
  changeImg = img => { this.setState({ img: img, ButtonImg: true }) }
  Famely = (Famely, NumKids) => { this.setState({ Famely: Famely, NumKids: NumKids }) }
  close = () => { this.setState({ DisplayPopup: false }) }
  navigate = () => { this.setState({ navigate: true }) }

  GetFirstStates = () => {
    axios.post('/GetFirstStates')
      .then(res => { this.setState({ States: res.data }); })
      .catch()
  }

  cityValueOrder = City => { if (City === null || City === undefined) { return null } else { return City.שם_ישוב } }
  originValueOrder = Origin => { if (Origin === null || Origin === undefined) { return null } else { return Origin.שם_ארץ } }

  gettime = date => {
    if (date === null || date === undefined || date === '') { }
    else {
      var today = new Date(date);
      var dd = checkTime(today.getDate());
      var mm = checkTime(today.getMonth() + 1)
      var yyyy = today.getFullYear();
      var h = today.getHours();
      var m = checkTime(today.getMinutes());
      function checkTime(i) { if (i < 10) { i = "0" + i; } return i; }
      var dateTime = dd + '/' + mm + '/' + yyyy + ' ' + h + ':' + m;
      return dateTime
    }
  }

  GetFirstCities = () => {
    axios.post('/GetFirstCities')
      .then(res => { this.setState({ Cities: res.data }); })
      .catch()
  }

  myHolidays() {
    let listHolidays = this.state.Holidays
    return listHolidays.map((ListObject, index) => {
      return (
        <tr key={index}>
          <td>{ListObject.Name + '-' + ListObject.Y}</td>
          <td>{ListObject.PackageType}</td>
          <td>{this.returnTextValue(ListObject.Status)}</td>
          <td>{ListObject.timeOfHasTaken}</td>
          <td><Print ListObject={ListObject} Person={this.props.OnePerson} /></td>
          <td><button onMouseDown={() => {
            let Holidays = [...this.state.Holidays]
            Holidays = Holidays.filter(x => !(x.Name === ListObject.Name && x.Y === ListObject.Y))
            this.setState({ HolidaysNotToDelete: Holidays, QuestionText: `האם אתה בטוח שברצונך למחוק את חג ${ListObject.Name + '-' + ListObject.Y}?`, ActionFun: this.DeletingHoliday, pop: true, ActionText: 'מחק' })
          }}>  <i className="fas fa-trash"></i>
          </button></td>
        </tr>
      )
    })
  }

  returnTextValue(props) { if (props === true) { return props = 'נלקח' } else { return props = 'טרם נלקח' } }
  HeaderHolidays() {
    let Headlines = ['שם אירוע', 'סוג', 'סטטוס', 'זמן לקיחה', 'הדפסת תלוש', 'מחיקה']
    return Headlines.map((title, index) => {
      return <th key={index}>{title}</th>
    })
  }

  KidsValueOrder = prpsy => { if (prpsy === '' || prpsy === undefined) { return [] } else { return prpsy } }

  numValueOrder = value => {
    var numValue = Number(value)
    if (numValue > 0) { return numValue } else { return '' }
  }

  AllColor = () => { this.setState({ backgroundColorFamely: null, backgroundColorWebcam: null, backgroundColorFiles: null, backgroundColorHolidays: null }) }
  AllNull = () => { this.setState({ FilesDisplay: null, FamelyDisplay: null, WebcamDisplay: null, HolidaysDisplay: null }) }
  FilesDisplay = () => {
    this.AllNull()
    this.AllColor()
    this.setState({ FilesDisplay: true, backgroundColorFiles: { backgroundColor: '#ddd', color: 'black' } })
  }
  FamelyDisplay = () => {
    this.AllNull()
    this.AllColor()
    this.setState({ FamelyDisplay: true, backgroundColorFamely: { backgroundColor: '#ddd', color: 'black' } })
  }
  WebcamDisplay = () => {
    this.AllNull()
    this.AllColor()
    this.setState({ WebcamDisplay: true, backgroundColorWebcam: { backgroundColor: '#ddd', color: 'black' } })
  }
  HolidaysDisplay = () => {
    this.AllNull()
    this.AllColor()
    this.setState({ HolidaysDisplay: true, backgroundColorHolidays: { backgroundColor: '#ddd', color: 'black' } })
  }
  isDisabled = () => { return (this.state.File === '' || this.state.File === undefined || this.state.FileName === '') }
  render() {
    const disabled = this.isDisabled();
    if (this.state.navigate) { return <Redirect to ='./Persons' /> }
    return (
      <div className='Update'>
        <div className='Updatetop'>
          <Button
            style={{ backgroundColor: 'green', float: 'right' }} variant="contained" color="primary" size="small"
            onMouseDown={() => {if  (this.dataRequired1() === false){this.setState({ Alert: true, colorAlert: 'Alertred', header: 'שגיאה', AlertText: 'אין אפשרות לעדכן ללא שם פרטי ומשפחה', icon: 'fas fa-exclamation-circle'})}
              else { this.popupdate()}}}>עדכן</Button>
          <h3 style={{ textAlign: 'center' }}>עידכון נזקק</h3>
          <Button
            style={{ backgroundColor: 'red', float: 'left' }} variant="contained" color="primary" size="small"
            onMouseDown={() => {this.dataRequired2() }}>יציאה ללא שינוי</Button>
        </div>
        <div className='from'>
          <div className='Update-right'>
            <div className='Divlabel' style={{ backgroundColor: 'lightgrey' }}>
              <h6 className='borderText'>פרטי זיהוי</h6>
              <div className="group">
                <input style={{ backgroundColor: 'lightgrey' }} readOnly value={this.state.PersonID}
                  dir='rtl' type="number" required />
                <label className='LABEL1'>ת.ז:</label>
              </div>
              <div className="group">
                <input style={{ backgroundColor: 'lightgrey' }} value={this.state.FirstName} onChange={ e => { this.onchangeValue(e, "FirstName") }}
                  type="text" required />
                <span className="highlight"></span>
                <span className="bar"></span>
                <label className='LABEL'>פרטי</label>
              </div>
              <div className="group">
                <input style={{ backgroundColor: 'lightgrey' }} value={this.state.LastName} onChange={ e => { this.onchangeValue(e, "LastName") }}
                  type="text" required />
                <span className="highlight"></span>
                <span className="bar"></span>
                <label className='LABEL'>משפחה</label>
              </div>
              <div className="group" >
                <MuiPickersUtilsProvider utils={DateFnsUtils} ><KeyboardDatePicker labelstyle={{ right: '0' }} label="תאריך לידה"
                  format="dd/MM/yyyy" value={this.state.DateOfBirth} style={{ verticalAlign: 'sub', width: '145px', right: '0' }} onChange={(date) => { this.onchangeDate(date, "DateOfBirth") }} /></MuiPickersUtilsProvider>
              </div>
              <FormControl style={{ minWidth: "120px", marginLeft: '5px', marginRight: '5px', marginTop: '1px', paddingRight: '0' }}><InputLabel>מין</InputLabel>
                <Select value={this.state.Sex} onChange={ e => { this.onchangeValue(e, "Sex") }} ><MenuItem value=""><em>ריק</em></MenuItem>
                  <MenuItem value={'זכר'}>{'זכר'}</MenuItem><MenuItem value={'נקבה'}>{'נקבה'}</MenuItem></Select></FormControl>
            </div>
            <div className='Divlabel' >
              <h6 className='borderText'>פרטיים אישיים</h6>
              <FormControl id='MaritalStatus' style={{ minWidth: "130px", marginLeft: '5px', marginRight: '5px', marginTop: '1p000x' }}><InputLabel>מצב משפחתי</InputLabel>
                <Select value={this.state.MaritalStatus} onChange={ e => { this.onchangeValue(e, "MaritalStatus") }}><MenuItem value=""><em>ריק</em></MenuItem>
                  <MenuItem value={'נשוי'}>{'נשוי'}</MenuItem><MenuItem value={'רווק'}>{'רווק'}</MenuItem><MenuItem value={'גרוש'}>{'גרוש'}</MenuItem>
                  <MenuItem value={'אלמן'}>{'אלמן'}</MenuItem><MenuItem value={'אחר'}>{'אחר'}</MenuItem></Select></FormControl>
              <FormControl id='NoOfPersons' style={{ minWidth: "130px", marginLeft: '5px', marginRight: '5px', marginTop: '1px' }}><InputLabel>מס' נפשות</InputLabel>
                <Select value={this.state.NoOfPersons} onChange={ e => { this.onchangeValue(e, "NoOfPersons") }}><MenuItem value=""><em>ריק</em></MenuItem>
                  <MenuItem value={1}>{1}</MenuItem><MenuItem value={2}>{2}</MenuItem>
                  <MenuItem value={3}>{3}</MenuItem><MenuItem value={4}>{4}</MenuItem>
                  <MenuItem value={5}>{5}</MenuItem><MenuItem value={6}>{6}</MenuItem>
                  <MenuItem value={7}>{7}</MenuItem><MenuItem value={8}>{8}</MenuItem>
                  <MenuItem value={9}>{9}</MenuItem><MenuItem value={10}>{10}</MenuItem>
                </Select></FormControl>
              <div className="group" >
                <MuiPickersUtilsProvider utils={DateFnsUtils} ><KeyboardDatePicker labelstyle={{ right: '0' }} label="תאריך פטירה"
                  format="dd/MM/yyyy" value={this.state.demise} style={{ verticalAlign: 'sub', width: '145px', right: '0', direction: 'rtl' }} onChange={(date) => { this.onchangeDate(date, "demise") }} /></MuiPickersUtilsProvider>
              </div>
              <div className="group" >
                <MuiPickersUtilsProvider utils={DateFnsUtils} ><KeyboardDatePicker labelstyle={{ right: '0' }} label="תאריך עליה"
                  format="dd/MM/yyyy" value={this.state.immigrant} style={{ verticalAlign: 'sub', width: '145px', right: '0' }} onChange={(date) => { this.onchangeDate(date, "immigrant") }} /></MuiPickersUtilsProvider>
              </div>
              <div id='AutocompleteCity' className="group">
                <Autocomplete
                  value={this.state.Origin}
                  className="Autocomplete"
                  onChange={(e, value) => {
                    if (value === null || value === '' || value === []) { this.setState({ Origin: null }); }
                    else { this.setState({ Origin: value }); }
                  }}
                  options={this.state.States}
                  getOptionSelected={option => option.שם_ארץ}
                  getOptionLabel={option => option.שם_ארץ}
                  style={{ width: '130px' }}
                  renderInput={params => <TextField
                    onChange={ e => {
                      if (e.target.value === '') { this.GetFirstStates() }
                      else {
                        axios.post('/GetStates/', { שם_ארץ: { $regex: e.target.value } })
                        .then(city => { this.setState({ States: city.data }); })
                        .catch(function () { this.setState({ States: [] }); })
                      }
                    }}
                    {...params} label="מוצא" />}
                /> </div>
            </div>
            <div className='Divlabel' style={{ backgroundColor: 'lightgrey' }}>
              <h6 className='borderText'> כתובת</h6>
              <div className="group">
                <input style={{ backgroundColor: 'lightgrey', width: "185px" }} readOnly value={this.state.lkh_Street} type="text" />
                <label className='LABEL1'>כתובת ישנה</label>
              </div>
              <FormControl id='residence' style={{ minWidth: "66px", marginLeft: '5px', marginRight: '5px' }}><InputLabel>מגורים</InputLabel>
                <Select value={this.state.residence} onChange={ e => { this.onchangeValue(e, "residence") }}><MenuItem value=""><em>ריק</em></MenuItem>
                  <MenuItem value={'בעלות'}>{'בעלות'}</MenuItem><MenuItem value={'השכרה'}>{'השכרה'}</MenuItem>
                  <MenuItem value={'דמי מפתח'}>{'דמי מפתח'}</MenuItem><MenuItem value={'דיור מוגן/הוסטל'}>{'דיור מוגן/הוסטל'}</MenuItem><MenuItem value={'עמידר'}>{'עמידר'}</MenuItem></Select></FormControl>
              <div id='AutocompleteCity' className="group">
                <Autocomplete
                  className="Autocomplete"
                  value={this.state.City}
                  onChange={(e, value) => {
                    this.setState({ Streets: [], Street: null });
                    if (value === null || value === '' || value === []) { this.setState({ City: null, Streets: [], Street: null }); }
                    else { this.setState({ City: value, Streets: value.שם_רחוב }); }
                  }}
                  options={this.state.Cities}
                  getOptionSelected={option => option.שם_ישוב}
                  getOptionLabel={option => option.שם_ישוב}
                  style={{ width: '150px' }}
                  renderInput={params => <TextField
                    onChange={ e => {
                      if (e.target.value === null) { this.GetFirstCities() }
                      else {
                        axios.post('/GetCities/', { שם_ישוב: { $regex: e.target.value } })
                        .then(city => { this.setState({ Cities: city.data }); })
                        .catch(function (error) { this.setState({ Cities: [] }); })
                      }
                    }}
                    {...params} label="עיר" />}
                /> </div>
              <div id='AutocompleteStreet' className="group">
                <Autocomplete
                  value={this.state.Street}
                  className="Autocomplete"
                  onChange={(e, value) => {
                    if (value === null || value === '' || value === []) { this.setState({ Street: '' }); }
                    else { this.setState({ Street: value }); }
                  }}
                  options={this.state.Streets}
                  getOptionSelected={option => option}
                  getOptionLabel={option => option}
                  style={{ width: '150px' }}
                  renderInput={params => <TextField
                    {...params} label="רחוב" />}
                /> </div>
              <div style={{ width: '50px' }} className="group">
                <input style={{ backgroundColor: 'lightgrey', width: '50px', padding: '10px 3px 10px 3px' }} type="text" value={this.state.Housenom} onChange={ e => { this.onchangeValue(e, "Housenom") }} required />
                <span style={{ width: '50px' }} className="highlight"></span>
                <span style={{ width: '50px' }} className="bar"></span>
                <label className='LABEL'>בית</label>
              </div>
              <div style={{ width: '50px' }} className="group">
                <input style={{ backgroundColor: 'lightgrey', width: '50px', padding: '10px 3px 10px 3px' }} type="text" value={this.state.ApartmentNum} onChange={ e => { this.onchangeValue(e, "ApartmentNum") }} required />
                <span style={{ width: '50px' }} className="highlight"></span>
                <span style={{ width: '50px' }} className="bar"></span>
                <label className='LABEL'>דירה</label>
              </div>
            </div>
            <div className='Divlabel' >
              <h6 className='borderText'>טלפון ופרטים פיננסיים</h6>
              <div className="group">
                <input style={{ width: "135px" }} value={this.state.Cell} onChange={ e => { this.onchangeValue(e, "Cell") }} dir='rtl' type="text" required />
                <span style={{ width: "135px" }} className="highlight"></span>
                <span style={{ width: "135px" }} className="bar"></span>
                <label className='LABEL'>פלאפון</label>
              </div>
              <div className="group" style={{ width: "130px" }}>
                <input style={{ width: "130px" }} value={this.state.Income} onChange={ e => { this.onchangeValue(e, "Income") }}
                  type="number" required />
                <span style={{ width: "130px" }} className="highlight"></span>
                <span style={{ width: "130px" }} className="bar"></span>
                <label className='LABEL'>הכנסות</label>
              </div>
              <div className="group" style={{ width: "130px" }}>
                <input style={{ width: "130px" }} value={this.state.Insurance} onChange={ e => { this.onchangeValue(e, "Insurance") }}
                  type="number" required />
                <span style={{ width: "130px" }} className="highlight"></span>
                <span style={{ width: "130px" }} className="bar"></span>
                <label className='LABEL'>ביטוח לאומי</label>
              </div>
              <div className="group" style={{ width: "130px" }}>
                <input style={{ width: "130px" }} value={this.state.SupportNum} onChange={ e => { this.onchangeValue(e, "SupportNum") }}
                  type="number" required />
                <span style={{ width: "130px" }} className="highlight"></span>
                <span style={{ width: "130px" }} className="bar"></span>
                <label className='LABEL'>סכום תמיכה</label>
              </div>
              <FormControl id='Population' style={{ minWidth: "80px", marginLeft: '5px', marginRight: '5px', verticalAlign: 'sub' }}><InputLabel>אוכלסיה</InputLabel>
                <Select value={this.state.Population} onChange={ e => { this.onchangeValue(e, "Population") }}><MenuItem value=""><em>ריק</em></MenuItem>
                  <MenuItem value={'נזקקת'}>{'נזקקת'}</MenuItem><MenuItem value={'רווחה'}>{'רווחה'}</MenuItem></Select></FormControl>
              <div style={{ width: "80px" }} className="group">
                <input style={{ width: "80px" }} value={this.state.Code} onChange={ e => { this.onchangeValue(e, "Code") }} type="number" required />
                <span style={{ width: "80px" }} className="highlight"></span>
                <span style={{ width: "80px" }} className="bar"></span>
                <label className='LABEL'>מיקוד</label>
              </div>
            </div>
            <div className='Divlabel' id='checkboxDiv' style={{ backgroundColor: 'lightgrey', width: 'fit-content' }}>
              <h6 className='borderText'>שונות</h6>
              <div className="group" id={'checkboxinput'}>
                <label className='labelCheckbox'>פעיל</label>
                <input style={{ width: '15px' }} type="checkbox" checked={this.state.Situation} onChange={ e => { this.onchangeChecked(e, "Situation") }} required />
              </div>
              <div className="group">
                <label className='labelCheckbox'>עובד</label>
                <input style={{ width: '15px' }} type="checkbox"
                  checked={this.state.worker} onChange={ e => { this.onchangeChecked(e, "worker") }} required />
              </div>
              <div className="group">
                <label className='labelCheckbox'>נתמך</label>
                <input style={{ width: '15px' }} type="checkbox" checked={this.state.Supported} onChange={ e => { this.onchangeChecked(e, "Supported") }} required />
              </div>
              <div className="group">
                <label className='labelCheckbox'>לומד</label>
                <input style={{ width: '15px' }} type="checkbox" checked={this.state.Studying} onChange={ e => { this.onchangeChecked(e, "Studying") }} required />
              </div>
              <br></br>
              <div className="group" id={'checkboxinput'}>
                <label className='labelCheckbox'>בית תמחוי</label>
                <input style={{ width: '15px' }} type="checkbox" checked={this.state.SoupKitchen} onChange={ e => { this.onchangeChecked(e, "SoupKitchen") }} required />
              </div>
              <div className="group">
                <label className='labelCheckbox'>מגזר הערבי</label>
                <input style={{ width: '15px' }} type="checkbox" checked={this.state.sector} onChange={ e => { this.onchangeChecked(e, "sector") }} required />
              </div>
              <div className="group">
                <label className='labelCheckbox'>ניצול</label>
                <input style={{ width: '15px' }} type="checkbox" checked={this.state.Survivor} onChange={ e => { this.onchangeChecked(e, "Survivor") }} required />
              </div>
            </div>
            <div className='Divlabel' style={{ backgroundColor: 'lightgrey', width: 'fit-content', verticalAlign: 'top', display: 'inline-block', marginRight: '-2px', height: '111px' }} >
              <h6 className='borderText'> הערות</h6>
              <textarea value={this.state.Note} onChange={ e => { this.onchangeValue(e, "Note") }} rows="4" cols="100" style={{ backgroundColor: 'lightgrey', resize: 'none', width: '448.2px' }}>
              </textarea>
            </div>
          </div>
        </div>
        <div id='Update-beneath'>
          <div className='dates'>
            <div className='open'><span>נפתח לראשונה </span><span className='num'>{this.state.OpeningDate}</span>
              <span style={{ marginRight: '10px', marginLeft: '5px' }}>ע"י</span><span>{this.state.UserOpn}</span></div>
            <div className='upd'><span>עודכן לאחרונה </span><span className='num'>{this.state.UpdateDate}</span>
              <span style={{ marginRight: '10px', marginLeft: '5px' }}>ע"י</span><span>{this.state.UserUpd}</span></div>
          </div>
        </div>
        <div className='botm'>
          <ul className='topnav'>
            <li onMouseDown={this.FamelyDisplay} style={this.state.backgroundColorFamely}>משפחה</li>
            <li onMouseDown={this.WebcamDisplay} style={this.state.backgroundColorWebcam}>תמונה</li>
            <li onMouseDown={this.FilesDisplay} style={this.state.backgroundColorFiles}>קבצים</li>
            <li onMouseDown={this.HolidaysDisplay} style={this.state.backgroundColorHolidays}>חגים</li>
          </ul>
          <div className='cabcia'>
            {this.state.FamelyDisplay &&
              <div id='tabDiv'><Famely Famely={this.Famely} araayFamely={this.KidsValueOrder(this.state.Famely)} LastName={this.state.LastName} /></div>}
            {this.state.FilesDisplay &&
              <div className="LoadToServer">
                <h2>הוספת קובץ</h2>
    שם הקובץ {" "}
                <input className='Loadinput1' type="text" value={this.state.FileName} onChange={ e => { this.onchangeValue(e, "FileName") }} />
                <input className='Loadinput' type="file" value={this.state.Filevalue} onChange={evt => this.setState({ File: evt.target.files[0], Filevalue: evt.target.value })} />
                <button disabled={disabled} onMouseDown={this.loadFilesToServer}>הוסף קובץ</button>
                <br />
                {this.state.Files && this.filesList()}
                {this.state.showFile && <ImgFiles ImgFiles={this.state.showFile} Display={this.Display} />}
              </div>}
            {this.state.WebcamDisplay &&
              <div style={{ width: '818px', margin: '0 auto 100px', border: '2px solid gray' }}>
                {this.state.ButtonImg && <Button style={{ position: 'relative', left: '-369px' }} variant="contained" color="primary" size="small" onMouseDown={() => { this.addImg() }}>עדכן תמונה</Button>}
                <WebcamCapture changeImg={this.changeImg} Img={this.state.img} />
              </div>}
            {this.state.HolidaysDisplay &&
              <div id='beneathImg'>
                <div id='AutocompleteCity' className="group">
                  <Autocomplete
                    className="Autocomplete"
                    value={null}
                    onChange={(e, value) => {
                      if (value === null || value === '' || value === []) { }
                      else {
                        let Holidays = [...this.state.Holidays]
                        let Holiday = Holidays.find(x => (x.Name === value.Name && x.Y === value.Y))
                        if (Holiday === undefined) { this.setState({ holidayValue: value, DisplayPopup: true }) }
                        else { this.setState({ Alert: true, colorAlert: 'Alertred', header: 'שגיאה', AlertText: 'כבר קיים אירוע בשם זה', icon: 'fas fa-exclamation-circle' }) }
                      }
                    }}
                    options={this.state.HolidaysList}
                    getOptionLabel={option => option.Name + ' - ' + option.Y}
                    style={{ width: '130px' }}
                    renderInput={params => <TextField
                      onChange={ e => {
                        if (e.target.value === '') { this.LastHoliday() }
                        else {
                          axios.get('/Holiday/', { $regex: e.target.value })
                          .then(H => { this.setState({ HolidaysList: H.data }); })
                          .catch(function () { this.setState({ HolidaysList: [] }); })
                        }
                      }}
                      {...params} label="אירוע" />}
                  /> </div>
                {this.state.Holidays && <table id='Holidays'>
                  <tbody>
                    <tr>{this.HeaderHolidays()}</tr>
                    {this.myHolidays()}
                  </tbody>
                </table>}
              </div>}
          </div>
        </div>
        {this.state.pop && <GeneralPopup remove={this.remove} add={this.add} QuestionText={this.state.QuestionText} ActionText={this.state.ActionText} cancel={this.cancel} ActionFun={this.state.ActionFun} />}
        {this.state.DisplayPopup && <Popup closePopup={this.close} remove={this.remove} add={this.add} PopupHolidays={this.PopupHolidays} text={'איזה חבילת חג ברצונך להוסיף?'} holidayValue={this.state.holidayValue} />}
        {this.state.Alert && <Alert remove={this.remove} add={this.add} colorAlert={this.state.colorAlert} header={this.state.header} cancelAlert={this.cancelAlert} AlertText={this.state.AlertText} icon={this.state.icon} />}
      </div>
    );
  }
}

export default Update;