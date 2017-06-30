import React from 'react'
import Task from "./Task"
export default (props) => {
    return (<div>
        {props.records.map((r) =>
            <Task key={r.get("id")}
                type={props.past ? "readonly" : "mini"}
                doOperating={props.doOperating}
                task={props.tasks.get(r.get("ref_task_id"))}
                record={r}
                app={props.app}
            />)
        }
    </div>)
}