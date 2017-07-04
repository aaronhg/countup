import { Map, fromJS } from "immutable"
import { push } from "react-router-redux"
import { toSecs,getShortID } from "../utils/id"
// contants
const REDISTRIBUTION_AT = "REDISTRIBUTION_AT"
const REDISTRIBUTION_COMPLETE = "REDISTRIBUTION_COMPLETE"
const SAVE_RECORD = "SAVE_RECORD"
const OPERATING = "OPERATING"
const CHANGE_DATE = "CHANGE_DATE"
const SAVE_STAMP = "SAVE_STAMP"
const RECORD_DONE = "RECORD_DONE"
const TASK_ARCHIVE = "TASK_ARCHIVE"
const UPDATE_REOCRD = "UPDATE_REOCRD"
const UPDATE_TASK = "UPDATE_TASK"
const UPDATE_DATE = "UPDATE_DATE"
const UPDATE_USER = "UPDATE_USER"
// reducer
var opReducer = (state, action) => {
    switch (action.type) {
        case SAVE_STAMP:
            var { stamp } = action.payload
            var stamps = state.get("stamps")
            if (~stamps.findIndex(r => r.get("id") === stamp.id)) {
                stamps = stamps.update(
                    stamps.findIndex(r => r.get("id") === stamp.id),
                    r => fromJS({
                        ...r.toJS(),
                        ...stamp,
                    })
                )
            } else {
                stamps = stamps.push(fromJS(stamp))
            }
            return state.set("stamps", stamps)
        case UPDATE_REOCRD:
            var { record } = action.payload
            var records = state.get("records")
            if (~records.findIndex(r => r.get("id") === record.id)) {
                records = records.update(
                    records.findIndex(r => r.get("id") === record.id),
                    r => fromJS({
                        ...r.toJS(),
                        ...record,
                    })
                )
            }
            return state.set("records", records)
        case UPDATE_TASK:
            var { task } = action.payload
            var tasks = state.get("tasks")
            if (tasks.get(task.id)) {
                tasks = tasks.update(
                    task.id,
                    r => fromJS({
                        ...r.toJS(),
                        ...task,
                    })
                )
            }
            return state.set("tasks", tasks)
        case UPDATE_DATE:
            var { date } = action.payload
            var dates = state.get("dates")
            if (~dates.findIndex(r => r.get("date") === date.date)) {
                dates = dates.update(
                    dates.findIndex(r => r.get("date") === date.date),
                    r => fromJS({
                        ...r.toJS(),
                        ...date,
                    })
                )
            } else {
                dates = dates.push(fromJS(date))
            }
            return state.set("dates", dates)
        case UPDATE_USER:
            var { user } = action.payload
            return state.set("user", fromJS({
                ...state.get("user").toJS(),
                ...user,
            }))
        case REDISTRIBUTION_AT:
            var { at } = action.payload
            return state.set("app", fromJS({
                ...state.get("app").toJS(),
                redistribution_at: at,
            }))
        case CHANGE_DATE:
            var { date } = action.payload
            return state.set("app", fromJS({
                ...state.get("app").toJS(),
                current_date: date,
            }))
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
            records = records.push(fromJS({
                id: recordId,
                custom: {
                    ref_id: recordRefId,
                },
                date,
                ref_task_id: task ? task.get("id") : taskId,
                duration: 0,
                update_at,
            }))
            state = state.set("records", records)
            return state
        case REDISTRIBUTION_COMPLETE:
            var { operate, counts } = action.payload.data
            var { last_action_at, counting_record_id, current_date } = operate
            var records = state.get("records")
            var actionlog = state.get("actionlog")
            for (let c in counts) {
                records = records.update(
                    records.findIndex(r => r.get("id") === c),
                    r => {
                        actionlog = actionlog.push(fromJS({
                            id : getShortID(),
                            at: last_action_at,
                            ref_task_id: r.get("ref_task_id"),
                            date: r.get("date"),
                            action_type: "distribution",
                            secs: counts[c],
                            accumulate: r.get("duration") + counts[c],
                            update_at: last_action_at,
                        }))
                        return r.set("duration", r.get("duration") + counts[c]).set("update_at", last_action_at)
                    }
                )
            }
            state = state.set("records", records)
            state = state.set("actionlog", actionlog)

            return state.set("app", Map({
                ...state.get("app").toJS(),
                last_action_at,
                counting_record_id,
                redistribution_at: 0,
                current_date: current_date ? current_date : state.get("app").get("current_date")
            }))
        case OPERATING:
            var { last_action_at, counting_record_id } = action.payload.operate
            var records = state.get("records")
            var actionlog = state.get("actionlog")
            var id = state.get("app").get("counting_record_id")
            if (id) {
                let diff = toSecs(last_action_at) - toSecs(state.get("app").get("last_action_at"))
                records = records.update(
                    records.findIndex(r => r.get("id") === id),
                    r => {
                        actionlog = actionlog.push(fromJS({
                            id : getShortID(),
                            at: last_action_at,
                            ref_task_id: r.get("ref_task_id"),
                            date: r.get("date"),
                            action_type: "pause",
                            secs: diff,
                            accumulate:r.get("duration") + diff,
                            update_at: last_action_at,
                        }))
                        return r.set("duration", r.get("duration") + diff).set("update_at", last_action_at)
                    }
                )
                state = state.set("records", records)
                state = state.set("actionlog", actionlog)
            }
            if (counting_record_id) {
                let tmpr = records.find(r => r.get("id") === counting_record_id)
                actionlog = actionlog.push(fromJS({
                    id : getShortID(),
                    at: last_action_at,
                    ref_task_id: tmpr.get("ref_task_id"),
                    date: tmpr.get("date"),
                    action_type: "start",
                    update_at: last_action_at,
                }))
                state = state.set("actionlog", actionlog)
            }
            return state.set("app", Map({
                ...state.get("app").toJS(),
                last_action_at,
                counting_record_id,
                redistribution_at: 0,
            }))
        case RECORD_DONE:
            var { id } = action.payload
            var records = state.get("records")
            records = records.update(
                records.findIndex(r => r.get("id") === id),
                t => t.set("done", true)
            )
            return state.set("records", records)
        case TASK_ARCHIVE:
            let { tid } = action.payload
            let tasks = state.get("tasks")
            tasks = tasks.update(
                tid,
                t => t.set("archive", true)
            )
            return state.set("tasks", tasks)
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
        payload: { date },
    }
}
export function saveStamp(stamp) {
    return {
        type: SAVE_STAMP,
        payload: { stamp },
    }
}
export function updateRecord(record) {
    return {
        type: UPDATE_REOCRD,
        payload: { record },
    }
}
export function updateTask(task) {
    return {
        type: UPDATE_TASK,
        payload: { task },
    }
}
export function updateDate(date) {
    return {
        type: UPDATE_DATE,
        payload: { date },
    }
}
export function updateUser(user) {
    return {
        type: UPDATE_USER,
        payload: { user },
    }
}
export function recordDone(id) {
    return {
        type: RECORD_DONE,
        payload: { id },
    }
}
export function taskArchive(tid) {
    return {
        type: TASK_ARCHIVE,
        payload: { tid },
    }
}
export function gotoStamp(id) {
    return push("/memo/stamp/" + id)
}
export function redistributionAt(at) {
    return {
        type: REDISTRIBUTION_AT,
        payload: { at },
    }
}
export default {
    [OPERATING]: opReducer,
    [SAVE_RECORD]: opReducer,
    [REDISTRIBUTION_COMPLETE]: opReducer,
    [CHANGE_DATE]: opReducer,
    [SAVE_STAMP]: opReducer,
    [RECORD_DONE]: opReducer,
    [TASK_ARCHIVE]: opReducer,
    [REDISTRIBUTION_AT]: opReducer,
    [UPDATE_REOCRD]: opReducer,
    [UPDATE_TASK]: opReducer,
    [UPDATE_DATE]: opReducer,
    [UPDATE_USER]: opReducer,
}