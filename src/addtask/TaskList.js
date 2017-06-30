import React from "react"
export default (props) => {
    let taskids = props.records.map(r => r.get("ref_task_id")) || []

    return <div>{props.tasks.filter(t => !~taskids.indexOf(t.get("id"))).map(t =>
        <div key={t.get("id")} onClick={() => props.handleCheckTask(t)}>{t.get("name")}</div>
    )}</div>
}