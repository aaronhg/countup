import React from "react"
import Counting from "./Counting"
import { format } from "../utils/period"
import { toSecs } from "../utils/id"
var diffFn = function (end_at, start_at) {
    return toSecs(end_at) - toSecs(start_at)
}
class Notify extends React.Component {
    constructor(props) {
        super(props)
        this.notification = this.notification.bind(this)
        this.state = {
            reach: props.task_notification_mins || props.default_notification_mins || 0, //mins
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            reach: nextProps.task_notification_mins || nextProps.default_notification_mins || 0, //mins
        })
    }
    notification() {
        let msg = this.state.reach+" mins reached"
        if (Notification && Notification.permission === "granted") {
            new Notification(msg)
        }
        else if (Notification && Notification.permission !== "denied") {
            Notification.requestPermission(function (status) {
                if (Notification.permission !== status) {
                    Notification.permission = status
                }
                if (status === "granted") {
                    new Notification(msg)
                }
                else {
                    alert(msg)
                }
            })
        }
        else {
            alert(msg)
        }
    }
    render() {
        let { reach } = this.state
        let diff = diffFn(+new Date(),this.props.last_action_at)
        let reachSecs = reach * 60
        return (<div>
            <Counting prefix="counting:"
                showStart={false}
                do={true}
                start={0}
                diff={diff}
                doAWhenReach={reachSecs}
                doA={this.notification}
            />
            {" "}alert when reach<input
                style={{width: "30px"}}
                type="number"
                value={this.state.reach}
                onChange={(e) => this.setState({ reach: e.target.value })}
            />mins
        </div>)
    }
}
export default Notify