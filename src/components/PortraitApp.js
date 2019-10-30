import React from 'react'
import scroll from 'scroll'
import { scaleLinear } from 'd3-scale'
import { timer } from 'd3-timer'
import Markdown from 'react-markdown'

import '../styles/App.css'

import createTransition from '../common/createTransition'
import ProjectCover from './ProjectCover'
import PortraitProjectPieces from './PortraitProjectPieces'
import PortraitCaption from './PortraitCaption'
// import NavigationLinks from './NavigationLinks'

// const scrollTriggerThreshold = 51
const swipeTriggerThreshold = 51

// given an ordered list of numbers, give the 
function positionInList(value, list) {
  const s = scaleLinear().domain(list).range(list.keys())
  return s(value)
}

export default class PortraitApp extends React.Component {
  constructor () {
    super()
    // this.handleRef = this.handleRef.bind(this)

    // this.setSizes = this.setSizes.bind(this)
    
    this.keydownHandler = this.keydownHandler.bind(this)
    this.wheelHandler = this.wheelHandler.bind(this)
    this.touchstartHandler = this.touchstartHandler.bind(this)
    this.touchmoveHandler = this.touchmoveHandler.bind(this)
    this.handleCoverClick = this.handleCoverClick.bind(this)
    this.moveHorizontal = this.moveHorizontal.bind(this)
    this.horizontalPosition = 0

    this.masterContainer = React.createRef()
    this.coversContainer = React.createRef()

    this.pieceIndex = 0 // 0 is project splash screen, higher numbers are the pieces
    this.projectIndex = 0
    
    this.state = {
      showInfo: false
    }

    this.transitions = []
  }

