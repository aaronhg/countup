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
                this.setState({
                    count: this.state.count + 1,
                })
            }, 1000)
        }
    }
    componentWillUnmount() {
        clearInterval(this.timer)
    }
    render() {
        return (<span>{format(this.props.start)} {this.props.diff ? <span style={{ color: "red" }}>{format(this.state.count)}</span> : <span />}</span>)
    }
}

export default Counting