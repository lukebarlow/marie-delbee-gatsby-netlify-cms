import React from 'react'

import ProjectPreview from './ProjectPreview.js'

class ProjectPagePreview extends React.Component {
  render () {
    const projects = this.props.entry.getIn(['data', 'projects']).toJS()
    return <div style={{zoom: '20%' }}>
      { projects.map((p, i) => <ProjectPreview key={i} project={p} onPieceClick={() => {}} />)}
    </div>
  }
}

// const ProjectPagePreview = ({ entry, getAsset }) => {

  // { entry, getAsset }
  // console.log('showing the project page preview')
  // console.log('props are', props)
  // window.props = props

  

  // const entryBlurbs = entry.getIn(['data', 'intro', 'blurbs'])
  // const blurbs = entryBlurbs ? entryBlurbs.toJS() : []

  // const entryTestimonials = entry.getIn(['data', 'testimonials'])
  // const testimonials = entryTestimonials ? entryTestimonials.toJS() : []

  // const entryPricingPlans = entry.getIn(['data', 'pricing', 'plans'])
  // const pricingPlans = entryPricingPlans ? entryPricingPlans.toJS() : []

  // return (
  //   <ProductPageTemplate
  //     image={entry.getIn(['data', 'image'])}
  //     title={entry.getIn(['data', 'title'])}
  //     heading={entry.getIn(['data', 'heading'])}
  //     description={entry.getIn(['data', 'description'])}
  //     intro={{ blurbs }}
  //     main={{
  //       heading: entry.getIn(['data', 'main', 'heading']),
  //       description: entry.getIn(['data', 'main', 'description']),
  //       image1: {
  //         image: getAsset(entry.getIn(['data', 'main', 'image1', 'image'])),
  //         alt: entry.getIn(['data', 'main', 'image1', 'alt']),
  //       },
  //       image2: {
  //         image: getAsset(entry.getIn(['data', 'main', 'image2', 'image'])),
  //         alt: entry.getIn(['data', 'main', 'image2', 'alt']),
  //       },
  //       image3: {
  //         image: getAsset(entry.getIn(['data', 'main', 'image3', 'image'])),
  //         alt: entry.getIn(['data', 'main', 'image3', 'alt']),
  //       },
  //     }}
  //     fullImage={entry.getIn(['data', 'full_image'])}
  //     testimonials={testimonials}
  //     pricing={{
  //       heading: entry.getIn(['data', 'pricing', 'heading']),
  //       description: entry.getIn(['data', 'pricing', 'description']),
  //       plans: pricingPlans,
  //     }}
  //   />
  // )
// }

// ProjectPagePreview.propTypes = {
//   entry: PropTypes.shape({
//     getIn: PropTypes.func,
//   }),
//   getAsset: PropTypes.func,
// }

export default ProjectPagePreview
