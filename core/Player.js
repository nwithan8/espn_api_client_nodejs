const { get } = require('unirest')
const Team = require('./Team')

/**
 * Class and methods for ESPN player data
 */
module.exports = class Player {
  constructor(playerID, data) {
    this.playerID = playerID
    this.firstName = null
    this.lastName = null
    this.league = data.league
    this.sport = data.sport
    this.team = null
    this.position = null
    this.jerseyNumber = null
    this.baseUrl = `https://site.web.api.espn.com/apis/common/v3/sports/${this.sport}/${this.league}/athletes`
  }

  /**
   * Get player data for player ID in JSON format
   * @return {object} JSON of player info
   */
  async getJson() {
    try {
      const request = await get(`${this.baseUrl}/${this.playerID}`)
      return request.body
    } catch (e) {
      console.error(e)
    }
  }

  /**
   * Update basic player information following construction
   */
  async updatePlayerInfo() {
    try {
      const json = await this.getJson()
      this.firstName = json.athlete.firstName
      this.lastName = json.athlete.lastName
      if (json.athlete.jersey) {
        this.jerseyNumber = json.athlete.jersey
      }
      if (json.athlete.position) {
        this.position = json.athlete.position.abbreviation
      }
      if (json.athlete.team.id) {
        this.team = new Team({
          teamID: json.athlete.team.id,
          teamNickname: null,
          league: this.league,
          sport: this.sport,
          baseUrl: `http://site.api.espn.com/apis/site/v2/sports/${this.sport}/${this.league}`
        })
      }
    } catch (e) {
      console.error(e)
    }
  }

  /**
   * Get a player's team
   * @return {object} Team object of player's team
   */
  async getPlayerTeam() {
    return this.team
  }

  /**
   * Get data of player statistics in JSON format, if available
   * @return {object} JSON of player stats
   */
  async getPlayerStats() {
    const json = await this.getJson()
    if (json.athlete.statsSummary) {
      return json.athlete.statsSummary
    }
  }
}
