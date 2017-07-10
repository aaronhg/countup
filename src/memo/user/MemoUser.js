import React from "react"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { getTimestamp } from "../../utils/id"
import TimePicker from "material-ui/TimePicker"
import { updateUser } from "../../home/HomeRedux"
class MemoUser extends React.Component {
    constructor(props) {
        super(props)
        this.handleSave = this.handleSave.bind(this)
        let user = props.user
        let custom = user && user.get("custom")
        var d1 = new Date(),
            d2 = new Date()
        d1.setHours(user.get("working_start_at"), 0, 0, 0)
        d2.setHours(user.get("working_end_at"), 0, 0, 0)
        this.state = {
            ref_id: custom ? custom.get("ref_id") : "",
            system_key: custom ? custom.get("system_key") : "",
            field1: custom ? custom.get("field1") : "",
            field2: custom ? custom.get("field2") : "",
            working_start_at: user.get("working_start_at") ? d1 : undefined,
            working_end_at: user.get("working_end_at") ? d2 : undefined,
            working_hours: user.get("working_hours") || "",
            default_notification_mins: user.get("default_notification_mins"),
        }
    }
    handleSave() {
        let user = this.props.user.toJS()
        let wsa = this.state.working_start_at,
            wea = this.state.working_end_at
        if (wsa instanceof Date) {
            wsa = wsa.getHours()
        }
        if (wea instanceof Date) {
            wea = wea.getHours()
        }
        this.props.updateUser({
            ...user,
            custom: {
                ...user.custom,
                ref_id: this.state.ref_id,
                system_key: this.state.system_key,
                field1: this.state.field1,
                field2: this.state.field2,
            },
            working_start_at: wsa > wea ? wea : wsa,
            working_end_at: wsa > wea ? wsa : wea,
            working_hours: this.state.working_hours,
            default_notification_mins: this.state.default_notification_mins,
            update_at: getTimestamp(),
        })
        this.props.goBack()
    }
    render() {
        return (<div>
            Your
            <hr />
            ref_id:<input value={this.state.ref_id} onChange={(e) => this.setState({ ref_id: e.target.value })} /><br />
            system_key:<input value={this.state.system_key} onChange={(e) => this.setState({ system_key: e.target.value })} /><br />
            field1:<input value={this.state.field1} onChange={(e) => this.setState({ field1: e.target.value })} /><br />
            field2:<input value={this.state.field2} onChange={(e) => this.setState({ field2: e.target.value })} /><br />
            <hr />
            working_<br />
            start_at:<TimePicker minutesStep={60} format="24hr" autoOk={true} value={this.state.working_start_at} onChange={(e, d) => this.setState({ working_start_at: d })} />
            end_at:<TimePicker minutesStep={60} format="24hr" autoOk={true} value={this.state.working_end_at} onChange={(e, d) => this.setState({ working_end_at: d })} />
            hours:<input type="number" value={this.state.working_hours} onChange={(e) => this.setState({ working_hours: e.target.value })} /><br />
            <hr />
            default Notification mins:<input type="number" value={this.state.default_notification_mins} onChange={(e) => this.setState({ default_notification_mins: e.target.value })} /><br />
            <hr />
            <a onClick={this.handleSave}>(update)</a>
            <a onClick={this.props.goBack}>(close)</a><br />
        </div>)
    }
}
export default withRouter(connect((state, ownProps) => {
    let app = state.app
    return {
        user: app.get("user"),
        goBack: () => ownProps.history.push("/"), // todo : 正確導向
    }
}, (dispatch) => {
    return {
        updateUser: bindActionCreators(updateUser, dispatch),
    }
})(MemoUser))