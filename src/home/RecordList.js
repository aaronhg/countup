import React from 'react'
import Task from "./Task"
export default (props) => {
    let records = props.records.filter(r => !r.get("archive"))
    return (<div>
        tasks:
        {records.filter(r => !r.get("done")).map((r) =>
            <Task key={r.get("id")}
                type={props.past ? "readonly" : "mini"}
                redistributionComplete={props.redistributionComplete}
                doOperating={props.doOperating}
                recordDone={props.recordDone}
                task={props.tasks.get(r.get("ref_task_id"))}
                record={r}
                app={props.app}
            />)
        }
        <hr />
        dones:
        {records.filter(r => r.get("done")).map((r) =>
            <Task key={r.get("id")}
                type={props.past ? "readonly" : "mini"}
                redistributionComplete={props.redistributionComplete}
                doOperating={props.doOperating}
                task={props.tasks.get(r.get("ref_task_id"))}
                record={r}
                app={props.app}
            />)}
    </div>)
}