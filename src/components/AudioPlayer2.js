import React from 'react'
import styled from 'styled-components'
import { timeFormat } from 'd3-time-format'

import PlayStopButton2 from './PlayStopButton2'
import { portraitSelector, landscapeSelector } from '../mediaSelectors.js'

const Container = styled.div`
  width: ${({width}) => width}px;
  height: ${({height}) => height}px;

  -moz-user-select: -moz-none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
`

const StyledImg = styled.img`
  display: block;
  width: auto;
  height: calc(100vh - 160px);
  cursor: pointer;
  
  @media ${portraitSelector} {
    max-width: calc(100vw - 10px);
    max-height: calc(100vh - 20px);
    height: calc(100vh - 160px);
    width: 100%;
    object-fit: contain;
  }

  @media ${landscapeSelector} {
    width: auto;
    max-width: calc(100vw - 10px);
    height: calc(100vh - 40px);
  }
`

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
    const { imageDimensionsCalculated, width, height, actualHeight, effectiveTopMargin, fractionPlayed } = this.state
    const size = Math.min(width, height)
    const playStopSize = size / 6
    const playerHeight = Math.max(Math.round(playStopSize / 2), 50)
    const top = effectiveTopMargin
    const bottom = top + actualHeight
    const playerY = bottom - playerHeight
    const timelineStart = playerHeight + timecodeWidth
    const timelineWidth = width - timecodeWidth - timelineStart
    return { width, height, actualHeight, playerY, playerHeight, timelineStart, timelineWidth, imageDimensionsCalculated, fractionPlayed, effectiveTopMargin }
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

    setTimeout(() => {
      let { width, height } = img
      let actualHeight = height
      let effectiveTopMargin = 0
      if (img.height > img.width && img.naturalHeight < img.naturalWidth) {
        actualHeight = img.width / (img.naturalWidth / img.naturalHeight)
        effectiveTopMargin = (height - actualHeight) / 2
      }

      this.setState({
        imageDimensionsCalculated: true,
        width,
        height,
        actualHeight,
        effectiveTopMargin
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
    window.addEventListener('resize', () => {
      this.setState({ imageDimensionsCalculated: false })
    })
  }
  
  render () {
    const { imgSrc } = this.props
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
      actualHeight
    } = this.getDisplayMetrics()

    if (!imageDimensionsCalculated) {
      return <StyledImg src={imgSrc} onLoad={this.imageLoadHandler} ref={this.sizerImage} />
    } else {

      return <Container width={width} height={height}>
        <div style={{position: 'absolute', width: width, height: height}}
          
          onDragStart={(e) => {
            e.preventDefault()
            return false
          }}
        >
         <StyledImg src={imgSrc} onLoad={this.imageLoadHandler} ref={this.sizerImage} />
        </div>
        <svg width={width} height={actualHeight + effectiveTopMargin} style={{ position: 'absolute' }}>
          <g style={{transform: 'translate(0, ' + playerY + 'px)'}}
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
            <text 
              width={80} 
              x={width - timecodeWidth / 2} 
              y={playerHeight / 2 + 4} fill="white" 
              style={{textAnchor: 'middle'}}>{formatTime(window.audio.duration)}</text>
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
