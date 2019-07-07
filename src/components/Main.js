import React, { Component } from 'react'
import styled from 'styled-components'

const Theme = styled.div`
  max-width: ${props => props.theme.maxWidth};
  margin: 0 auto;
  padding: 2rem;
  font-family: helvetica, sans-serif;
  font-weight: normal;
  font-style: normal;
`

class Main extends Component {
  render() {
    return (
        <Theme>{this.props.children}</Theme>
    )
  }
}

export default Main
