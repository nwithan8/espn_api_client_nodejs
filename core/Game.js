const { get } = require('unirest')
const Team = require('./Team')

/**
 * Class and methods for ESPN game data
 */
module.exports = class Game {
  constructor(gameID, data) {
    this.gameID = gameID
    this.league = data.league
    this.sport = data.sport
    this.baseUrl = data.baseUrl
    this.awayTeam = null // Team object
    this.homeTeam = null // Team object
    this.score = null // {awayScore, homeScore}
    this.winProbability = null // {percentage, winningTeam}
    this.spread = null
    this.overUnder = null
    this.venue = null
    this.attendance = null
    /* ;(async () => {
      await this.getTeams(gameID)
    })() */
    // can't be run at construction, so games don't have home & away teams filled out until getTeams() called manually
  }

  /**
   * Get game data for game ID in JSON format
   * @return {object} JSON of game info
   */
  async getJson() {
    try {
      const request = await get(`${this.baseUrl}/summary?event=${this.gameID}`)
      return request.body
    } catch (e) {
      console.error(e)
    }
  }

  /**
   * Complete Game object, used internally
   *
   * ERROR: TypeError: Team is not a constructor (line 47 & 54)
   */
  async makeGame() {
    try {
      const json = await this.getJson()
      const teamObjs = json.boxscore.teams
      /* this.awayTeam = new Team({
        teamID: teamObjs[0].team.id,
        teamNickname: null,
        league: this.league,
        sport: this.sport,
        baseUrl: this.baseUrl
      })
      this.homeTeam = new Team({
        teamID: teamObjs[1].team.id,
        teamNickname: null,
        league: this.league,
        sport: this.sport,
        baseUrl: this.baseUrl
      }) */
      this.venue =
        {
          name: json.gameInfo.venue.fullName,
          city: json.gameInfo.venue.address.city,
          state: json.gameInfo.venue.address.state,
          capacity: json.gameInfo.venue.capacity,
          image: json.gameInfo.venue.images[0].href
        } || null
      this.attendance = json.gameInfo.venue.attendance || null
      this.broadcast = json.header.competitions[0].broadcasts[0].media.shortName || null
      await this.getScore()
      await this.getGameProbability()
      await this.getGameOdds()
    } catch (e) {
      console.error(e)
    }
  }

  /**
   * Gets the two teams playing the game
   * @returns {object} {awayTeam, homeTeam}
   *
   * ERROR: TypeError: Team is not a constructor (line 58 & 66)
   */
  async getTeams() {
    return { awayTeam: this.awayTeam, homeTeam: this.homeTeam }
  }

  /**
   *  Gets the score of the game
   * @return {object} {awayScore, homeScore}
   */
  async getScore() {
    try {
      const json = await this.getJson()
      // this.score reset on every getScore() because data frequently changes
      if (this.score) {
        this.score = {}
      }
      if (json.scoringPlays) {
        const lastScore = json.scoringPlays.pop()
        this.score = { awayScore: lastScore.awayScore, homeScore: lastScore.homeScore }
      }
      return this.score
    } catch (e) {
      console.error(e)
    }
  }

  /**
   *  Gets the win probability of the game
   * @return {object} {percentage, Team Object of predicted winning team}
   */
  async getGameProbability() {
    /* this.winProbabilityPercentage and this.winProbabilityTeam updated on every
    getGameProbability() because data frequently changes */
    try {
      const json = await this.getJson()
      let percentage
      let team
      if (json.winprobability) {
        const lastProbability = json.winprobability.pop()
        if (lastProbability.homeWinPercentage < 0.5) {
          percentage = (1 - lastProbability.homeWinPercentage) * 100
          team = this.awayTeam
        } else {
          percentage = lastProbability.homeWinPercentage * 100
          team = this.homeTeam
        }
        this.winProbability = {
          percentage,
          winningTeam: team
        }
      }
      return this.winProbability
    } catch (e) {
      console.error(e)
    }
  }

  /**
   * Gets the game spread and over-under
   * @return {object} {spread, overUnder}
   */
  async getGameOdds() {
    try {
      if (!this.spread || !this.overUnder) {
        const json = await this.getJson()
        if (json.pickcenter) {
          const pickCenter = json.pickcenter[0]
          this.spread = pickCenter.details
          this.overUnder = pickCenter.overUnder
        }
      }
      return {
        spread: this.spread,
        overUnder: this.overUnder
      }
    } catch (e) {
      console.error(e)
    }
  }
}
