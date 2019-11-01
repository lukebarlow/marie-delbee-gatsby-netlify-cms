import React from 'react'
import styled from 'styled-components'
import { timeFormat } from 'd3-time-format'

import PlayStopButton2 from './PlayStopButton2'
// import { portraitSelector, landscapeSelector, smallScreenSelector } from '../mediaSelectors.js'
import { pieceSizeCss } from '../styles/elements.js'

const Container = styled.div`
  width: ${({width}) => width}px;
  height: ${({height}) => height}px;

  -moz-user-select: -moz-none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
`

// const StyledImg = styled.img`
//   ${pieceSizeCss}
// `

const fmt = timeFormat('%M:%S')

function formatTime (totalSeconds) {
  return fmt(totalSeconds * 1000)
}  

const timecodeWidth = 60

export default class AudioPlayer2 extends React.Component {
  constructor () {
    super()
    this.state = { 
      imageDimensionsCalculated: false, 
      width: null, 
      height: null, 
      fractionPlayed: 0 
    }
    this.togglePlayHandler = this.togglePlayHandler.bind(this)
    this.mouseDownHandler = this.mouseDownHandler.bind(this)
    this.mouseMoveHandler = this.mouseMoveHandler.bind(this)
    this.touchStartHandler = this.touchStartHandler.bind(this)
    this.touchMoveHandler = this.touchMoveHandler.bind(this)
    this.stopPropagation = this.stopPropagation.bind(this)
    this.imageLoadHandler = this.imageLoadHandler.bind(this)
    this.audio = null
    this.sizerImage = React.createRef()
  }

  togglePlayHandler () {
    if (this.audio.paused) {
      this.audio.play()
    } else {
      this.audio.pause()
    }
  }

  stopPropagation (e) {
    e.stopPropagation()
  }

  getDisplayMetrics () {
    const { imageDimensionsCalculated, width, height, actualHeight, playerY, fractionPlayed } = this.state
    const size = Math.min(width, height)
    const playStopSize = size / 6
    const playerHeight = Math.max(Math.round(playStopSize / 2), 50)
    // const top = effectiveTopMargin
    // const bottom = top + actualHeight
    // const playerY = bottom - playerHeight
    const timelineStart = playerHeight + timecodeWidth
    const timelineWidth = width - timecodeWidth - timelineStart
    return { width, height, actualHeight, playerY, playerHeight, timelineStart, timelineWidth, imageDimensionsCalculated, fractionPlayed }
  }

  setAudioPositionFromScreenPosition (x) {
    const { timelineStart, timelineWidth } = this.getDisplayMetrics()
    const fraction = (x - timelineStart) / timelineWidth
    this.audio.currentTime = fraction * this.audio.duration
    this.setState({ fractionPlayed: fraction })
  }

  mouseDownHandler (e) {
    const r = e.currentTarget.getBoundingClientRect()
    this.setAudioPositionFromScreenPosition(e.clientX - r.left)
    e.stopPropagation()
  }

  mouseMoveHandler (e) {
    if (e.buttons > 0) {
      const r = e.currentTarget.getBoundingClientRect()
      this.setAudioPositionFromScreenPosition(e.clientX - r.left)
    }
  }

  touchStartHandler (e) {
    const r = e.currentTarget.getBoundingClientRect()
    this.setAudioPositionFromScreenPosition(e.touches[0].clientX - r.left)
    e.stopPropagation()
  }

  touchMoveHandler (e) {
    const r = e.currentTarget.getBoundingClientRect()
    this.setAudioPositionFromScreenPosition(e.touches[0].clientX - r.left)
    e.stopPropagation()
  }

