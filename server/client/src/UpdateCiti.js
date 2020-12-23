import React, { Component } from 'react';
import axios from "axios";
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

class UpdateCiti extends Component {
  state = { Streets: [], Street: null, City: null, Cities: [], NewStreet: '', CityId: '', DleStreet: '' }
  render() {
    return (
      <div>
        <div style={{ width: '600px', margin: 'auto' }}>
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
                  this.setState({ City: value, Streets: value.שם_רחוב, CityId: value._id });
                  console.log(value);
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
                      .catch(function (error) {
                        this.setState({ Cities: [] });
                        // console.log(error);
                      })
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
        <br /><br /><br /><br />
        <input onChange={e => this.setState({ NewStreet: e.target.value })} ></input>
        <br /><br /><br /><br />
        <button onClick={() => {
          let araay = [...this.state.Streets]
          araay.push(this.state.NewStreet);
          const url = `${'./Cities/'}${this.state.CityId}`;
          axios.put(url, { שם_רחוב: araay })
            .then(response => {
              if (response.status === 200) {
                alert('עודכן בהצלחה');
              }
              else {
                console.log(`status is not 200 : ${response.status}`);
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        }

        }>update</button>
        <br /><br /><br /><br />

        <input onChange={e => this.setState({ DleStreet: e.target.value })} ></input>
        <br /><br /><br /><br />

        <button onClick={() => {
          let araay = [...this.state.Streets]
          let araayStreet = araay.filter(x => x !== this.state.DleStreet)
          const url = `${'./Cities/'}${this.state.CityId}`;
          axios.put(url, { שם_רחוב: araayStreet })

            .then(response => {
              if (response.status === 200) {
                alert('עודכן בהצלחה');
              }
              else {
                console.log(`status is not 200 : ${response.status}`);
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        }

        }>מחיקה</button>
      </div>
    );
  }
}

export default UpdateCiti;