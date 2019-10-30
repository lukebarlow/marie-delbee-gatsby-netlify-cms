import React from 'react'
import MediaQuery from 'react-responsive'

import PortraitApp from './PortraitApp'
import LandscapeApp from './LandscapeApp'

export default class MarieDelbeeApp extends React.Component {
  constructor () {
    super()
    // this.keydownHandler = this.keydownHandler.bind(this)
    this.resizeHandler = this.resizeHandler.bind(this)

    this.state = {
      innerWidth: 1000,
      innerHeight: 700,
      isMobile: false,
      isPortrait: false
    }
  }
  
  setSizes () {
    this.setState({
      innerWidth: document.body.clientWidth,
      innerHeight: document.body.clientHeight,
      isMobile: document.body.clientWidth < 758,
      isPortrait: document.body.clientWidth < document.body.clientHeight
    })
  }

  resizeHandler () {
    this.setSizes()
  }

  componentDidMount () {
    this.setSizes()
    // window.addEventListener('keydown', this.keydownHandler)
    window.addEventListener('resize', this.resizeHandler)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.resizeHandler)
  }

  render () {
    return <>
      <MediaQuery orientation='landscape'>
        <LandscapeApp {...this.state} {...this.props} />
      </MediaQuery>
      <MediaQuery orientation='portrait'>
        <PortraitApp {...this.state} {...this.props} />
      </MediaQuery>
    </>
  }
}