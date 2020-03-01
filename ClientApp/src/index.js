import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Notifications from 'react-notify-toast';
//import './index.css';
import App from './App';
import theme from './shared/theme';

import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <ThemeProvider theme={theme}>
        <BrowserRouter>
            <CssBaseline/>
            <App />
        </BrowserRouter>
    </ThemeProvider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
