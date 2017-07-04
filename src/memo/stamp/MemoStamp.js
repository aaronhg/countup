import React from "react"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import TaskList from "../../addtask/TaskList"
import { getTimestamp, getShortID } from "../../utils/id"
import { saveStamp, gotoStamp } from "../../home/HomeRedux"
import { fromJS } from "immutable"
import moment from "moment"
const prefix = [{
    txt: "start of",
}, {
    txt: "end of",
}]
const prefixStyles = {
    color: "red",
}
var Prefix = (props) => {
    return (<div>
        {prefix.map(p => <a key={p.txt} onClick={props.clickPrefix} style={props.txt == p.txt ? prefixStyles : Object.prototype}>{p.txt}</a>)}
    </div>)
}
class MemoStamp extends React.Component {
    constructor(props) {
        super(props)
        this.clickPrefix = this.clickPrefix.bind(this)
        this.handleSave = this.handleSave.bind(this)
        this.handleCheckTask = this.handleCheckTask.bind(this)
        this.handleUpdateMemo = this.handleUpdateMemo.bind(this)
        this.handleStamp = this.handleStamp.bind(this)
        this.state = {
            prefix: props.stamp ? props.stamp.get("prefix"):"",
            memo: props.stamp ? props.stamp.get("memo"):"",
        }
    }
    clickPrefix(e) {
        this.setState({
            prefix: e.target.text,
        })
    }
    handleUpdateMemo() {
        this.handleSave()
    }
    handleStamp() {
        let id = getShortID()
        this.props.saveStamp({
            id,
            at: getTimestamp(),
            date: this.props.date,
        })
        this.props.gotoStamp(id)
    }
    handleSave(t) {
        this.props.saveStamp({
            ...this.props.stamp.toJS(),
            prefix: this.state.prefix,
            ref_task_id: t ? t.get("id") : "",// todo
            memo: this.state.memo,
            update_at: getTimestamp(),
        })
        this.props.goBack()
    }
    handleCheckTask(t) {
        this.handleSave(t)
    }
    render() {
        let { stamp, tasks } = this.props
        let task = tasks.find(t=>t.get("id")==stamp.get("ref_task_id"))
        return stamp ? 
                (<div>
                    stamp at {moment(stamp.get("at")).format()}<br />
                    1) is
                    <Prefix clickPrefix={this.clickPrefix} txt={this.state.prefix} />
                    <TaskList task={task} tasks={tasks} handleCheckTask={this.handleCheckTask} /><br />
                    <hr />
                    2) memo:<input value={this.state.memo} onChange={(e) => this.setState({ memo: e.target.value })} /><br />
                    <a onClick={this.handleUpdateMemo}>(update,close)</a><br />
                    <hr />
                    <a onClick={this.handleStamp}>(make another stamp)</a>
                    <a onClick={this.props.goBack}>(close)</a><br />
                </div>) :
                (<div>
                    stamp not exists
                    <a onClick={this.props.goBack}>(goback)</a><br />
                </div>)
    }
}
/*<Link className="button tiny" to="/addtask">(addtask)</Link>
                <a onClick={this.handleComplete}>(complete)</a>
                {!this.props.gonextdate ? <a onClick={this.props.onCancel}>(close)</a> : <a />}*/
export default withRouter(connect((state, ownProps) => {
    let app = state.app
    let current_date = app.get("app").get("current_date")
    return {
        date: current_date,
        tasks: app.get("tasks"),
        stamp: app.get("stamps").find(s => s.get("id") === ownProps.match.params.id),
        goBack: () => ownProps.history.push("/"), // todo : 正確導向
    }
}, (dispatch) => {
    return {
        saveStamp: bindActionCreators(saveStamp, dispatch),
        gotoStamp: bindActionCreators(gotoStamp, dispatch),
    }
})(MemoStamp))