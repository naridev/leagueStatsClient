import React, { Component, Fragment } from 'react'
import fetch from 'isomorphic-unfetch'
import SearchBar from './components/SearchBar'
import List from './components/List'
import { ClipLoader } from 'react-spinners'
import styled from 'styled-components'

const Header = styled.h2`
  display: flex;
  align-items: center;
  justify-content: center;
`

const Section = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  margin-top: 10px;
`

class App extends Component {
  state = {
    isLoading: false,
    summoner: undefined,
    matches: undefined
  }

//get provided summoner name
getAndHandleSummoner = async summonerName => {
  const summonerResp = await fetch(
    `https://league-app-stats.herokuapp.com/${summonerName}`
  )
  const summoner = await summonerResp.json()

  this.setState({ summoner: summoner })

  return summoner.accountId
}

//use summoner name to load summoner matches
loadSummonerMatches = async summonerName => {
  this.setState({ isLoading: true, summoner: undefined })

  const accountId = await this.getAndHandleSummoner(summonerName)

  const matchesResp = await fetch(
    `https://league-app-stats.herokuapp.com/${accountId}/matches`
  )
  const matches = await matchesResp.json()

  this.setState({ isLoading: false, matches: matches })
}

render() {
    return (
      <Fragment>
        <Header> League Stats App </Header>

        <SearchBar handleSubmit={this.loadSummonerMatches} />

        <Section>
        {this.state.isLoading ? <ClipLoader
          sizeUnit={"px"}
          size={50}
          color={'#123abc'}
          loading={this.state.isLoading}
          style={{alignItems: 'center'}}
        /> : null}
        {this.state.matches ? (
          <List matches={this.state.matches} />
        ) : null}
        </Section>

      </Fragment>
    )
  }
}

export default App
