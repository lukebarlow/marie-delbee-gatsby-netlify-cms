import React from 'react'
import styled from 'styled-components'
import scroll from 'scroll'
import Markdown from 'react-markdown'
import MediaQuery from 'react-responsive'

import History from 'hash-history'

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
    this.handleImageLoad = this.handleImageLoad.bind(this)
    this.scrollTo = this.scrollTo.bind(this)
    this.state = {
      showInfo: false,
      projectIndex: 0,
      pieceIndex: 0, // where 0 is the cover, and 1 is the first piece
      captionPieceIndex: 0 // replicates pieceIndex, but sometimes changes at
                           // a slightly different moment to get the transitions
                           // correct
    }
  }

  scrollTo ({ projectIndex, pieceIndex }, instant) {
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
      
      // the project we're scrolling to will always start with the cover,
      // so we first reset the scroll position of that project
      const projectElement = projectsContainer.children[projectIndex]
      // projectElement.scrollLeft = 0 // redundant - done above

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
        default :
          // do nothing
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

    window.addEventListener('resize', () => { 
      // this.verticalScroll(this.state.projectIndex, true)
      // this.horizontalScroll(this.state.pieceIndex, true)

      this.scrollTo(this.state, true)

    })

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
        projectIndex: link
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
          selected={ showInfo ? 'info' : projectIndex }
          isWhite={captionPieceIndex===0 && !showInfo} 
          projects={projects} 
          onLink={this.handleLink} 
        />
      </MediaQuery>
    </>
  }
}