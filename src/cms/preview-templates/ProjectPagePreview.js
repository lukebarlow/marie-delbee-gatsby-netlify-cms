import React from 'react'

import ProjectPreview from './ProjectPreview.js'

class ProjectPagePreview extends React.Component {
  render () {
    const projects = this.props.entry.getIn(['data', 'projects']).toJS()
    return <div>
      { projects.map((p, i) => <ProjectPreview key={i} project={p} onPieceClick={() => {}} />)}
    </div>
  }
}

export default ProjectPagePreview
