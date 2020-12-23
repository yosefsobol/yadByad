import React, { Component } from 'react';
import axios from 'axios'
import "./Register.css";
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';

class Register extends Component {
    state = { ID: '', FirstName: '', User: null, LastName: '', role: '', nickname: '', navigaToHome: false, password: '', iserror: false, RedirectHome: false }
    componentDidMount() { if (!this.props.User) { this.setState({ User: true }) } }
    role = event => { this.setState({ role: event.target.value }) }
    register = () => {
        console.log(this.state.ID, this.state.password)
        this.setState({ iserror: false });
        const config = { headers: { Authorization: `Bearer ${this.props.User.Token}` } };
        axios
            .post("users/register", {
                ID: this.state.ID,
                FirstName: this.state.FirstName,
                LastName: this.state.LastName,
                role: this.state.role,
                nickname: this.state.nickname,
                password: this.state.password
            }, config)
            .then(res => {
                if (res.status === 201) {
                    alert('הרישום בוצע בהצלחה')
                }
                else {
                    this.setState({ iserror: true })
                    console.log(`error code :${res.status}`)
                }
            }).catch(err => {
                this.setState({ iserror: true })
                console.log(err)
            });
    };
    render() {
        const disabled = !this.state.ID || !this.state.password || !this.state.role || !this.state.nickname;
        return (
            <div >
                <div className='Register'>
                    <div className="login-wrap">
                        <div className="login-html">
                            <input type="radio" name="tab" className="sign-in" required /><label className="tab">רישום עובד</label>
                            <div className="login-form">
                                <div className="sign-in-htm">
                                    <div className="groupLogin">
                                        <label className="label">תעודת זהות</label>
                                        <input required onChange={e => this.setState({ ID: e.target.value })} type="number" className="input" />
                                    </div>
                                    <div className="groupLogin">
                                        <label className="label">שם פרטי</label>
                                        <input required onChange={e => this.setState({ FirstName: e.target.value })} type="text" className="input" />
                                    </div>
                                    <div className="groupLogin">
                                        <label className="label">שם משפחה</label>
                                        <input required onChange={e => this.setState({ LastName: e.target.value })} type="text" className="input" />
                                    </div>
                                    <FormControl className='select' style={{ minWidth: "100%", paddingRight: '0' }}><InputLabel>תפקיד</InputLabel>
                                        <Select value={this.state.role} onChange={this.role}><MenuItem value=""><em>בחר תפקיד</em></MenuItem>
                                            <MenuItem value={'מנהלראשי'}>{'מנהל'}</MenuItem><MenuItem value={'מזכירות'}>{'מזכירות'}</MenuItem><MenuItem value={'חלוקת חבילות'}>{'חלוקת חבילות'}</MenuItem></Select></FormControl>
                                    <div className="groupLogin">
                                        <label className="label">כינוי</label>
                                        <input required onChange={e => this.setState({ nickname: e.target.value })} type="text" className="input" />
                                    </div>
                                    <form> <div className="groupLogin">
                                        <label className="label">סיסמה</label>
                                        <input autoComplete='off' required onChange={e => this.setState({ password: e.target.value })} type="password" className="input" />
                                    </div> </form>
                                    <div className="groupLogin">
                                        {this.state.iserror ? <p style={{ color: 'red' }}>הרישום נכשל</p> : ''}
                                        <button className="button" disabled={disabled} onClick={this.register}>רישום</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default Register;

