import CMS from 'netlify-cms'

import ProjectPagePreview from './preview-templates/ProjectPagePreview.js'
import { ListOfPiecesControl, ListOfPiecesPreview } from './widgets/ListOfPieces.js'
import { MediaControl, MediaPreview } from './widgets/Media.js'

CMS.registerPreviewTemplate('projects', ProjectPagePreview)
CMS.registerWidget('listOfPieces', ListOfPiecesControl, ListOfPiecesPreview)
CMS.registerWidget('media', MediaControl, MediaPreview)