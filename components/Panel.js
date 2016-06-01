import React, {Component} from 'react';


export default class Panel extends Component {

  constructor(props) {
    super(props)
    this.state = {
      animateObj: {},
      filterList: []
    }
    this.state.animateObj[this.props.alignment] = "0px"
  }

  componentDidMount() {
    console.log("+++++++++ Menu component did mount ++++++++++++")

  }

  componentWillUnmount() {
     console.log("+++++++++ Menu component will mount ++++++++++++")

  }

  render() {
    return (
      <div data-role="panel" id={this.props.idVal} data-position={this.props.position} data-display={this.props.display} data-theme={this.props.theme}>
          <div className={this.props.alignment}>{this.props.children}</div>
      </div>
    )
  }
}
