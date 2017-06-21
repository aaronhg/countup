import React from 'react'
const hrButtons = [
    { txt: 'empty', val: 'empty' },
    // { txt: '-5', val: -5 * 60 },
    { txt: '-1h', val: -1 * 60 },
    { txt: '+1h', val: 1 * 60 },
    // { txt: '+5', val: 5 * 60 },
    { txt: 'full', val: 'full' },
]
const minButtons = [
    { txt: '-10', val: -10 },
    { txt: '-5', val: -5 },
    { txt: '-1', val: -1 },
    { txt: '+1', val: 1 },
    { txt: '+5', val: 5 },
    { txt: '+10', val: 10 },
]

class TimeButtor extends React.Component {
    constructor() {
        super()
        this.handleChange = this.handleChange.bind(this)
        this.state = {
            count: 0, //mins
        }
        this.inputRef = {}
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            count: nextProps.count,
        })
    }
    handleChange(event) {
        if (event.target.nodeName == "SPAN") {
            let v = event.target.dataset.v
            let count = this.state.count
            switch (v) {
                case 'full':
                    this.props.onTimeChanged('full')
                    break;
                case 'empty':
                    count = v = 0
                default:
                    count = count + Number(v)
                    this.setState({
                        count,
                    })
                    this.props.onTimeChanged(count * 60) // *60 to secs
                    break;
            }
        }
    }
    render() {
        return (
            <div>
                {/*<input value={Math.floor(this.state.count / 60)} /><br />*/}
                <span style={{color:"red"}}>+ {Math.floor(this.state.count / 60)} h {Math.floor(this.state.count % 60)} m </span>
                <div onClick={this.handleChange}>
                    {hrButtons.map(
                        v => <span key={v.val} data-v={v.val}>({v.txt})</span>
                    )}
                </div>
                {/*<input value={Math.floor(this.state.count % 60)} /><br />*/}
                <div onClick={this.handleChange}>
                    {minButtons.map(
                        v => <span key={v.val} data-v={v.val}>({v.txt})</span>
                    )}
                </div>
            </div>
        )
    }
}
export default TimeButtor