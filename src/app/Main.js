import React from "react"
import { Route, Link } from "react-router-dom"

import Home from "../home/Home"
import FontIcon from "material-ui/FontIcon"
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
import ActionLog from "../actionlog/ActionLog"
import Redistribution from "../redistribution/Redistribution"
import MemoStamp from "../memo/stamp/MemoStamp"
import MemoDate from "../memo/date/MemoDate"
import MemoRecord from "../memo/record/MemoRecord"
import MemoTask from "../memo/task/MemoTask"
import MemoUser from "../memo/user/MemoUser"
import { saveAs } from "file-saver"
let prevState
class Main extends React.Component {
    constructor() {
        super()
        this.saveData = this.saveData.bind(this)
        this.handleRequestClose = this.handleRequestClose.bind(this)
        this.export = this.export.bind(this)
        this.import = this.import.bind(this)
        this.exportText = this.exportText.bind(this)
        this.state = {
            snackbarOpen: false,
            snackbarMessage: "",
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
    handleRequestClose() {
        this.setState({
            snackbarOpen: false,
        })
    }
    componentDidMount() {
        let store = this.props.store
        storage.getAll.then((data) => {
            prevState = fromJS(data)
            this.props.store.dispatch(loadData(prevState))
            this.setState({
                snackbarOpen: true,
                snackbarMessage: "Loaded",
            })
            store.subscribe(() => {
                let state = store.getState().app
                if (prevState && state != prevState) {
                    storage.saveAll(prevState, state).then(() => {
                        prevState = state
                        this.setState({
                            snackbarOpen: true,
                            snackbarMessage: "Saved",
                        })
                    })
                }
            })
        })
    }
    exportText(){
        storage.getAll.then((data) => {
            document.body.innerText = JSON.stringify(data)
        })
    }
    export() {
        let store = this.props.store
        let blob = new Blob([JSON.stringify(store.getState().app.toJS(), (k, v) => ~["$loki", "meta"].indexOf(k) ? undefined : v)], { type: "application/json;charset=utf-8" })
        saveAs(blob, "export.json")
    }
    import() {
        var file = document.getElementById("file1")
        file.onchange = () => {
            var reader = new FileReader()
            reader.onload = () => {
                var text = reader.result
                storage.clearAll()
                this.props.store.dispatch(loadData(fromJS(JSON.parse(text))))
            }
            reader.readAsText(document.getElementById("file1").files[0])
        }
        file.click()
    }
    render() {
        return (<MuiThemeProvider muiTheme={getMuiTheme()}>
            <div>
                <Route exact path="/" render={() => <a style={{ float: "right" }} onClick={this.export}><FontIcon className="material-icons" >file_download</FontIcon>all</a>} />
                <Route exact path="/export" render={() => <a style={{ float: "right" }} onClick={this.export}><FontIcon className="material-icons" >file_download</FontIcon>export</a>} />
                <Route exact path="/export_text" render={() => <a style={{ float: "right" }} onClick={this.exportText}><FontIcon className="material-icons" >file_download</FontIcon>export text</a>} />
                <Route exact path="/import" render={() => {
                    return (<div>
                        <a style={{ float: "right" }} onClick={this.import}><FontIcon className="material-icons" >file_upload</FontIcon>import(will replace data)</a>
                        <input type="file" id="file1" style={{ display: "none" }} />
                    </div>)
                }} />
                <div>
                    <Route exact path="/" component={Home} />
                    <Route path="/addtask" component={AddTask} />
                    <Route path="/memo/user" component={MemoUser} />
                    <Route path="/memo/record/:id" component={MemoRecord} />
                    <Route path="/memo/task/:id" component={MemoTask} />
                    <Route path="/memo/date" component={MemoDate} />
                    <Route path="/memo/stamp/:id" component={MemoStamp} />
                    <Route path="/actionlog" component={ActionLog} />
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