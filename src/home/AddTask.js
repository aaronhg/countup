import React from 'react'
import TimeButtor from './TimeButtor'
import { toSecs, getTimestamp, getShortID } from '../utils/id'
import moment from 'moment'
const styles = {
    "position": "absolute",
    zIndex: "2",
    top: 0,
    backgroundColor: "lightgray",
    width: "100%",
    height: "100%",
}
class AddTask extends React.Component {
    constructor(props) {
        super()
        this.handleAdd = this.handleAdd.bind(this)
        this.handleCheckTask = this.handleCheckTask.bind(this)
        this.state = {
            taskName: "",
        }
    }
    handleAdd() {
        this.props.saveRecord({
            task : this.state.task,
            taskName : this.state.taskName,
            taskRefId : this.state.taskRefId,
            taskId :getShortID(),
            recordId : getShortID(),
            recordRefId : this.state.recordRefId,
            date : this.props.date,
            update_at : getTimestamp(),
        })
        this.props.onCancel()
    }
    handleCheckTask(task) {
        this.setState({
            task,
        })
    }
    render() {
        let { tasks, records } = this.props
        let { task } = this.state
        let taskids = records.map(r => r.get("ref_task_id")) || []
        return (<div style={styles}>
            {tasks.filter(t => taskids.indexOf(t.get("id")) == -1).map(t =>
                <div key={t.get("id")} onClick={() => this.handleCheckTask(t)}>{t.get("name")}</div>
            )}
            <br /><hr />
            {task ? <p>{task.get("name") + "#" + task.get("id")}
                <a onClick={() => this.handleCheckTask()}>(remove)</a>
            </p> :
                <div>
                    task name:<input value={this.state.taskName} onChange={(e) => this.setState({ taskName: e.target.value })} /><br />
                    task ref_id:<input value={this.state.taskRefId} onChange={(e) => this.setState({ taskRefId: e.target.value })} /><br />
                </div>
            }
            record ref_id:<input value={this.state.recordRefId} onChange={(e) => this.setState({ recordRefId: e.target.value })} /><br />
            <a onClick={this.handleAdd}>(add)</a>
            <a onClick={this.props.onCancel}>(cancel)</a>
        </div>)
    }
}
export default AddTask