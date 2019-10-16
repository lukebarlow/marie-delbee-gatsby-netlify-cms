import React from 'react'
import styled from 'styled-components'
import Markdown from 'react-markdown'

import {  smallScreenSelector, portraitSelector, landscapeSelector } from '../mediaSelectors.js'

const Toggle = styled.div`
  position: absolute;
  left: 20px;
  top: -5px;
  font-size: 27px;
  cursor: pointer;

  @media ${smallScreenSelector} {
    left: 10px;
    top: 2px;
  }
`

const Nav = styled.div`
  position: absolute;
  right: 150px;
  top: -3px;

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

  stopPropagation (e) {
    e.stopPropagation()
  }

  render () {
    const { piece, index, count, onMove, left, innerHeight, innerWidth } = this.props
    const { expanded } = this.state
    
    if (!piece) {
      return null
    }

    return <div style={{ 
        position: 'absolute', 
        top: expanded ? innerHeight / 1.5 : innerHeight - 40, 
        width: innerWidth, 
        backgroundColor: 'white',
        maxHeight: innerHeight / 2,
        overflowY: 'auto',
        left: left,
        transition: 'top 0.5s'
      }}>
    
      <div 
        onWheel={this.stopPropagation} 
        onTouchMove={this.stopPropagation}
        style={{ margin: '10px' }}
      >
        { 
          piece.description &&
          <Toggle onClick={this.toggleExpanded}>{expanded ? '-' : '+'}</Toggle>
        }
        
        { index > 0 && 
          <Nav>
            <NavLink onClick={() => onMove(-1)}>&lt;</NavLink>
            <span>&nbsp;&nbsp;{index}/{count}&nbsp;&nbsp;</span>
            <NavLink onClick={() => onMove(+1)}>&gt;</NavLink>
          </Nav>
        }
        <Title onClick={this.toggleExpanded}>{(piece && piece.title) || '  '}&nbsp;</Title>
        <Markdown source={piece && piece.description ? piece.description.replace(/\\/g, '  ') : ''} />
      </div>
    </div>
  }
}