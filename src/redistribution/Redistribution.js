import React from "react"
import RecordList from "./RecordList"
import { getTimestamp } from "../utils/id"
import { Link } from "react-router-dom"
import moment from "moment"
import Counting from "../home/Counting"
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
        super(props)
        this.handleRecordTime = this.handleRecordTime.bind(this)
        this.handleComplete = this.handleComplete.bind(this)
        this.state = {
            diff_re_at: props.diff,
            counts: {
                // id: secs,
            },
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            diff_re_at: nextProps.diff,
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
    render() {
        let { records, tasks, end_at, start_at, at } = this.props
        let {counts} = this.state
        let count = Object.values(this.state.counts).reduce((a, b) => a + b, 0)
        let remaining = this.props.remaining - count
        let diff = this.state.diff_re_at + (remaining <0 ? remaining : 0)
        remaining = remaining >=0 ? remaining : 0
        
        return (<div style={styles}>
            at: {moment(at).format()}<br />
            from: {moment(start_at).format()}<br />
            to  : {moment(end_at).format()}<br />
            <br />
            <span>
            <Counting start={remaining} diff={diff} do={false} /> : remaining
             </span>
            <br /><hr />
            <RecordList records={records} tasks={tasks} counts={counts} handleRecordTime={this.handleRecordTime}/>
            <br /><hr />
            <Link className="button tiny" to="/addtask">(addtask)</Link>
            <a onClick={this.handleComplete}>(complete)</a>
            {this.props.closable ? <a onClick={this.props.onCancel}>(close)</a> : <a />}
        </div>)
    }
}
Redistribution.propTypes = {

}
export default Redistribution