import React from "react"
import { bindActionCreators } from "redux"
import { connect } from "react-redux"
import PropTypes from "prop-types"

import * as homeActions from "./HomeRedux"
// import * as dialogActions from "../dialog/MemoDialogRedux"
import FontIcon2 from "material-ui/FontIcon"
const fontStyles = {
    fontSize: "36px",
}
var FontIcon = (props) => <FontIcon2 style={fontStyles} {...props} />
import Task from "./Task"
// import Redistribution from "./Redistribution"
import { getTimestamp, toSecs, getShortID } from "../utils/id"
import { fromJS } from "immutable"
import { saveAs } from "file-saver"
import RecordList from "./RecordList"
import Redistribution from "../redistribution/Redistribution"
import DayGoTo from "./DayGoTo"
import moment from "moment"
import { Link } from "react-router-dom"
// delete homeActions.default
function getStat(props) {
    // debugger
    var isOver = function (at) {
        return working_end_at < at && at < working_last_at
    }
    var isCounting = function () {
        return !!counting_record_id
    }
    var isWorking = function () {
        return working_start_at <= now && now <= working_end_at
    }
    var isThatDay = function (at) {
        return working_first_at < at && at < working_last_at
    }
    var workhrdiff = function () {
        return working_hours - props.records.reduce((c, r) => c + r.get("duration"), 0)
    }
    var diffFn = function (end_at, start_at) {
        return toSecs(end_at) - toSecs(start_at)
    }
    let date = props.date.get("date")
    let d = new Date(date)
    let now = getTimestamp()
    let last_action_at = isNaN(Number(props.app.get("last_action_at"))) ? 0 : Number(props.app.get("last_action_at"))
    let counting_record_id = props.app.get("counting_record_id")

    let working_first_at = d.getTime()
    let working_last_at = d.setHours(24)
    let redistribution_at = isNaN(Number(props.app.get("redistribution_at"))) ? 0 : props.app.get("redistribution_at")
    d = new Date(date)
    let working_start_at = isNaN(Number(props.user.get("working_start_at"))) ? working_first_at : d.setHours(props.user.get("working_start_at"))
    let working_end_at = isNaN(Number(props.user.get("working_end_at"))) ? working_last_at : d.setHours(props.user.get("working_end_at"))
    let working_hours = isNaN(Number(props.user.get("working_hours"))) ? ((working_end_at - working_start_at) / 1000) : props.user.get("working_hours") * 3600

    let doTrigger = false
    let start_at, end_at, at, remaining, docount, gonextdate, closable = true
    let diff
    start_at = isThatDay(last_action_at) ? last_action_at : working_start_at
    // debugger
    // todo trigger 很多次，看是否可以減少
    if (now > working_last_at && last_action_at < working_last_at) { // 換天了
        at = working_last_at
        doTrigger = true
        end_at = working_end_at
        remaining = Math.max(diffFn(end_at, start_at), workhrdiff())
        diff = 0
        docount = false
        closable = false
        gonextdate = moment(working_last_at).format("YYYY/MM/DD")
    } else if (isThatDay(redistribution_at)) {
        at = redistribution_at
        doTrigger = true
        end_at = redistribution_at
        remaining = diffFn(end_at, start_at)
        diff = diffFn(now, end_at)
        docount = true
    } else if (isOver(now) && !isOver(last_action_at) && workhrdiff() > 0) { // 工作結束及時數不滿
        // } else if ( isOver() && isCounting() &&  + idle 30 min)
        doTrigger = true
        at = now
        end_at = working_end_at
        remaining = Math.max(diffFn(end_at, start_at), workhrdiff())
        diff = diffFn(now, end_at)
        docount = false
        // } else if (isWorking() && isActionThatDay() && !isCounting()) { + idle 30 min
        //     doTrigger = true
        //     start_at = last_action_at
        //     end_at = now
        //     remaining = diffFn(end_at, start_at)
        //     docount = true
    } else if (isWorking() && !isThatDay(last_action_at) && !isCounting()) {
        at = now
        doTrigger = true
        start_at = working_start_at
        end_at = now
        diff = diffFn(now, end_at)
        remaining = diffFn(end_at, start_at)
        closable = false
        docount = true
    }
    if (!doTrigger)
        return { at: 0 }
    return {
        at: at,
        start_at: isThatDay(last_action_at) ? last_action_at : working_start_at,
        end_at: end_at,
        remaining: remaining,
        diff: diff,
        docount: docount,
        closable,
        gonextdate: gonextdate,
    }
}
class Home extends React.Component {
    constructor(props) {
        super(props)
        this.downloadJSON = this.downloadJSON.bind(this)
        this.redistribution = this.redistribution.bind(this)
        this.clearRedistribution = this.clearRedistribution.bind(this)
        this.handleStamp = this.handleStamp.bind(this)
        this.state = {
            redistribution: getStat(props),
        }
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
        this.setState({
            redistribution: getStat(nextProps),
        })
    }
    redistribution() {
        this.props.homeActions.redistributionAt(getTimestamp())
    }
    clearRedistribution() {
        this.props.homeActions.redistributionAt(0)
    }
    handleStamp() {
        let id = getShortID()
        this.handleStampNoPush(id)
        this.props.homeActions.gotoStamp(id)
    }
    handleStampNoPush(id) {
        this.props.homeActions.saveStamp({
            id,
            at: getTimestamp(),
            date: this.props.date.get("date"),
        })
    }
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
                delete r.date
                return r
            }),
            download_at: getTimestamp(),
        }
        let blob = new Blob([JSON.stringify(obj, (k, v) => ~["$loki", "meta", "id", "ref_task_id"].indexOf(k) ? undefined : v)], { type: "application/json;charset=utf-8" })
        saveAs(blob, date.value + ".json")
    }
    render() {
        let { records, tasks, app, homeActions, date } = this.props
        let last_action_at = isNaN(Number(app.get("last_action_at"))) ? 0 : Number(app.get("last_action_at"))
        let d = new Date(date.get("date"))
        let working_last_at = d.setHours(24)
        let past = (last_action_at >= working_last_at) ? true : false
        return (<div>
            <DayGoTo maxDate={new Date()} onSelectDay={homeActions.changeDate} /> {date.get("date")}
            <FontIcon onClick={this.downloadJSON} className="material-icons" >file_download</FontIcon>
            <hr />
            {
                !past ?
                    <div>
                        <span onClick={this.redistribution}>(<FontIcon className="material-icons">format_line_spacing</FontIcon>redistribution)</span>
                    </div> :
                    <div />
            }
            <hr />
            <RecordList past={past}
                records={records}
                tasks={tasks}
                app={app}
                doOperating={homeActions.doOperating}
                recordDone={homeActions.recordDone}
                redistributionComplete={homeActions.redistributionComplete}
            />
            <br /><hr />
            {!past ?
                <Link to="/addtask"><FontIcon className="material-icons" >add_circle_outline</FontIcon></Link>
                : <a />
            }
            <a style={{ float: "right" }} onClick={this.handleStamp}>(make a stamp)</a>
            <Link to="/actionlog"><FontIcon className="material-icons" >history</FontIcon></Link><br />
            memo:
            <Link to="/memo/date"><FontIcon className="material-icons" >date_range</FontIcon></Link>
            <Link to="/memo/user"><FontIcon className="material-icons" >face</FontIcon></Link>
            {
                this.state.redistribution.at ?
                    <Redistribution
                        {...this.state.redistribution}
                        records={records}
                        tasks={tasks}
                        redistributionComplete={this.props.homeActions.redistributionComplete}
                        onCancel={this.clearRedistribution}
                    /> :
                    <div />
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
        date: state.app.get("dates").find(d => d.get("date") == current_date) || fromJS({ date: current_date }), //todo
        tasks: state.app.get("tasks"),
        records: state.app.get("records").filter(r => r.get("date") == current_date),
    }
}, (dispatch) => {
    return {
        homeActions: bindActionCreators(homeActions, dispatch),
        // dialogActions: bindActionCreators(dialogActions, dispatch),
    }
})(Home)