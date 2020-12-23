import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import "./Login.css";
class Login extends Component {

    state = { ID: '', password: '', RedirectHome: false, iserror: false, division: null, user: null, manager: null, fsw: null }

    componentDidMount() { document.body.addEventListener('keypress', this.UseLoginEnter); }
    componentWillUnmount() { document.body.removeEventListener('keypress', this.UseLoginEnter); }
    UseLoginEnter = e => {
        if (this.state.ID !== '' & this.state.password !== '') {
            if (e.keyCode === 13) {
                this.login()
            }
        }
    }
    login = () => {
        axios
            .post("users/login", {
                ID: this.state.ID,
                password: this.state.password
            })
            .then(res => {
                if (res.status === 200) {
                    this.props.setUser(res.data);
                    sessionStorage.setItem('Token', res.data.Token);
                    sessionStorage.setItem('role', res.data.role);
                    sessionStorage.setItem('nickname', res.data.nickname);
                    this.setState({ RedirectHome: true })
                }
                else {
                    this.setState({ iserror: true })
                }
            }).catch(() => {
                this.setState({ iserror: true })
            })
    }
    render() {
        const disabled = !this.state.ID || !this.state.password;
        if (this.state.RedirectHome) { return <Redirect to='./Home' /> }
        return (
            <div className='Login'>

                <div className="login-wrap">
                    <div className="login-html">
                        <input type="radio" name="tab" className="sign-in" /><label className="tab">ברוכים הבאים</label>
                        <div className="login-form">
                            <div className="sign-in-htm">
                                <form>
                                    <div className="groupLogin">
                                        <label className="label">שם משתמש</label>
                                        <input autoComplete="off" required onChange={e => this.setState({ ID: e.target.value })} type="text" className="input" />
                                    </div>
                                    <div className="groupLogin">
                                        <label className="label">סיסמה</label>
                                        <input autoComplete="off" type="password" required onChange={e => this.setState({ password: e.target.value })} className="input" />
                                    </div>
                                </form>
                                <div className="groupLogin">
                                    {this.state.iserror ? <p style={{ color: 'red' }}>שגיאה באחד הנתונים</p> : ''}
                                    <button className="button" disabled={disabled} onMouseDown={() => { this.login() }}>כניסה</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Login;