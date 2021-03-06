import React from "react"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { getTimestamp, getShortID } from "../utils/id"
import TaskList from "./TaskList"
import RecordList from "./RecordList"
import { saveRecord, taskArchive, recordArchive } from "../home/HomeRedux"
class AddTask extends React.Component {
    constructor(props) {
        super(props)
        this.handleAdd = this.handleAdd.bind(this)
        this.handleCheckTask = this.handleCheckTask.bind(this)
        this.handleCheckRecord = this.handleCheckRecord.bind(this)
        this.handleArchiveTask = this.handleArchiveTask.bind(this)
        this.state = {
            taskName: "",
        }
    }
    handleAdd() {
        if (this.state.record) {
            this.props.recordArchive(this.state.record.get("id"), false)
        } else {
            this.props.saveRecord({
                task: this.state.task,
                taskName: this.state.taskName,
                taskRefId: this.state.taskRefId,
                taskId: getShortID(),
                recordId: getShortID(),
                recordRefId: this.state.recordRefId,
                date: this.props.date,
                update_at: getTimestamp(),
            })
        }
        this.props.goBack()
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            task: null,
            record: null,
        })
    }
    handleCheckTask(task) {
        this.setState({
            task,
            record: null,
        })
    }
    handleCheckRecord(record) {
        this.setState({
            task: record ? this.props.tasks.get(record.get("ref_task_id")) : null,
            record,
        })
    }
    handleArchiveTask(task) {
        this.props.taskArchive(task.get("id"))
    }
    render() {
        let { tasks, records } = this.props
        let { task, record } = this.state
        let tmp
        return (<div>
            <TaskList task={task} tasks={tasks} records={records} handleCheckTask={this.handleCheckTask} handleArchiveTask={this.handleArchiveTask} />
            <RecordList record={record} tasks={tasks.filter(t => !t.get("archive"))} records={records.filter(r => r.get("archive"))} handleCheckRecord={this.handleCheckRecord} handleArchiveTask={this.handleArchiveTask} />
            <hr />
            {
                task ?
                    <div>
                        {task.get("name")} {!record ? <a onClick={() => this.handleCheckTask()}>(remove)</a> : <a />}<br />
                        #{(tmp = task.get("custom")) ? tmp.get("ref_id") : ""}<br />
                    </div> :
                    <div>
                        task name:<input value={this.state.taskName} onChange={(e) => this.setState({ taskName: e.target.value })} /><br />
                        task ref_id:<input value={this.state.taskRefId} onChange={(e) => this.setState({ taskRefId: e.target.value })} /><br />
                    </div>
            }
            {
                record ?
                    <div>
                        #{(tmp = record.get("custom")) ? tmp.get("ref_id") : ""} <a onClick={() => this.handleCheckRecord()}>(remove)</a>
                    </div> :
                    <div>
                        record ref_id:<input value={this.state.recordRefId} onChange={(e) => this.setState({ recordRefId: e.target.value })} /><br />
                    </div>
            }
            <a onClick={this.handleAdd}>(add)</a>
            <a onClick={this.props.goBack}>(cancel)</a>
        </div>)
    }
}
AddTask.propTypes = {
    // tasks: PropTypes
    // existNames: PropTypes.arrayOf(PropTypes.object),
}
export default withRouter(connect((state, ownProps) => {
    let app = state.app
    let current_date = app.get("app").get("current_date")
    // console.log(ownProps)
    return {
        date: current_date,
        tasks: app.get("tasks"),
        records: app.get("records").filter(r => r.get("date") == current_date),
        goBack: ownProps.history.length > 2 ? ownProps.history.goBack : () => ownProps.history.push("/"), // todo : 正確導向
    }
}, (dispatch) => {
    return {
        saveRecord: bindActionCreators(saveRecord, dispatch),
        taskArchive: bindActionCreators(taskArchive, dispatch),
        recordArchive: bindActionCreators(recordArchive, dispatch),
    }
})(AddTask))