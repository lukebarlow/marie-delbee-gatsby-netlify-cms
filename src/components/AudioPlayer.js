import React from 'react'
import styled from 'styled-components'

import PlayStopButton from './PlayStopButton'
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

const Cropper = styled.div`
  overflow: hidden;
  width: ${({width, fractionCropped}) => fractionCropped * width}px;
  height: ${({height}) => height}px;
  position: absolute;
`

const FadedImg = styled.img`
  position: absolute;
  width: ${({width}) => width}px;
  height: auto;
  opacity: 0.7;
  height: calc(100vh - 160px);
  object-fit: contain;
`

const Img = styled.img`
  width: ${({width}) => width}px;
  height: auto;
  position: absolute;
  height: calc(100vh - 160px);
  object-fit: contain;
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
    height: calc(100vh - 60px);
  }
`

export default class AudioPlayer extends React.Component {
  constructor () {
    super()
    this.state = { 
      imageDimensionsCalculated: false, 
      width: null, 
      height: null, 
      fractionCropped: 0 
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

  setAudioPositionFromScreenPosition (x) {
    const fraction = x / this.state.width
    this.audio.currentTime = fraction * this.audio.duration
    this.setState({ fractionCropped: fraction })
  }

  mouseDownHandler (e) {
    const r = e.target.getBoundingClientRect()
    this.setAudioPositionFromScreenPosition(e.clientX - r.left)
  }

  mouseMoveHandler (e) {
    if (e.buttons > 0) {
      const r = e.target.getBoundingClientRect()
      this.setAudioPositionFromScreenPosition(e.clientX - r.left)
    }
  }

  touchStartHandler (e) {
    const r = e.target.getBoundingClientRect()
    this.setAudioPositionFromScreenPosition(e.touches[0].clientX - r.left)
    e.stopPropagation()
  }

  touchMoveHandler (e) {
    const r = e.target.getBoundingClientRect()
    this.setAudioPositionFromScreenPosition(e.touches[0].clientX - r.left)
    e.stopPropagation()
  }

  imageLoadHandler (e) {
    this.setState({
      imageDimensionsCalculated: true,
      width: e.target.width,
      height: e.target.height
    })
  }

  componentDidMount () {
    if (window.audio) {
      window.audio.pause()
    }
    const audio = this.audio = window.audio = new Audio(this.props.audioSrc)
    audio.addEventListener('timeupdate', () => {
      this.setState({ fractionCropped: audio.currentTime / audio.duration })
    })
    window.addEventListener('resize', () => {
      this.setState({ imageDimensionsCalculated: false })
    })

    const img = this.sizerImage.current
    if (img.complete) {
      this.setState({
        imageDimensionsCalculated: true,
        width: img.width,
        height: img.height
      })
    }
  }
  

  render () {
    const { imgSrc } = this.props
    const { imageDimensionsCalculated, width, height } = this.state
    const size = Math.min(width, height)

    const playStopSize = size / 6

    if (!imageDimensionsCalculated) {
      return <StyledImg style={{ opacity: 0.1 }} src={imgSrc} onLoad={this.imageLoadHandler} ref={this.sizerImage} />
    } else {

      return <Container 
          width={width}
          height={height} 
          onMouseDown={this.mouseDownHandler} 
          onMouseMove={this.mouseMoveHandler}
          onTouchStart={this.touchStartHandler}
          onTouchMove={this.touchMoveHandler}
          onClick={this.stopPropagation}
          onDragStart={(e) => {
            e.preventDefault()
            return false
          }}
          
        >
        <div style={{position: 'absolute', width: width, height: height}}>
          <FadedImg src={imgSrc} width={width} height={height}/>
          <Cropper width={width} height={height} fractionCropped={this.state.fractionCropped}>
            <Img src={imgSrc} width={width} height={height} />
          </Cropper>
        </div>
        <svg width={size} height={size} style={{ position: 'absolute' }}>
          <PlayStopButton 
            fraction={this.state.fractionCropped} 
            size={playStopSize} 
            width={width}
            height={height}
            x={width / 2 - playStopSize / 2} 
            y={height / 2 - playStopSize / 2} 
            onChange={this.togglePlayHandler}
          />
        </svg>
      </Container>

    }
  }
}
