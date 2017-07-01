import React from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"

import * as homeActions from "./HomeRedux"
// import * as dialogActions from "../dialog/MemoDialogRedux"
import FontIcon from "material-ui/FontIcon"
import Task from "./Task"
// import Redistribution from "./Redistribution"
import { getTimestamp, toSecs } from "../utils/id"
import { fromJS } from "immutable"
import { saveAs } from "file-saver"
import RecordList from "./RecordList"
// import AddTask from "./AddTask"
import DayGoTo from "./DayGoTo"
import moment from "moment"
import { Link } from "react-router-dom"
class Home extends React.Component {
    constructor(props) {
        super(props)
        this.downloadJSON = this.downloadJSON.bind(this)
        // var stat = getStat(props)
    }
    componentDidMount() {
        // this.timer = setInterval(() => {
        //     var stat = getStat(this.props)
        //     if (stat.at) {
        //         this.setState(stat)
        //     }
        // // }, 600000) // 每 10 分鐘 check 一次
        // }, 5000) // 每 10 分鐘 check 一次
    }
    componentWillUnmount() {
    }
    // shouldComponentUpdate(nextProps, nextState) {
    //     return true
    // }
    componentWillReceiveProps(nextProps) {
        // this.setState({
        //     redistribution: getStat(nextProps),
        // })
    }
    // shift(n) {
    //     this.setState({
    //         currentIdx: this.state.currentIdx + n,
    //     })
    // }
    downloadJSON() {
        let date = this.props.date.toJS()
        let user_c = this.props.user.get("custom")
        let user = user_c ? user_c.toJS() : {}
        let records = this.props.records.toJS()
        let tasks = this.props.tasks.toJS()
        date = {
            ...date.custom,
            value: date.date,
        }
        let obj = {
            user,
            date,
            records: records.map(r => {
                r.task = tasks[r.ref_task_id]
                delete r.meta
                delete r.id
                delete r.date
                delete r.ref_task_id
                delete r.task.meta
                delete r.task.id
                delete r.update_at
                return r
            }),
            download_at: getTimestamp(),
        }
        let blob = new Blob([JSON.stringify(obj)], { type: "application/json;charset=utf-8" })
        saveAs(blob, date.value + ".json")
    }
    render() {
        let { records, tasks, app, homeActions, date } = this.props
        let last_action_at = isNaN(Number(app.get("last_action_at"))) ? 0 : Number(app.get("last_action_at"))
        let d = new Date(date.get("date"))
        let working_last_at = d.setHours(24)
        let past = (last_action_at >= working_last_at) ? true : false
        return (<div>
            <DayGoTo maxDate={new Date()} onSelectDay={homeActions.changeDate} /> {date}
            <FontIcon onClick={this.downloadJSON} className="material-icons" >file_download</FontIcon>
            <hr />
            {
                !past ?
                    <div>
                        <FontIcon className="material-icons" >format_line_spacing</FontIcon>
                    </div> :
                    <div />
            }
            <hr />
            <RecordList past={past} 
                        records={records}
                        tasks={tasks}
                        app={app}
                        doOperating={homeActions.doOperating} />
            <br /><hr />
            {!past ?
                <Link className="button tiny" to="/addtask">(addtask)</Link>
                : <a />
            }
        </div>)
    }
}
Home.propTypes = {
    // items: PropTypes.arrayOf(PropTypes.object).isRequired,
    // records: PropTypes.arrayOf(PropTypes.object),
}
export default connect((state) => {
    let current_date = state.app.get("app").get("current_date")
    return {
        app: state.app.get("app"),
        user: state.app.get("user"),
        date: state.app.get("dates").filter(d => d.get("date") == current_date)[0] || fromJS({ date: current_date }), //todo
        tasks: state.app.get("tasks"),
        records: state.app.get("records").filter(r => r.get("date") == current_date),
    }
}, (dispatch) => {
    return {
        homeActions: bindActionCreators(homeActions, dispatch),
        // dialogActions: bindActionCreators(dialogActions, dispatch),
    }
})(Home)