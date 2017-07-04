import React from "react"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"
// import { bindActionCreators } from "redux"
// import { getTimestamp, getShortID } from "../../utils/id"
// import { fromJS } from "immutable"
import { Link } from "react-router-dom"
import moment from "moment"
var StampLi = (props) => {
    let { s, task } = props
    return (<li>
        @{moment(s.at).format("THH:mm:ssZ")}
        <Link to={"/memo/stamp/" + s.id}>#</Link >
        {((s.prefix) || "") + " " + (task ? task.get("name") : "") + (s.memo || "")}
    </li >
    )
}
var LogLi = (props) => {
    let { al, task } = props
    return <li>
        @{moment(al.at).format("THH:mm:ssZ")}#
        {
            (task ? task.get("name") : "") + ":" +
            (al.action_type || "") + "," +
            (al.secs || "") + "(" +
            (al.accumulate || "") + ")"
        }
    </li >
}
function merge(als, ss) {
    let ms = [...als.toJS(), ...ss.toJS()]
    return ms.sort((ma, mb) => ma.at < mb.at)
}
class ActionLog extends React.Component {
    constructor(props) {
        super(props)
        this.handleBack = this.handleBack.bind(this)
    }
    handleBack() {
        this.props.goBack()
    }
    render() {
        let { stamps, tasks, actionlog, date } = this.props
        let ms = merge(actionlog, stamps)
        return (
            <div>
                <a onClick={this.handleBack}>(goback)</a>
                {date}<br />
                <hr />
                <ul>
                    {
                        ms.map(m => {
                            let task = tasks.get(m.ref_task_id)
                            return !m.action_type
                                ? <StampLi key={m.id} s={m} task={task} />
                                : <LogLi key={m.id} al={m} task={task} />
                        })
                    }
                </ul>
            </div>
        )
    }
}
export default withRouter(connect((state, ownProps) => {
    let app = state.app
    let current_date = app.get("app").get("current_date")
    return {
        date: current_date,
        tasks: app.get("tasks"),
        stamps: app.get("stamps").filter(s => s.get("date") === current_date) || [],
        actionlog: app.get("actionlog").filter(al => al.get("date") === current_date) || [],
        goBack: ownProps.history.length > 2 ? ownProps.history.goBack : () => ownProps.history.push("/"), // todo : 正確導向
    }
}, (dispatch) => {
    return {
        // saveStamp: bindActionCreators(saveStamp, dispatch),
    }
})(ActionLog))