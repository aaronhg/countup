import { Map, fromJS } from 'immutable'
import { toSecs } from '../utils/id'
// contants
const REDISTRIBUTION_COMPLETE = "REDISTRIBUTION_COMPLETE"
const SAVE_RECORD = "SAVE_RECORD"
const OPERATING = "OPERATING"
const CHANGE_DATE = "CHANGE_DATE"
// reducer
var opReducer = (state, action) => {
    switch (action.type) {
        case CHANGE_DATE:
            debugger
            var { date } = action.payload
            return state.set("date", fromJS({
                date,
            })).set("records", fromJS([]))
        case SAVE_RECORD:
            var records = state.get("records")
            let { record } = action.payload
            let { task, taskName, taskRefId, taskId, recordRefId, date, update_at, recordId } = record
            if (!task) {
                let task = {
                    id: taskId,
                    name: taskName,
                    custom: {
                        ref_id: taskRefId,
                    }
                }
                let tasks = state.get("tasks").set(taskId, fromJS(task))
                state = state.set("tasks", tasks)
            }
            record = {
                id: recordId,
                custom: {
                    ref_id: recordRefId,
                },
                date,
                ref_task_id: task ? task.get("id") : taskId,
                duration: 0,
                update_at,
            }
            records = records.push(fromJS(record))
            state = state.set("records", records)
            return state
        case REDISTRIBUTION_COMPLETE:
            var { operate, counts } = action.payload.data
            var { last_action_at, counting_record_id } = operate
            var records = state.get("records")
            for (let c in counts) {
                records = records.update(
                    records.findIndex(r => r.get("id") === c),
                    r => {
                        return r.set("duration", r.get("duration") + counts[c]).set("update_at", last_action_at)
                    }
                )
            }
            state = state.set("records", records)
            return state.set("app", Map({
                last_action_at,
                counting_record_id,
            }))
        case OPERATING:
            var { last_action_at, counting_record_id, done } = action.payload.operate
            let records = state.get("records")
            let tasks = state.get("tasks")
            let id = state.get("app").get("counting_record_id")
            if (id) {
                let diff = toSecs(last_action_at) - toSecs(state.get("app").get("last_action_at"))
                let tid
                records = records.update(
                    records.findIndex(r => r.get("id") === id),
                    r => {
                        tid = r.get("ref_task_id")
                        return r.set("duration", r.get("duration") + diff).set("update_at", last_action_at)
                    }
                )
                state = state.set("records", records)
                if (done) {
                    tasks = tasks.update(
                        tid,
                        t => t.set("done", true)
                    )
                    state = state.set("tasks", tasks)
                }
            }
            return state.set("app", Map({
                last_action_at,
                counting_record_id,
            }))
        default:
            return state
    }
}
// action creators
export function redistributionComplete(data) {
    return {
        type: REDISTRIBUTION_COMPLETE,
        payload: { data },
    }
}
export function doOperating(operate) {
    return {
        type: OPERATING,
        payload: { operate },
    }
}
export function saveRecord(record) {
    return {
        type: SAVE_RECORD,
        payload: { record },
    }
}
export function changeDate(date) {
    return {
        type: CHANGE_DATE,
        payload: {date},
    }
}
export default {
    [OPERATING]: opReducer,
    [SAVE_RECORD]: opReducer,
    [REDISTRIBUTION_COMPLETE]: opReducer,
    [CHANGE_DATE] : opReducer,
}