import React from 'react'
import styled from 'styled-components'
import Markdown from 'react-markdown'
// import Bowser from 'bowser'

import {  smallScreenSelector, portraitSelector, landscapeSelector } from '../mediaSelectors.js'

const CaptionContainer = styled.div`
  position: absolute;
  width: calc(100vw);
  padding-left: 150px;
  padding-right: 150px;
  transition: top 0.5s;
  background-color: white;
  overflow-y: auto;
  
  @media ${smallScreenSelector} {
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 0px;
  }

  @media only ${landscapeSelector} {
    -webkit-text-size-adjust: 100%;
  }
`

const Toggle = styled.div`
  position: absolute;
  left: 20px;
  top: -5px;
  font-size: 27px;
  cursor: pointer;

  @media ${smallScreenSelector} {
    left: 10px;
    top: -3px;
  }
`

const Nav = styled.div`
  position: absolute;
  right: 150px;
  top: -7px;

  @media ${smallScreenSelector} {
    right: 10px;
    font-size: 16px;
  }
`

const NavLink = styled.span`
  font-size: 27px;
  cursor: pointer;
  position: relative;
  top: 4px;
`

const Title = styled.div`
  margin-top: 5px;
  margin-bottom: 30px;
  cursor: pointer;
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: calc(100% - 100px);
  
  @media ${portraitSelector}{
    padding-left: 30px;
    font-size: 16px;
  }

  @media ${landscapeSelector} {
    padding-left: 30px;
    font-size: 16px;
    margin-bottom: 0px;
  }
`

export default class Caption extends React.Component {
  constructor () {
    super()
    this.state = { expanded: false }
    this.toggleExpanded = this.toggleExpanded.bind(this)
    this.handleRef = this.handleRef.bind(this)
    this.stopPropagation = this.stopPropagation.bind(this)
  }

  toggleExpanded () {
    this.setState({ expanded: !this.state.expanded })
  }

  handleRef (el) {
    this.el = el
  }

  calculateTopAndHeight () {
    const { piece, innerHeight } = this.props
    const { expanded } = this.state
    const isMobile = document.body.offsetWidth < 759
    const isLandscape = document.body.offsetWidth > document.body.offsetHeight
    let top = !piece ? '100vh' : (expanded ? '50%' : innerHeight - 40 + 'px')
    let height = isMobile && isLandscape ? 'calc(50% + 50px)' : '50%'
    return { top, height }
  }

  updateTopAndHeight () {
    const { top, height } = this.calculateTopAndHeight()
    this.el.style.top = top
    this.el.style.height = height
  }

  componentDidUpdate () {
    this.updateTopAndHeight()
  }

  componentDidMount () {
    this.updateTopAndHeight()
  }

  stopPropagation (e) {
    e.stopPropagation()
  }

  render () {
    const { piece, index, count, onMove } = this.props
    const { expanded } = this.state
    
    return <CaptionContainer 
        ref={this.handleRef} 
        onWheel={this.stopPropagation} 
        onTouchMove={this.stopPropagation}
      >
      { 
        (piece && piece.description) &&
        <Toggle onClick={this.toggleExpanded}>{expanded ? '-' : '+'}</Toggle>
      }
      { index > 0 && 
        <Nav>
          <NavLink onClick={() => onMove(-1)}>&lt;</NavLink>
          <span>&nbsp;&nbsp;{index}/{count}&nbsp;&nbsp;</span>
          <NavLink onClick={() => onMove(+1)}>&gt;</NavLink>
        </Nav>
      }
      <Title onClick={this.toggleExpanded}>{piece && piece.title}</Title>
      { 
        expanded && 
        <Markdown source={piece && piece.description ? piece.description.replace(/\\/g, '  ') : ''} />
      }
      
    </CaptionContainer>
  }
}