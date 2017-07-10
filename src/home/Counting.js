import React from "react"
import { format } from "../utils/period"
class Counting extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            count: props.diff || 0,
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            count: nextProps.diff || 0,
            doneA:false,
        })
        if (!nextProps.do && this.timer) {
            clearInterval(this.timer)
            this.timer = null
        }
        if (nextProps.do && !this.timer) {
            this.timer = setInterval(() => {
                this.setState({
                    count: this.state.count + 1,
                })
            }, 1000)
        }
    }
    componentDidMount() {
        if (this.props.do) {
            this.timer = setInterval(() => {
                let count = this.state.count + 1
                let floor = this.props.doAWhenReach
                let doneA = this.state.doneA
                if (floor && !doneA&& count >= floor) {
                    this.props.doA && this.props.doA()
                    doneA = true
                }
                this.setState({
                    count,
                    doneA,
                })
            }, 1000)
        }
    }
    componentWillUnmount() {
        clearInterval(this.timer)
    }
    render() {
        let s = (this.props.prefix?this.props.prefix:"") + (this.props.showStart ? format(this.props.start) : "")
        return (<span>{s} {this.props.diff ? <span style={{ color: "red" }}>{format(this.state.count)}</span> : <span />}</span>)
    }
}
Counting.propTypes = {
    // do,
    // doAWhenReach,
    // doA,
    // diff,
    // showStart,
    // start,
    // prefix,
    // count,//state
}
export default Counting