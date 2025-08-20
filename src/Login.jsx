import React, { useState, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'
import './Login.css';
import { useNavigate } from 'react-router-dom';

const Login = ({updateUserAndIsLoggedIn}) => {


    const navigate = useNavigate();

    const clientIdRef = useRef(null);
    const clientSecretRef = useRef(null);
    const userIdRef = useRef(null);
    const apiTokenRef = useRef(null);
    var bearerToken = null;
    var instanceUrl = null;
    const [incorrectCredentials, setIncorrectCredentials] = useState(false);

    const checkCred = async (userid, apitoken, clientid,clientSecret) => {
        let areCredentialsCorrect = false;
        const bodyData = `grant_type=password&username=${userid}&password=${apitoken}&client_id=${clientid}&client_secret=${clientSecret}`
        try {
            const response = await fetch(
                `https://login.salesforce.com/services/oauth2/token`,
                {
                    method: "POST",
                    headers: {
                      Accept: "*/*",
                      "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: bodyData,
                }
            );
            const stat = response.status;
            const data = await response.json();
            if (stat === 200) {
                areCredentialsCorrect = true;
                bearerToken = data.access_token;
                instanceUrl = data.instance_url;
            } else {
                setIncorrectCredentials(true);
                areCredentialsCorrect = false;
            }
        } catch (error) {
            setIncorrectCredentials(true);
            areCredentialsCorrect = false;
        }
        return areCredentialsCorrect;
    };

    const handleSave = async (e) => {
        e.preventDefault();
        let isUserLoggedIn = await checkCred(userIdRef.current.value, apiTokenRef.current.value, clientIdRef.current.value, clientSecretRef.current.value);
        if (isUserLoggedIn) {
            chrome.storage.sync.set({
                'sfuserId': userIdRef.current.value,
                'sfapiToken': apiTokenRef.current.value,
                'clientId': clientIdRef.current.value,
                'clientSecret': clientSecretRef.current.value,
                'bearerToken': bearerToken,
                'instanceUrl':instanceUrl,
                'sfisLoggedIn': true
            }, function () {
                e.target.form.reset();
            });
            navigate('/');
            () => updateUserAndIsLoggedIn(userIdRef.current.value, true);
        }
    };

    return (
        <div className='login-container'>
            <div className='login-content'>
                {incorrectCredentials && (
                    <div className='success-message'>Incorrect Login Credentials!</div>
                )}
                <form>
                    <h3>Sign In</h3>
                    <div className='input-group'>
                        <label for="email" className='input-label alignLabel1'>User Id</label>
                        <input type="email" placeholder="Enter Email" className='form-control' ref={userIdRef} required />
                    </div>
                    <div className='input-group'>
                        <label for="password" className='input-label alignLabel2'>API Token</label>
                        <input type="password" placeholder="Enter Password" className='form-control' ref={apiTokenRef} required />
                    </div>
                    <div className='input-group'>
                        <label for="password" className='input-label alignLabel3'>Client ID</label>
                        <input type="password" placeholder="Enter client ID" className='form-control' ref={clientIdRef} required />
                    </div>
                    <div className='input-group'>
                        <label for="password" className='input-label alignLabel3'>Client Secret</label>
                        <input type="password" placeholder="Enter client Secret" className='form-control' ref={clientSecretRef} required />
                    </div>
                    <div className="button-group">
                        <button onClick={handleSave} className="btn btn-primary">Sign in</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;

