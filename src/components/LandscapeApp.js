import React from 'react'
import styled from 'styled-components'
import scroll from 'scroll'
import Markdown from 'react-markdown'

// import History from 'hash-history'

import NavigationLinks from './NavigationLinks'
import Caption2 from './Caption2'
import '../styles/App.css'

import Project from './Project'
import { smallScreenSelector } from '../mediaSelectors.js'

// const ProjectContainer = styled.div`
//   height: 100vh;
//   overflow: hidden;
// `

const Info = styled.div`
  position: absolute;
  background-color: white;
  top: 0px;
  left: 0px;
  width: calc(100vw);
  height: calc(100vh);
  overflow-y: auto;
  padding-top: 100px;
  padding-left: 150px;
  padding-right: 150px;
  visibility: ${({visible}) => visible ? 'visible' : 'hidden'};

  @media ${smallScreenSelector} {
    padding-left: 20px;
    padding-right: 20px;
  }
`

export default class LandscapeApp extends React.Component {
  constructor () {
    super()
    this.isScrolling = false
    this.handleRef = this.handleRef.bind(this)
    this.handleLink = this.handleLink.bind(this)
    this.finishedScrolling = this.finishedScrolling.bind(this)
    // this.handlePieceClick = this.handlePieceClick.bind(this)
    this.handleImageLoad = this.handleImageLoad.bind(this)
    this.stopPropagation = this.stopPropagation.bind(this)
    this.scrollTo = this.scrollTo.bind(this)

    this.state = {
      captionPieceIndex: 0 // replicates pieceIndex, but sometimes changes at
                           // a slightly different moment to get the transitions
                           // correct
    }

    this.lastScrolledToProjectIndex = 0
  }

  componentDidMount () { 
    this.scrollTo(this.props, true)
  }

  componentDidUpdate (prevProps, prevState) {
    const { projectIndex, pieceIndex } = this.props
    if (prevProps.projectIndex !== projectIndex || prevProps.pieceIndex !== pieceIndex) {
      this.scrollTo({ projectIndex, pieceIndex }, false)
    }
  }

  scrollTo ({ projectIndex, pieceIndex }, instant) {
    if (!this.projectsContainer) {
      return
    }

    if (projectIndex !== this.lastScrolledToProjectIndex) {
      // first set the destination piece to be in the correct position
      const projectElement = this.projectsContainer.children[projectIndex]
      const offset = projectElement.children[pieceIndex].offsetLeft
      projectElement.scrollLeft = offset
      this.verticalScroll(projectIndex, instant, true)
    } else {
      this.horizontalScroll(pieceIndex, instant)
    }
  }

  async verticalScroll (projectIndex, instant, retainPieceIndex) {
    if (!this.projectsContainer) {
      return
    }

    return new Promise((resolve) => {
      // dirty delay fix - not sure why it's needed but it works
      setTimeout(() => {
        let { pieceIndex } = this.props

        const duration = instant ? 0 : Math.abs(projectIndex - this.lastScrolledToProjectIndex) * 600
        const projectsContainer = this.projectsContainer

        for (var i=0;i < projectsContainer.children.length; i++) {
          if (i !== this.lastScrolledToProjectIndex && (!retainPieceIndex || i !== projectIndex)) {
            projectsContainer.children[i].scrollLeft = 0
          }
        }
        
        const projectElement = projectsContainer.children[projectIndex]
        if (instant) {
          projectsContainer.scrollTop = projectElement.offsetTop
          resolve()
        } else {
          this.isScrolling = true
          scroll.top(projectsContainer, projectElement.offsetTop, 
            { duration: duration }, () => {
              this.finishedScrolling()
              resolve()
            })
          if (pieceIndex === 0) {
            this.setState({ captionPieceIndex: pieceIndex })
          }
        }
        this.lastScrolledToProjectIndex = projectIndex
      }, 100)
    })
  }

  horizontalScroll (pieceIndex, instant) {
    if (!this.projectsContainer) {
      return
    }
    const duration = instant ? 0 : 600
    const delayCaption = pieceIndex === 1
    let { projectIndex } = this.props
    const projectElement = this.projectsContainer.children[projectIndex]

    const el = projectElement.children[pieceIndex]
    if (!el) {
      console.log('NO PIECE ELEMENT FOUND')
      return
    }

    const offset = projectElement.children[pieceIndex].offsetLeft

    if (instant) {
      projectElement.scrollLeft = offset
      this.finishedScrolling()
    } else {
      this.isScrolling = true
      scroll.left(projectElement, offset, { duration }, 
        this.finishedScrolling)
    }

    if (!delayCaption) {
      this.setState({ captionPieceIndex: pieceIndex })
    }
  }

  finishedScrolling () {
    let { pieceIndex } = this.props
    this.setState({ captionPieceIndex: pieceIndex })
    setTimeout(() => {
      this.isScrolling = false
    }, 200)
  }
  
  setHistory ({ projectIndex, pieceIndex }) {
    this.navHistory.set({ projectIndex, pieceIndex })
  }

  setStateAndHistory(state) {
    this.setState(state)
    this.setHistory(state)
  }

  handleRef (el) {
    this.projectsContainer = el
    window.projectsContainer = el
  }

  handleLink (link) {

    if (link === 'info') {
      this.props.onInfoToggle()
      return
    }

    link = parseInt(link)
    if (!isNaN(link)) {
      // turn info off if it's on
      if (this.props.showInfo) {
        this.props.onInfoToggle()
      }

      this.props.onMove(link, 0, false, true) 
    }
  }

  handleImageLoad () {
    this.scrollTo(this.props, true)
  }

  stopPropagation (e) {
    e.stopPropagation()
  }

  render () {
    const { 
      projects, 
      info, 
      projectIndex, 
      pieceIndex,
      innerHeight, 
      innerWidth,
      isMobile,
      isPortrait,
      showInfo,
      onMove
    } = this.props
    const { captionPieceIndex } = this.state
    const pieces = projects[projectIndex].pieces
    const piece = captionPieceIndex > 0 ? pieces[captionPieceIndex - 1] : null

    return <>
      <div 
        style={{
          width: innerWidth,
          height: innerHeight,
          overflow: 'hidden'
        }}
        ref={this.handleRef}
      >
        { projects.map((p, i) => <Project 
          key={i} 
          project={p} 
          isCurrent={projectIndex === i} 
          pieceIndex={pieceIndex} 
          onPieceClick={() => onMove(0, 1, true)}
          onImageLoad={this.handleImageLoad}
          innerHeight={innerHeight}
          innerWidth={innerWidth}
          isMobile={isMobile}
        />)}
      </div>
      { 
        captionPieceIndex > 0 &&
        <Caption2 
          onMove={(moveBy) => onMove(0, moveBy)} 
          index={captionPieceIndex} 
          count={pieces.length} 
          piece={piece}
          innerWidth={innerWidth}
          innerHeight={innerHeight}
          isPortrait={isPortrait}
          isMobile={isMobile}
        />
      }
      
      <Info 
        visible={showInfo} 
        onWheel={this.stopPropagation} 
        onTouchMove={this.stopPropagation} 
        onTouchStart={this.stopPropagation}
      >
        <Markdown source={info} />
      </Info>
      <NavigationLinks
        selected={ showInfo ? 'info' : projectIndex }
        isWhite={captionPieceIndex===0 && !showInfo} 
        projects={projects} 
        onLink={this.handleLink} 
        isLastPieceInProject={pieceIndex >= projects[projectIndex].pieces.length}
      />
    </>
  }
}