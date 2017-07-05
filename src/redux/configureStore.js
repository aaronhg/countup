import { createStore, combineReducers, applyMiddleware } from "redux"
import ReduxLogger from "redux-logger"
import rootReducer from "./reducers"

import dialogReducer from "../dialog/MemoDialogRedux"
import createHistory from "history/createHashHistory"
import { routerReducer, routerMiddleware } from "react-router-redux"
export const history = createHistory()
const middleware = routerMiddleware(history)
export default function configureStore() {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    const store = createStore(combineReducers({
        router: routerReducer,
        app: rootReducer,
        dialog: dialogReducer,
    }),
        composeEnhancers(
        applyMiddleware(
            middleware,
            ReduxLogger
        )
        )
    )

    return store
}