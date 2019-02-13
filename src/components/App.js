import React from 'react'
import styled from 'styled-components'
import scroll from 'scroll'
import Markdown from 'react-markdown'
import MediaQuery from 'react-responsive'
import Helmet from 'react-helmet'

import NavigationLinks from './NavigationLinks'
import Caption from './Caption'
import '../styles/App.css'

import Project from './Project'

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
  visibility: ${({visible}) => visible ? 'visible' : 'hidden'}
`

const scrollTriggerThreshold = 51
const swipeTriggerThreshold = 51

export default class App extends React.Component {
  constructor () {
    super()
    this.isScrolling = false
    this.handleRef = this.handleRef.bind(this)
    this.handleLink = this.handleLink.bind(this)
    this.finishedScrolling = this.finishedScrolling.bind(this)
    this.handlePieceClick = this.handlePieceClick.bind(this)
    this.state = {
      showInfo: false,
      projectIndex: 0,
      pieceIndex: 0, // where 0 is the cover, and 1 is the first piece
      captionPieceIndex: 0 // replicates pieceIndex, but sometimes changes at
                           // a slightly different moment to get the transitions
                           // correct
    }
  }

  verticalScroll (projectIndex) {
    let { pieceIndex } = this.state
    // the project we're scrolling to will always start with the cover,
    // so we first reset the scroll position of that project
    const projectElement = this.projectsContainer.children[projectIndex]
    projectElement.scrollLeft = 0
    this.isScrolling = true


    scroll.top(this.projectsContainer, projectElement.offsetTop, 
      { duration: 500 }, this.finishedScrolling)
    if (pieceIndex === 0) {
      this.setState({ captionPieceIndex: pieceIndex })
    }
  }

  horizontalScroll (pieceIndex) {
    const delayCaption = pieceIndex === 1
    let { projectIndex } = this.state
    const projectElement = this.projectsContainer.children[projectIndex]
    const offset = projectElement.children[pieceIndex].offsetLeft
    this.isScrolling = true
    scroll.left(projectElement, offset, { duration: 500 }, 
      this.finishedScrolling)
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
      this.setState({ projectIndex, pieceIndex })
    }
  }

  down () {
    const { projects } = this.props
    let { projectIndex, pieceIndex } = this.state

    if (projectIndex < projects.length - 1) {
      pieceIndex = 0
      projectIndex += 1
      this.verticalScroll(projectIndex)
      this.setState({ projectIndex, pieceIndex })
    }
  }

  left () {
    let { projectIndex, pieceIndex } = this.state
    if (pieceIndex > 0) {
      pieceIndex -= 1
      this.horizontalScroll(pieceIndex)
      this.setState({ projectIndex, pieceIndex })
    }
  }

  right () {
    const { projects } = this.props
    let { projectIndex, pieceIndex } = this.state
    const pieces = projects[projectIndex].pieces
      if (pieceIndex < pieces.length) {
        pieceIndex += 1
        this.horizontalScroll(pieceIndex)
        this.setState({ projectIndex, pieceIndex })
      }
  }
  

  componentDidMount () {
    let touchStartX = null
    let touchStartY = null

    window.addEventListener('keydown', (e) => {
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
      }
    })

    window.addEventListener('wheel', (e) => {
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

    }, { passive: false })

    window.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX
      touchStartY = e.touches[0].clientY
    })

    window.addEventListener('touchmove', (e) => {
      if (this.isScrolling) {
        return
      }

      const dx = e.touches[0].clientX - touchStartX
      const dy = e.touches[0].clientY - touchStartY

      const adx = Math.abs(dx)
      const ady = Math.abs(dy)

      if (ady > adx && ady > swipeTriggerThreshold) {
        dy > 0 ? this.up() : this.down()
      }

      if (adx > ady && adx > swipeTriggerThreshold) {
        dx > 0 ? this.left() : this.right()
      }
    })

  }

  handleRef (el) {
    this.projectsContainer = el
    window.projectsContainer = el
  }

  handleLink (link) {
    this.setState({ showInfo: link === 'info' })
    link = parseInt(link)
    if (!isNaN(link)) {
      this.verticalScroll(link)
      this.setState({
        pieceIndex: 0,
        captionPieceIndex: 0,
        projectIndex: link
      })
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

  render () {
    const { projects, info } = this.props
    const { projectIndex, captionPieceIndex, showInfo } = this.state
    const pieces = projects[projectIndex].pieces

    const piece = captionPieceIndex > 0 ? pieces[captionPieceIndex - 1] : null

    const onMove = (by) => {
      by === -1 ? this.left() : this.right()
    }

    return <>
      <ProjectContainer ref={this.handleRef}>
        { projects.map((p, i) => <Project key={i} project={p} onPieceClick={this.handlePieceClick} />)}
      </ProjectContainer>
      <Caption 
        onMove={onMove} 
        index={captionPieceIndex} 
        count={pieces.length} 
        piece={piece} 
      />
      <Info visible={showInfo}>
        <Markdown source={info} />
      </Info>
      
      <MediaQuery minWidth={768}>
        <NavigationLinks 
          isWhite={captionPieceIndex===0 && !showInfo} 
          projects={projects} 
          onLink={this.handleLink} 
        />
      </MediaQuery>
    
    </>
  }
}