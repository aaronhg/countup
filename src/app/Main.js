import React from 'react';
import ReactDOM from 'react-dom';
import { Route, Link } from 'react-router-dom'

import Home from '../home/Home'

import FontIcon from 'material-ui/FontIcon'
import { loadData } from './MainRedux'
import storage from '../utils/storage'
// import MemoDialog from '../dialog/MemoDialog'
import FlatButton from 'material-ui/FlatButton'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
var injectTapEventPlugin = require("react-tap-event-plugin")
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
injectTapEventPlugin();
import Snackbar from 'material-ui/Snackbar'

class Main extends React.Component {
    constructor() {
        super()
        this.saveData = this.saveData.bind(this)
        this.handleRequestClose = this.handleRequestClose.bind(this)
        this.state = {
            snackbarOpen : false,
            snackbarMessage:"",
        }
    }
    saveData() {
        // let data = this.props.store.getState().app
        // storage.saveAll(data).then(() => {
        //     this.setState({
        //         snackbarOpen: true,
        //         snackbarMessage:"Saved",
        //     });
        // })
    }
    handleRequestClose () {
        this.setState({
            snackbarOpen: false,
        });
    };
    componentDidMount() {
        // storage.getAll.then((data) => {
        //     this.props.store.dispatch(loadData(data))
        //     this.setState({
        //         snackbarOpen: true,
        //         snackbarMessage:"Loaded",
        //     });
        // })
    }
    render() {
        return (<MuiThemeProvider muiTheme={getMuiTheme()}>
            <div>
                <Home/>
                
                <Snackbar
                    open={this.state.snackbarOpen}
                    message={this.state.snackbarMessage}
                    autoHideDuration={4000}
                    onRequestClose={this.handleRequestClose}
                />
            </div>
        </MuiThemeProvider>)
        // <MemoDialog />
    }
}
export default Main