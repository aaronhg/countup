import { createStore, combineReducers, applyMiddleware } from 'redux'
import ReduxLogger from 'redux-logger'
import rootReducer from './reducers'

import dialogReducer from '../dialog/MemoDialogRedux'

export default function configureStore() {
    // const store = applyMiddleware(ReduxLogger)(createStore)(combineReducers(rootReducer))
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    const store = createStore(combineReducers({
            app: rootReducer,
            dialog: dialogReducer,
        }),  composeEnhancers(
            applyMiddleware(
                ReduxLogger,
            )
    ))

    return store
}