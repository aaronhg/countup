import React from 'react'
import Counting from './Counting'
import FontIcon from 'material-ui/FontIcon'
import { getTimestamp ,toSecs} from '../utils/id'

class Task extends React.Component {
    constructor() {
        super()
        this.stop = this.stop.bind(this)
        this.done = this.done.bind(this)
        this.play = this.play.bind(this)
    }
    stop() {
        this.props.doOperating({
            counting_record_id: "",
            last_action_at: getTimestamp()
        })
    }
    done() {
        this.props.doOperating({
            counting_record_id: "",
            last_action_at: getTimestamp(),
            done: true,
        })
    }
    play() {
        this.props.doOperating({
            counting_record_id: this.props.record.get("id"),
            last_action_at: getTimestamp()
        })
    }
    render() {
        let { record, app, task } = this.props
        let isCounting = record.get("id") == this.props.app.get("counting_record_id")
        let diff = toSecs(getTimestamp()) - toSecs(this.props.app.get("last_action_at"))
        if (this.props.type=="mini")
            return (<div>
                    <Counting start={(record.get("duration") || 0) + (isCounting ?diff:0)} do={isCounting} />
                    {isCounting ? <span><FontIcon className="material-icons" onClick={this.stop}>pause_circle_outline</FontIcon>
                                  <FontIcon className="material-icons" onClick={this.done}>done</FontIcon></span> :
                                  <span><FontIcon className="material-icons" onClick={this.play}>play_circle_outline</FontIcon></span>}
                    {task.get("name")}
                    </div>
                    )
        else if (this.props.type=="readonly"){
            return (<div>
                    {task.get("name")} , {record.get("duration")}
                    </div>
                    )
        }   
        else 
            return (
                <div>
                <FontIcon className="material-icons" >comment</FontIcon>
                {task.get("name")}
                <br />
                <FontIcon className="material-icons" >chat_bubble_outline</FontIcon>
                <Counting start={(record.get("duration") || 0) +  (isCounting ?diff:0)} do={isCounting} />
                <br />
                {isCounting ?
                    <div>
                        <FontIcon className="material-icons" onClick={this.stop}>pause_circle_outline</FontIcon>
                        <FontIcon className="material-icons" onClick={this.done}>done</FontIcon>
                    </div>
                    :
                    <div>
                        <FontIcon className="material-icons" onClick={this.play}>play_circle_outline</FontIcon>
                    </div>
                }
        </div>)
    }
}
export default Task