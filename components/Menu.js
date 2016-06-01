import React, {Component} from 'react';


export default class Menu extends Component {

  constructor(props) {
    super(props)
    this.state = {
      hide: this.hide.bind(this),
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

  show() {
    console.log("================== show ====================")
    console.log(this.state.filterList)
    console.log("=================== show ===================")
    this.state.animateObj[this.props.alignment] = "0px"
    $('.menu .' + this.props.alignment).animate(this.state.animateObj)
    this.props.idListForClickEvt.forEach(function(id) {
        if (this.state.filterList.indexOf(id) < 0) {
            $("#"+id).bind("click", this.state.hide)
        } else {

        }
    }.bind(this))
  }

  hide() {
    console.log("================= hide =====================")
    console.log(this.state.filterList)
    console.log("================= hide =====================")
    this.props.idListForClickEvt.forEach(function(id) {
        if (this.state.filterList.indexOf(id) < 0) {
            $("#"+id).unbind("click", this.state.hide)
        } else {

        }
    }.bind(this))
    var widthVal = $('.menu .' + this.props.alignment).width() * -1 + "px"
    this.state.animateObj[this.props.alignment] = widthVal
    $('.menu .' + this.props.alignment).animate(this.state.animateObj)
  }

  render() {
    return (
      <div className="menu">
          <div className={this.props.alignment}>{this.props.children}</div>
      </div>
    )
  }
}
