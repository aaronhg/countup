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
import AddTask from './AddTask'
import moment from 'moment'
function getStat(props, force) {
    debugger
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
    let last_action_at = props.app.get("last_action_at")
    let counting_record_id = props.app.get("counting_record_id")

    let working_first_at = d.getTime()
    let working_start_at = d.setHours(props.user.get("working_start_at"))
    let working_end_at = d.setHours(props.user.get("working_end_at"))
    let working_last_at = d.setHours(24)
    let doTrigger = false
    let start_at
    let end_at
    let remaining
    let at
    let docount
    let nextdate
    if (force) {
        doTrigger = true
        start_at = isActionThatDay() ? last_action_at : working_start_at
        end_at = now
        remaining = diff(end_at, start_at)
        docount = true
    } else if (now > working_last_at) { // 換天了
        doTrigger = true
        start_at = isActionThatDay() ? last_action_at : working_start_at
        end_at = working_end_at
        remaining = Math.max(diff(end_at, start_at), workhrdiff())
        docount = false
        nextdate = moment(working_last_at).format('YYYY/MM/DD')
    } else if (isOver() && (isCounting() || workhrdiff() > 0)) { // 工作結束及時數不滿
        doTrigger = true
        start_at = isActionThatDay() ? last_action_at : working_start_at
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
        doTrigger = true
        start_at = working_start_at
        end_at = now
        remaining = diff(end_at, start_at)
        docount = true
    }
    at = now
    if (!doTrigger)
        return {
            redistribution_at: 0,
            redistribution_start_at: 0,
            redistribution_end_at: 0,
            redistribution_remaining: 0,
            redistribution_docount: false,
            redistribution_gonextdate: '',
        }
    return {
        redistribution_at: at,
        redistribution_start_at: start_at,
        redistribution_end_at: end_at,
        redistribution_remaining: remaining,
        redistribution_docount: docount,
        redistribution_gonextdate: nextdate,
    }
}

class Home extends React.Component {
    constructor(props) {
        super()
        // this.shift = this.shift.bind(this)
        this.redistribution = this.redistribution.bind(this)
        var stat = getStat(props)
        this.state = {
            currentIdx: props.app.get("counting_record_id") || 0,
            addtask: false,
            ...stat,
        }
    }
    componentDidMount() {
        // this.timer = setInterval(() => {
        //     var stat = getStat(this.props)
        //     if (stat.redistribution_at) {
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
        this.setState(stat)
    }
    // shift(n) {
    //     this.setState({
    //         currentIdx: this.state.currentIdx + n,
    //     })
    // }
    redistribution() {
        var stat = getStat(this.props, true)
        this.setState(stat)
    }
    render() {
        let { records, tasks, app } = this.props
        let date = this.props.date.get("date")
        let len = records.size
        let cr = records.get(this.state.currentIdx) || records.get(0)

        // let idx = records.indexOf(currentRecord)
        // let len = records.length
        // let rightList = records.slice(idx + 1, len/2 + len%2 )
        // let leftList = records.slice(idx - len-1, len/2 - 1)

        return (<div>
            {date}
            <FontIcon className="material-icons" >more_vert</FontIcon>
            <br /><hr />
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
                    {cr ? <Task type="mini" {...this.props.homeActions} key={cr.get("id")} task={tasks.get(cr.get("ref_task_id"))} record={cr} app={app} />
                        : ""
                    }
                </div>
            </div>
            <br /><hr />
            tasks:{records.filter(r => !tasks.get(r.get("ref_task_id")).get("done")).map((r) =>
                <Task type="mini" {...this.props.homeActions} key={r.get("id")} task={tasks.get(r.get("ref_task_id"))} record={r} app={app} />
            )}
            dones:{records.filter(r => tasks.get(r.get("ref_task_id")).get("done")).map((r) =>
                <Task type="mini" {...this.props.homeActions} key={r.get("id")} task={tasks.get(r.get("ref_task_id"))} record={r} app={app} />
            )}
            <br /><hr />
            <a onClick={() => this.setState({ addtask: true })} >(addtask)</a>

            {
                this.state.redistribution_at ?
                    <Redistribution onCancel={() => this.setState({
                        redistribution_at: 0,
                    })}
                        {...this.props.homeActions}
                        start_at={this.state.redistribution_start_at}
                        end_at={this.state.redistribution_end_at}
                        remaining={this.state.redistribution_remaining}
                        docount={this.state.redistribution_docount}
                        gonextdate={this.state.redistribution_gonextdate}
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
    return {
        app: state.app.get("app"),
        user: state.app.get("user"),
        date: state.app.get("date"),
        tasks: state.app.get("tasks"),
        records: state.app.get("records"),
    }
}, (dispatch) => {
    return {
        homeActions: bindActionCreators(homeActions, dispatch),
        // dialogActions: bindActionCreators(dialogActions, dispatch),
    };
})(Home)