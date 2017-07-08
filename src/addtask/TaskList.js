import React from "react"
import FontIcon from "material-ui/FontIcon"
const styles = {
    color: "red",
}
const styles2 = {
    float:"right",
}
export default (props) => {
    let taskids = props.records ? props.records.map(r => r.get("ref_task_id")) : []
    let task = props.task
    return <div>{props.tasks && props.tasks.filter(t => !t.get("archive") && !~taskids.indexOf(t.get("id"))).map(t =>
        <div style={task == t ? styles : Object.prototype} key={t.get("id")}>
            <span onClick={() => props.handleCheckTask(t)}>{t.get("name")}</span>
            {
                props.handleArchiveTask?
                <FontIcon style={styles2} onClick={()=>props.handleArchiveTask(t)} className="material-icons" >delete</FontIcon>
                :<a />
            }
        </div>
    )}</div>
}