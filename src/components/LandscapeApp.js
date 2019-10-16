import React from 'react'
import styled from 'styled-components'
import scroll from 'scroll'
import Markdown from 'react-markdown'

import History from 'hash-history'

import NavigationLinks from './NavigationLinks'
import Caption from './Caption'
import '../styles/App.css'

import Project from './Project'
import { smallScreenSelector } from '../mediaSelectors.js'

const ProjectContainer = styled.div`
  height: 100vh;
  overflow: hidden;
`

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

const scrollTriggerThreshold = 51
const swipeTriggerThreshold = 51

export default class LandscapeApp extends React.Component {
  constructor () {
    super()
    this.isScrolling = false
    this.handleRef = this.handleRef.bind(this)
    this.handleLink = this.handleLink.bind(this)
    this.finishedScrolling = this.finishedScrolling.bind(this)
    this.handlePieceClick = this.handlePieceClick.bind(this)
    this.handleImageLoad = this.handleImageLoad.bind(this)
    this.stopPropagation = this.stopPropagation.bind(this)
    this.scrollTo = this.scrollTo.bind(this)

    this.kekdownHandler = this.keydownHandler.bind(this)
    this.wheelHandler = this.wheelHandler.bind(this)
    this.touchstartHandler = this.touchstartHandler.bind(this)
    this.touchmoveHandler = this.touchmoveHandler.bind(this)
    this.resizeHandler = this.resizeHandler.bind(this)

    this.state = {
      showInfo: false,
      projectIndex: 0,
      pieceIndex: 0, // where 0 is the cover, and 1 is the first piece
      captionPieceIndex: 0 // replicates pieceIndex, but sometimes changes at
                           // a slightly different moment to get the transitions
                           // correct
    }

    this.touchStartX = null
    this.touchStartY = null
  }

  scrollTo ({ projectIndex, pieceIndex }, instant) {
    if (!this.projectsContainer) {
      return
    }
    const previousProjectIndex = this.state.projectIndex

    if (projectIndex !== previousProjectIndex) {
      // first set the destination piece to be in the correct position
      const projectElement = this.projectsContainer.children[projectIndex]
      const offset = projectElement.children[pieceIndex].offsetLeft
      projectElement.scrollLeft = offset
      // then scroll vertically to it
      this.verticalScroll(projectIndex, instant, true)
    } else {
      this.horizontalScroll(pieceIndex, instant)
    }
    this.setState({ projectIndex, pieceIndex, captionPieceIndex: pieceIndex })
  }

  async verticalScroll (projectIndex, instant, retainPieceIndex) {
    if (!this.projectsContainer) {
      return
    }

    return new Promise((resolve) => {
      let { pieceIndex } = this.state

      const duration = instant ? 0 : Math.abs(this.state.projectIndex - projectIndex) * 600

      // reset all the pieces which are not the current piece back to the left position
      
      const projectsContainer = this.projectsContainer

      for (var i=0;i < projectsContainer.children.length; i++) {
        if (i !== this.state.projectIndex && (!retainPieceIndex || i !== projectIndex)) {
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
    })
  }

  horizontalScroll (pieceIndex, instant) {
    if (!this.projectsContainer) {
      return
    }
    const duration = instant ? 0 : 600
    const delayCaption = pieceIndex === 1
    let { projectIndex } = this.state
    const projectElement = this.projectsContainer.children[projectIndex]
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
    let { pieceIndex } = this.state
    this.setState({ captionPieceIndex: pieceIndex })
    setTimeout(() => {
      this.isScrolling = false
    }, 200)
  }

  up () {
    let { projectIndex, pieceIndex } = this.state
    if (projectIndex > 0) {
      pieceIndex = 0
      projectIndex -= 1
      this.verticalScroll(projectIndex)
      this.setStateAndHistory({ projectIndex, pieceIndex })
    }
  }

  down () {
    const { projects } = this.props
    let { projectIndex, pieceIndex } = this.state

    if (projectIndex < projects.length - 1) {
      pieceIndex = 0
      projectIndex += 1
      this.verticalScroll(projectIndex)
      this.setStateAndHistory({ projectIndex, pieceIndex })
    }
  }

  left () {
    let { projectIndex, pieceIndex } = this.state
    if (pieceIndex > 0) {
      pieceIndex -= 1
      this.horizontalScroll(pieceIndex)
      this.setStateAndHistory({ projectIndex, pieceIndex })
    }
  }

  right () {
    const { projects } = this.props
    let { projectIndex, pieceIndex } = this.state
    const pieces = projects[projectIndex].pieces
      if (pieceIndex < pieces.length) {
        pieceIndex += 1
        this.horizontalScroll(pieceIndex)
        this.setStateAndHistory({ projectIndex, pieceIndex })
      }
  }
  
  keydownHandler (e) {
    switch(e.key) {
      case 'ArrowUp':
        this.up()
      break
      case 'ArrowDown':
        this.down()
      break
      case 'ArrowLeft':
        this.left()
      break
      case 'ArrowRight':
        this.right()
      break
      default :
        // do nothing
      break
    }
  }

  wheelHandler (e) {
    e.preventDefault()
    if (this.isScrolling) {
      return
    }

    if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && Math.abs(e.deltaY) > scrollTriggerThreshold) {
      e.deltaY > 0 ? this.down() : this.up()
    }

    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > scrollTriggerThreshold) {
      e.deltaX > 0 ? this.right() : this.left()
    }
  }

