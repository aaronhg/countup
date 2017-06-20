// contants
export const SAVE_RECORD = "SAVE_RECORD"
export const OPERATING = "OPERATING"
// reducer
var opReducer = (state, action) => {
    debugger
    switch (action.type) {
        // case SAVE_RECORD:
        // let { record } = action.payload
        // records = [...state.records]
        // var r = records.filter((r) => r.id == record.id)[0]
        // if (r) {
        //     records.splice(records.indexOf(r), 1);
        //     record = {
        //         ...r,
        //         ...record,
        //     }
        // }
        // return {
        //     ...state,
        //     records,
        // }
        case OPERATING:
            let { last_action_at, counting_record_id, done } = action.payload.operate
            let records = state.records
            let tasks = state.tasks
            let id = state.app.counting_record_id
            if (id) {
                records = [...records]
                let record = records.find((r) => r.id == id)
                let diff = last_action_at - state.app.last_action_at
                records.splice(records.indexOf(record), 1)
                record = {
                    ...record,
                    duration: record.duration + diff,
                    update_at: last_action_at,
                }
                records = [...records,record]
                if (done) {
                    tasks = [...tasks]
                    let task = tasks.find((t) => t.id == record.ref_task_id)
                    
                    tasks.slice(tasks.indexOf(task),1)
                    task = {
                        ...task,
                        done,
                    }
                    tasks = [...tasks,task]
                    record.ref_task = task
                }
            }
            return {
                ...state,
                app: {
                    last_action_at,
                    counting_record_id,
                },
                records,
                tasks,
            }
        default:
            return state
    }
}
// action creators
export function saveRecord(record) {
    return {
        type: SAVE_RECORD,
        payload: { record },
    }
}
export function doOperating(operate) {
    return {
        type: OPERATING,
        payload: { operate },
    }
}
export default {
    [OPERATING]: opReducer,
}