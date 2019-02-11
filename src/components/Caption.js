import React from 'react'
import styled from 'styled-components'


const CaptionContainer = styled.div`
  position: absolute;
  width: calc(100vw);
  min-height: 150px;
  padding-left: 150px;
  transition: top 0.5s;
  background-color: white;
`

const Toggle = styled.div`
  position: absolute;
  left: 20px;
  top: -8px;
  font-size: 150%;
  cursor: pointer;
`

const Title = styled.div`
  margin-bottom: 30px;
`

export default class Caption extends React.Component {
  constructor () {
    super()
    this.state = { expanded: false }
    this.toggleExpanded = this.toggleExpanded.bind(this)
    this.handleRef = this.handleRef.bind(this)
  }

  toggleExpanded () {
    this.setState({ expanded: !this.state.expanded })
  }

  handleRef (el) {
    this.el = el
  }

  calculateStyleTop () {
    const { piece } = this.props
    const { expanded } = this.state
    const elementHeight = this.el ? this.el.offsetHeight : 200
    return !piece ? '100vh' : (expanded ? `calc(100vh - ${elementHeight}px)` : 'calc(100vh - 40px)')
  }

  componentDidUpdate () {
    this.el.style.top = this.calculateStyleTop()
  }

  render () {
    const { piece } = this.props
    const { expanded } = this.state
    
    const style = {
      top: this.calculateStyleTop()
    }

    return <CaptionContainer style={style} ref={this.handleRef}>
      <Toggle onClick={this.toggleExpanded}>{expanded ? '-' : '+'}</Toggle>
      <Title>{piece && piece.title}</Title>
      <div>{piece && piece.description}</div>
    </CaptionContainer>
  }
}