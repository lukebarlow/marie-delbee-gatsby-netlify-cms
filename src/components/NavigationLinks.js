import React from 'react'
import MediaQuery from 'react-responsive'
import styled from 'styled-components'
const Bar = styled.div`
  position: absolute;
  top: 20px;
  left: 0px;
  white-space: nowrap;
  color: ${({ isWhite }) => isWhite ? 'white': 'black'};
  transition: color 0.5s;
`

const NavSpan = styled.span`
  display: inline-block;
  margin-left: 40px;
  cursor: pointer;
  text-decoration: ${({ selected }) => selected ? 'underline' : 'inherit'};
  :hover {
    text-decoration: underline;
  }
`

const InfoSpan = styled.span`
  position: absolute;
  cursor: pointer;
  top: 20px;
  right: 30px;
  display: block;
  color: ${({ color }) => color};
  text-decoration: ${({ selected }) => selected ? 'underline' : 'inherit'};

  :hover {
    text-decoration: underline;
  }
`

export default ({projects, onLink, isWhite, selected}) => {
  return <>
    <MediaQuery minWidth={768}>
      <Bar isWhite={isWhite}>
        { projects.map((p, i) => <NavSpan onClick={() => onLink(i)} key={i} selected={parseInt(selected)===i} project={p}>{p.title}</NavSpan>)}
      </Bar>
      <InfoSpan color={isWhite ? 'white' : 'black'} onClick={() => onLink('info')} selected={selected==='info'}>
        { selected==='info' ? 'close' : 'info' }
      </InfoSpan>
    </MediaQuery>
    <MediaQuery maxWidth={768}>
      <InfoSpan color='gray' onClick={() => onLink('info')} selected={selected==='info'}>
        { selected==='info' ? 'close' : 'info' }
      </InfoSpan>
    </MediaQuery>
  </>
}