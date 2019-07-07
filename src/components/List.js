import React, { Component } from 'react'
import styled from 'styled-components'
import Match from './Match'

const Item = styled.section`
  display: flex;
`

//return list of matches
const List = props => {
  return props.matches.map((match, index) => (
    <Item key={index}>
      <Match match={match} />
    </Item>
  ))
}

export default List
