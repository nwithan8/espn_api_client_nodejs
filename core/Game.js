const { get } = require('unirest')
const TeamClass = require('./Team')

module.exports = class Game {
  constructor(gameID, data) {
    this.gameID = gameID
    this.league = data.league
    this.sport = data.sport
    this.baseUrl = data.baseUrl
    this.awayTeam = null
    this.homeTeam = null
    this.score = [] // [away, home]
    ;(async () => {
      await this.getTeams(gameID)
    })()
  }

  async getTeams() {
    const request = await get(`${this.baseUrl}/summary?event=${this.gameID}`)
    const { teams } = request.body.boxscore
    this.awayTeam = new TeamClass({
      teamID: teams[0].team.id,
      league: this.league,
      sport: this.sport,
      baseUrl: this.baseUrl
    })
    this.homeTeam = new TeamClass({
      teamID: teams[1].team.id,
      league: this.league,
      sport: this.sport,
      baseUrl: this.baseUrl
    })
  }

  async getScore() {
    const request = await get(`${this.baseUrl}/summary?event=${this.gameID}`)
    if (request.body.scoringPlays) {
      const lastScore = request.body.scoringPlays.pop()
      this.score.push(lastScore.awayScore)
      this.score.push(lastScore.homeScore)
    }
    return this.score
  }

  async getGameProbability() {}

  async getGameOdds() {}
}
