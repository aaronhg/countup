import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import * as homeActions from './HomeRedux'
// import * as dialogActions from '../dialog/MemoDialogRedux'
import FontIcon from 'material-ui/FontIcon'
import Task from './Task'
import Redistribution from './Redistribution'
import { getTimestamp, toSecs } from '../utils/id'
import { fromJS } from 'immutable'
import { saveAs } from 'file-saver'
import AddTask from './AddTask'
import DayGoTo from './DayGoTo'
import moment from 'moment'
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
        return (end_at - start_at) / 1000
    }
    let date = props.date.get("date")
    let d = new Date(date)
    let now = getTimestamp()
    let last_action_at = isNaN(Number(props.app.get("last_action_at"))) ? 0 : Number(props.app.get("last_action_at"))
    let counting_record_id = props.app.get("counting_record_id")

    let working_first_at = d.getTime()
    let working_start_at = isNaN(Number(props.user.get("working_start_at")))? 0:d.setHours(props.user.get("working_start_at"))
    let working_end_at = isNaN(Number(props.user.get("working_end_at"))) ? 0:d.setHours(props.user.get("working_end_at"))
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
        gonextdate = moment(working_last_at).format('YYYY/MM/DD')
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
        start_at: isActionThatDay() ? last_action_at : working_start_at,
        end_at: end_at,
        remaining: remaining,
        docount: docount,
        gonextdate: gonextdate,
    }
}
class Home extends React.Component {
    constructor(props) {
        super()
        // this.shift = this.shift.bind(this)
        this.redistribution = this.redistribution.bind(this)
        this.downloadJSON = this.downloadJSON.bind(this)
        var stat = getStat(props)
        this.state = {
            currentIdx: props.app.get("counting_record_id") || 0,
            addtask: false,
            redistribution: stat,
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
        clearInterval(this.timer)
    }
    shouldComponentUpdate(nextProps, nextState) {
        return true
    }
    componentWillReceiveProps(nextProps) {
        // 處理換天
        var stat = getStat(nextProps)
        this.setState({
            redistribution: stat,
        })
    }
    // shift(n) {
    //     this.setState({
    //         currentIdx: this.state.currentIdx + n,
    //     })
    // }
    redistribution() {
        var stat = getStat(this.props, true)
        this.setState({
            redistribution: stat,
        })
    }
    downloadJSON(){
        let date = this.props.date.toJS()
        let user_c = this.props.user.get("custom")
        let user = user_c? user_c.toJS() : {}
        let records = this.props.records.toJS()
        let tasks = this.props.tasks.toJS()
        date = {
            ...date.custom,
            value:date.date,
        }
        let obj = {
            user,
            date,
            records:records.map(r=>{
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
            download_at : getTimestamp(),
        }
        let txt = JSON.stringify(obj)
        let blob = new Blob([txt], {type: "application/json;charset=utf-8"});
        saveAs(blob, date.value+".json");
    }
    render() {
        let { records, tasks, app } = this.props
        let date = this.props.date.get("date")
        let len = records.size
        let cr = records.get(this.state.currentIdx) || records.get(0)
        let last_action_at = isNaN(Number(this.props.app.get("last_action_at"))) ? 0 : Number(this.props.app.get("last_action_at"))
        let d = new Date(date)
        let working_last_at = d.setHours(24)
        let past
        if (last_action_at >= working_last_at){
            past = true
        }
        // let idx = records.indexOf(currentRecord)
        // let len = records.length
        // let rightList = records.slice(idx + 1, len/2 + len%2 )
        // let leftList = records.slice(idx - len-1, len/2 - 1)

        return (<div>
            <DayGoTo maxDate={new Date()} onSelectDay={this.props.homeActions.changeDate} /> {date}
            <FontIcon onClick={this.downloadJSON} className="material-icons" >file_download</FontIcon>
            <hr />
            {
               !past?
               <div>
                {/*len >= 2 ?
                    <div>
                        <FontIcon className="material-icons" onClick={() => this.shift(-1)}>chevron_left</FontIcon>
                        <FontIcon className="material-icons" onClick={() => this.shift(1)}>chevron_right</FontIcon>
                    </div>
                    : ""
                */}
                <div>
                    <FontIcon onClick={this.redistribution} className="material-icons" >format_line_spacing</FontIcon>
                    {cr ? <Task type={past?"readonly":"mini"} {...this.props.homeActions} key={cr.get("id")} task={tasks.get(cr.get("ref_task_id"))} record={cr} app={app} />
                        : ""
                    }
                </div>
            </div>:
                <div />
            }
            <hr />
            tasks:{records.filter(r => !tasks.get(r.get("ref_task_id")).get("done")).map((r) =>
                <Task type={past?"readonly":"mini"} {...this.props.homeActions} key={r.get("id")} task={tasks.get(r.get("ref_task_id"))} record={r} app={app} />
            )}
            dones:{records.filter(r => tasks.get(r.get("ref_task_id")).get("done")).map((r) =>
                <Task type={past?"readonly":"mini"} {...this.props.homeActions} key={r.get("id")} task={tasks.get(r.get("ref_task_id"))} record={r} app={app} />
            )}
            <br /><hr />
            { !past?
                <a onClick={() => this.setState({ addtask: true })} >(addtask)</a>
                : <a />
            }
            {
                this.state.redistribution.at ?
                    <Redistribution onCancel={() => this.setState({
                        redistribution: { at: 0 },
                    })}
                        {...this.props.homeActions}
                        {...this.state.redistribution}
                        tasks={tasks}
                        records={records}
                        app={app}
                        addtask={() => this.setState({
                            addtask: true,
                        })}
                        date={date}
                    /> :
                    <div />
            }
            {
                this.state.addtask ?
                    <AddTask {...this.props.homeActions}
                        tasks={tasks}
                        onCancel={() => this.setState({
                            addtask: false,
                        })}
                        date={date}
                        records={records} /> :
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
        date: state.app.get("dates").filter(d => d.get("date") == current_date)[0] || fromJS({ date: current_date }),
        tasks: state.app.get("tasks"),
        records: state.app.get("records").filter(r => r.get("date") == current_date),
    }
}, (dispatch) => {
    return {
        homeActions: bindActionCreators(homeActions, dispatch),
        // dialogActions: bindActionCreators(dialogActions, dispatch),
    };
})(Home)