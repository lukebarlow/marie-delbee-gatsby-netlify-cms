import React from 'react'

import AudioPlayer from '../components/AudioPlayer.js'

export default class AudioPlayerTest extends React.Component {
  render () {
    return <div style={{marginLeft: '80px', marginTop: '50px'}}>
      <AudioPlayer 
        audioSrc='./img/30 Kim (No. 2).mp3' 
        imgSrc='./img/charlie-parker.jpeg'
      />
    </div>
  }
}