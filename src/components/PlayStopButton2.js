import React from 'react'
import styled from 'styled-components'

const Container = styled.g`
  cursor: pointer;
  stroke: transparent;
`

const WhiteShape = styled.path`
  fill: rgba(255, 255, 255, 0.8)
`

class PlayStopButton extends React.Component {
  constructor (props) {
    super(props)
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

    if (this.props.onChange) {
      this.props.onChange()
    }
  }

  render () {
    // TODO : use default props
    let { x, y, size, playing } = this.props
    const triangleRadius = size / 3
    const top = triangleRadius * Math.sin(Math.PI * 2 / 3)
    const left = triangleRadius * Math.cos(Math.PI * 2 / 3)
    const squareRadius = size / 4

    x += size / 2
    y += size / 2

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

    return (
      <Container
        width={size} height={size}
        onClick={this.clickHandler} 
      >
        <g 
          onMouseDown={this.stopPropagation} 
          onMouseMove={this.stopPropagation}
          onTouchStart={this.stopPropagation}
          onTouchMove={this.stopPropagation}
        >
          <rect width={size} height={size} fill="transparent" />
          <WhiteShape d={playing ? squarePath : trianglePath } />
        </g>
      </Container>
    )
  }
}

export default PlayStopButton
