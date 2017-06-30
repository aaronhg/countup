import { createReducer } from "../redux/utils"
import initialState from "../redux/initialState"
import mainReducerObj from "../app/MainRedux"
import homeReducerObj from "../home/HomeRedux"

export default createReducer(initialState, {
    ...homeReducerObj,
    ...mainReducerObj,
})