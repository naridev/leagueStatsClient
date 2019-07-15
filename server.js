const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const path = require('path');
//kayn to work with Riot API
const { Kayn, REGIONS } = require('kayn')

const isDebugEnabled = process.env.NODE_ENV !== 'production'

const kayn = Kayn(process.env.RIOT_API_KEY)({
  region: REGIONS.NORTH_AMERICA,
  locale: 'en_US',
  debugOptions: {
    isEnabled: isDebugEnabled,
    showKey: false
  },
  requestOptions: {
    shouldRetry: true,
    numberOfRetriesBeforeAbort: 3,
    delayBeforeRetry: 1000,
    burst: false,
    shouldExitOn403: false
  }
})

const parseMatchData = (championIdMap, summonerId, match) => {
  const { participantId } = match.participantIdentities.find(
    identity => identity.player.summonerId === summonerId
  )

  const participant = match.participants.find(
    p => p.participantId === participantId
  )

  const champion = championIdMap.data[participant.championId]

  return {
    gameCreation: match.gameCreation,
    gameDuration: match.gameDuration,
    seasonId: match.seasonId,
    didWin:
      participant.teamId ===
      match.teams.find(({ win }) => win === 'Win').teamId,
    championName: champion.name,
    championImage: champion.image.full,
    // championSpell: champion.spells.image.full,
    kills: participant.stats.kills,
    deaths: participant.stats.deaths,
    assists: participant.stats.assists
  }
}

const getSummonerByName = async summonerName => {
  return await kayn.Summoner.by.name(summonerName)
}

const getRecentMatches = async (accountId) => {
  const championIdMap = await kayn.DDragon.Champion.listDataByIdWithParentAsId()

  const { id } = await kayn.Summoner.by.accountID(accountId)

  const { matches } = await kayn.Matchlist.by
    .accountID(accountId)
    .query({ queue: 420 })

  const gameIds = matches
    .slice(0, 5)
    .map(({ gameId }) => gameId)

  const matchDtos = await Promise.all(gameIds.map(kayn.Match.get))

  const processor = match => parseMatchData(championIdMap, id, match)

  return await Promise.all(matchDtos.map(processor))
}

app.use(express.json())

app.get('/:summonerName', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.get('/:accountId/matches', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});


app.get('/:summonerName', async function(req, res, next) {
  try {
    const summoner = await getSummonerByName(req.params.summonerName)
    return res.json(summoner)
  } catch (err) {
    return res.json({ message: 'Invalid Name' })
  }
})

app.get('/:accountId/matches', async function(req, res, next) {
  try {
    // Ensure the page param is a number and start as 0 if not provided
    let startIndex = 0
    if (req.query.start && Number.isInteger(parseInt(req.query.start))) {
      startIndex = req.query.start
    }

    const summoner = await getRecentMatches(
      req.params.accountId,
      startIndex
    )

    return res.json(summoner)
  } catch (err) {
    return res.json({ message: 'No Matches Found' })
  }
})

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(process.env.PORT || port, () =>
  console.log(`Server started on port ${port}`)
)
