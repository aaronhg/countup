import React from "react"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"
import { bindActionCreators } from "redux"
import { getTimestamp, getShortID } from "../../utils/id"
import { updateDate } from "../../home/HomeRedux"
import moment from "moment"
class MemoStamp extends React.Component {
    constructor(props) {
        super(props)
        this.handleSave = this.handleSave.bind(this)
        let custom = props.date && props.date.get("custom")
        this.state = {
            field1: custom ? custom.get("field1") : "",
            field2: custom ? custom.get("field2") : "",
            memo: custom ? custom.get("memo") : "",
        }
    }
    handleSave() {
        let date = this.props.date
        date = date ? date.toJS() : {}
        this.props.updateDate({
            ...date,
            custom: {
                ...date.custom,
                field1: this.state.field1,
                field2: this.state.field2,
                memo: this.state.memo,
            },
            date: this.props.datetxt,
            update_at: getTimestamp(),
        })
        this.props.goBack()
    }
    render() {
        let { datetxt } = this.props
        return (<div>
            date : {datetxt}<br />
            <hr />
            memo:<input value={this.state.memo} onChange={(e) => this.setState({ memo: e.target.value })} /><br />
            field1:<input value={this.state.field1} onChange={(e) => this.setState({ field1: e.target.value })} /><br />
            field2:<input value={this.state.field2} onChange={(e) => this.setState({ field2: e.target.value })} /><br />
            <hr />
            <a onClick={this.handleSave}>(update)</a>
            <a onClick={this.props.goBack}>(close)</a><br />
        </div>)
    }
}
export default withRouter(connect((state, ownProps) => {
    let app = state.app
    let current_date = app.get("app").get("current_date")
    return {
        datetxt: current_date,
        date: app.get("dates").find(d => d.get("date") == current_date),
        goBack: () => ownProps.history.push("/"), // todo : 正確導向
    }
}, (dispatch) => {
    return {
        updateDate: bindActionCreators(updateDate, dispatch),
    }
})(MemoStamp))