import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'

import configureStore from '../redux/configureStore'

import Main from './Main'

import './app.scss';

const store = configureStore()
class App extends React.Component {
    render() {
        return (<Provider store={store}>
                <Main store={store}/>
        </Provider>)
    }
}

const root = document.createElement("div")
document.body.appendChild(root)
ReactDOM.render(<App />, root)