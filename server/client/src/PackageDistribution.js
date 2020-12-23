import React, { Component } from 'react'
import './Persons.css';
import axios from "axios";
import cleaner from 'deep-cleaner'
import MenuItem from '@material-ui/core/MenuItem';
import './PackageDistribution.css'
import Button from '@material-ui/core/Button';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import QrReader from 'react-qr-reader';
import { Redirect } from 'react-router-dom';
import Alert from './Alert';

class PackageDistribution extends Component {

  state = { 
     data: [],
      PersonID: '', navigaToHome:false,
       res: undefined, 
       Holidays:undefined,
       oneHoliday:undefined,
       SelHolidays:'',
       HolidaysList:[],
       UpdateInformation:undefined,
       valueHoliday:null,
       OneHolidayToUpdate:undefined,
       result: undefined,
       ShowQrReader: false,
       Showinputs:false,
       buttonShowQrReader:true,
       User:null,
       Showbuttoninputs:true
       ,Alert:null,colorAlert:'',header:'',AlertText:'',icon:''
      }

      ALert = (colorAlert,AlertText,icon,header) => {
        this.setState({Alert:true,colorAlert:colorAlert,header:header,AlertText:AlertText,icon:icon})
      }
      cancelAlert = () => { this.setState({ Alert:null })}

      handleScan = data => {
        const config = {headers: { Authorization: `Bearer ${this.props.User.Token}` }};
        if (data) {
          this.setState({
            result: data,
            ShowQrReader: false
          })
          axios.post('/find',
          this.SearchScan(data), config )
       .then(r => {
        //  console.log(r.data,'data')
         if (r.data.length < 1){
          ALert('Alertred','אין תוצאות מתאימות','fas fa-exclamation-circle','שגיאה')
          //  alert('שגיאה  - אין תוצאות מתאימות')
           this.setState({result:undefined})
         } else {
           this.setState({ res: this.finddataScan(r.data) });
           this.setState({ UpdateInformation :r.data});
          //  this.setState({OneHolidayToUpdate: r.data.q})
         }
       })
       .catch(function (error) {
        //  console.log(error);
       })

        }
      }
      handleError = err => {
        console.error(err)
      }

      finddataScan = (peoplel) => {
        return peoplel.map((people, index) => {
          // var findHolidays = people.Holidays.find(x => x.DateOFHoliday === this.state.OneHolidayToUpdate)
          // let PackageType = '';
          // if (findHolidays !== undefined){PackageType = findHolidays.PackageType }   
          // console.log(findHolidays,'New2')
          return (
            <div style={{
              backgroundColor: 'burlywood',
              margin: 'auto',
              width: '30vw',
              padding: '1.5vw',
              textAlign: 'center',
              border: '2px double brown',
              minWidth: '330px'
            }}
            key={index}
              > 
              <h2 style={{marginBottom:'0px'}}>האם ברצונך לעדכן איסוף חבילה?</h2>
          {/* <h3>שים לב! סוג החבילה היא : {'  '+  PackageType}</h3> */}
                    {/* <table className='table'>
            <tbody>
              <tr>
                <td>ת.ז</td>
                <td>{people.PersonID}</td>
              </tr>
              <tr>
                <td>שם פרטי</td>
          <td>{people.FirstName}</td>
              </tr>
              <tr>
              <td>שם משפחה</td>
          <td>{people.LastName}</td>
              </tr>
              <tr>
              <td>מין</td>
          <td>{people.Sex}</td>
              </tr>
            </tbody>
          </table> */}
          <div style={{height: '36px',margin: '26px auto 0'}}>
          <Button style={{float:'right'}} variant="contained"
              onClick={() => {
                this.TestDataScan(people.PersonID)
              }}>כן</Button>
          <Button style={{float:'left'}} variant="contained"
              onClick={() => {
              //  alert('נא הקלד מחדש את הנתונים')
            this.setState({ PersonID: '' ,buttonShowQrReader:true, oneHoliday:'', valueHoliday:null, res:undefined});
              }}>לא</Button>
              </div>
            </div>
          )
        })
      }
         // var query = {
    //    PersonID: 771,
    //     Holidays: { '$elemMatch': { 'DateOFHoliday': '21/05/2020' } }
    //    }
    LastHoliday =()=>{
      axios.get('/LastHoliday')
          .then(res => {
            this.setState({HolidaysList: res.data });
            // console.log(res.data);
          })
          .catch(function (error) {
            // console.log(error);
          })
    }
  componentDidMount() {
    
    // axios.get('/people')
    //   .then(res => {
    //     this.setState({ data: res.data });
    //   })
    //   .catch(function (error) {
    //     console.log(error);
    //   })

this.LastHoliday()
  }

  componentDidUpdate() { if (!this.props.User) { this.setState({ User: true }) }    }
  