  // handleCoverContainerRef (el) {
  //   this.projectsContainer = el
  //   window.projectsContainer = el
  // }

  

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
          this.moveHorizontal(1)
        break
        default :
          // do nothing
        break
      }
    }
  }

  wheelHandler (e) {
    console.log('got a wheel event')
  }

  touchstartHandler (e) {
    this.touchStartX = e.touches[0].clientX
    this.touchStartY = e.touches[0].clientY
    e.preventDefault()
  }

  touchmoveHandler (e) {
    
    if (this.transitions.length > 0) {
      return
    }

    const dx = e.touches[0].clientX - this.touchStartX
    const dy = e.touches[0].clientY - this.touchStartY

    const adx = Math.abs(dx)
    const ady = Math.abs(dy)

    // no vertical swiping in the portrait mode

    // if (ady > adx && ady > swipeTriggerThreshold) {
    //   dy > 0 ? this.moveVertical(-1) : this.moveVertical(1)
    // }

    if (this.pieceIndex !== 0 && adx > ady && adx > swipeTriggerThreshold) {
      dx > 0 ? this.moveHorizontal(-1) : this.moveHorizontal(1)
    }

    if (adx > ady || this.pieceIndex > 0) {
      e.preventDefault()
    }
  }

  componentDidMount () {
    // this.setSizes()
    
    window.addEventListener('keydown', this.keydownHandler)
    window.addEventListener('wheel', this.wheelHandler)
    window.addEventListener('touchstart', this.touchstartHandler)
    window.addEventListener('touchmove', this.touchmoveHandler, { passive: false })

    let lastTick = 0
    const tick = (time) => {
      const d = time - lastTick
      lastTick = time
      for (let transition of this.transitions) {
        transition.tick(d)
      }
      if (this.transitions.length > 0) {
        this.forceUpdate()
      }
    }

    this.timer = timer(tick)
  }

  componentWillUnmount () {
    window.removeEventListener('keydown', this.keydownHandler)
    window.removeEventListener('wheel', this.wheelHandler)
    window.removeEventListener('touchstart', this.touchstartHandler)
    window.removeEventListener('touchmove', this.touchmoveHandler)
    this.timer.stop()
  }

  moveHorizontal (horizontal, rewindAtEnd = false) {
    this.pieceIndex += horizontal
    if (this.pieceIndex < 0) {
      this.pieceIndex = 0
    }
    const project = this.props.projects[this.projectIndex]
    const numberOfPieces = project.pieces.length

    if (this.pieceIndex > numberOfPieces) {
      if (rewindAtEnd) {
        this.pieceIndex = 0
      } else {
        this.pieceIndex = numberOfPieces
      }
    }
    this.moveToPiece(this.pieceIndex)
  }

  moveVertical (moveBy) {
    const coversContainer = this.coversContainer.current
    if (moveBy !== 0) {
      // measure the project element offsets
      let topOffsets = []
      for (let child of coversContainer.children) {
        topOffsets.push(child.offsetTop)
      }
      // figure out current project index by the scroll position
      let position = positionInList(coversContainer.scrollTop, topOffsets)
      const isExact = Math.round(position) === position

      if (isExact) {
        position = position + moveBy
        position = Math.max(Math.min(position, topOffsets.length - 1), 0)
      } else {
        position = moveBy > 0 ? Math.ceil(position) : Math.floor(position)        
      }
      this.projectIndex = position
      this.forceUpdate()
      scroll.top(coversContainer, topOffsets[position])
    }
  }

  handleCoverClick (projectIndex) {
    this.projectIndex = projectIndex
    this.forceUpdate()
    this.pieceIndex = 1
    this.moveToPiece()
  }

  moveToPiece () {
    const transition = createTransition({
      startValue: this.horizontalPosition,
      endValue: this.pieceIndex,
      setter: (value) => {
        this.horizontalPosition = value
      },
      onEnd: () => {
        this.removeTransition(transition)
        this.horizontalPosition = this.pieceIndex
        this.forceUpdate()
      }
    })
    this.transitions = [transition]
  }

  removeTransition (t) {
    this.transitions = []
  }

  stopPropagation (e) {
    e.stopPropagation()
  }
  
  render () {
    console.log('rendering portrait', this.props)

    const { projects, info, innerHeight, innerWidth, isMobile, isPortrait } = this.props
    const {  showInfo } = this.state
  
    const project = projects[this.projectIndex]
    const pieces = project.pieces
    const pieceIndex = this.pieceIndex
    const piece = pieceIndex > 0 ? pieces[pieceIndex - 1] : null

    const horizontalPosition = this.horizontalPosition

    const coverContainerStyle = {
      width: innerWidth,
      height: innerHeight,
      scrollbarWidth: 'none',
      overflowY: 'scroll',
      position: 'absolute',
      left: -innerWidth * horizontalPosition
    }

    const infoStyle = {
      position: 'absolute',
      backgroundColor: 'white',
      top: 0,
      left: 0,
      width: innerWidth,
      height: innerHeight,
      overflowY: 'auto',
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 100
    }

    const infoLinkStyle = {
      position: 'absolute',
      cursor: 'pointer',
      top: '20px',
      right: '30px',
      display: 'block',
      transition: 'color 0.5s',
      color: pieceIndex == 0 ? 'white' : 'black'
    }

    return <div style={{ position: 'absolute', height: innerHeight, width: innerWidth, overflowX: 'hidden', left: 0 }} ref={this.masterContainer}>
      <div style={ coverContainerStyle } ref={this.coversContainer}>
        { projects.map((project, i) => <ProjectCover 
            key={i} 
            project={project} 
            innerWidth={innerWidth}
            innerHeight={innerHeight}
            isMobile={isMobile}
            isPortrait={isPortrait}
            onClick={() => this.handleCoverClick(i)}
        />)}
      </div>
      <div style={{ 
        position: 'absolute', 
        left: innerWidth * (1 - horizontalPosition), 
        width: innerWidth,
        top: 0 
      }}>
        <PortraitProjectPieces 
          onPieceClick={() => this.moveHorizontal(1, true)}
          project={projects[this.projectIndex]} 
          innerHeight={innerHeight} 
          innerWidth={innerWidth} 
        />
      </div>
      
      <PortraitCaption 
        onMove={ this.moveHorizontal } 
        index={pieceIndex} 
        count={pieces.length} 
        piece={piece}
        innerWidth={innerWidth}
        innerHeight={innerHeight}
        left={horizontalPosition >= 1 ? 0 : innerWidth * (1 - horizontalPosition)}
      />

      { showInfo && 
        <div 
          style={infoStyle} 
          onWheel={this.stopPropagation} 
          onTouchMove={this.stopPropagation} 
          onTouchStart={this.stopPropagation}
        >
          <Markdown source={info} />
        </div>
      }
      <div style={infoLinkStyle} onClick={() => { this.setState({ showInfo: !this.state.showInfo })}}>
        { showInfo ? 'close' : 'info'}
      </div>     
    </div>
  }
}