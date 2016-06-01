import React, {Component} from 'react'
import 'whatwg-fetch'
import Promise from 'es6-promise'

export default class Header extends Component {

  constructor(props) {
    super(props)
    this.state = {
      map: null, // This value is set by componentDidMount in App.js
      csList: []
    }
  }

  componentDidMount() {
    console.log("------------------ header component did mount ------------------")
  }

  handleItemClick(cs) {
    console.log("item clicked !!!!!!!!!!!!!!!!!!!!!!")
    console.log(cs)
    console.log(this.state.map)
  }

  render() {
    return (
        <div id="header" data-role="header">
            <h1 id="mName">충전소 조회</h1>
            <a href="#left_menu" className="btn-menu">Menu</a>
            <a href={this.props.cp + "/mobile/index.do"} className="home" rel="external">홈으로 가기</a>
        </div>
    )
  }
}


