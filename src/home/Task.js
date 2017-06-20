import React from 'react'
import Counting from './Counting'
import FontIcon from 'material-ui/FontIcon'
import { getShortID, getTimestamp } from '../utils/id'

class Task extends React.Component {
    constructor(){
        super()
        this.stop = this.stop.bind(this)
        this.done = this.done.bind(this)
        this.play = this.play.bind(this)
    }
    stop(){
        this.props.doOperating({
            counting_record_id :"",
            last_action_at : getTimestamp()
        })
    }
    done(){
        this.props.doOperating({
            counting_record_id :"",
            last_action_at : getTimestamp(),
            done:true,
        })
    }
    play(){
        this.props.doOperating({
            counting_record_id :this.props.record.id,
            last_action_at : getTimestamp()
        })
    }
    render() {
        let { record } = this.props
        let isCounting = record.id == this.props.counting_record_id
        let diff = isCounting ? new Date().getTime() - this.props.last_action_at : 0
        return (<div>
            <FontIcon className="material-icons" >comment</FontIcon>
            {record.ref_task.name}
            <br />
            <FontIcon className="material-icons" >chat_bubble_outline</FontIcon>
            <Counting start={record.duration+diff} do={isCounting} />
            <FontIcon className="material-icons" >format_line_spacing</FontIcon>
            <br />
            {isCounting?
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