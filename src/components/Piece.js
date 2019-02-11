import React from 'react'

import styled from 'styled-components'

const StyledDiv = styled.div`
  height: 100vh;
  border: 1pt solid red;
`
export default  ({ piece }) => (
  <StyledDiv>&nbsp;&nbsp;Piece {piece.title}</StyledDiv>
)

