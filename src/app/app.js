import React from "react"
import ReactDOM from "react-dom"
import { Provider } from "react-redux"


import Main from "./Main"
import configureStore, { history } from "../redux/configureStore"
import "./app.scss"
import { ConnectedRouter } from "react-router-redux"
const store = configureStore()
class App extends React.Component {
    render() {
        return (<Provider store={store}>
            <ConnectedRouter history={history}>
                <Main store={store} />
            </ConnectedRouter>
        </Provider>)
    }
}

const root = document.createElement("div")
document.body.appendChild(root)
ReactDOM.render(<App />, root)