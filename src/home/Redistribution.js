import React from 'react'
import TimeButtor from './TimeButtor'
import { toSecs, getTimestamp } from '../utils/id'
import moment from 'moment'
const styles = {
    "position": "absolute",
    zIndex: "1",
    top: 0,
    backgroundColor: "lightgray",
    width: "100%",
    height: "100%",
}
class Redistribution extends React.Component {
    constructor(props) {
        super()
        this.handleRecordTime = this.handleRecordTime.bind(this)
        this.handleComplete = this.handleComplete.bind(this)
        this.state = {
            diff_re_at: 0,
            counts: {
                // id:secs,
            },
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            diff_re_at: 0,
            counts:{},
        })
    }
    componentDidMount() {
        if ( this.props.docount ) {
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
    handleComplete() {
        let laa = this.props.gonextdate ? this.props.end_at : getTimestamp()
        this.props.redistributionComplete({
            operate: {
                last_action_at: laa, //todo
                counting_record_id: "",
            },
            counts: this.state.counts,
        })
        // change date here
        if (this.props.gonextdate)
            this.props.changeDate(this.props.gonextdate)
        else
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
    render() {
        let { records, tasks, app, end_at,start_at } = this.props
        return (<div style={styles}>
            {start_at + '-' + end_at+' '}<br />
            {new Date(start_at) + '-' + new Date(end_at)+' '}<br />
            {moment(start_at).format("YYYY/MM/DD HH:mm:SS") + '-' + moment(end_at).format("HH:mm:SS") + ' '}
            {!this.props.gonextdate?<a onClick={this.props.onCancel}>(x)</a>:<a />}
            <br />
            {this.props.remaining + this.state.diff_re_at - Object.values(this.state.counts).reduce((a, b) => a + b, 0)}: remaining
            <br /><hr />
            {records.map(r => {
                let t = tasks.get(r.get("ref_task_id"))
                let c = this.state.counts[r.get("id")] / 60
                return (
                    <div key={t.get("id")}>
                        {t.get("name")} , {r.get("duration")}
                        <TimeButtor count={c || 0} record={r} onTimeChanged={(v) => this.handleRecordTime(r, v)} />
                    </div>
                )
            })}
            <br /><hr />
            <a onClick={this.props.addtask}>(addtask)</a>
            <a onClick={this.handleComplete}>(complete)</a>
        </div>)
    }
}
export default Redistribution