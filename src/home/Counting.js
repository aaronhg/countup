import React from 'react'
class Counting extends React.Component {
    constructor(props) {
        super()
        this.state = {
            count: props.start,
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({
            count: nextProps.start
        })
        if (!nextProps.do && this.timer){
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
        return (<span>{this.state.count}</span>)
    }
}

export default Counting