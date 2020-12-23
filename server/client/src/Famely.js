import React, { Component } from 'react';
import "./Famely.css";
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker, } from '@material-ui/pickers';
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import axios from "axios";
import GeneralPopup from './GeneralPopup'

class Famely extends Component {

    state = {
        famelyArray: [], onePerson: '', displayMainTable: false, editing: false, newRoot : null, addButton: true, states: [],
        data: [], popup: null, QuestionText: '', ActionText: '', ActionFun: null, personIdToDelete: '',
        PersonID: '', Closeness: '', FirstName: '', LastName: this.props.LastName, DateOfBirth: null, Sex: '', Situation: '', immigrant: null,
        Origin: null, Age: '', OpeningDate: '', DateOfBirthToServer: null,
    }
    cancel = () => { this.setState({ popup: null }) }
    componentDidMount() {
        this.setState({ famelyArray: this.props.araayFamely })
        if (this.props.araayFamely.length > 0) { this.setState({ displayMainTable: true }) }
    }

    addPerson = (PersonID, Closeness, Situation, Sex, FirstName, LastName, DateOfBirth, Origin, immigrant) => {
        let FamArray = [...this.state.famelyArray]
        FamArray.unshift({
            PersonID: PersonID, Closeness: Closeness, FirstName: FirstName, LastName: LastName, DateOfBirth: DateOfBirth,
            Sex: Sex, Origin: Origin, immigrant: immigrant, OpeningDate: this.time(), Situation: Situation
        });
        this.setState({ famelyArray: FamArray })
        let NumKids = FamArray.filter(x => x.Closeness === 'ילד')
        this.props.Famely(FamArray, NumKids.length)
    }

    updatePerson = (ID, PersonID, Closeness, Situation, Sex, FirstName, LastName, DateOfBirth, Origin, immigrant) => {
        let FamArray = [...this.state.famelyArray];
        for (let i in FamArray) {
            if (FamArray[i].PersonID === ID) {
                FamArray[i].PersonID = PersonID
                FamArray[i].Closeness = Closeness
                FamArray[i].FirstName = FirstName
                FamArray[i].LastName = LastName
                FamArray[i].DateOfBirth = DateOfBirth
                FamArray[i].Sex = Sex
                FamArray[i].Origin = Origin
                FamArray[i].immigrant = immigrant
                FamArray[i].Situation = Situation
                this.setState({ famelyArray: FamArray })
                let NumKids = FamArray.filter(x => x.Closeness === 'ילד')
                this.props.Famely(FamArray, NumKids.length)
                break;
            }
        }
    }

    deletePerson = () => {
        const ID = this.state.personIdToDelete;
        let FamArray = [...this.state.famelyArray];
        FamArray = FamArray.filter(x => x.PersonID !== ID)
        this.setState({ famelyArray: FamArray })
        let NumKids = FamArray.filter(x => x.Closeness === 'ילד')
        this.props.Famely(FamArray, NumKids.length)
        this.setState({ personIdToDelete: '' })
        if (FamArray.length === 0) { this.setState({ displayMainTable: false }) }
    }

    time = () => {
        const today = new Date();
        const dd = checkTime(today.getDate());
        const mm = checkTime(today.getMonth() + 1)
        const yyyy = today.getFullYear();
        function checkTime(i) { if (i < 10) { i = "0" + i; } return i; }
        const dateTime = mm + '/' + dd + '/' + yyyy
        return dateTime
    }
    // *********************************** 0**********************
    clearingFields = () => {
        this.setState({
            PersonID: '', Closeness: '', FirstName: '', LastName: this.props.LastName, DateOfBirth: null, Sex: '', Situation: '', immigrant: null,
            Origin: null, Age: '', OpeningDate: '', DateOfBirthToServer: null
        })
    }
    //  ***************************** updte **********************************************************************

    handleChangeSex = (event) => { this.setState({ Sex: event.target.value }) }
    handleChangeCloseness = (event) => { this.setState({ Closeness: event.target.value }) }

