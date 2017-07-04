import React from "react"
import Counting from "./Counting"
import FontIcon from "material-ui/FontIcon"
import { getTimestamp, toSecs } from "../utils/id"
import { format } from "../utils/period"
import { Link } from "react-router-dom"
const styles = {
    float:"right",
}
class Task extends React.Component {
    constructor(props) {
        super(props)
        this.stop = this.stop.bind(this)
        this.done = this.done.bind(this)
        this.play = this.play.bind(this)
        this.pass = this.pass.bind(this)
    }
    stop() {
        this.props.doOperating({
            counting_record_id: "",
            last_action_at: getTimestamp()
        })
    }
    done() {
        let { record, app } = this.props
        if (record.get("id") == app.get("counting_record_id")) {
            this.stop()
        }
        this.props.recordDone(this.props.record.get("id"))
    }
    play() {
        this.props.doOperating({
            counting_record_id: this.props.record.get("id"),
            last_action_at: getTimestamp()
        })
    }
    pass() {
        this.props.redistributionComplete({
            operate: {
                last_action_at: this.props.app.get("last_action_at"),
                counting_record_id: "",
            },
            counts: {},
        })
    }
    render() {
        let { record, app, task } = this.props
        let isCounting = record.get("id") == app.get("counting_record_id")
        let diff = toSecs(getTimestamp()) - toSecs(app.get("last_action_at"))
        if (this.props.type == "mini")
            return (<div style={{height:40}}>
                <Link to={"/memo/task/"+task.get("id")}>{task.get("name")}</Link>
                <Link to={"/memo/record/"+record.get("id")}> @T</Link>
                <Counting start={record.get("duration") || 0} diff={isCounting ? diff : 0} do={isCounting} />
                <span style={styles}>
                    {isCounting
                        ? <FontIcon className="material-icons" onClick={this.stop}>pause_circle_outline</FontIcon>
                        : <FontIcon className="material-icons" onClick={this.play}>play_circle_outline</FontIcon>
                    }
                    {isCounting
                        ? <a onClick={this.pass}>(pass)</a>
                        : <a />
                    }
                    {!record.get("done")
                        ? <FontIcon className="material-icons" onClick={this.done}>done</FontIcon>
                        : <a />
                    }
                </span>
            </div>
            )
        else if (this.props.type == "readonly") {
            return (<div>
                {task.get("name")} , {format(record.get("duration"))}
            </div>
            )
        }
        // else
        //     return (
        //         <div>
        //             <FontIcon className="material-icons" >comment</FontIcon>
        //             {task.get("name")}
        //             <br />
        //             <FontIcon className="material-icons" >chat_bubble_outline</FontIcon>
        //             <Counting start={record.get("duration") || 0} diff={isCounting ? diff : 0} do={isCounting} />
        //             <br />
        //             {isCounting ?
        //                 <div>
        //                     <FontIcon className="material-icons" onClick={this.stop}>pause_circle_outline</FontIcon>
        //                     <FontIcon className="material-icons" onClick={this.done}>done</FontIcon>
        //                 </div>
        //                 :
        //                 <div>
        //                     <FontIcon className="material-icons" onClick={this.play}>play_circle_outline</FontIcon>
        //                 </div>
        //             }
        //         </div>)
    }
}
export default Task