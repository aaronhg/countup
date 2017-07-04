import React from "react"
import {format} from "../utils/period"
import TimeButtor from "./TimeButtor"
export default (props) => {
    let { records, tasks, handleRecordTime, counts } = props
    records = records || []
    return (<div>
        {records.map(r => {
            let t = tasks.get(r.get("ref_task_id"))
            let c = counts[r.get("id")]
            return (
                <div key={t.get("id")}>
                    {t.get("name")} , {format(r.get("duration"))}
                    <TimeButtor count={c || 0} record={r} onTimeChanged={(v) => handleRecordTime(r, v)} />
                </div>
            )
        })}
    </div>)
}