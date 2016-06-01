import React, {Component} from 'react';


export default class SubMenu extends Component {

  constructor(props) {
    super(props)
    this.state = {
      active: false,
    }
  }

  handleToggleClick (event) {
    var slideToggleOption = {
      duration: "fast",
      start: function() {
        console.log($(this).parent())
        $(this).parent().toggleClass( "active" )
      },
      done: function() {
        console.log($(this))
      }
    }
    var menuList = $(event.currentTarget).next()
    $('.submenu.active').each(function(){
      var childMenuList = $(this).children(".menu_list")
      console.log("--------------------------------------------")
      console.log(menuList.text() == childMenuList.text())
      if (menuList.text() === childMenuList.text()) {
        console.log("same menu list !!!!!!!!!!!!!!!")
      } else {
        childMenuList.slideToggle(slideToggleOption)
      }
    })
    menuList.slideToggle(slideToggleOption)
  }

  render() {
    return (
      <div className={"submenu" + (this.state.active ? " active" : "")}>
        <div className="title" onClick={this.handleToggleClick.bind(this)}>
            {this.props.name}
        </div>
        <div className="menu_list" id="menu_list" style={{display: "none"}}>
          {this.props.children}
        </div>
      </div>
    )
  }
}
