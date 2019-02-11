import React from 'react'

import styled from 'styled-components'
import scroll from 'scroll'

import '../styles/App.css'

import Project from './Project'

const ProjectContainer = styled.div`
  height: 100vh;
  overflow: hidden;
`
const scrollTriggerThreshold = 51

export default class App extends React.Component {
  constructor () {
    super()
    this.handleRef = this.handleRef.bind(this)
    this.projectIndex = 0
    this.pieceIndex = 0 // where 0 is the cover, and 1 is the first piece
    this.isScrolling = false
  }

  componentDidMount () {
    const { projects } = this.props

    const finishedScrolling = () => {
      this.isScrolling = false
    }

    const verticalScroll = () => {
      // the project we're scrolling to will always start with the cover,
      // so we first reset the scroll position of that project
      const projectElement = this.projectsContainer.children[this.projectIndex]
      projectElement.scrollLeft = 0
      this.pieceIndex = 0
      this.isScrolling = true
      scroll.top(this.projectsContainer, window.innerHeight * this.projectIndex, { duration: 500 }, finishedScrolling)
    }

    const horizontalScroll = () => {
      const projectElement = this.projectsContainer.children[this.projectIndex]
      const offset = projectElement.children[this.pieceIndex].offsetLeft
      this.isScrolling = true
      scroll.left(projectElement, offset, { duration: 500 }, finishedScrolling)
    }

    const up = () => {
      if (this.projectIndex > 0) {
        this.projectIndex -= 1
        verticalScroll()
      }
    }

    const down = () => {
      if (this.projectIndex < projects.length - 1) {
        this.projectIndex += 1
        verticalScroll()
      }
    }

    const left = () => {
      if (this.pieceIndex > 0) {
        this.pieceIndex -= 1
        horizontalScroll()
      }
    }

    const right = () => {
      const pieces = projects[this.projectIndex].frontmatter.pieces
        if (this.pieceIndex < pieces.length) {
          this.pieceIndex += 1
          horizontalScroll()
        }
    }

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

      if (this.isScrolling) {
        return
      }

      if (Math.abs(e.deltaY) > scrollTriggerThreshold) {
        e.deltaY > 0 ? down() : up()
      }

      if (Math.abs(e.deltaX) > scrollTriggerThreshold) {
        e.deltaX > 0 ? right() : left()
      }

    }, { passive: false })

  }

  handleRef (el) {
    this.projectsContainer = el
    window.projectsContainer = el
    console.log('got project container', el)
  }

  render () {
    // const { data } = this.props
    // let { edges: projects } = data.allMarkdownRemark
    
    const { projects } = this.props

    // projects = projects.map(p => p.node)
    console.log(projects)

    return <ProjectContainer ref={this.handleRef}>
      { projects.map((p, i) => <Project key={i} project={p} />)}
    </ProjectContainer>
  }
}