import React from 'react'
import PropTypes from 'prop-types'
// import { AboutPageTemplate } from '../../templates/about-page'

const InfoPagePreview = ({ entry, widgetFor }) => (
  <div>This will be a preview of the info page</div>
  // <AboutPageTemplate
  //   title={entry.getIn(['data', 'title'])}
  //   content={widgetFor('body')}
  // />
)

InfoPagePreview.propTypes = {
  entry: PropTypes.shape({
    getIn: PropTypes.func,
  }),
  widgetFor: PropTypes.func,
}

export default InfoPagePreview
