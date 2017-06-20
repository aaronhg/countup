import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

import * as taskActions from './HomeRedux'
// import * as dialogActions from '../dialog/MemoDialogRedux'
import FontIcon from 'material-ui/FontIcon'
import Task from './Task'
class Home extends React.Component {
    constructor(props) {
        super()
        this.shift = this.shift.bind(this)
        this.state = {
            // currentIdx: props.app.counting_record_id || "",
            currentIdx:0,
        }
    }
    componentWillReceiveProps(nextProps) {
        // this.setState({currentRecordId})
    }
    shouldComponentUpdate(nextProps, nextState) {
        return true
    }
    shift(n){
        this.setState({
            currentIdx :this.state.currentIdx +n,
        })
    }
    render() {
        let { records } = this.props
        let currentRecord = records[this.state.currentIdx] || records[0]
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
                <FontIcon className="material-icons" onClick={()=>this.shift(-1)}>chevron_left</FontIcon>
                <FontIcon className="material-icons" onClick={()=>this.shift(1)}>chevron_right</FontIcon>
                <div>
                    <Task {...this.props.taskActions} record={currentRecord} last_action_at={this.props.app.last_action_at} counting_record_id={this.props.app.counting_record_id} />
                </div>
            </div>
            <br /><hr />
            records:{records.filter(r=>!r.ref_task.done).map((r) =>
                        <Task {...this.props.taskActions} key={r.id} record={r} last_action_at={this.props.app.last_action_at} counting_record_id={this.props.app.counting_record_id} />
                    )
                }
            <br /><hr />
            dones:{records.filter(r=>r.ref_task.done).map((r) =>
                        <Task {...this.props.taskActions} key={r.id} record={r} last_action_at={this.props.app.last_action_at} counting_record_id={this.props.app.counting_record_id} />
                    )
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
    debugger
    return {
        ...state.app,
    };
}, (dispatch) => {
    return {
        taskActions: bindActionCreators(taskActions, dispatch),
        // dialogActions: bindActionCreators(dialogActions, dispatch),
    };
})(Home)