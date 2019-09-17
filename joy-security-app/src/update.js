import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Update from './page/Update';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<Update />, document.getElementById('root'));
serviceWorker.register();