import React from "react"
const hrButtons = [
    { txt: "empty", val: "empty" },
    { txt: "-1h", val: -1 * 60 * 60 },
    { txt: "+1h", val: 1 * 60 * 60},
    { txt: "full", val: "full" },
]
const minButtons = [
    { txt: "-10", val: -10 * 60},
    { txt: "-5", val: -5 * 60 },
    { txt: "-1", val: -1 * 60 },
    { txt: "+1", val: 1 * 60 },
    { txt: "+5", val: 5 * 60 },
    { txt: "+10", val: 10 * 60 },
]

class TimeButtor extends React.Component {
    constructor() {
        super()
        this.handleChange = this.handleChange.bind(this)
        this.state = {
            count: 0, //secs
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
                case "full":
                    this.props.onTimeChanged("full")
                    break
                case "empty":
                    count = v = 0
                default:
                    count = count + Number(v)
                    this.setState({
                        count,
                    })
                    this.props.onTimeChanged(count)
                    break
            }
        }
    }
    render() {
        return (
            <div>
                <span style={{ color: "red" }}>+ {Math.floor(this.state.count / 3600)} h {Math.floor((this.state.count % 3600) / 60)} m {Math.floor(this.state.count % 60)} s</span>
                <div onClick={this.handleChange}>
                    {hrButtons.map(
                        v => <span key={v.val} data-v={v.val}>({v.txt})</span>
                    )}
                </div>
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