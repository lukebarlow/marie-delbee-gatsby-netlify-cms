import React from 'react'
import PlayStopButton from './PlayStopButton'

import styled from 'styled-components'

const Container = styled.div`
  width: ${({size}) => size}px;
  height: ${({size}) => size}px;
`

const Cropper = styled.div`
  overflow: hidden;
  width: ${({size, fractionCropped}) => fractionCropped * size}px;
  height: ${({size}) => size}px;
  position: absolute;
`

const FadedImg = styled.img`
  position: absolute;
  width: ${({size}) => size}px;
  height: auto;
  opacity: 0.2;
`

const Img = styled.img`
  width: ${({size}) => size}px;
  height: auto;
  position: absolute;
`

export default class AudioPlayer extends React.Component {
  constructor () {
    super()
    this.state = { fractionCropped: 0 }
    this.togglePlayHandler = this.togglePlayHandler.bind(this)
    this.mouseDownHandler = this.mouseDownHandler.bind(this)
    this.mouseMoveHandler = this.mouseMoveHandler.bind(this)
    this.stopPropagation = this.stopPropagation.bind(this)
    this.audio = null
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

  mouseDownHandler (e) {
    const r = e.target.getBoundingClientRect()
    const x = e.clientX - r.left
    const fraction = x / this.props.height
    this.audio.currentTime = fraction * this.audio.duration
  }

  mouseMoveHandler (e) {
    if (e.buttons > 0) {
      const r = e.target.getBoundingClientRect()
      const x = e.clientX - r.left
      const fraction = x / this.props.height
      this.audio.currentTime = fraction * this.audio.duration
    }
  }

  componentDidMount () {
    const audio = this.audio = new Audio(this.props.audioSrc)
    audio.addEventListener('timeupdate', () => {
      this.setState({ fractionCropped: audio.currentTime / audio.duration })
    })
    window.audio = audio
  }

  render () {
    const { imgSrc, height } = this.props
    const size = height

    return <Container 
        size={size} 
        onMouseDown={this.mouseDownHandler} 
        onMouseMove={this.mouseMoveHandler}
        onClick={this.stopPropagation}
      >
      <div style={{position: 'absolute', width: size, height: size}}>
        <FadedImg src={imgSrc} size={size}/>
        <Cropper size={size} fractionCropped={this.state.fractionCropped}>
          <Img src={imgSrc} size={size} />
        </Cropper>
      </div>
      <svg width={size} height={size} style={{ position: 'absolute' }}>
        <PlayStopButton 
          fraction={this.state.fractionCropped} 
          size={100} 
          squareSize={size} 
          x={size/2 - 50} 
          y={size/2 - 50} 
          onChange={this.togglePlayHandler}
        />
      </svg>
    </Container>
  }
}
