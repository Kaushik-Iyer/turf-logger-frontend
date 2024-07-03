import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';
import './style.css';

ReactDOM.render(
    <GoogleOAuthProvider clientId="208336226392-unu2cmbsmc2bb18kisoiujlj8v7opgns.apps.googleusercontent.com">
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </GoogleOAuthProvider>,
    document.getElementById('root')
);