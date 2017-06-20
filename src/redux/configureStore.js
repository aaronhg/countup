import { createStore, combineReducers, applyMiddleware } from 'redux'
import ReduxLogger from 'redux-logger'
import rootReducer from './reducers'

import dialogReducer from '../dialog/MemoDialogRedux'

export default function configureStore() {
    // const store = applyMiddleware(ReduxLogger)(createStore)(combineReducers(rootReducer))
    const store = createStore(
        combineReducers({
            app: rootReducer,
            dialog: dialogReducer,
        }),
        applyMiddleware(
            ReduxLogger,
        )
    )
    return store
}