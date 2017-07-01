import React from "react"
import RecordList from "./RecordList"
import { getTimestamp } from "../utils/id"
import { Link } from "react-router-dom"
import moment from "moment"
class Redistribution extends React.Component {
    constructor(props) {
        super(props)
        this.handleRecordTime = this.handleRecordTime.bind(this)
        this.handleComplete = this.handleComplete.bind(this)
        this.state = {
            diff_re_at: 0,
            counts: {
                // id: secs,
            },
        }
    }
    handleComplete() {
        let laat = this.props.gonextdate ? this.props.at : getTimestamp()
        this.props.redistributionComplete({
            operate: {
                last_action_at: laat, //todo
                counting_record_id: "",
                current_date: this.props.gonextdate,
            },
            counts: this.state.counts,
        })
        // change date here
        if (!this.props.gonextdate)
            this.props.onCancel()
    }
    handleRecordTime(r, v) {
        let counts = {
            ...this.state.counts,
        }
        if (v == "full") {
            counts[r.get("id")] = this.props.remaining + this.state.diff_re_at - Object.values(counts).reduce((a, b) => a + b, 0) + (counts[r.get("id")] || 0)
        } else {
            counts[r.get("id")] = v
        }
        this.setState({
            counts,
        })
    }
    componentDidMount() {
        if (this.props.docount) {
            this.timer = setInterval(() => {
                this.setState({
                    diff_re_at: this.state.diff_re_at + 1,
                })
            }, 1000)
        }
    }
    componentWillUnmount() {
        clearInterval(this.timer)
    }
    render() {
        let { records, tasks, end_at, start_at, at } = this.props
        return (<div>
            at: {moment(at).format("YYYY/MM/DD HH:mm:SS")}<br />
            {moment(start_at).format("YYYY/MM/DD HH:mm:SS") + "-" + moment(end_at).format("HH:mm:SS") + " "}<br />
            <br />
            <span>
            {this.props.remaining + this.state.diff_re_at - Object.values(this.state.counts).reduce((a, b) => a + b, 0)}: remaining
             </span>
            <br /><hr />
            <RecordList records={records} tasks={tasks} />
            <br /><hr />
            <Link className="button tiny" to="/addtask">(addtask)</Link>
            <a onClick={this.handleComplete}>(complete)</a>
            {!this.props.gonextdate ? <a onClick={this.props.onCancel}>(close)</a> : <a />}
        </div>)
    }
}
Redistribution.propTypes = {

}
export default withRouter(connect((state, ownProps) => {
    let app = state.app
    let current_date = app.get("app").get("current_date")
    return {
        date: current_date,
        tasks: app.get("tasks"),
        records: app.get("records").filter(r => r.get("date") == current_date),
        goBack: ownProps.history.length > 2? ownProps.history.goBack : () => ownProps.history.push("/"), // todo : 正確導向
    }
}, (dispatch) => {
    return {
        saveRecord: bindActionCreators(saveRecord, dispatch),
    }
})(Redistribution))