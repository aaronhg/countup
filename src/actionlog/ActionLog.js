import React from "react"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"
// import { bindActionCreators } from "redux"
// import { getTimestamp, getShortID } from "../../utils/id"
// import { fromJS } from "immutable"
import { Link } from "react-router-dom"
import moment from "moment"
class ActionLog extends React.Component {
    constructor(props){
        super(props)
        this.handleBack = this.handleBack.bind(this)
    }
    handleBack(){
        this.props.goBack()
    }
    render() {
        let { stamps, tasks } = this.props
        return (
            <div>
                <a onClick={this.handleBack}>(goback)</a>
                <ul>
                    {
                        stamps.map(s => {
                            let task = tasks.get(s.get("ref_task_id"))
                            let prefix = s.get("prefix")
                            return (<li key={s.get("id")}>
                                @{moment(s.get("at")).format()}
                                    <Link to={"/memo/stamp/"+s.get("id")}>#</Link>
                                    {(prefix || "") +" "+ (task ? task.get("name") : "") + (s.get("memo") || "")}
                            </li>
                            )
                        }
                        )
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
        goBack: ownProps.history.length > 2 ? ownProps.history.goBack : () => ownProps.history.push("/"), // todo : 正確導向
    }
}, (dispatch) => {
    return {
        // saveStamp: bindActionCreators(saveStamp, dispatch),
    }
})(ActionLog))