  TestDataScan = (PersonID) =>{
    const config = {headers: { Authorization: `Bearer ${this.props.User.Token}` }};
    let ALert = this.ALert
    var New = this.state.UpdateInformation.find(x => x.PersonID === PersonID)
    // let HolidaysSelect = this.state.HolidaysList
    // let NewHoliday = HolidaysSelect.find(x => x.id === this.state.SelHolidays)
    var New2 = New.Holidays.find(x => x.DateOFHoliday === this.state.OneHolidayToUpdate)
    if (New2.Status === true) {
      ALert('Alertred','כבר דווח במערכת על לקיחה','fas fa-exclamation-circle','אזהרה')
      // alert('כבר דווח במערכת על לקיחה')
      this.setState({ PersonID: '' });
      this.setState({ SelHolidays:''});
      this.setState({ res:undefined});
    }
    else {
            New2.Status = true;
            New2.timeOfHasTaken = this.props.Newtime();
            // console.log(New.Holidays,New._id)
            const url = `${'./people/'}${New._id}`;
            axios.put(url, {
             Holidays:New.Holidays
           },config)
           .then(response=> {
             if (response.status === 200) {
              ALert('Alertgreen','עודכן בהצלחה','far fa-thumbs-up')
              // alert('עודכן בהצלחה');
              this.setState({ PersonID: '' });
              this.setState({ SelHolidays:''});
              this.setState({ res:undefined});
              // console.log( response.status);
             }
             else {
              //  console.log(`status is not 200 : ${response.status}`);
             }    
           })
           .catch(function (error) {
            //  console.log(error);
           });
          }
  }
  finddata = (peoplel) => {
    this.setState({Showinputs:false})
    return peoplel.map((people, index) => {
      return (
        <div style={{
          backgroundColor: 'burlywood',
          margin: 'auto',
          width: '30vw',
          padding: '1.5vw',
          textAlign: 'center',
          border: '2px double brown'
        }}
        key={index}
          > 
          <h2 style={{marginBottom:'0px'}}>האם ברצונך לעדכן איסוף חבילה?</h2>
      <div style={{height: '36px',margin: '26px auto 0'}}>
      <Button style={{float:'right'}} variant="contained"
          onClick={() => {
            this.TestData()
          }}>כן</Button>
      <Button style={{float:'left'}} variant="contained"
          onClick={() => {
          //  alert('נא הקלד מחדש את הנתונים')
        this.setState({ PersonID: '' });
        this.setState({ oneHoliday:''});
        this.setState({valueHoliday:null})
        this.setState({ res:undefined});
          }}>לא</Button>
          </div>

        </div>
      )
    })
  }
  numFun = (value)=>{
    var numValue = Number(value)
    if (numValue > 0) {return numValue}else {return ''}
   }
  PersonID = (event) => {this.setState({PersonID : this.numFun(event.target.value)})}
   handleChange = (event) => {
    let HolidaysSelect = this.state.HolidaysList
    let NewHoliday = HolidaysSelect.find(x => x.id === event.target.value)
    this.setState({SelHolidays: event.target.value})
  if (NewHoliday === '' || NewHoliday === undefined || NewHoliday === []){this.setState({oneHoliday:undefined})
  } else {
    let Name = NewHoliday.Name , Y = NewHoliday.Y
    this.setState({oneHoliday:{ Holidays :  {  $elemMatch :  {Name ,Y}  }  }}) 
  }
  }
  renderList() {
    let HolidaysSelect = this.state.HolidaysList
    return HolidaysSelect.map((Holiday, index) => {
    let OneHoliday = Holiday.Name+'-'+Holiday.Y
       return <MenuItem  value={Holiday.id} key={index}>{OneHoliday}</MenuItem>
    })
  }

  // נתונים לחיפוש שרת 
 Search = () => {
   var obj = {
      PersonID:this.state.PersonID, 
      Holidays:this.state.oneHoliday 
    }
      this.setState({OneHolidayToUpdate: this.state.oneHoliday.Holidays.$elemMatch })
if (this.state.oneHoliday === undefined){}else{obj.Holidays = obj.Holidays.Holidays}
cleaner(obj);
return obj;
 } 

 SearchScan = (data) => {
   var Scan = JSON.parse(data);
  //  console.log(Scan);
   this.setState({OneHolidayToUpdate : Scan.DateOFHoliday})
  var obj = {
     PersonID: Scan.PersonID, 
     Holidays:{ '$elemMatch': { 'DateOFHoliday': Scan.DateOFHoliday } }
   }
  //  console.log('hy');
cleaner(obj);
return obj;
}

