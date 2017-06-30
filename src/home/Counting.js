import React from "react"
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
        return (<span>{this.props.start} {this.props.do ? <span style={{ color: "red" }}>+ {this.state.count}</span> : <span />}</span>)
    }
}

export default Counting