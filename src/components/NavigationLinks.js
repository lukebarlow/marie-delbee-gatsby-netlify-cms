import React from 'react'
import styled from 'styled-components'
const Bar = styled.div`
  position: absolute;
  top: 20px;
  left: 0px;
  white-space: nowrap;
  color: ${({isWhite}) => isWhite ? 'white': 'black'}
  transition: color 0.5s;

  span {
    display: inline-block;
    margin-left: 30px;
    cursor: pointer;
  }
`

export default ({projects, onLink, isWhite}) => {
  return <Bar isWhite={isWhite}>
    { projects.map((p, i) => <span onClick={() => onLink(i)} key={i} project={p}>{p.title}</span>)}
    <span onClick={() => onLink('info')}>Info</span>
  </Bar>
}