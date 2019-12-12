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
    this.awayTeam = null
    this.homeTeam = null
    this.score = [] // [away, home]
    /*;(async () => {
      await this.getTeams(gameID)
    })()*/
    // can't be run at construction, so games don't have home & away teams filled out until getTeams() called manually
    this.winProbabilityPercentage = null
    this.winProbabilityTeam = null
    this.spread = null
    this.overUnder = null
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
   * Get game ID
   * @returns {number} Game ID
   */
  async getGameID() {
    return this.gameID
  }

  /**
   * Gets the two teams playing the game
   * @returns {object} homeTeam, awayTeam of game
   * 
   * ERROR: TypeError: Team is not a constructor (line 58 & 66)
   */
  async getTeams() {
    try {
      const json = await this.getJson()
      const teamObjs = json.boxscore.teams
      console.log(teamObjs[0].team.id)
      this.awayTeam = new Team({
        teamID: teamObjs[0].team.id,
        teamNickname: null,
        league: this.league,
        sport: this.sport,
        baseUrl: this.baseUrl
      })
      console.log(teamObjs[1].team.id)
      this.homeTeam = new Team({
        teamID: teamObjs[1].team.id,
        teamNickname: null,
        league: this.league,
        sport: this.sport,
        baseUrl: this.baseUrl
      })
      return { homeTeam: this.homeTeam, awayTeam: this.awayTeam }
    } catch (e) {
      console.error(e)
    }
  }

  async getScore() {
    const json = await this.getJson()
    if (json.scoringPlays) {
      const lastScore = json.scoringPlays.pop()
      this.score.push(lastScore.awayScore)
      this.score.push(lastScore.homeScore)
    }
    return this.score
  }

  /**
   *  Gets the win probability of the game
   * @return {object} winProbabilty, Team Object of predicted winning team
   */
  async getGameProbability() {
    try {
      const json = await this.getJson()
      if (json.winprobability) {
        const lastProbability = json.winprobability.pop()
        if (lastProbability.homeWinPercentage < 0.5) {
          this.winProbabilityPercentage = 1 - lastProbability.homeWinPercentage
          this.winProbabilityTeam = this.awayTeam
        } else {
          this.winProbabilityPercentage = lastProbability.homeWinPercentage
          this.winProbabilityTeam = this.homeTeam
        }
      }
      return {
        winProbabilityPercentage: this.winProbabilityPercentage,
        winProbabilityTeam: this.winProbabilityTeam
      }
    } catch (e) {
      console.error(e)
    }
  }

  /**
   * @return {}
   */
  async getGameOdds() {
    try {
      const json = await this.getJson()
      if (json.pickcenter) {
        const pickCenter = json.pickcenter[0]
        this.spread = pickCenter.details
        this.overUnder = pickCenter.overUnder
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