import React from "react"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { getTimestamp, getShortID } from "../../utils/id"
import { updateRecord, recordArchive } from "../../home/HomeRedux"
import FontIcon from "material-ui/FontIcon"
import moment from "moment"
const styles2 = {
    float: "right",
}
const styles3 = {
    float: "right",
    display: "none",
}
class MemoRecord extends React.Component {
    constructor(props) {
        super(props)
        this.handleSave = this.handleSave.bind(this)
        this.handleArchive = this.handleArchive.bind(this)
        let custom = props.record && props.record.get("custom")
        this.state = {
            ref_id: custom ? custom.get("ref_id") : "",
            field1: custom ? custom.get("field1") : "",
            field2: custom ? custom.get("field2") : "",
            memo: custom ? custom.get("memo") : "",
        }
    }
    handleSave() {
        let record = this.props.record.toJS()
        this.props.updateRecord({
            ...record,
            custom: {
                ...record.custom,
                ref_id: this.state.ref_id,
                field1: this.state.field1,
                field2: this.state.field2,
                memo: this.state.memo,
            },
            update_at: getTimestamp(),
        })
        this.props.goBack()
    }
    handleArchive() {
        this.props.recordArchive(this.props.record.get("id"), true)
        this.props.goBack()
    }
    render() {
        let { record, task } = this.props
        let name = task ? task.get("name") : ""
        return record ? (<div>
            task : {name}<br />
            at : {record.get("date")}<br />
            <hr />
            ref_id:<input value={this.state.ref_id} onChange={(e) => this.setState({ ref_id: e.target.value })} /><br />
            memo:<input value={this.state.memo} onChange={(e) => this.setState({ memo: e.target.value })} /><br />
            field1:<input value={this.state.field1} onChange={(e) => this.setState({ field1: e.target.value })} /><br />
            field2:<input value={this.state.field2} onChange={(e) => this.setState({ field2: e.target.value })} /><br />
            <hr />
            <a onClick={this.handleSave}>(update)</a>
            <a onClick={this.props.goBack}>(close)</a>
            <FontIcon style={record.get("duration") ? styles3 : styles2} onClick={this.handleArchive} className="material-icons" >delete</FontIcon>
        </div>) :
            (<div>
                record not exists
                    <a onClick={this.props.goBack}>(goback)</a><br />
            </div>)
    }
}
export default withRouter(connect((state, ownProps) => {
    let app = state.app
    // let current_date = app.get("app").get("current_date")
    let record = app.get("records").find(r => r.get("id") === ownProps.match.params.id)
    return {
        record,
        task: app.get("tasks").find(d => d.get("id") == record.get("ref_task_id")),
        goBack: () => ownProps.history.push("/"), // todo : 正確導向
    }
}, (dispatch) => {
    return {
        updateRecord: bindActionCreators(updateRecord, dispatch),
        recordArchive: bindActionCreators(recordArchive, dispatch),
    }
})(MemoRecord))