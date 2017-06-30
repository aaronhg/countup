import React from "react"
import PropTypes from "prop-types"
import FontIcon from "material-ui/FontIcon"
import moment from "moment"
import DatePicker from "material-ui/DatePicker"
class DayGoTo extends React.Component {
    constructor() {
        super()
        this.handleChange = this.handleChange.bind(this)
    }
    handleChange(event, date) {
        this.props.onSelectDay(moment(date).format("YYYY/MM/DD"))
    }
    // shouldComponentUpdate(nextProps, nextState) {
    //     return true
    // }
    render() {
        return (<span>
            <FontIcon className="material-icons" onClick={() => this.refs.dp.openDialog()}>date_range</FontIcon>
            <DatePicker ref="dp" style={{ display: "none" }}
                maxDate={this.props.maxDate}
                onChange={this.handleChange}
                autoOk={true} />
        </span>
        )
    }
}
DayGoTo.propTypes = {
    onSelectDay: PropTypes.func,
}
export default DayGoTo