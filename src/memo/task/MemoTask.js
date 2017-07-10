import React from "react"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { getTimestamp } from "../../utils/id"
import { updateTask } from "../../home/HomeRedux"
class MemoTask extends React.Component {
    constructor(props) {
        super(props)
        this.handleSave = this.handleSave.bind(this)
        let custom = props.task && props.task.get("custom")
        this.state = {
            ref_id: custom ? custom.get("ref_id") : "", 
            field1: custom ? custom.get("field1") : "",
            field2: custom ? custom.get("field2") : "",
            memo: custom ? custom.get("memo") : "",
            notification_mins: props.task && props.task.get("notification_mins") || "",
        }
    }
    handleSave() {
        let task = this.props.task.toJS()
        this.props.updateTask({
            ...task,
            custom: {
                ...task.custom,
                ref_id: this.state.ref_id,
                field1: this.state.field1,
                field2: this.state.field2,
                memo: this.state.memo,
            },
            notification_mins: this.state.notification_mins,
            update_at: getTimestamp(),
        })
        this.props.goBack()
    }
    render() {
        let { task } = this.props
        let name = task ?task.get("name"):""
        return task ? (<div>
            task : {name}<br />
            <hr />
            ref_id:<input value={this.state.ref_id} onChange={(e) => this.setState({ ref_id: e.target.value })} /><br />
            memo:<input value={this.state.memo} onChange={(e) => this.setState({ memo: e.target.value })} /><br />
            field1:<input value={this.state.field1} onChange={(e) => this.setState({ field1: e.target.value })} /><br />
            field2:<input value={this.state.field2} onChange={(e) => this.setState({ field2: e.target.value })} /><br />
            <hr />
            notification_mins:<input type="number" value={this.state.notification_mins} onChange={(e) => this.setState({ notification_mins: e.target.value })} /><br />
            <hr />
            <a onClick={this.handleSave}>(update)</a>
            <a onClick={this.props.goBack}>(close)</a><br />
        </div>) :
            (<div>
                task not exists
                    <a onClick={this.props.goBack}>(goback)</a><br />
            </div>)
    }
}
export default withRouter(connect((state, ownProps) => {
    let app = state.app
    // let current_date = app.get("app").get("current_date")
    return {
        task:app.get("tasks").find(r => r.get("id") === ownProps.match.params.id),
        goBack: () => ownProps.history.push("/"), // todo : 正確導向
    }
}, (dispatch) => {
    return {
        updateTask: bindActionCreators(updateTask, dispatch),
    }
})(MemoTask))