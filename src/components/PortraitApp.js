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

// given an ordered list of numbers, give the 
function positionInList(value, list) {
  const s = scaleLinear().domain(list).range(list.keys())
  return s(value)
}

export default class PortraitApp extends React.Component {
  constructor () {
    super()
    this.horizontalPosition = 0

    this.masterContainer = React.createRef()
    this.coversContainer = React.createRef()
    
    this.lastRenderProjectIndex = null
    this.lastRenderPieceIndex = null
    this.isAnimating = false

    this.transitions = []
  }

  componentDidMount () {
    this.horizontalPosition = this.props.pieceIndex

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
    this.timer.stop()
  }

  componentDidUpdate (prevProps) {
    const { projectIndex, pieceIndex } = this.props

    if (prevProps.projectIndex !== projectIndex) {
      if (pieceIndex === 0) {
        // if it's moving to another cover page, we move vertically
        this.moveVertical(projectIndex - prevProps.projectIndex)
      } else {
        // otherwise, since multiple covers are visible at the same
        // time in portrait mode, we re-render with the right
        // pieces then slide horizontally
        this.forceUpdate()
        this.moveToPiece(pieceIndex)
      }
    } else if (prevProps.pieceIndex !== pieceIndex) {
      this.moveToPiece(pieceIndex)
    }
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

      this.forceUpdate()
      scroll.top(coversContainer, topOffsets[position])
    }
  }

  handleCoverClick (projectIndex) {
    this.props.onMove(projectIndex, 1, false, true)
  }

  moveToPiece (pieceIndex) {
    const transition = createTransition({
      startValue: this.horizontalPosition,
      endValue: pieceIndex,
      setter: (value) => {
        this.horizontalPosition = value
      },
      onEnd: () => {
        this.removeTransition(transition)
        this.horizontalPosition = pieceIndex
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
    const { 
      projects, 
      info, 
      innerHeight, 
      innerWidth, 
      isMobile, 
      isPortrait,
      projectIndex,
      pieceIndex,
      showInfo,
      onMove,
      onCoverTouch,
      onInfoToggle
    } = this.props

    const project = projects[projectIndex]
    const pieces = project.pieces
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
      color: pieceIndex === 0 && !showInfo ? 'white' : 'black'
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
            onCoverTouch={() => onCoverTouch(i)}
        />)}
      </div>
      <div style={{ 
        position: 'absolute', 
        left: innerWidth * (1 - horizontalPosition), 
        width: innerWidth,
        top: 0 
      }}>
        <PortraitProjectPieces 
          onPieceClick={() => { onMove(0, 1, true) }}
          project={projects[projectIndex]} 
          innerHeight={innerHeight} 
          innerWidth={innerWidth} 
        />
      </div>
      
      <PortraitCaption 
        onMove={ (moveBy) => onMove(0, moveBy) } 
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
      <div style={infoLinkStyle} onClick={onInfoToggle}>
        { showInfo ? 'close' : 'info'}
      </div>     
    </div>
  }
}