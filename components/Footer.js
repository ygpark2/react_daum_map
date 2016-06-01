import React, {Component} from 'react'
import 'whatwg-fetch'
import Promise from 'es6-promise'

export default class Footer extends Component {

  constructor(props) {
    super(props)
    this.state = {
      hide: this.hide.bind(this),
      animateObj: {bottom: "0px"},
      csInfo: {},
      cpList: [],
      zIndex: 10,
    }
  }

  show(cs, cpList, marker) {
    console.log("-----------------------------------------")
    console.log(cs)
    console.log(cpList)
    console.log("-----------------------------------------")

    var latlng = new daum.maps.LatLng(cs.cs_lati, cs.cs_longi)

    this.props.app.state.infowindow.setPosition(latlng)
    this.props.app.state.infowindow.setContent(this.props.app.state.getInfoWindowContent(cs.cs_nm))
    this.props.app.state.infowindow.open(this.props.app.state.map, marker)

    this.setState({csInfo: cs, cpList: cpList}, function() {

        $('#footer').animate({'bottom':'0'}, 400)
        /*
        this.state.animateObj["bottom"] = $('#footer').height() + "px"
        $('#footer').css( "display", "block" ).animate(this.state.animateObj, 400, function() {
            console.log(this)
        })
        */
    })
  }

  hide() {

    $('#footer').animate({'bottom':'-100%'}, 400)
    /*
    var heightVal = $('#footer').height() * -1 + "px"
    this.state.animateObj["bottom"] = heightVal
    $('#footer').animate(this.state.animateObj, 400, function() {
        $(this).css( "display", "none" )
    })
    */
  }

  componentDidMount() {
    $("#footer").css({ bottom: $("#footer").height()*-1 })
  }

  render() {
    return (
      <div data-role="footer" id='footer'>
        <table style={{border: 0, cellspacing: 0, cellpadding: 0}} className="mapLayerTable">
            <caption>
                <div className="ui-grid-a">
                    <div className="ui-block-a" style={{width: "85%"}}>
                        <img src="../../images/kevcs_logo.png" className="kevcs_logo"></img>
                        <div className="table_d_title_text" id="select_cs">
                            {this.state.csInfo.hasOwnProperty('cs_nm') ? this.state.csInfo.cs_nm : ""}
                        </div>
                    </div>
                    <div className="ui-block-b" style={{width: "15%", textAlign: "left"}}>
                        <a href="#" id="footer_close_btn" className="ui-btn ui-shadow ui-corner-all ui-icon-delete ui-btn-icon-right ui-btn-icon-notext ui-btn-b ui-btn-inline" onClick={this.hide.bind(this)}>Menu close</a>
                    </div>
                </div>
            </caption>
            <thead>
                <tr>
                    <th style={{borderBottomWidth: 0}}></th>
                    <th align="center">구분</th>
                    <th align="center">충전방식</th>
                    <th align="center">이용시간</th>
                    <th align="center">통신상태</th>
                    <th style={{borderBottomWidth: 0}}></th>
                </tr>
            </thead>
            <tbody id="cp_list">
                {this.state.cpList.map(function(cp, i){
                    return <tr>
                               <td style={{borderBottomWidth: 0}}></td>
                               <td align="center">{cp.charge_tp}</td>
                               <td align="center">{cp.charge_mthd_cd}</td>
                               <td align="center">{cp.use_time}</td>
                               <td align="center">{cp.cp_status}</td>
                               <td style={{borderBottomWidth: 0}}></td>
                           </tr>
                }.bind(this))}
            </tbody>
        </table>
      </div>
    )
  }
}


