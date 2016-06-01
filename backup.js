import React, {Component} from 'react';
import {render} from 'react-dom';
import Select from 'react-select';
import Header from './Header';
import Body from './Body';
import Footer from './Footer';
import Menu from './Menu';
import SubMenu from './SubMenu';
import MenuItem from './MenuItem';

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
          removable : true
      }),
      clusterer: new daum.maps.MarkerClusterer({
          // map: this.state.map, // 마커들을 클러스터로 관리하고 표시할 지도 객체
          averageCenter: true, // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
          minLevel: 10, // 클러스터 할 최소 지도 레벨
          disableClickZoom: true // 클러스터 마커를 클릭했을 때 지도가 확대되지 않도록 설정한다
      }),
      idListForClickEvt: ["header", "map", "footer"],
      compCd1isChecked: false,
      compCd2isChecked: false,
      compCd3isChecked: false,
      compCd9isChecked: false,
      compCdList: [],
      regionOptions: [
          { value: 'one', label: 'One' },
          { value: 'two', label: 'Two' }
      ],
      selectedRegion: 'one',
    }
  }

  componentDidMount() {

    console.log('!!! app component has mounted !!!')

    this.state.mapContainer = document.getElementById('map')

    this.state.map = new daum.maps.Map(this.state.mapContainer, this.state.mapOption)

    this.state.map.addControl(this.state.mapTypeControl, daum.maps.ControlPosition.TOPRIGHT)
    this.state.map.addControl(this.state.zoomControl, daum.maps.ControlPosition.RIGHT)

    this.state.clusterer.setMap(this.state.map)

    daum.maps.event.addListener(this.state.clusterer, 'clusterclick', function(cluster) {

        var level = this.state.map.getLevel()-1

        this.state.map.setLevel(level, {anchor: cluster.getCenter()})
    }.bind(this))

    this.refs.header.setState({map: this.state.map})
    this.refs.body.setState({map: this.state.map})

    // resize right menu
    // $(".menu .right").offset({ top: $("#header").outerHeight() })
    // $(".menu .right").height("50%")
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("app component did update!!!!!!!!!!!!!!")
  }

  componentWillMount() {
    console.log("app component wiil mount!!!!!!!!!!!!!!")
    // this.state.getOptions("abc")
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

    this.state.clusterer.clear()
    this.refs.body.loadCsosDataFromServer(this.state.compCdList)

    console.log(this.state.compCdList)
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

  onRegionSelect(newVal) {
      console.log("Selected: " + newVal)

      this.setState({
	    selectedRegion: newVal
      })
  }

  render() {
    console.log("app is renderd!!!!!!!!!!!!!!1")

    return (
      <div id='App'>

        <Header ref="header" cp={this.props.cp} app={this} clusterer={this.state.clusterer} />

        <Body ref="body" app={this} clusterer={this.state.clusterer} />

        <Footer ref="footer" app={this} idListForClickEvt={this.state.idListForClickEvt} clusterer={this.state.clusterer} />

        <Menu ref="left" alignment="left" idListForClickEvt={this.state.idListForClickEvt}>
            <div className="lang-select">
                <span style={{color: "#e5e5e5"}}>KEVCS</span>
                <a href="#" className="btn-menu-close" onClick={this.hideLeft.bind(this)}>Menu close</a>
            </div>
            <div className="menu-item">
                <a href={this.props.cp + "/mobile/loginInit.do"}>로그인</a>
            </div>
            <div className="menu-item">
                <SubMenu name="이용안내">
                    <div className="submenu-item">
                        <a href={this.props.cp + "/mobile/info/getCompanyInfo.do"}>회사 소개</a>
                    </div>
                    <div className="submenu-item">
                        <a href={this.props.cp + "/mobile/info/getQuickCharger.do"}>이용가이드</a>
                    </div>
                </SubMenu>
            </div>
            <div className="menu-item">
                <SubMenu name="마이페이지">
                    <div className="submenu-item">
                        <a href={this.props.cp + "/mobile/mypage/memberInfo.do"}>회원정보</a>
                    </div>
                    <div className="submenu-item">
                        <a href={this.props.cp + "/mobile/mypage/reservList.do"}>충전이용정보</a>
                    </div>
                </SubMenu>
            </div>
            <div className="menu-item">
                <a href={this.props.cp + "/mobile/info/chargerSearch.do"}>충전소안내</a>
            </div>
            <div className="menu-item">
                <SubMenu name="고객센터">
                    <div className="submenu-item">
                        <a href={this.props.cp + "/mobile/csCenter.do"}>고객센터</a>
                    </div>
                    <div className="submenu-item">
                        <a href={this.props.cp + "/mobile/board/boardList.do"}>공지사항</a>
                    </div>
                </SubMenu>
            </div>
        </Menu>

        <Menu ref="right" alignment="right" idListForClickEvt={this.state.idListForClickEvt}>
            <div className="row chkBox">
                <input type="checkbox" id="compCd1isChecked" className="cbx hidden" checked={this.state.compCd1isChecked} onChange={this.onCompCdChange.bind(this, 1)} />
                <label htmlFor="compCd1isChecked" className="lbl">
                    <span className="chkBoxLbl"> 한국전기차충전서비스(주) </span>
                </label>
            </div>
            <div className="row chkBox">
                <input type="checkbox" id="compCd2isChecked" className="cbx hidden" checked={this.state.compCd2isChecked} onChange={this.onCompCdChange.bind(this, 2)} />
                <label htmlFor="compCd2isChecked" className="lbl">
                    <span className="chkBoxLbl"> 한국전력공사 </span>
                </label>
            </div>
            <div className="row chkBox">
                <input type="checkbox" id="compCd3isChecked" className="cbx hidden" checked={this.state.compCd3isChecked} onChange={this.onCompCdChange.bind(this, 3)} />
                <label htmlFor="compCd3isChecked" className="lbl">
                    <span className="chkBoxLbl"> 환경부(환경공단) </span>
                </label>
            </div>

            <Select
                ref="regionSelect"
                autofocus
                options={this.state.regionOptions}
                simpleValue
                name="selected-region"
                value={this.state.selectedRegion}
                onChange={this.onRegionSelect}
            />

        </Menu>
      </div>
    )
  }
}

var app = render(<App cp={cp} isLogin={isLogin} map="daum map"/>, document.getElementById("main-container"))


