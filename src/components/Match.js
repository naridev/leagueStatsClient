import React, { Component } from 'react'
import styled from 'styled-components'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
TimeAgo.addLocale(en)
const timeAgo = new TimeAgo('en-US')

const SingleMatch = styled.section`
  display: flex;
  width: 600px;
  background-color: lightBlue;
  border-radius: 5px;
  margin: 1rem;
`

const ChampIcon = styled.img`
  border-radius: 50%;
  transform: scale(0.5);
`

const Section = styled.div`
  margin-left: 40px;
  padding: 5px;
  font-size: 12pt;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
`

const Blue = styled.span`
  color: blue;
  font-weight: bold;
`

const Red = styled.span`
  color: red;
  font-weight: bold;
`

const champ_url =
  'http://ddragon.leagueoflegends.com/cdn/6.24.1/img/champion/'


const MatchesItem = props => {
  const { match } = props
  const gameRelativeDate = timeAgo.format(new Date(match.gameCreation))
  const gameDurationTime = parseInt(match.gameDuration/60)
  return (
    <SingleMatch style = {{background: match.didWin ? "lightBlue" : "#FB7585"}}>
      <Section>
      <p>{match.seasonId}</p>
        <p>{gameRelativeDate}</p>
        {match.didWin ? <Blue>{'Victory'}</Blue> : <Red>{'Defeat'}</Red>}
        <p>{gameDurationTime} minutes</p>
      </Section>

      <Section>
      <ChampIcon src={champ_url + match.championImage} alt="Champion Icon" />
      {match.championName}
      </Section>

      <Section>
        <p>
          {match.kills} / <Red> {match.deaths}</Red> /{' '}
          {match.assists}
        </p>
      </Section>
    </SingleMatch>
  )
}

export default MatchesItem
