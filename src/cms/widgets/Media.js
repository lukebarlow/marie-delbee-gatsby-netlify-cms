import React from "react";

// import MediaControl from './MediaControl.js'
import withFileControl from './withFileControl.js'

// This is the preview component
const MediaPreview = props => <div>MEDIA PREVIEW</div>;
const MediaControl = withFileControl()

export {
  MediaControl,
  MediaPreview
}