    GetAge = date => {
        if (date === null) { return '' }
        else {
            const birth = new Date(date);
            const dd = checkTime(birth.getDate());
            const mm = checkTime(birth.getMonth() + 1)
            const yyyy = birth.getFullYear();
            function checkTime(i) { if (i < 10) { i = "0" + i; } return i; }
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
                if (age < 0) { }
                else {
                    return age;
                }
            }
            const numAge = calculate_age(dd, mm, yyyy)
            return numAge
        }
    }

    handleDateChange = date => {
        this.setState({ DateOfBirth: date })
        if (date === null) {
            this.setState({ DateOfBirthToServer: null, Age: '' })
        }
        else {
            if (date.toString() !== 'Invalid Date') {
                this.setState({ Age: this.GetAge(date), DateOfBirthToServer: date })
            }
        }
    };

    immigrant = date => { this.setState({ immigrant: date }) }
    Situation = e => { this.setState({ Situation: e.target.checked }) }
    PersonID = e => { this.setState({ PersonID: e.target.value }) }
    FirstName = e => { this.setState({ FirstName: e.target.value }) }
    LastName = e => { this.setState({ LastName: e.target.value }) }

    numFun = value => {
        let numValue = Number(value)
        if (numValue > 0) { return numValue } else { return '' }
    }
    inputStyle = { fontSize: '17px', textAlign: 'center', padding: '0px', display: 'inline-block', width: '102px' }
    selectStyle = { fontSize: '17px', textAlign: 'center', padding: '0.5px', display: 'inline-block', width: '60px' }

    renderTableHeader() {
        let header = ['פעולה', 'פעיל', 'ת.ז', 'קירבה', 'מין', 'שם פרטי', 'שם משפחה', 'תאריך לידה', 'גיל', 'מוצא', 'תאריך עליה', 'פתיחת כרטיס']
        return header.map((head, index) => {
            return <th key={index}>{head}</th>
        })
    }

    getOnePersonDataToUpdate(onePerson) {
        this.setState({
            PersonID: onePerson.PersonID, Closeness: onePerson.Closeness, FirstName: onePerson.FirstName,
            LastName: onePerson.LastName, OpeningDate: onePerson.OpeningDate, editing: true, DateOfBirth: onePerson.DateOfBirth,
            DateOfBirthToServer: onePerson.DateOfBirth, Age: this.GetAge(onePerson.DateOfBirth), Sex: onePerson.Sex,
            Situation: onePerson.Situation
        });
        if (onePerson.immigrant === null) { }
        else { this.setState({ immigrant: onePerson.immigrant }); }
        if (onePerson.Origin === null || onePerson.Origin === undefined) { } else {
            this.setState({ states: [{ שם_ארץ: onePerson.Origin }] })
            this.setState({ Origin: { שם_ארץ: onePerson.Origin } });
        }
    }

    fixOrigin = Origin => { if (Origin === null || Origin === undefined) { return null } else { return Origin.שם_ארץ } }
    GetOrigin = Origin => { if (Origin === null || Origin === undefined) { return '' } else { return Origin } }

    renderTableDataUpdate = () => {
        return this.state.famelyArray.map((person, index) => {
            if (person.PersonID === this.state.onePerson.PersonID) {
                return (
                    <tr key={index}>
                        <td>
                            <Button variant="contained"
                                style={{ color: 'green' }}
                                onClick={() => {
                                    this.updatePerson(this.numFun(person.PersonID), this.state.PersonID, this.state.Closeness, this.state.Situation, this.state.Sex,
                                        this.state.FirstName, this.state.LastName, this.state.DateOfBirthToServer, this.fixOrigin(this.state.Origin),
                                        this.state.immigrant)
                                    this.setState({ displayMainTable: true, addButton: true, editing: false })
                                }}
                            ><i className="far fa-check-circle"></i></Button>
                            <Button variant="contained"
                                style={{ color: 'red' }}
                                onClick={() => {
                                    this.setState({ displayMainTable: true, addButton: true, editing: false })
                                }} >   <i className="fas fa-times"></i> </Button>
                        </td>
                        <td>
                            <div className="group">
                                <label className='labelCheckbox'></label>
                                <input style={{ width: '15px' }} type="checkbox" checked={this.state.Situation} onChange={this.Situation} required />
                            </div>
                        </td>
                        <td>
                            <input className='inputFam' placeholder={'תעודת זהות'} style={this.inputStyle} readOnly value={person.PersonID} dir='rtl' type="number" required />
                        </td>
                        <td>
                            <select style={this.selectStyle} value={this.state.Closeness} onChange={this.handleChangeCloseness}>
                                <option disabled hidden value="">בחר</option><option value='ילד'>ילד</option><option value='בן זוג'>בן זוג</option></select>
                        </td>
                        <td>
                            <select style={this.selectStyle} value={this.state.Sex} onChange={this.handleChangeSex}>
                                <option disabled hidden value="">בחר</option><option value='זכר'>זכר</option><option value='נקבה'>נקבה</option></select>
                        </td>
                        <td>
                            <input className='inputFam' style={this.inputStyle} value={this.state.FirstName} placeholder={'פרטי'} onChange={this.FirstName} type="text" required />
                        </td>
                        <td>
                            <input className='inputFam' style={this.inputStyle} value={this.state.LastName} placeholder={'משפחה'} onChange={this.LastName} type="text" required />
                        </td>
                        <td>
                            <div className={'DatePicker'} >
                                <MuiPickersUtilsProvider utils={DateFnsUtils} ><KeyboardDatePicker
                                    format="dd/MM/yyyy" placeholder={'תאריך לידה'} value={this.state.DateOfBirth} onChange={this.handleDateChange} style={{ width: '123px', right: '0', padding: '0 0 0 0' }} /></MuiPickersUtilsProvider>
                            </div>
                        </td>
                        <td>
                            <input placeholder={'גיל'} disabled style={{ fontSize: '17px', padding: '0px', textAlign: 'center', display: 'inline-block', width: '33px' }} value={this.state.Age} dir='rtl' type="text" />
                        </td>
                        <td>
                            <div id='AutocompleteOrigin' className="group">
                                <Autocomplete
                                    value={this.state.Origin}
                                    className="Autocomplete"
                                    onChange={(e, value) => {
                                        if (value === null || value === '' || value === []) {
                                            this.setState({ Origin: null });
                                        }
                                        else {
                                            this.setState({ Origin: value });
                                        }
                                    }}
                                    options={this.state.states}
                                    getOptionSelected={option => option.שם_ארץ}
                                    getOptionLabel={option => option.שם_ארץ}
                                    style={{ width: '130px' }}
                                    renderInput={params => <TextField
                                        onChange={e => {
                                            if (e.target.value === '') {
                                            }
                                            else {
                                                axios.post('/GetStates/', { שם_ארץ: { $regex: e.target.value } })
                                                    .then(city => {
                                                        this.setState({ states: city.data });
                                                    })
                                                    .catch(function (error) {
                                                    })
                                            }
                                        }}
                                        {...params} label="מוצא" />}
                                />
                            </div>
                        </td>
                        <td>
                            <div className={'DatePicker'} >
                                <MuiPickersUtilsProvider utils={DateFnsUtils} ><KeyboardDatePicker placeholder={'תאריך עליה'}
                                    format="dd/MM/yyyy" value={this.state.immigrant} style={{ width: '123px', right: '0' }} onChange={this.immigrant} /></MuiPickersUtilsProvider>
                            </div>
                        </td>
                        <td>
                            <input disabled style={{ fontSize: '17px', padding: '0px', textAlign: 'center', display: 'inline-block', width: '90px' }} value={this.state.OpeningDate} dir='rtl' type="text" required />
                        </td>
                    </tr>
                )
            } else {
                return (
                    <tr key={index}>
                        <td>
                        </td>
                        <td>
                            <div className="group">
                                <label className='labelCheckbox'></label>
                                <input disabled style={{ width: '15px' }} type="checkbox" checked={person.Situation} onChange={this.Situation} required />
                            </div>
                        </td>
                        <td>
                            <input disabled placeholder={'תעודת זהות'} style={this.inputStyle} value={person.PersonID} onChange={this.PersonID} dir='rtl' type="text" required />
                        </td>

                        <td>
                            <select disabled style={this.selectStyle} value={person.Closeness} onChange={this.handleChangeCloseness}>
                                <option disabled hidden value="">בחר</option><option value='ילד'>ילד</option><option value='בן זוג'>בן זוג</option></select>
                        </td>
                        <td>
                            <select disabled style={this.selectStyle} value={person.Sex} onChange={this.handleChangeSex}>
                                <option disabled hidden value="">בחר</option><option value='זכר'>זכר</option><option value='נקבה'>נקבה</option></select>
                        </td>
                        <td>
                            <input disabled style={this.inputStyle} value={person.FirstName} placeholder={'פרטי'} onChange={this.FirstName} type="text" required />
                        </td>
                        <td>
                            <input disabled style={this.inputStyle} value={person.LastName} placeholder={'משפחה'} onChange={this.LastName} type="text" required />
                        </td>
                        <td>
                            <div className={'DatePicker'} >
                                <MuiPickersUtilsProvider utils={DateFnsUtils} ><KeyboardDatePicker disabled
                                    format="dd/MM/yyyy" placeholder={'תאריך לידה'} value={person.DateOfBirth} onChange={this.handleDateChange} style={{ width: '123px', right: '0', padding: '0 0 0 0' }} /></MuiPickersUtilsProvider>
                            </div>
                        </td>
                        <td>
                            <input placeholder={'גיל'} disabled style={{ fontSize: '17px', padding: '0px', textAlign: 'center', display: 'inline-block', width: '33px' }} value={this.GetAge(person.DateOfBirth)} dir='rtl' type="text" />
                        </td>
                        <td>
                            <input disabled style={{ fontSize: '17px', padding: '0px', textAlign: 'center', display: 'inline-block', width: '100px' }} placeholder={'מוצא'} value={person.Origin} type="text" required />
                        </td>
                        <td>
                            <div className={'DatePicker'} >
                                <MuiPickersUtilsProvider utils={DateFnsUtils} ><KeyboardDatePicker disabled placeholder={'תאריך עליה'}
                                    format="dd/MM/yyyy" value={person.immigrant} style={{ width: '123px', right: '0' }} onChange={this.immigrant} /></MuiPickersUtilsProvider>
                            </div>
                        </td>
                        <td>
                            <input disabled style={{ fontSize: '17px', padding: '0px', textAlign: 'center', display: 'inline-block', width: '90px' }} value={person.OpeningDate} dir='rtl' type="text" required />
                        </td>
                    </tr>
                )
            }
        })
    }

    // *************************** add ********************************* add *********************
    oldData = () => {
        if (this.state.famelyArray === undefined || this.state.famelyArray === []) { } else {
            return this.state.famelyArray.map((person, index) => {
                return (
                    <tr key={index}>
                        <td>
                            <Button variant="contained"
                                style={{ color: 'blue' }}
                                onClick={() => {
                                    this.clearingFields()
                                    this.setState({ displayMainTable: false, addButton: false, onePerson: person })
                                    this.getOnePersonDataToUpdate(person)
                                }}
                            >  <i className="fas fa-user-edit"></i>
                            </Button>
                            <Button variant="contained"
                                style={{ color: 'red' }}
                                onClick={() => {
                                    this.setState({ QuestionText: `האם אתה בטוח שברצונך למחוק את ${person.PersonID}?`, personIdToDelete: person.PersonID, ActionFun: this.deletePerson, popup: true, ActionText: 'מחק' })
                                }}
                            > <i className="fas fa-user-times"></i>
                            </Button>
                        </td>
                        <td>
                            <div className="group">
                                <label className='labelCheckbox'></label>
                                <input disabled style={{ width: '15px' }} type="checkbox" checked={person.Situation} onChange={this.Situation} required />
                            </div>
                        </td>
                        <td>
                            <input disabled placeholder={'תעודת זהות'} style={this.inputStyle} value={person.PersonID} onChange={this.PersonID} dir='rtl' type="text" required />
                        </td>

                        <td>
                            <select disabled style={this.selectStyle} value={person.Closeness} onChange={this.handleChangeCloseness} required>
                                <option disabled hidden value="">בחר</option><option value='ילד'>ילד</option><option value='בן זוג'>בן זוג</option></select>
                        </td>
                        <td>
                            <select disabled style={this.selectStyle} value={person.Sex} onChange={this.handleChangeSex} required>
                                <option disabled hidden value="">בחר</option><option value='זכר'>זכר</option><option value='נקבה'>נקבה</option></select>
                        </td>
                        <td>
                            <input disabled style={this.inputStyle} value={person.FirstName} placeholder={'פרטי'} onChange={this.FirstName} type="text" required />
                        </td>
                        <td>
                            <input disabled style={this.inputStyle} value={person.LastName} placeholder={'משפחה'} onChange={this.LastName} type="text" required />
                        </td>
                        <td>
                            <div className={'DatePicker'} >
                                <MuiPickersUtilsProvider utils={DateFnsUtils} ><KeyboardDatePicker disabled
                                    format="dd/MM/yyyy" placeholder={'תאריך לידה'} value={person.DateOfBirth} onChange={this.DateOfBirth} style={{ width: '123px', right: '0', padding: '0 0 0 0' }} /></MuiPickersUtilsProvider>
                            </div>
                        </td>
                        <td>
                            <input placeholder={'גיל'} disabled style={{ fontSize: '17px', padding: '0px', textAlign: 'center', display: 'inline-block', width: '33px' }} value={this.GetAge(person.DateOfBirth)} dir='rtl' type="text" />
                        </td>
                        <td>
                            <input disabled style={{ fontSize: '17px', padding: '0px', textAlign: 'center', display: 'inline-block', width: '100px' }} placeholder={'מוצא'} value={this.GetOrigin(person.Origin)} type="text" required />
                        </td>
                        <td>
                            <div className={'DatePicker'} >
                                <MuiPickersUtilsProvider utils={DateFnsUtils} ><KeyboardDatePicker disabled placeholder={'תאריך עליה'}
                                    format="dd/MM/yyyy" value={person.immigrant} style={{ width: '123px', right: '0' }} onChange={this.immigrant} /></MuiPickersUtilsProvider>
                            </div>
                        </td>
                        <td>
                            <input disabled style={{ fontSize: '17px', padding: '0px', textAlign: 'center', display: 'inline-block', width: '90px' }} value={person.OpeningDate} dir='rtl' type="text" />
                        </td>
                    </tr>
                )
            })
        }
    }
    // ********
    newRoot  = () => {
        return (
            <tr key={'add'}>
                <td>

                    <Button variant="contained"
                        style={{ color: 'green' }}
                        onClick={() => {
                            if (this.state.PersonID === '' || this.state.FirstName === '') { alert('לא ניתן להוסיף בן משפחה ללא ת.ז או ללא שם פרטי') }
                            else {
                                let check = this.state.famelyArray.filter(x => x.PersonID === this.numFun(this.state.PersonID))
                                if (check.length < 1) {
                                    this.addPerson(this.numFun(this.state.PersonID), this.state.Closeness, this.state.Situation, this.state.Sex,
                                        this.state.FirstName, this.state.LastName, this.state.DateOfBirthToServer, this.state.Origin, this.state.immigrant)
                                    this.clearingFields()
                                    this.setState({ newRoot : false, addButton: true })
                                }
                                else { alert('כבר קיים בן משפחה עם ת.ז זו') }
                            }
                        }}
                    ><i className="far fa-check-circle"></i></Button>
                    <Button variant="contained"
                        style={{ color: 'red' }}
                        onClick={() => {
                            this.setState({ displayMainTable: false, addButton: true, editing: false })
                        }} >   <i className="fas fa-times"></i> </Button>
                </td>
                <td>
                    <div className="group">
                        <label className='labelCheckbox'></label>
                        <input style={{ width: '15px' }} type="checkbox" checked={this.state.Situation} onChange={this.Situation} required />
                    </div>
                </td>
                <td>
                    <input className='inputFam' placeholder={'תעודת זהות'} style={this.inputStyle} value={this.state.PersonID} onChange={this.PersonID} dir='rtl' type="number" required />
                </td>
                <td>
                    <select style={this.selectStyle} value={this.state.Closeness} onChange={this.handleChangeCloseness}>
                        <option disabled hidden value="">בחר</option><option value='ילד'>ילד</option><option value='בן זוג'>בן זוג</option></select>
                </td>
                <td>
                    <select style={this.selectStyle} value={this.state.Sex} onChange={this.handleChangeSex}>
                        <option disabled hidden value="">בחר</option><option value='זכר'>זכר</option><option value='נקבה'>נקבה</option></select>
                </td>
                <td>
                    <input className='inputFam' style={this.inputStyle} value={this.state.FirstName} placeholder={'פרטי'} onChange={this.FirstName} type="text" required />
                </td>
                <td>
                    <input className='inputFam' style={this.inputStyle} value={this.state.LastName} placeholder={'משפחה'} onChange={this.LastName} type="text" required />
                </td>
                <td>
                    <div className={'DatePicker'} >
                        <MuiPickersUtilsProvider utils={DateFnsUtils} ><KeyboardDatePicker
                            format="dd/MM/yyyy" placeholder={'תאריך לידה'} value={this.state.DateOfBirth} onChange={this.handleDateChange} style={{ width: '123px', right: '0', padding: '0 0 0 0' }} /></MuiPickersUtilsProvider>
                    </div>
                </td>
                <td>
                    <input placeholder={'גיל'} disabled style={{ fontSize: '17px', padding: '0px', textAlign: 'center', display: 'inline-block', width: '33px' }} value={this.state.Age} dir='rtl' type="text" />
                </td>
                <td>
                    <div id='AutocompleteOrigin' className="group">
                        <Autocomplete
                            className="Autocomplete"
                            onChange={(e, value) => {
                                if (value === null || value === '' || value === []) {
                                    this.setState({ Origin: null });
                                }
                                else {
                                    this.setState({ Origin: value.שם_ארץ });
                                }
                            }
                            }
                            options={this.state.states}
                            getOptionLabel={option => option.שם_ארץ}
                            style={{ width: '130px' }}
                            renderInput={params => <TextField
                                onChange={e => {
                                    if (e.target.value === '') { }
                                    else {
                                        axios.post('/GetStates/', { שם_ארץ: { $regex: e.target.value } })
                                            .then(city => {
                                                this.setState({ states: city.data });
                                            })
                                            .catch()
                                    }
                                }}
                                {...params} label="מוצא" />}
                        /> </div>
                </td>
                <td>
                    <div className={'DatePicker'} >
                        <MuiPickersUtilsProvider utils={DateFnsUtils} ><KeyboardDatePicker placeholder={'תאריך עליה'}
                            format="dd/MM/yyyy" value={this.state.immigrant} style={{ width: '123px', right: '0' }} onChange={this.immigrant} /></MuiPickersUtilsProvider>
                    </div>
                </td>
                <td>
                    <input disabled style={{ fontSize: '17px', padding: '0px', textAlign: 'center', display: 'inline-block', width: '90px' }} value={this.state.OpeningDate} dir='rtl' type="text" required />
                </td>
            </tr>
        )
    }
    Under21 = () => {
        if (this.state.famelyArray === undefined || this.state.famelyArray === [] || this.state.famelyArray.length === 0) {
        }
        else {
            let NumLittle = this.state.famelyArray.filter(x => x.Closeness === 'ילד' & this.GetAge(x.DateOfBirth) < 21)
            return (
                <div style={{ display: 'inline-block', marginRight: '10px' }}>
                    <p style={{ display: 'inline-block', marginLeft: '5px', marginRight: '5px' }}>סה"כ ילדים מתחת לגיל 21:  </p>
                    <span>{NumLittle.length}</span>
                    <p style={{ display: 'inline-block', marginLeft: '5px', marginRight: '5px' }}>סה"כ בני משפחה   :  </p>
                    <span>{this.state.famelyArray.length}</span>
                </div>)
        }
    }

    render() {
        return (
            <div className='Family'>
                {this.state.addButton &&
                    <Button variant="contained"
                        onClick={() => {
                            this.clearingFields();
                            this.setState({ newRoot : true, displayMainTable: true, addButton: false, Situation: true })
                        }}><i className="fas fa-user-plus"></i></Button>}
                {this.state.displayMainTable && this.Under21()}
                {this.state.editing && <table className='Update tablePersons' >
                    <tbody>
                        <tr>
                            {this.renderTableHeader()}
                        </tr>
                        {this.renderTableDataUpdate()}
                    </tbody>
                </table>}
                {this.state.displayMainTable && <table className='add tablePersons' >
                    <tbody>
                        <tr>
                            {this.renderTableHeader()}
                        </tr>
                        {this.state.newRoot  && this.newRoot ()}
                        {this.oldData()}
                    </tbody>
                </table>}
                {this.state.popup && <GeneralPopup QuestionText={this.state.QuestionText} ActionText={this.state.ActionText} cancel={this.cancel} ActionFun={this.state.ActionFun} />}
            </div>
        );
    }
}

export default Famely;