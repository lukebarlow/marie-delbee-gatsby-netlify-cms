import React from 'react'
import styled from 'styled-components'
import Markdown from 'react-markdown'

const CaptionContainer = styled.div`
  position: absolute;
  width: calc(100vw);
  min-height: 150px;
  padding-left: 150px;
  padding-right: 150px;
  transition: top 0.5s;
  background-color: white;
  
  @media only screen and (max-width: 758px) {
    padding-left: 10px;
    padding-right: 10px;
    padding-top: 0px;
  }
`

const Toggle = styled.div`
  position: absolute;
  left: 20px;
  top: -5px;
  font-size: 20pt;
  cursor: pointer;

  @media only screen and (max-width: 758px) {
    left: 10px;
    top: 2px;
  }
`

const Nav = styled.div`
  position: absolute;
  right: 150px;
  top: 5px;

  @media only screen and (max-width: 758px) {
    right: 10px;
    font-size: 20pt;
  }
`

const NavLink = styled.span`
  cursor: pointer;
`

const Title = styled.div`
  margin-top: 5px;
  margin-bottom: 30px;
  cursor: pointer;
  
  @media only screen and (max-width: 758px) {
    padding-left: 20px;
    font-size: 20pt;
  }
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
    const isMobile = document.body.offsetWidth < 759
    const isLandscape = document.body.offsetWidth > document.body.offsetHeight

    if (isMobile) {
      if (isLandscape) {
        return !piece ? '100vh' : (expanded ? `calc(100vh - ${elementHeight + 30}px)` : 'calc(100vh - 100px)')
      } else {
        return !piece ? '100vh' : (expanded ? `calc(100vh - ${elementHeight + 70}px)` : 'calc(100vh - 110px)')
      }
    } else {
      return !piece ? '100vh' : (expanded ? `calc(100vh - ${elementHeight}px)` : 'calc(100vh - 40px)')
    }
  }

  componentDidUpdate () {
    this.el.style.top = this.calculateStyleTop()
  }

  componentDidMount () {
    this.el.style.top = this.calculateStyleTop()
  }

  render () {
    const { piece, index, count, onMove } = this.props
    const { expanded } = this.state
    
    return <CaptionContainer ref={this.handleRef}>
      <Toggle onClick={this.toggleExpanded}>{expanded ? '-' : '+'}</Toggle>
      { index > 0 && 
        <Nav>
          <NavLink onClick={() => onMove(-1)}>&lt;</NavLink>
          <span>&nbsp;&nbsp;{index}/{count}&nbsp;&nbsp;</span>
          <NavLink onClick={() => onMove(+1)}>&gt;</NavLink>
        </Nav>
      }
      <Title onClick={this.toggleExpanded}>{piece && piece.title}</Title>
      <Markdown source={piece ? piece.description : ''} />
    </CaptionContainer>
  }
}