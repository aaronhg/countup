import React from "react"
const styles = {
    color: "red",
}
export default (props) => {
    let taskids = props.records ? props.records.map(r => r.get("ref_task_id")) : []
    let task = props.task
    return <div>{props.tasks && props.tasks.filter(t => !~taskids.indexOf(t.get("id"))).map(t =>
        <div style={task == t ? styles : Object.prototype}
            key={t.get("id")}
            onClick={() => props.handleCheckTask(t)}>
            {t.get("name")}
        </div>
    )}</div>
}