  imageLoadHandler (e) {
    const img = window.img = e.target
    const { innerHeight, innerWidth } = this.props

    setTimeout(() => {
      // let { width, height } = img
      let width = img.naturalWidth
      let height = img.naturalHeight
      let actualHeight = height
      // let effectiveTopMargin = 0
      // if (img.height > img.width && img.naturalHeight < img.naturalWidth) {
      //   actualHeight = img.width / (img.naturalWidth / img.naturalHeight)
      //   effectiveTopMargin = (height - actualHeight) / 2
      // }

      const imgVerticalSpace = innerHeight - 160
      const gap = (imgVerticalSpace - height) / 2
      const playerY = innerHeight - 160 - gap

      this.setState({
        imageDimensionsCalculated: true,
        width,
        height,
        actualHeight,
        playerY
      })

    }, 10)
  }

  componentDidMount () {
    if (window.audio) {
      window.audio.pause()
    }
    const audio = this.audio = window.audio = new Audio(this.props.audioSrc)
    audio.addEventListener('timeupdate', () => {
      this.setState({ fractionPlayed: audio.currentTime / audio.duration })
    })
    audio.addEventListener('canplay', () => {
      this.forceUpdate()
    })
    window.addEventListener('resize', () => {
      this.setState({ imageDimensionsCalculated: false })
    })
  }
  
  render () {
    const { 
      imgSrc, 
      isPortrait,
      innerHeight,
      innerWidth } = this.props
    const {
      width,
      height,
      playerY,
      playerHeight,
      timelineStart,
      timelineWidth,
      imageDimensionsCalculated,
      fractionPlayed,
      effectiveTopMargin,
      actualHeight,

    } = this.getDisplayMetrics()

    if (!imageDimensionsCalculated) {
      return <img src={imgSrc} onLoad={this.imageLoadHandler} ref={this.sizerImage} />
    } else {

      const mediaWidth = innerWidth - 10

      const mediaStyle = { 
        margin: '5px', 
        width: mediaWidth, 
        height: innerHeight - 160, 
        objectFit: 'contain' 
      }

      return <Container width={innerWidth} height={height}>
        <div style={{position: 'absolute', width: width, height: height}}
          
          onDragStart={(e) => {
            e.preventDefault()
            return false
          }}
        >
         <img 
          style={mediaStyle}
          src={imgSrc} 
          onLoad={this.imageLoadHandler} 
          ref={this.sizerImage} 
        />
        </div>
        <svg width={innerWidth} height={playerY + playerHeight} style={{ position: 'absolute' }}>
          <g style={{transform: 'translate(5px, ' + playerY + 'px)'}}
            onMouseDown={this.mouseDownHandler} 
            onMouseMove={this.mouseMoveHandler}
            onTouchStart={this.touchStartHandler}
            onTouchMove={this.touchMoveHandler}
            onClick={this.stopPropagation}
          >
            <rect fill="black" width={width} height={playerHeight} />
            <PlayStopButton2 
              fraction={1} 
              size={playerHeight} 
              width={playerHeight}
              height={playerHeight}
              x={0} 
              y={0} 
              onChange={this.togglePlayHandler}
              playing={!window.audio.paused}
            />
            
            
            <text 
              width={80} 
              x={playerHeight + timecodeWidth / 2} 
              y={playerHeight / 2 + 4} 
              fill="white" style={{textAnchor: 'middle'}}>{formatTime(window.audio.currentTime)}</text>
            <line y1={playerHeight / 2} y2={playerHeight / 2} x1={timelineStart} x2={timelineStart + timelineWidth} stroke="white" />
            { 
              window.audio.readyState > 3 &&
              <text 
                width={80} 
                x={width - timecodeWidth / 2} 
                y={playerHeight / 2 + 4} fill="white" 
                style={{textAnchor: 'middle'}}>{formatTime(window.audio.duration)}</text>
            }

            <circle 
              cx={timelineStart + fractionPlayed * timelineWidth }
              cy={playerHeight / 2}
              r={playerHeight / 12}
              fill="red"
              style={{cursor: 'pointer'}}
            />
          </g>
          
        </svg>
      </Container>
    }
  }
}
