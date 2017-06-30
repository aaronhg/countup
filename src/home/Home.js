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
function getStat(props, force) {
    // debugger
    var isOver = function () {
        return working_end_at < now && now < working_last_at
    }
    var isCounting = function () {
        return !!counting_record_id
    }
    var isWorking = function () {
        return working_start_at <= now && now <= working_end_at
    }
    var isActionThatDay = function () {
        return working_first_at < last_action_at && last_action_at < working_last_at
    }
    var workhrdiff = function () {
        return (working_end_at - working_start_at) / 1000 - props.records.reduce((c, r) => c + r.get("duration"), 0)
    }
    var diff = function (end_at, start_at) {
        return toSecs(end_at) - toSecs(start_at)
    }
    let date = props.date.get("date")
    let d = new Date(date)
    let now = getTimestamp()
    let last_action_at = isNaN(Number(props.app.get("last_action_at"))) ? 0 : Number(props.app.get("last_action_at"))
    let counting_record_id = props.app.get("counting_record_id")

    let working_first_at = d.getTime()
    let working_start_at = isNaN(Number(props.user.get("working_start_at"))) ? 0 : d.setHours(props.user.get("working_start_at"))
    let working_end_at = isNaN(Number(props.user.get("working_end_at"))) ? 0 : d.setHours(props.user.get("working_end_at"))
    let working_last_at = d.setHours(24)
    let doTrigger = false
    let start_at, end_at, at, remaining, docount, gonextdate
    debugger
    start_at = isActionThatDay() ? last_action_at : working_start_at
    if (force) {
        at = now
        doTrigger = true
        end_at = now
        remaining = diff(end_at, start_at)
        docount = true
    } else if (now > working_last_at && last_action_at < working_last_at) { // 換天了
        at = working_last_at
        doTrigger = true
        end_at = working_end_at
        remaining = Math.max(diff(end_at, start_at), workhrdiff())
        docount = false
        gonextdate = moment(working_last_at).format("YYYY/MM/DD")
    } else if (isOver() && workhrdiff() > 0) { // 工作結束及時數不滿
        // } else if ( isOver() && isCounting() &&  + idle 30 min)
        doTrigger = true
        at = now
        end_at = working_end_at
        remaining = Math.max(diff(end_at, start_at), workhrdiff())
        docount = false
        // } else if (isWorking() && isActionThatDay() && !isCounting()) { + idle 30 min
        //     doTrigger = true
        //     start_at = last_action_at
        //     end_at = now
        //     remaining = diff(end_at, start_at)
        //     docount = true
    } else if (isWorking() && !isActionThatDay() && !isCounting()) {
        at = now
        doTrigger = true
        start_at = working_start_at
        end_at = now
        remaining = diff(end_at, start_at)
        docount = true
    }
    if (!doTrigger)
        return { at: 0 }
    return {
        at: at,
        start_at: isActionThatDay() ? toSecs(last_action_at) : toSecs(working_start_at),
        end_at: toSecs(end_at),
        remaining: remaining,
        docount: docount,
        gonextdate: gonextdate,
    }
}
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
    // componentWillReceiveProps(nextProps) {
    //     // 處理換天
    //     this.setState({
    //         redistribution: getStat(nextProps),
    //     })
    // }
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
            <RecordList past={past} records={records} tasks={tasks} app={app} doOperating={homeActions.doOperating} />
            {/*<RecordList past={past} records={records.filter(r => !tasks.get(r.get("ref_task_id")).get("done"))} tasks={tasks} app={app}/>
            <RecordList past={past} records={records.filter(r => tasks.get(r.get("ref_task_id")).get("done"))} tasks={tasks} app={app}/>*/}
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