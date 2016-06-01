import React, {Component} from 'react'
import {render} from 'react-dom'
import Select from 'react-select'
import 'whatwg-fetch'
import Promise from 'es6-promise'

import Header from './Header'
import Body from './Body'
import Footer from './Footer'
import Panel from './Panel'
import SubMenu from './SubMenu'
import MenuItem from './MenuItem'

export default class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      map: null,
      mapContainer: "", // 지도를 표시할 div
      mapOption: {
          center: new daum.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
          level: 9 // 지도의 확대 레벨
      },
      mapTypeControl: new daum.maps.MapTypeControl(),
      zoomControl: new daum.maps.ZoomControl(),
      infowindow: new daum.maps.InfoWindow({
          content : "",
          zIndex : 3,
          removable : true
      }),
      clusterer: new daum.maps.MarkerClusterer({
          // map: this.state.map, // 마커들을 클러스터로 관리하고 표시할 지도 객체
          averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
          minLevel: 10, // 클러스터 할 최소 지도 레벨
          disableClickZoom: true // 클러스터 마커를 클릭했을 때 지도가 확대되지 않도록 설정한다
      }),
      idListForClickEvt: ["header", "map", "footer"],
      compCd1isChecked: true,
      compCd2isChecked: true,
      compCd3isChecked: true,
      compCd9isChecked: true,
      compCdList: [],
      csosReqJsonOjt: {
          area_cd:"",
          warea_cd:"", // 제주도 7, 전국 empty
          cs_tp:"",
          cs_nm:"",
          // comp1:"01", comp2:"02", comp3:"03",
          charge1:"1",
          charge2:"2",
          charge3:"3",
          charge4:"4"
      },
      cpReqJsonOjt: {
          cs_id: "",
          charge_tp:""
      },
      serialize: (data) => {
          return Object.keys(data).map(function (keyName) {
              return encodeURIComponent(keyName) + '=' + encodeURIComponent(data[keyName])
          }).join('&')
      },
      regionDivisionSelectOption: {
          selectValue: '',
      },
      regionSelectOption: {
          selectValue: '',
      },
      regionOptions: [],
      csList: [],
      getInfoWindowContent: (nm) => {
        return '<div style="padding:5px;">' + nm + '</div>'
      },
    }
    // compCd init
    $.each([1,2,3,9], function( idx, val ) {
      this.state["compCd" + val + "isChecked"] ? this.state.compCdList.push(val) : this.state.compCdList.splice(this.state.compCdList.indexOf(val), 1)
    }.bind(this))
  }

  componentDidMount() {

    console.log('!!! app component has mounted !!!')

    this.setState({mapContainer: document.getElementById('map')}, function() {
        this.setState({map: new daum.maps.Map(this.state.mapContainer, this.state.mapOption)}, function() {

            this.state.map.addControl(this.state.mapTypeControl, daum.maps.ControlPosition.TOPRIGHT)
            // zoomControl disable
            // this.state.map.addControl(this.state.zoomControl, daum.maps.ControlPosition.RIGHT)

            this.state.clusterer.setMap(this.state.map)

            daum.maps.event.addListener(this.state.clusterer, 'clusterclick', function(cluster) {

                var level = this.state.map.getLevel()-1

                this.state.map.setLevel(level, {anchor: cluster.getCenter()})
            }.bind(this))

            this.refs.header.setState({map: this.state.map})
            this.refs.body.setState({map: this.state.map})

            // jquerymobile pageshow event and relayout map
            $(document).on('pageshow',function(){
                this.state.map.relayout()
                this.state.map.panTo(this.state.mapOption.center)
            }.bind(this))
        }.bind(this))
    }.bind(this))

/*
$(document).on('pagebeforecreate',function(){console.log('pagebeforecreate');});
$(document).on('pagecreate'    $(document).on('pageshow',function(){
        console.log('pageshow')
    }),function(){console.log('pagecreate');});
$(document).on('pageinit',function(){console.log('pageinit');});
$(document).on('pagebeforehide',function(){console.log('pagebeforehide');});
$(document).on('pagebeforeshow',function(){console.log('pagebeforeshow');});
$(document).on('pageremove',function(){console.log('pageremove');});
$(document).on('pageshow',function(){console.log('pageshow');});
$(document).on('pagehide',function(){console.log('pagehide');});
$(window).load(function () {console.log("window loaded");});
$(window).unload(function () {console.log("window unloaded");});
*/

  }

  componentDidUpdate(prevProps, prevState) {
    console.log("app component did update!!!!!!!!!!!!!!")

  }

  /* ===============================================
  shouldComponentUpdate(nextProps, nextState) {
    console.log("|||||||||||||||||| app shouldComponentUpdate ||||||||||||||||||")
  }
  ================================================ */

  componentWillUnmount() {
    // window.removeEventListener('resize', this.state.handleWindowResize);
  }

  componentWillMount() {
    console.log("app component wiil mount!!!!!!!!!!!!!!")

  }

  componentWillReceiveProps(nextProps) {
    console.log("app component will receive props !!!!!!!!!!!!!!")

  }

  showLeft() {
    this.refs.left.show()
  }

  hideLeft() {
    this.refs.left.hide()
  }

  showRight() {
    this.refs.right.show()
  }

  hideRight() {
    this.refs.right.hide()
  }

  compCdUpdateCallback(cd) {
    this.state["compCd" + cd + "isChecked"] ? this.state.compCdList.push(cd) : this.state.compCdList.splice(this.state.compCdList.indexOf(cd), 1)

    this.state.infowindow.close()
    this.state.clusterer.clear()
    this.refs.body.loadCsosDataFromServer(this.state.compCdList)
  }

  onCompCdChange(cd) {
    switch (cd) {
        case 1:
            this.setState({compCd1isChecked: !this.state.compCd1isChecked}, this.compCdUpdateCallback.bind(this, cd))
            break
        case 2:
            this.setState({compCd2isChecked: !this.state.compCd2isChecked}, this.compCdUpdateCallback.bind(this, cd))
            break
        case 3:
            this.setState({compCd3isChecked: !this.state.compCd3isChecked}, this.compCdUpdateCallback.bind(this, cd))
            break
        case 9:
            this.setState({compCd9isChecked: !this.state.compCd9isChecked}, this.compCdUpdateCallback.bind(this, cd))
            break
        default:
            console.error("not expect comp_cd value !!! ", cd)
            break
    }
  }

  onRegionDivisionChange(event) {
    var newValue = event.target.value
    console.log("Selected: " + newValue)
    this.setState({
        regionDivisionSelectOption: {
            selectValue: newValue
        },
        regionOptions: [],
    }, function() {

        var url = this.props.cp + "/comCd/getComCdList?_REQ_DATA_TYPE_=json&_USE_WRAPPED_OBJECT_=true"
        var option = {
          method: 'POST',
          headers: {
              "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
          },
          body: this.state.serialize({'_REQ_JSON_OBJECT_': JSON.stringify({cd_cl: newValue})})
        }
        fetch(url, option).then((response) => { return response.json() })
            .then((json) => {
                var regionOptions = $(json.data.list).map(function(idx, rgn) {
                                        return { value: rgn.cd, label: rgn.cd_desc }
                                    })
                this.setState({regionOptions: $.makeArray(regionOptions)})
                this.refs.regionSelect.defaultValue = ""
                return regionOptions
            }).catch(function(error) {
                console.log('request failed', error)
            })
    })
  }

  onRegionChange(event) {
    var newValue = event.target.value
    console.log("Selected: " + newValue)

    this.setState({
        regionSelectOption: {
            selectValue: newValue
        }
    }, function() {

    })
  }

  onSearchClick() {
    var newCsosReqJsonOjt = JSON.parse(JSON.stringify(this.state.csosReqJsonOjt))
    $.each([1,2,3], function( index, value ) {
      newCsosReqJsonOjt["comp" + value] = "0" + value
    }.bind(this))

    newCsosReqJsonOjt["area_cd"] = this.state.regionDivisionSelectOption.selectValue == "CD103" ? this.state.regionSelectOption.selectValue : ""
    newCsosReqJsonOjt["warea_cd"] = this.state.regionDivisionSelectOption.selectValue == "CD114" ? this.state.regionSelectOption.selectValue : ""
    newCsosReqJsonOjt["cs_nm"] = this.refs.searchTextInput.value

    var url = this.props.cp + "/chargingInfra/getCsInfo?_REQ_DATA_TYPE_=json&_USE_WRAPPED_OBJECT_=true"
    var option = {
      method: 'POST',
      headers: {
          "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      body: this.state.serialize({'_REQ_JSON_OBJECT_': JSON.stringify(newCsosReqJsonOjt)})
    }
    fetch(url, option).then((response) => { return response.json() })
        .then((json) => {
            console.log("------------ fetch response error -------------------")
            console.log(json.data.list)
            this.setState({
              csList: json.data.list
            }, function() {

              //  검색 결과 수에 따라 조절 높이
              var searchListHeight = $('#searchList').height() + $('#searchList').offset().top
              if (searchListHeight > $(window).height() ) {
                var searchListNewHeight = $(window).height() - $('#searchList').offset().top - 20
                $('#searchList').height(searchListNewHeight)
              } else {
                $('#searchList').height('100%')
              }
              var firstCS = json.data.list[0]
              // move map to the first cs in the searched list
              this.state.map.panTo(new daum.maps.LatLng(firstCS.cs_lati, firstCS.cs_longi))
            })
            return json
        }).catch(function(error) {
            console.log('request failed', error)
        })
  }

  onSearchedItemClick(cs) {
    console.log("item clicked !!!!!!!!!!!!!!!!!!!!!!")

    var latlng = new daum.maps.LatLng(cs.cs_lati, cs.cs_longi)

    this.state.map.panTo(latlng)

    // this.refs.body.loadCpDataFromServer({}, {}, cs)

    var latFloatSize = cs.cs_lati.split(".").pop().length
    var lngFloatSize = cs.cs_longi.split(".").pop().length

    var fnd = $.makeArray(this.refs.body.state.markers).filter(function(marker) {
        var markerLat = marker.getPosition().getLat()
        var markerLng = marker.getPosition().getLng()
        return cs.cs_lati === markerLat.toFixed(latFloatSize) && cs.cs_longi === markerLng.toFixed(lngFloatSize)
    })

    // infowindow open
    this.state.infowindow.setPosition(latlng)
    this.state.infowindow.setContent(this.state.getInfoWindowContent(cs.cs_nm))
    this.state.infowindow.open(this.state.map, fnd.pop())
  }

  getChkBoxClassNames(isChecked, isFirst, isLast) {
    var classNames = "ui-btn ui-corner-all ui-btn-inherit ui-btn-icon-left"
    if (isChecked) {
        classNames = classNames + " ui-checkbox-on"
    } else {
        classNames = classNames + " ui-checkbox-off"
    }
    if (isFirst) {
        classNames = classNames + " ui-first-child"
    }
    if (isLast) {
        classNames = classNames + " ui-last-child"
    }
    return classNames
  }

  render() {
    console.log("app is renderd!!!!!!!!!!!!!!1")

    return (
      <div id='page' data-role="page">

        <Header ref="header" cp={this.props.cp} app={this} clusterer={this.state.clusterer} />

        <Body ref="body" cp={this.props.cp} app={this} clusterer={this.state.clusterer} />

        <Footer ref="footer" app={this} idListForClickEvt={this.state.idListForClickEvt} clusterer={this.state.clusterer} />

        <Panel ref="left" idVal="left_menu" position="left" display="overlay" theme="b" idListForClickEvt={this.state.idListForClickEvt}>
            <div className="lang-select">
                <span style={{color: "#e5e5e5"}}>KEVCS</span>
                <a href="#left_menu_close" className="btn-menu-close" data-rel="close">Left Menu close</a>
            </div>
            <div className="menu-item">
                <a href={this.props.isLogin ? this.props.cp + "/mobile/logout.do" : this.props.cp + "/mobile/loginInit.do"} rel="external">{this.props.isLogin ? "로그아웃" : "로그인"}</a>
            </div>
            <div className="menu-item">
                <SubMenu name="회사 소개">
                    <div className="submenu-item">
                        <a href={this.props.cp + "/mobile/info/getCompanyInfo.do"} rel="external">회사 소개</a>
                    </div>
                    <div className="submenu-item">
                        <a href={this.props.cp + "/mobile/info/getBizServiceInfo.do"} rel="external">제공서비스</a>
                    </div>
                    <div className="submenu-item">
                        <a href={this.props.cp + "/mobile/info/getComHistory.do"} rel="external">연 혁</a>
                    </div>
                    <div className="submenu-item">
                        <a href={this.props.cp + "/mobile/info/getComCibi.do"} rel="external">CIBI</a>
                    </div>
                    <div className="submenu-item">
                        <a href={this.props.cp + "/mobile/info/getComLocation.do"} rel="external">위 치</a>
                    </div>
                    <div className="submenu-item">
                        <a href={this.props.cp + "/mobile/info/archives"} rel="external">보도 자료</a>
                    </div>
                </SubMenu>
            </div>
            <div className="menu-item">
                <SubMenu name="충전서비스">
                    <div className="submenu-item">
                        <a href={this.props.cp + "/mobile/chargingInfra/getHomeCharger.do"} rel="external">홈충전 구축/관리</a>
                    </div>
                    <div className="submenu-item">
                        <a href={this.props.cp + "/mobile/chargingInfra/getSharingCharger.do"} rel="external">공용충전멤버십</a>
                    </div>
                    <div className="submenu-item">
                        <a href={this.props.cp + "/mobile/chargingInfra/getCustomerService.do"} rel="external">고객서비스</a>
                    </div>
                    {/*
                    <div className="submenu-item">
                        <a href={this.props.cp + "/mobile/chargingInfra/getQuickCharger.do"} rel="external">충전기이용방법</a>
                    </div>
                    */}
                </SubMenu>
            </div>
            <div className="menu-item">
                <a href={this.props.cp + "/mobile/info/chargerSearch.do"} rel="external">충전소안내</a>
            </div>
            <div className="menu-item">
                <a href={this.props.isLogin ? this.props.cp + "/mobile/mypage/myPassCheck.do" : this.props.cp + "/mobile/loginInit.do"} rel="external">마이페이지</a>
            </div>
            <div className="menu-item">
                <SubMenu name="고객센터">
                    <div className="submenu-item">
                        <a href={this.props.cp + "/mobile/csCenter.do"} rel="external">고객센터</a>
                    </div>
                    <div className="submenu-item">
                        <a href={this.props.cp + "/mobile/board/boardList.do"} rel="external">공지사항</a>
                    </div>
                </SubMenu>
            </div>
        </Panel>

        <Panel ref="right" idVal="right_menu" position="right" display="overlay" theme="b" idListForClickEvt={this.state.idListForClickEvt}>
            <div className="ui-grid-a">
                <div className="ui-block-a" style={{marginTop: 5, fontWeight: "bold"}}>
                    검색
                </div>
                <div className="ui-block-b" style={{textAlign: "right"}}>
                    <a href="#right_menu_close" style={{margin: "auto"}} className="ui-btn ui-shadow ui-corner-all ui-icon-delete ui-btn-icon-notext ui-btn-b ui-btn-inline ui-btn-icon-right" data-rel="close">Menu close</a>
                </div>
            </div>
            <div data-role="controlgroup" data-enhanced="true" className="ui-controlgroup ui-controlgroup-vertical ui-group-theme-b ui-corner-all">
                <div role="heading" className="ui-controlgroup-label">
                    <legend>충전기 타입 :</legend>
                </div>
                <div className="ui-controlgroup-controls ui-shadow">
                    <div className="ui-checkbox ui-mini">
                        <input type="checkbox" name="compCd1" id="compCd1isChecked" data-role="none" data-cacheval={this.state.compCd1isChecked} onChange={this.onCompCdChange.bind(this, 1)}/>
                        <label htmlFor="compCd1isChecked" className={this.getChkBoxClassNames(this.state.compCd1isChecked, true, false)}>한국전기차충전서비스(주)</label>
                    </div>
                    <div className="ui-checkbox ui-mini">
                        <input type="checkbox" name="compCd2" id="compCd2isChecked" data-role="none" data-cacheval={this.state.compCd2isChecked} onChange={this.onCompCdChange.bind(this, 2)}/>
                        <label htmlFor="compCd2isChecked" className={this.getChkBoxClassNames(this.state.compCd2isChecked, false, false)}>한국전력공사</label>
                    </div>
                    <div className="ui-checkbox ui-mini">
                        <input type="checkbox" name="compCd3" id="compCd3isChecked" data-role="none" data-cacheval={this.state.compCd3isChecked} onChange={this.onCompCdChange.bind(this, 3)}/>
                        <label htmlFor="compCd3isChecked" className={this.getChkBoxClassNames(this.state.compCd3isChecked, false, false)}>환경부(환경공단)</label>
                    </div>
                </div>
            </div>
            <label htmlFor="selected-region-division" className="select">지역, 권역</label>
            <select ref="regionDivisionSelect" name="selected-region-division" id="selected-region-division" data-mini="true" data-inline="true" value={this.state.regionDivisionSelectOption.selectValue} onChange={this.onRegionDivisionChange.bind(this)}>
                <option value="" disabled>선택</option>
                <option value="CD103">지역</option>
                <option value="CD114">권역</option>
            </select>
            <select ref="regionSelect" name="selected-region" id="selected-region" data-mini="true" data-inline="true" value={this.state.regionSelectOption.selectValue} onChange={this.onRegionChange.bind(this)}>
                <option value="">선택</option>
                {
                    this.state.regionOptions.map(function(region) {
                        return <option key={region.value} value={region.value}>{region.label}</option>
                    }.bind(this))
                }
            </select>

            <input type="text" data-type="search" name="searchCP" ref="searchTextInput" />

            <input type="button" className="ui-shadow ui-btn ui-corner-all" value="검색" onClick={this.onSearchClick.bind(this)} />

            <ul data-role="listview" id="searchList" data-inset="true" style={{overflow: "auto"}} className="ui-listview ui-listview-inset ui-corner-all ui-shadow">
                {this.state.csList.map(function(cs, i){
                    var clsName = "ui-btn"
                    var count = this.state.csList.length
                    switch (i) {
                      case 0:
                        clsName = "ui-first-child"
                        break
                      case count:
                        clsName = "ui-last-child"
                        break
                      default:
                        clsName = null
                        break
                    }
                    return <li className={clsName}>
                               <a href='#' className="ui-btn" onClick={this.onSearchedItemClick.bind(this, cs)}>
                                   {cs.cs_nm}
                               </a>
                           </li>
                }.bind(this))}
            </ul>
        </Panel>
      </div>
    )
  }
}

var renderCallback = () => {
    console.log('--------------- render callback function ---------------------')

    console.log("--------------- render callback function -----------------")
}

var app = render(<App cp={cp} isLogin={isLogin} map="daum map"/>, document.getElementById('app'), renderCallback)
