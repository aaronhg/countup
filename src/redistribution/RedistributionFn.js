export default function getStat(props, force) {
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