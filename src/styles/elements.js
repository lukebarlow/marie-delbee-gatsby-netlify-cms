import styled from 'styled-components'

export const ProjectLandingScreen = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: #fff;
  background-image: url(${props => props.backgroundImage});
  background-repeat: no-repeat;
  background-size: cover;
`

export const ProjectTitle = styled.h1`
  position: relative;
  top: -0.1em;
  z-index: 1;
  width: 100%;
  margin: 0;
  color: white;
  font-size: 64px;
  font-weight: normal;
  text-align: center;
`

export const ProjectVideoWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;

  video {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: ${props => `${100 * (props.videoWidth / props.videoHeight)}vh`};
    height: 100%;
    min-width: 100%;
    min-height: ${props => `${100 * (props.videoHeight / props.videoWidth)}vw`};
  }
`

export const UnstyledButton = styled.button`
  appearance: none;
  padding: 0;
  background: none;
  border: none;
  outline: none;
  color: inherit;
`