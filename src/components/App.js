import React from 'react'

import styled from 'styled-components'
import scroll from 'scroll'

import Caption from './Caption'
import '../styles/App.css'

import Project from './Project'

const ProjectContainer = styled.div`
  height: 100vh;
  overflow: hidden;
`


const scrollTriggerThreshold = 51
const swipeTriggerThreshold = 51

export default class App extends React.Component {
  constructor () {
    super()
    this.handleRef = this.handleRef.bind(this)
    this.state = {
      projectIndex: 0,
      pieceIndex: 0, // where 0 is the cover, and 1 is the first piece
      captionPieceIndex: 0 // replicates pieceIndex, but sometimes changes at
                           // a slightly different moment to get the transitions
                           // correct
    }
  }

  componentDidMount () {
    const { projects } = this.props
    let projectIndex = this.state.projectIndex
    let pieceIndex = this.state.pieceIndex
    let touchStartX = null
    let touchStartY = null
    let isScrolling = false

    const finishedScrolling = () => {
      this.setState({ captionPieceIndex: pieceIndex })
      setTimeout(() => {
        isScrolling = false
      }, 200)
    }

    const verticalScroll = () => {
      // the project we're scrolling to will always start with the cover,
      // so we first reset the scroll position of that project
      const projectElement = this.projectsContainer.children[projectIndex]
      projectElement.scrollLeft = 0
      isScrolling = true
      scroll.top(this.projectsContainer, window.innerHeight * projectIndex, { duration: 500 }, finishedScrolling)
      if (pieceIndex === 0) {
        this.setState({ captionPieceIndex: pieceIndex })
      }
    }

    const horizontalScroll = (delayCaption) => {
      const projectElement = this.projectsContainer.children[projectIndex]
      const offset = projectElement.children[pieceIndex].offsetLeft
      isScrolling = true
      scroll.left(projectElement, offset, { duration: 500 }, finishedScrolling)
      if (!delayCaption) {
        this.setState({ captionPieceIndex: pieceIndex })
      }
    }

    const up = () => {
      if (projectIndex > 0) {
        pieceIndex = 0
        projectIndex -= 1
        verticalScroll()
        this.setState({ projectIndex, pieceIndex })
      }
    }

    const down = () => {
      if (projectIndex < projects.length - 1) {
        pieceIndex = 0
        projectIndex += 1
        verticalScroll()
        this.setState({ projectIndex, pieceIndex })
      }
    }

    const left = () => {
      if (pieceIndex > 0) {
        pieceIndex -= 1
        horizontalScroll()
        this.setState({ projectIndex, pieceIndex })
      }
    }

    const right = () => {
      const pieces = projects[projectIndex].frontmatter.pieces
        if (pieceIndex < pieces.length) {
          pieceIndex += 1
          horizontalScroll(pieceIndex === 1)
          this.setState({ projectIndex, pieceIndex })
        }
    }

    this.left = left
    this.right = right

    window.addEventListener('keydown', (e) => {
      switch(e.key) {
        case 'ArrowUp':
          up()
        break
        case 'ArrowDown':
          down()
        break
        case 'ArrowLeft':
          left()
        break
        case 'ArrowRight':
          right()
        break
      }
    })

    window.addEventListener('wheel', (e) => {
      e.preventDefault()

      if (isScrolling) {
        return
      }

      if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && Math.abs(e.deltaY) > scrollTriggerThreshold) {
        e.deltaY > 0 ? down() : up()
      }

      if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > scrollTriggerThreshold) {
        e.deltaX > 0 ? right() : left()
      }

    }, { passive: false })

    window.addEventListener('touchstart', e => {
      touchStartX = e.touches[0].clientX
      touchStartY = e.touches[0].clientY
    })

    window.addEventListener('touchmove', (e) => {
      if (isScrolling) {
        return
      }

      const dx = e.touches[0].clientX - touchStartX
      const dy = e.touches[0].clientY - touchStartY

      const adx = Math.abs(dx)
      const ady = Math.abs(dy)

      if (ady > adx && ady > swipeTriggerThreshold) {
        dy > 0 ? up() : down()
      }

      if (adx > ady && adx > swipeTriggerThreshold) {
        dx > 0 ? left() : right()
      }
    })

    // window.addEventListener('click', (e) => {
    //   // check if there are more pieces to move to
    //   const pieces = projects[projectIndex].frontmatter.pieces
    //   if (pieces.length > pieceIndex) {
    //     right()
    //   } else if (projects.length > projectIndex - 1) {
    //     down()
    //   }
    // })
  }

  handleRef (el) {
    this.projectsContainer = el
    window.projectsContainer = el
  }

  render () {
    const { projects } = this.props
    const { projectIndex, captionPieceIndex } = this.state
    const pieces = projects[projectIndex].frontmatter.pieces
    const piece = captionPieceIndex > 0 ? pieces[captionPieceIndex - 1] : null

    const onMove = (by) => {
      console.log('move by', by)
      by === -1 ? this.left() : this.right()
    }

    return <ProjectContainer ref={this.handleRef}>
      { projects.map((p, i) => <Project key={i} project={p} />)}
      <Caption 
        onMove={onMove} 
        index={captionPieceIndex} 
        count={pieces.length} 
        piece={piece} 
      />
    </ProjectContainer>
  }
}