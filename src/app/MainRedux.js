export const LOAD_DATA = "LOAD_DATA"
function rootReducer(state, action) {
    switch (action.type) {
        case LOAD_DATA:
            return action.payload.data
        default:
            return state
    }
}
export default {
    [LOAD_DATA]: rootReducer,
}
export function loadData(data) {
    return {
        type: LOAD_DATA,
        payload: { data },
    }
}