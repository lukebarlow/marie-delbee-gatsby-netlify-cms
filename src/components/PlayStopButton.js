import React from 'react'
import styled from 'styled-components'

const Container = styled.g`
  cursor: pointer;
  stroke: transparent;
`

const LhsPath = styled.path`
  fill: rgba(255, 255, 255, 0.8)
`

const RhsPath = styled.path`
  fill: rgba(0, 0, 0, 0.8)
`

class PlayStopButton extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      playing: false
    }
    this.clickHandler = this.clickHandler.bind(this)
    this.stopPropagation = this.stopPropagation.bind(this)
  }

  stopPropagation (e) {
    e.stopPropagation()
  }

  clickHandler (event) {
    event.preventDefault()
    event.stopPropagation()
    if (event.metaKey) {
      if (this.props.onReset) {
        this.props.onReset()
      }
      return
    }

    const playing = !this.state.playing
    this.setState({
      playing: playing
    })
    if (this.props.onChange) {
      this.props.onChange(playing)
    }
  }

  render () {
    // TODO : use default props
    let { fraction, x, y, width, height, size } = this.props
    const triangleRadius = size / 3
    const top = triangleRadius * Math.sin(Math.PI * 2 / 3)
    const left = triangleRadius * Math.cos(Math.PI * 2 / 3)
    const squareRadius = size / 4

    x += size / 2
    y += size / 2

    const r = size / 2 - 1

    const circlePath = `
      M ${x} ${y}
      m ${-r}, 0
      a ${r},${r} 0 1,0 ${r*2},0
      a ${r},${r} 0 1,0 -${r*2},0
      z
    `

    const squarePath = `
      M ${x} ${y}
      m ${-squareRadius}, ${-squareRadius}
      l ${squareRadius * 2}, 0
      l 0, ${squareRadius * 2}
      l ${-squareRadius * 2}, 0
      l 0, ${-squareRadius * 2}
      z
    `

    const trianglePath = `
      M ${x + triangleRadius} ${y}
      l ${left - triangleRadius},${top} 
      l ${0},${-top * 2}
      z
    `

    const stopPath = circlePath + squarePath
    const playPath = circlePath + trianglePath

    return (
      <Container
        width={size} height={size}
        onClick={this.clickHandler}
        
      >
        <clipPath id="lhs">
          <rect width={fraction * width} height={height} style={{fill: 'rgba(0, 255, 0, 0.2)'}} />
        </clipPath>

        <clipPath id="rhs">
          <rect x={fraction * width} width={(1 - fraction) * width} height={height} style={{fill: 'rgba(0, 255, 0, 0.2)'}} />
        </clipPath>

        <g 
          fillRule='evenodd' 
          onMouseDown={this.stopPropagation} 
          onMouseMove={this.stopPropagation}
          onTouchStart={this.stopPropagation}
          onTouchMove={this.stopPropagation}
        >
          <path d={circlePath} style={{fill: 'transparent'}} />
          <LhsPath d={this.state.playing ? stopPath : playPath } clipPath='url(#lhs)'/>
          <RhsPath d={this.state.playing ? stopPath : playPath } clipPath='url(#rhs)'/>
        </g>
      </Container>
    )
  }
}

export default PlayStopButton
