import React from 'react'
import Dialog from 'material-ui/Dialog'
import RaisedButton from 'material-ui/RaisedButton'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getShortID, getTimestamp } from '../utils/id'
// import * as dialogActions from './MemoDialogRedux'

class MemoDialog extends React.Component {
    constructor() {
        super()
        this.handleClose = this.handleClose.bind(this)
        this.state = {
            tags: [],
            memo: "",
        }
        this.inputRefs = {
        }
    }
    handleClose() {
        let { record } = this.props
        if (!record.id) {
            record = {
                ...record,
                id: getShortID(),
                star: false,
                grade: 0,
                memo: "",
                update_at: getTimestamp(),
            }
        }
        record.memo = this.inputRefs.memo.value
        record.ref_etags = this.state.tags
        this.props.saveRecord(record)
        this.props.closeMemoDialog()
    }
    handleDelete(i) {
        const tags = this.state.tags.slice(0)
        tags.splice(i, 1)
        this.setState({ tags })
    }
    componentWillReceiveProps(nextProps) {
        let { record } = nextProps
        let ref_etags = record && record.ref_etags
        let memo = record && record.memo
        this.setState({
            tags: ref_etags || [],
            memo: memo || "",
        })
    }
    handleAddition(tag) {
        if (!tag.id)
            tag.id = getShortID()
        const tags = [].concat(this.state.tags, tag)
        this.setState({ tags })
    }
    render() {
        return (
            <div>
                <Dialog
                    open={this.props.open}
                    onRequestClose={this.handleClose}
                >
                    memo: <textarea style={{ width: "100%", height: "100px" }} ref={(ref) => this.inputRefs.memo = ref} defaultValue={this.state.memo}>
                    </textarea>
                    <RaisedButton label="Save" onTouchTap={this.handleClose} />
                </Dialog>
            </div>
        )
    }
}
export default connect((state) => {
    return {
        ...state.dialog,
        tags:state.app.etags.map(e=>({id:e.id,name:e.name})),
    };
}, (dispatch) => {
    return {
        saveRecord: bindActionCreators(listActions, dispatch).saveRecord,
        closeMemoDialog: bindActionCreators(dialogActions, dispatch).closeMemoDialog,
    };
})(MemoDialog)