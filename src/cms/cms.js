import CMS from 'netlify-cms'

// import AboutPagePreview from './preview-templates/AboutPagePreview'
// import BlogPostPreview from './preview-templates/BlogPostPreview'
import ProjectPagePreview from './preview-templates/ProjectPagePreview'

// CMS.registerPreviewTemplate('about', AboutPagePreview)
CMS.registerPreviewTemplate('projects', ProjectPagePreview)
// CMS.registerPreviewTemplate('blog', BlogPostPreview)
