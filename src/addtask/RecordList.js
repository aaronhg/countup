import React from "react"
import FontIcon from "material-ui/FontIcon"
const styles = {
    color: "red",
}
const styles2 = {
    float:"right",
}
export default (props) => {
    let { records, tasks, record } = props
    records = records || []
    return (<div>
        {records.map(r => {
            let t = tasks.get(r.get("ref_task_id"))
            return (
                <div style={record == r ? styles : Object.prototype} key={r.get("id")}>
                    <span onClick={() => props.handleCheckRecord(r)}>{t.get("name")}</span>
                    {
                        props.handleArchiveTask?
                        <FontIcon style={styles2} onClick={()=>props.handleArchiveTask(t)} className="material-icons" >delete</FontIcon>
                        :<a />
                    }
                </div>
            )
        })}
    </div>)
}