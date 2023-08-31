import '../src/style.css'
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    // const [token, setToken] = useState('');
    const navigate = useNavigate();
    const handleLogin = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('username', userName);
        formData.append('password', password);
        try {
            const response = await axios.post('http://172.16.0.212:3300/login', formData);
            const responseData = response.data;
            localStorage.setItem('access_token', responseData.access_token);
            navigate('/Dashboard')
        }
        catch (error) {
            console.error('Error:', error);
        }
    };
    return (
        <section className="align-items-center justify-content-center d-flex flex-column login-all-bg vh-100">
            <div className="container">
                <div className="row">
                    <div className="col-md-6 col-lg-5 col-xl-5 m-auto">
                        <div className="card">
                            <div className="card-body p-5">
                                <div className="row">
                                    <div className="col-md-12 text-center mb-4">
                                        <h1 className="mb-0">Retention Dashboard</h1>
                                    </div>
                                </div>
                                <form>
                                    <div className="mb-3">
                                        <label className="form-label login-u-p">Username</label>
                                        <input onChange={(e) => setUserName(e.target.value)} required id='username' name='username' type="text" className="form-control" placeholder="Enter username"></input>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label login-u-p">Password</label>
                                        <div className="position-relative">
                                            <input onChange={(e) => setPassword(e.target.value)} required id='password' name='password' type="password" className="form-control" placeholder="Enter your password"></input>
                                            <a href="#" className="pass-icon position-absolute top-0 end-0 my-2 me-3"><i id='hideshowpass' className="fa fa-eye-slash"></i></a>
                                        </div>
                                    </div>
                                    <div className="row mt-5 pt-4 mb-4">
                                        <div className="col-md-12">
                                            <button type='btn' className="btn btn-primary w-100" onClick={handleLogin}>Login</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="footer-login position-absolute bottom-0">
                <div className="container text-center">
                    <p className="text-white">© 2023 Revenue Cycle Management Web. All rights reserved.</p>
                </div>
            </div>
        </section>
    );
}
export default Login;

