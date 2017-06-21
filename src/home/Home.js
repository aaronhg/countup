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
class Home extends React.Component {
    constructor(props) {
        super()
        // this.shift = this.shift.bind(this)
        this.redistribution = this.redistribution.bind(this)
        this.state = {
            currentIdx: props.app.get("counting_record_id") || 0,
            redistribution_at: 0,
            addtask:false,
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
        return true
    }
    // shift(n) {
    //     this.setState({
    //         currentIdx: this.state.currentIdx + n,
    //     })
    // }
    redistribution() {
        this.setState({
            redistribution_at: getTimestamp(),
        })
    }
    render() {
        let { records, tasks, app } = this.props
        let len = records.size
        let cr = records.get(this.state.currentIdx) || records.get(0)

        // let idx = records.indexOf(currentRecord)
        // let len = records.length
        // console.log(idx,len)
        // let rightList = records.slice(idx + 1, len/2 + len%2 )
        // let leftList = records.slice(idx - len-1, len/2 - 1)

        return (<div>
            {this.props.date.date}
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
            <a onClick={()=>this.setState({addtask:true})} >(addtask)</a>
            <br /><hr />
            {
                this.state.redistribution_at ?
                    <Redistribution onCancel={() => this.setState({
                            redistribution_at: 0,
                        })} {...this.props.homeActions} 
                        redistribution_at={this.state.redistribution_at} 
                        tasks={tasks} 
                        records={records}
                        app={app}
                        addtask={() => this.setState({
                            addtask: true,
                        })}
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
        //     <AddButon />
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