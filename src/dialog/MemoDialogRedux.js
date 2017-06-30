// contants
export const OPEN_MEMO_DIALOG = "OPEN_MEMO_DIALOG"
export const CLOSE_MEMO_DIALOG = "CLOSE_MEMO_DIALOG"
// initial state
var initialState = {
    open :false,
}
// reducer
export default (state=initialState, action) => {
    switch (action.type) {
        case OPEN_MEMO_DIALOG:
            return {
                ...state,
                open: true,
                record: action.payload,
            }
        case CLOSE_MEMO_DIALOG:
            return {
                ...state,
                open: false,
            }
        default:
            return state
    }
}
// action creators
export function openMemoDialog(record) {
    return {
        type: OPEN_MEMO_DIALOG,
        payload: record,
    }
}
export function closeMemoDialog() {
    return {
        type: CLOSE_MEMO_DIALOG,
    }
}