import React from "react"
import { Route, Link } from "react-router-dom"

import Home from "../home/Home"

import { loadData } from "./MainRedux"
import storage from "../utils/storage"
// import MemoDialog from "../dialog/MemoDialog"
import getMuiTheme from "material-ui/styles/getMuiTheme"
var injectTapEventPlugin = require("react-tap-event-plugin")
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider"
injectTapEventPlugin()
import { fromJS } from "immutable"
import Snackbar from "material-ui/Snackbar"
import AddTask from "../addtask/AddTask"
import Redistribution from "../redistribution/Redistribution"
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
        })
    }
    componentDidMount() {
        let store = this.props.store
        storage.getAll.then((data) => {
            this.props.store.dispatch(loadData(fromJS(data)))
            this.setState({
                snackbarOpen: true,
                snackbarMessage:"Loaded",
            })
            store.subscribe(()=>{
                storage.saveAll(store.getState().app.toJS()).then(() => {
                    this.setState({
                        snackbarOpen: true,
                        snackbarMessage:"Saved",
                    })
                })
            })
        })
    }
    render() {
        return (<MuiThemeProvider muiTheme={getMuiTheme()}>
            <div>
                <div>
                    <Route exact path="/" component={Home} />
                    <Route path="/addtask" component={AddTask} />
                    <Route path="/redistribution" component={Redistribution} />
                    {/*<Route path="/memo/date/:id" component={TagsTag} />
                    <Route path="/memo/task/:id" component={TagsETag} />
                    <Route path="/memo/record/:id" component={TagsItem} />
                    <Route path="/memo/stamp/:id" component={TagsItem} />*/}
                </div>
                <Snackbar
                    open={this.state.snackbarOpen}
                    message={this.state.snackbarMessage}
                    autoHideDuration={3000}
                    onRequestClose={this.handleRequestClose}
                />
            </div>
        </MuiThemeProvider>)
    }
}
export default Main