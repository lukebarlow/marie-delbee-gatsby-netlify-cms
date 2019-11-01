import React from 'react'
import MediaQuery from 'react-responsive'

// import History from 'hash-history'

import PortraitApp from './PortraitApp'
import LandscapeApp from './LandscapeApp'

const SWIPE_TRIGGER_THRESHOLD = 51
const SCROLL_TRIGGER_THRESHOLD = 51
const SCROLL_TIME_RECOVERY = 500

export default class MarieDelbeeApp extends React.Component {
  constructor () {
    super()
    this.keydownHandler = this.keydownHandler.bind(this)
    this.resizeHandler = this.resizeHandler.bind(this)
    this.moveHandler = this.moveHandler.bind(this)
    this.touchstartHandler = this.touchstartHandler.bind(this)
    this.touchmoveHandler = this.touchmoveHandler.bind(this)
    this.wheelHandler = this.wheelHandler.bind(this)
    this.coverTouchStartHandler = this.coverTouchStartHandler.bind(this)
    this.infoToggleHandler = this.infoToggleHandler.bind(this)

    this.state = {
      innerWidth: 1000,
      innerHeight: 700,
      isMobile: false,
      isPortrait: false,
      projectIndex: 0,
      pieceIndex: 0,
      showInfo: false
    }

    this.touchStartX = null
    this.touchStartY = null
    this.lastScrollTriggered = null
    this.touchStartProjectIndex = null
  }

