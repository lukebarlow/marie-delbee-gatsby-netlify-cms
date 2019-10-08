// import React from 'react'

// export default class PortraitApp extends React.Component {
//   render () {
//     return "PORTRAIT APP"
//   }
// }


import React from 'react'
import scroll from 'scroll'
import { scaleLinear } from 'd3-scale'

import '../styles/App.css'

// import createTransition from '../common/createTransition'

import ProjectCover from './ProjectCover'
import ProjectPieces from './ProjectPieces'

// given an ordered list of numbers, give the 
function positionInList(value, list) {
  const s = scaleLinear().domain(list).range(list.keys())
  return s(value)
}

export default class App extends React.Component {
  constructor () {
    super()
    // this.handleRef = this.handleRef.bind(this)

    this.masterContainer = React.createRef()
    this.coversContainer = React.createRef()

    window.masterContainer = this.masterContainer
    window.coversContainer = this.coversContainer

    this.pieceIndex = 0 // 0 is project splash screen, higher numbers are the pieces
    this.projectIndex = 0
    
    this.state = {
      innerWidth: 1000,
      innerHeight: 700,
      isPortrait: true
    }
  }

  // handleCoverContainerRef (el) {
  //   this.projectsContainer = el
  //   window.projectsContainer = el
  // }

  componentDidMount () {
    const setSizes = () => {
      this.setState({
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        isMobile: window.innerWidth < 758,
        isPortrait: window.innerWidth < window.innerHeight
      })
    }
    setSizes()

    window.addEventListener('resize', setSizes)

    window.addEventListener('keydown', (e) => {
      if (!e.repeat) {
        switch(e.key) {
          case 'ArrowUp':
            this.moveVertical(-1)
          break
          case 'ArrowDown':
            this.moveVertical(1)
          break
          case 'ArrowLeft':
            this.moveHorizontal(-1)
          break
          case 'ArrowRight':
            this.moveHorizontal(1)
          break
          default :
            // do nothing
          break
        }
      }
    })
  }

  moveHorizontal (horizontal) {
    const { innerWidth } = this.state
    const masterContainer = this.masterContainer.current

    // if (this.pieceIndex === 0 && horizontal > 0) {
    //   scroll.left(masterContainer, innerWidth)
    //   this.pieceIndex = 1
    // }

    // if (this.pieceIndex === 1 && horizontal < 0) {
    //   scroll.left(masterContainer, 0)
    //   this.pieceIndex = 0
    // }

  }

  moveVertical (moveBy) {

    const coversContainer = this.coversContainer.current

    if (moveBy !== 0) {
      // measure the project element offsets
      let topOffsets = []
      for (let child of coversContainer.children) {
        topOffsets.push(child.offsetTop)
      }
      // figure out current project index by the scroll position
      let position = positionInList(coversContainer.scrollTop, topOffsets)
      const isExact = Math.round(position) === position

      if (isExact) {
        position = position + moveBy
        position = Math.max(Math.min(position, topOffsets.length - 1), 0)
      } else {
        position = moveBy > 0 ? Math.ceil(position) : Math.floor(position)        
      }
      this.projectIndex = position
      this.forceUpdate()
      scroll.top(coversContainer, topOffsets[position])
    }
  }

  render () {
    const { projects } = this.props
    const { innerHeight, innerWidth, isMobile, isPortrait } = this.state
    
    const coverContainerStyle = {
      width: innerWidth,
      height: innerHeight,
      scrollbarWidth: 'none',
      overflowY: 'scroll',
      overflowX: 'hidden',
      border: '1pt solid red'
    } 

    const zoom = 1

    return <div style={{ position: 'relative', left: 0, top: 0}}>

      PORTRAIT APPa
    </div>

    // return <div style={{ position: 'absolute', width: innerWidth, zoom, left: 0 }} ref={this.masterContainer}>
    //   <div style={ coverContainerStyle } ref={this.coversContainer}>
    //     { projects.map((project, i) => <ProjectCover 
    //         key={i} 
    //         project={project} 
    //         innerWidth={innerWidth}
    //         innerHeight={innerHeight}
    //         isMobile={isMobile}
    //         isPortrait={isPortrait}
    //     />)}
    //   </div>
    //   {/* <div style={{ position: 'absolute', left: innerWidth, top: 0 }}>
    //     <ProjectPieces project={projects[this.projectIndex]} innerHeight={innerHeight} innerWidth={innerWidth} />
    //   </div> */}
    // </div>
  }
}