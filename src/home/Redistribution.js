import React from 'react'
import TimeButtor from './TimeButtor'
import { toSecs,getTimestamp } from '../utils/id'
const styles = {
    "position": "absolute",
    zIndex:"1",
    top: 0,
    backgroundColor: "lightgray",
    width:"100%",
    height:"100%",
}
class Redistribution extends React.Component {
    constructor(props) {
        super()
        this.handleRecordTime = this.handleRecordTime.bind(this)
        this.handleComplete = this.handleComplete.bind(this)
        this.state = {
            diff_re_at: 0,
            have: toSecs(props.redistribution_at) - toSecs(props.app.get("last_action_at")),
            counts: {
                // id:secs,
            },
        }
    }
    componentDidMount() {
        this.timer = setInterval(() => {
            this.setState({
                diff_re_at: this.state.diff_re_at + 1,
            })
        }, 1000)
    }
    componentWillUnmount() {
        clearInterval(this.timer)
    }
    handleComplete() {
        this.props.redistributionComplete({
            operate: {
                last_action_at:getTimestamp(),
                counting_record_id:"",
            },
            counts: this.state.counts,
        })
        this.props.onCancel()
    }
    handleRecordTime(r, v) {
        let counts = {
            ...this.state.counts,
        }
        if (v == "full") {
            counts[r.get("id")] = this.state.have + this.state.diff_re_at - Object.values(counts).reduce((a, b) => a + b, 0) + (counts[r.get("id")] || 0)
        } else {
            counts[r.get("id")] = v
        }
        this.setState({
            counts,
        })
    }
    render() {
        let { records, tasks, app, redistribution_at } = this.props
        return (<div style={styles}>
            {toSecs(app.get("last_action_at")) + '-' + toSecs(redistribution_at) + ' '} <a onClick={this.props.onCancel}>(x)</a>
            <br />
            {this.state.have + this.state.diff_re_at - Object.values(this.state.counts).reduce((a, b) => a + b, 0)}: remaining
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
            <a onClick={this.props.addtask}>(add)</a>
            <a onClick={this.handleComplete}>(complete)</a>
        </div>)
    }
}
export default Redistribution