  touchstartHandler (e) {
    this.touchStartX = e.touches[0].clientX
    this.touchStartY = e.touches[0].clientY
  }

  touchmoveHandler (e) {
    if (this.isScrolling) {
      return
    }

    const dx = e.touches[0].clientX - this.touchStartX
    const dy = e.touches[0].clientY - this.touchStartY

    const adx = Math.abs(dx)
    const ady = Math.abs(dy)

    if (ady > adx && ady > swipeTriggerThreshold) {
      dy > 0 ? this.up() : this.down()
    }

    if (adx > ady && adx > swipeTriggerThreshold) {
      dx > 0 ? this.left() : this.right()
    }
  }

  resizeHandler () {
    this.scrollTo(this.state, true)
    this.verticalScroll(this.state.projectIndex, true)
  }
  
  componentDidMount () {
    window.addEventListener('keydown', this.keydownHandler)
    window.addEventListener('wheel', this.wheelHandler, { passive: false })
    window.addEventListener('touchstart', this.touchstartHandler)
    window.addEventListener('touchmove', this.touchmoveHandler)
    window.addEventListener('resize', this.resizeHandler)

    this.navHistory = new History('n', {
      stringify: ({ projectIndex, pieceIndex }) => [projectIndex, pieceIndex].toString(),
      parse: (s) => {
        const [ projectIndex, pieceIndex ] = s ? s.split(',').map(x => parseInt(x)) : [0, 0]
        return { projectIndex, pieceIndex }
      }
    }).on('change', ({ projectIndex, pieceIndex }) => {
      this.scrollTo({ projectIndex, pieceIndex })
    })

    setTimeout(() => {
      const { projectIndex, pieceIndex } = this.navHistory.get()
      this.scrollTo({ projectIndex, pieceIndex }, true)
    }, 0)
    
  }

  componentWillUnmount () {
    window.removeEventListener('keydown', this.keydownHandler)
    window.removeEventListener('wheel', this.wheelHandler)
    window.removeEventListener('touchstart', this.touchstartHandler)
    window.removeEventListener('touchmove', this.touchmoveHandler)
    window.removeEventListener('resize', this.resizeHandler)
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
      this.setState({ showInfo: !this.state.showInfo })
    }

    link = parseInt(link)
    if (!isNaN(link)) {
      if (link === this.state.projectIndex) {
        this.horizontalScroll(0)
      } else {
        this.verticalScroll(link)
      }

      this.setStateAndHistory({
        pieceIndex: 0,
        captionPieceIndex: 0,
        projectIndex: link,
        showInfo: false
      })
      // this.setHistory({ projectIndex, pieceIndex })   
    }
  }

  handlePieceClick () {
    const { projects } = this.props
    const { projectIndex, pieceIndex } = this.state
    const pieces = projects[projectIndex].pieces
    if (pieces.length > pieceIndex) {
      this.right()
    } else if (projects.length > projectIndex - 1) {
      this.down()
    }
  }

  handleImageLoad () {
    this.scrollTo(this.state, true)
  }

  stopPropagation (e) {
    e.stopPropagation()
  }

  render () {
    const { projects, info } = this.props
    const { projectIndex, pieceIndex, captionPieceIndex, showInfo } = this.state
    const pieces = projects[projectIndex].pieces

    const piece = captionPieceIndex > 0 ? pieces[captionPieceIndex - 1] : null

    const onMove = (by) => {
      by === -1 ? this.left() : this.right()
    }

    return <>
      <ProjectContainer ref={this.handleRef}>
        { projects.map((p, i) => <Project 
          key={i} 
          project={p} 
          isCurrent={projectIndex === i} 
          pieceIndex={pieceIndex} 
          onPieceClick={this.handlePieceClick}
          onImageLoad={this.handleImageLoad}
        />)}
      </ProjectContainer>
      { 
        captionPieceIndex > 0 &&
        <Caption 
          onMove={onMove} 
          index={captionPieceIndex} 
          count={pieces.length} 
          piece={piece} 
        />
      }
      
      <Info visible={showInfo} onWheel={this.stopPropagation} onTouchMove={this.stopPropagation} onTouchStart={this.stopPropagation}>
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