    TestData = () =>{
      const config = {headers: { Authorization: `Bearer ${this.props.User.Token}` }};
      var New = this.state.UpdateInformation.find(x => x.PersonID === this.state.PersonID)
      let ALert = this.ALert
      var New2 = New.Holidays.find(x => x.Name === this.state.OneHolidayToUpdate.Name & x.Y === this.state.OneHolidayToUpdate.Y)
      if (New2.Status === true) {
      ALert('Alertred','כבר דווח במערכת על לקיחה','fas fa-exclamation-circle','אזהרה')
        this.setState({ PersonID: '' });
        this.setState({ SelHolidays:''});
        this.setState({ res:undefined});
      }
      else {
              New2.Status = true;
              New2.timeOfHasTaken = this.props.Newtime();
              const url = `${'./people/'}${New._id}`;
              axios.put(url, {
               Holidays:New.Holidays
             },config)
             .then(response=> {
               if (response.status === 200) {
              ALert('Alertgreen','עודכן בהצלחה','far fa-thumbs-up')
                this.setState({ PersonID: '' });
                this.setState({ SelHolidays:''});
                this.setState({ res:undefined});
               }
               else {
               }    
             })
             .catch(function (error) {
             });
            }
    }

   isDisabled = () => {return (this.state.PersonID === '' ||this.state.PersonID === undefined || this.state.oneHoliday===null || this.state.oneHoliday===undefined)} 
 
   render() {
 const disabled = this.isDisabled();
 if (this.state.User) { return <Redirect to='./'/> }    

    return (
      <div style={{padding:'2vw'}}>
       <div style={{ width: 'fit-content',margin: 'auto', padding: '15px' }}>

</div>
       <div className='PackageDistribution'>
       <h2>עדכון חבילת חג</h2>
       {this.state.ShowQrReader && <QrReader
          delay={300}
          onError={this.handleError}
          onScan={this.handleScan}
          style={{ width: '100%' }}
          showViewFinder={true}
        />
      }
        {this.state.buttonShowQrReader && <button onClick={()=>{this.setState({Showbuttoninputs:true,ShowQrReader:true,Showinputs:null,buttonShowQrReader:false})}}>הפעל סריקה</button>}
<br/>
<br/>
<br/>
{this.state.Showinputs && <div>
        <input placeholder='ת.ז' type="number" value={this.state.PersonID} onChange={this.PersonID} required></input><br></br>
             <div id='AutocompleteCity' className="group">
    <Autocomplete
      className="Autocomplete"
      value={this.state.valueHoliday}
        onChange={(e,value) => {
          if (value === null || value === '' || value === []){
            this.setState({oneHoliday: undefined});
          }
          else {
            var Name = value.Name, Y = value.Y
            this.setState({oneHoliday:{ Holidays :  { '$elemMatch' : { Name, Y } } }})
            this.setState({valueHoliday: value});
          }
    }
    } 
      options={this.state.HolidaysList}
      getOptionLabel={option => option.Name + ' - ' + option.Y}
      style={{ width: '130px' }}
      renderInput={params => <TextField 
        onChange={ e=>{ 
          if (e.target.value === ''){
            this.LastHoliday()
          }
          else {
          axios.get('/Holiday/' ,  {$regex: e.target.value })
          .then(H =>  {
          this.setState({HolidaysList: H.data });})
            .catch(function (error) {
            this.setState({HolidaysList: []});
            })
        }
          }}
        {...params} label="בחר חג" />}
    /> </div>

      <Button style={{margin:'30px auto',display: 'block',backgroundColor:'gray'}}
       disabled={disabled}
            onClick={() => {
              let ALert = this.ALert
              const config = {headers: { Authorization: `Bearer ${this.props.User.Token}` }};
              axios.post('/find',
               this.Search() ,config)
            .then(r => {
              if (r.data.length < 1){
          ALert('Alertred','אין תוצאות מתאימות','fas fa-exclamation-circle','שגיאה')
                this.setState({ PersonID: '' });
                this.setState({ oneHoliday:''});
                this.setState({valueHoliday:null})
              } else {
                this.setState({ res: this.finddata(r.data) });
                this.setState({ UpdateInformation :r.data});
              }
            })
            .catch(function (error) {
            })
        }}> <i style={{color:'darkblue'}} className="fas fa-search"></i></Button>
       </div> }
       {this.state.Showbuttoninputs && <button onClick={()=>{this.setState({Showinputs:true,ShowQrReader:null, Showbuttoninputs:false,buttonShowQrReader:true})}}>עידכון ידני</button>}
       
        </div><br/><br/>

        {this.state.res && this.state.res}
        <div style={{height:'100px'}}></div>
{this.state.Alert && <Alert colorAlert={this.state.colorAlert} header={this.state.header} cancelAlert={this.cancelAlert} AlertText={this.state.AlertText}  icon={this.state.icon}/>}

      </div>
    )
  }
}
export default PackageDistribution;