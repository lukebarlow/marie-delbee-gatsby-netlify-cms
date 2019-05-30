import React from "react";
import withFileControl from './withFileControl.js'

const MediaPreview = props => <div>MEDIA PREVIEW</div>;
const MediaControl = withFileControl()

export {
  MediaControl,
  MediaPreview
}