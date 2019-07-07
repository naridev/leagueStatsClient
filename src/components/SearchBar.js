import React, { Component } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const Search = styled.input`
  height: 40px;
  width: 200px;
  border-radius: 5px;
  align-items: center;
  padding: 2px;
  font-size: 12px;
`

const Button = styled.button`
  height: 40px;
  border-radius: 5px;
  border: none;
  background: lightblue;
`

export default class Input extends Component {
  state = {
    summonerName: ''
  }

  handleChange = event => {
    this.setState({
      summonerName: event.target.value
    })
  }

  handleSubmit = event => {
    event.preventDefault()
    this.props.handleSubmit(this.state.summonerName)
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} style={{ width: '100%' }}>
        <Container>
          <Search
            placeholder="enter summoner name"
            value={this.state.url}
            onChange={this.handleChange}
          />
          <Button type="submit">Submit</Button>
        </Container>
      </form>
    )
  }
}
