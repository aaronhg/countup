import React from "react"
import TimeButtor from "./TimeButtor"
export default (props) => {
    let { records, tasks, handleRecordTime, counts } = props
    return (<div>
        {records.map(r => {
            let t = tasks.get(r.get("ref_task_id"))
            let c = counts[r.get("id")]
            return (
                <div key={t.get("id")}>
                    {t.get("name")} , {r.get("duration")}
                    <TimeButtor count={c || 0} record={r} onTimeChanged={(v) => handleRecordTime(r, v)} />
                </div>
            )
        })}
    </div>)
}