  componentDidMount () {
    this.setSizes()
    window.addEventListener('keydown', this.keydownHandler)
    window.addEventListener('resize', this.resizeHandler)
    window.addEventListener('touchstart', this.touchstartHandler, { passive: false })
    window.addEventListener('touchmove', this.touchmoveHandler, { passive: false })
    window.addEventListener('wheel', this.wheelHandler, { passive: false })

    // this.navHistory = new History('n', {
    //   stringify: ({ projectIndex, pieceIndex }) => [projectIndex, pieceIndex].toString(),
    //   parse: (s) => {
    //     const [ projectIndex, pieceIndex ] = s ? s.split(',').map(x => parseInt(x)) : [0, 0]
    //     return { projectIndex, pieceIndex }
    //   }
    // }).on('change', ({ projectIndex, pieceIndex }) => {
    //   this.scrollTo({ projectIndex, pieceIndex })
    // })

    // setTimeout(() => {
    //   const { projectIndex, pieceIndex } = this.navHistory.get()
    //   // this.scrollTo({ projectIndex, pieceIndex }, true)
    // }, 0)
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.resizeHandler)
    window.removeEventListener('keydown', this.keydownHandler)
    window.removeEventListener('touchstart', this.touchstartHandler)
    window.removeEventListener('touchmove', this.touchmoveHandler)
    window.removeEventListener('wheel', this.wheelHandler)
  }
  
  setSizes () {
    this.setState({
      innerWidth: document.body.clientWidth,
      innerHeight: document.body.clientHeight,
      isMobile: document.body.clientWidth < 758,
      isPortrait: document.body.clientWidth < document.body.clientHeight
    })
  }

  infoToggleHandler () {
    this.setState({ showInfo: !this.state.showInfo })
  }

  resizeHandler () {
    this.setSizes()
  }

  keydownHandler (e) {
    if (!e.repeat) {
      switch(e.key) {
        case 'ArrowUp':
          e.preventDefault()
          this.moveVertical(-1)
        break
        case 'ArrowDown':
          e.preventDefault()
          this.moveVertical(1)
        break
        case 'ArrowLeft':
          e.preventDefault()
          this.moveHorizontal(-1)
        break
        case 'ArrowRight':
          e.preventDefault()
          this.moveHorizontal(1, true)
        break
        default :
          // do nothing
        break
      }
    }
  }

  wheelHandler (e) {
    const { isPortrait, showInfo, pieceIndex } = this.state
    const absX = Math.abs(e.deltaX)
    const absY = Math.abs(e.deltaY)
    // in certain cases we just want browser default scrolling behavior
    if (showInfo || (isPortrait && pieceIndex === 0 && absY > absX)) {
      return
    }

    if (this.lastScrollTriggered === null || new Date() - this.lastScrollTriggered > SCROLL_TIME_RECOVERY) {
      if (absY > absX && absY > SCROLL_TRIGGER_THRESHOLD) {
        this.lastScrollTriggered = new Date()
        e.deltaY > 0 ? this.moveVertical(1) : this.moveVertical(-1)
      }
  
      if (absX > absY && absX > SCROLL_TRIGGER_THRESHOLD) {
        this.lastScrollTriggered = new Date()

        if (this.touchStartProjectIndex !== null && this.state.pieceIndex === 0 && this.state.isPortrait && e.deltaX > 0) {
          this.setState({
            projectIndex: this.touchStartProjectIndex,
            pieceIndex: 1
          })
          this.touchStartProjectIndex = null
        } else {
          e.deltaX > 0 ? this.moveHorizontal(1) : this.moveHorizontal(-1)
        }

        
      }
    }
  }

  moveHorizontal (horizontal, wrapAround) {
    const { projects } = this.props
    let { projectIndex, pieceIndex } = this.state
    
    pieceIndex += horizontal
    if (pieceIndex < 0) {
      pieceIndex = 0
    }
    const numberOfPieces = projects[projectIndex].pieces.length

    if (pieceIndex > numberOfPieces) {
      if (wrapAround) {
        if (this.state.isPortrait) {
          this.setState({ pieceIndex: 0 })
        } else {
          this.moveVertical(1)
        }
      }
      return
    }

    this.setState({ pieceIndex })
  }

  moveVertical (moveBy) {
    // const coversContainer = this.coversContainer.current
    if (moveBy !== 0) {
      // measure the project element offsets
      // let topOffsets = []
      // for (let child of coversContainer.children) {
      //   topOffsets.push(child.offsetTop)
      // }
      // // figure out current project index by the scroll position
      // let position = positionInList(coversContainer.scrollTop, topOffsets)
      // const isExact = Math.round(position) === position

      // if (isExact) {
      //   position = position + moveBy
      //   position = Math.max(Math.min(position, topOffsets.length - 1), 0)
      // } else {
      //   position = moveBy > 0 ? Math.ceil(position) : Math.floor(position)        
      // }
      // this.projectIndex = position
      // this.forceUpdate()
      // scroll.top(coversContainer, topOffsets[position])

      let { projectIndex } = this.state
      const numberOfProjects = this.props.projects.length

      projectIndex += moveBy
      if (projectIndex < 0) {
        projectIndex = 0
      }
      if (projectIndex > numberOfProjects - 1) {
        projectIndex = numberOfProjects - 1
      }

      this.setState({ projectIndex, pieceIndex: 0 })

    }
  }

  moveHandler (vertical, horizontal, wrapAround = false, isAbsolutePosition = false) {
    if (isAbsolutePosition) {
      this.setState({
        projectIndex: vertical,
        pieceIndex: horizontal
      })
    } else {
      if (vertical) {
        this.moveVertical(vertical)
      } else if (horizontal) {
        this.moveHorizontal(horizontal, wrapAround)
      }
    }
  }

  touchstartHandler (e) {
    this.touchStartX = e.touches[0].clientX
    this.touchStartY = e.touches[0].clientY
    // e.preventDefault()
  }

  touchmoveHandler (e) {
    const dx = e.touches[0].clientX - this.touchStartX
    const dy = e.touches[0].clientY - this.touchStartY

    const adx = Math.abs(dx)
    const ady = Math.abs(dy)

    // no vertical swiping in the portrait mode
    if (this.lastScrollTriggered === null || new Date() - this.lastScrollTriggered > SCROLL_TIME_RECOVERY) {
      if (ady > adx && ady > SWIPE_TRIGGER_THRESHOLD) {
        this.lastScrollTriggered = new Date()
        if (!this.state.isPortrait) {
          dy > 0 ? this.moveHandler(-1, 0) : this.moveHandler(1, 0)
        }
      }
  
      if (this.pieceIndex !== 0 && adx > ady && adx > SWIPE_TRIGGER_THRESHOLD) {
        this.lastScrollTriggered = new Date()
        // special case for when you swipe from
                
        if (this.touchStartProjectIndex !== null && this.state.pieceIndex === 0 && this.state.isPortrait && dx < 0) {
          this.setState({
            projectIndex: this.touchStartProjectIndex,
            pieceIndex: 1
          })
          this.touchStartProjectIndex = null
        } else {
          dx > 0 ? this.moveHandler(0, -1) : this.moveHandler(0, 1)
        }
      }
  
      if (adx > ady || this.pieceIndex > 0) {
        e.preventDefault()
      }
    }
  }

  coverTouchStartHandler (projectIndex) {
    this.touchStartProjectIndex = projectIndex
  }

  render () {
    return <>
      <MediaQuery orientation='landscape'>
        <LandscapeApp 
          onMove={this.moveHandler} 
          onInfoToggle={this.infoToggleHandler}
          {...this.state} 
          {...this.props} 
        />
      </MediaQuery>
      <MediaQuery orientation='portrait'>
        <PortraitApp 
          onMove={this.moveHandler} 
          onCoverTouch={this.coverTouchStartHandler}
          onInfoToggle={this.infoToggleHandler}
          {...this.state} 
          {...this.props} 
        />
      </MediaQuery>
    </>
  }
}