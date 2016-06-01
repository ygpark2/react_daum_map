import React, {Component} from 'react'
import {render, findDOMNode} from 'react-dom'
import {renderToString, renderToStaticMarkup} from 'react-dom/server'
import 'whatwg-fetch'
import Promise from 'es6-promise'

export default class Body extends Component {

  constructor(props) {
    super(props)
    this.state = {
      map: null, // This value is set by componentDidMount in App.js
      imageSrc: 'http://www.kevcs.co.kr/images/pin_icon/quick1_12.png',
      imageSize: new daum.maps.Size(28, 41),
      imageOption: {offset: new daum.maps.Point(14, 41)},
      overlay: new daum.maps.CustomOverlay({ map: null }),
      markers: [],
    }

  }

  handleClick() {
    console.log(" this.setState({liked: !this.state.liked}); ")
  }

  getOverlayContent(cs, cpList) {
    var strCPList = $(cpList).map(function(i, cp) {
      return "<span>" + cp.charge_tp + " | " +
                        cp.charge_mthd_cd + " | " +
                        cp.use_time + " | " +
                        cp.cp_status + " | " +
             "</span>"
    })
    console.log(cpList)
    console.log("-------------------------------------")
    console.log($.makeArray(strCPList))
    return "<div class=\"wrap\">" +
               "<div class=\"info\">" +
                   "<div class=\"title\">" +
                       cs.cs_nm +
                       "<div class=\"close\" onClick=\"prev_overlay.setMap(null);\" title=\"닫기\"></div>" +
                   "</div>" +
                   "<div class=\"body\">" +
				        "<span> 구분 | 충전방식 | 이용시간 | 통신상태 </span>" +
				        "<br/>" +
				        $.makeArray(strCPList).join("<br/>") +
                   "</div>" +
               "</div>" +
           "</div>"
  }

  loadCsosDataFromServer(comp_cd) {

    if (comp_cd instanceof Array) {
        var newCsosReqJsonOjt = JSON.parse(JSON.stringify(this.props.app.state.csosReqJsonOjt))
        $.each(comp_cd, function( index, value ) {
          newCsosReqJsonOjt["comp" + value] = "0" + value
        }.bind(this))

        var url = this.props.cp + "/chargingInfra/getCsInfo?_REQ_DATA_TYPE_=json&_USE_WRAPPED_OBJECT_=true"
        var option = {
          method: 'POST',
          headers: {
              "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
          },
          body: this.props.app.state.serialize({_REQ_JSON_OBJECT_: JSON.stringify(newCsosReqJsonOjt)})
        }
        fetch(url, option).then((response) => { return response.json() })
          .then((json) => {
            var markers = $(json.data.list).map(function(idx, cs) {

              this.getMarkerByCompanyType(cs.comp_cd)

              var marker = new daum.maps.Marker({
                  title: cs.cs_nm,
                  clickable: true,
                  position : new daum.maps.LatLng(cs.cs_lati, cs.cs_longi),
                  image: new daum.maps.MarkerImage(this.state.imageSrc, this.state.imageSize, this.state.imageOption)
              })

              var overlay = new daum.maps.CustomOverlay({
                  clickable: true,
                  position: marker.getPosition(),
              })

              daum.maps.event.addListener(marker, 'click', function() {
                  this.loadCpDataFromServer(marker, overlay, cs)
                  // this.loadCpDataFromServer(marker, cs)
              }.bind(this))

              return marker
            }.bind(this))

            this.setState({
                markers: markers
            }, function() {

            })

            this.props.clusterer.addMarkers(markers)
            return json.data
          }).catch(function(error) {
            console.log('request failed', error)
          })
    } else {
        console.error("Wrong parameter! Only Array is accepted!")
    }
  }

  loadCpDataFromServer(marker, overlay, cs) {
  // loadCpDataFromServer(marker, cs) {

    this.props.app.state.cpReqJsonOjt["cs_id"] = cs.cs_id

    var url = this.props.cp + "/chargingInfra/getCpInfo?_REQ_DATA_TYPE_=json&_USE_WRAPPED_OBJECT_=true"
    var option = {
      method: 'POST',
      headers: {
          "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      body: this.props.app.state.serialize({_REQ_JSON_OBJECT_: JSON.stringify(this.props.app.state.cpReqJsonOjt)})
    }
    fetch(url, option).then((response) => { return response.json() })
      .then((json) => {
        /* ---------------------- disable custom overlay --------------------------
        var cpList = $(data.data.list).map(function(i, cp) {
            return cp.charge_mthd_cd + ", " + cp.charge_tp + ", " + cp.cp_status
        })

        if(this.state.overlay.getMap() !== null) {
            this.state.overlay.setMap(null)
        }

        // console.log(this.getOverlayContent(cs, data.data.list))
        overlay.setContent(this.getOverlayContent(cs, data.data.list))
        // console.log(this.state)
        overlay.setMap(this.state.map)

        this.state.overlay = overlay
        window.prev_overlay = overlay // 브라우저에서 창을 닫기위한 꼼
        -------------------------------------------------------------------------- */

        /* ------------------------ disable bottom window ----------------------- */
        // show bottom info window
        this.props.app.refs.footer.show(cs, json.data.list, marker)

        this.state.map.panTo(new daum.maps.LatLng(cs.cs_lati, cs.cs_longi))

        return json.data
      }).catch(function(error) {
        console.log('request failed', error)
      })
  }

  getMarkerByCompanyType(cd) {
    switch (cd) {
      case "01":
        this.state.imageSrc = "http://www.kevcs.co.kr/images/pin_icon/quick1_12.png"
        break;
      case "02":
        this.state.imageSrc = "http://www.kevcs.co.kr/images/pin_icon/quick2_23.png"
        break;
      case "03":
        this.state.imageSrc = "http://www.kevcs.co.kr/images/pin_icon/slow_11.png"
        break;
      case "09":
        this.state.imageSrc = "http://www.kevcs.co.kr/images/pin_icon/pin1.png"
        break;
      default:
        this.state.imageSrc = "http://www.kevcs.co.kr/images/pin_icon/quick1_12.png"
        break;
    }
  }

  componentWillMount() {
    console.log('component currently mounting')
    // this.loadCsosDataFromServer()

  }

  componentDidMount() {

    console.log('body component has mounted !!!!!')

    this.loadCsosDataFromServer(this.props.app.state.compCdList)

    var height = $(window).height() - $("#header").outerHeight()
    $("#map").height(height)

    // $("#map .btn-menu").css({ bottom: $("#footer").height() + 20 })
    // $("#map .btn-menu").height($("#map").height() - 60)
  }

  render() {
    return (
        <div role="main" className="ui-content" style={{padding: 0}}>
          <div id='map'>
            <a href="#right_menu" className="btn-menu">Menu</a>
          </div>
        </div>
    )
  }
}


