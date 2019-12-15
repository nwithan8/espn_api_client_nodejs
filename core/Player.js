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
    this.baseUrl = data.baseUrl
    this.team = null
    this.position = null
    this.jerseyNumber = null
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
      let json = await this.getJson()
      json = json.athlete || json
      this.firstName = json.firstName || null
      this.lastName = json.lastName || null
      this.jerseyNumber = json.jersey || null
      if (json.position) {
        this.position = json.position.abbreviation || null
      }
      if (json.team) { // won't happen on solo players
        this.team = new Team({
          teamID: json.team.id,
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
   * Get summary data of player statistics in JSON format, if available
   * @return {object} JSON of player stats
   */
  async getPlayerStatsSummary() {
    const json = await this.getJson()
    if (json.athlete.statsSummary) {
      return json.athlete.statsSummary
    }
  }

  /**
   * Get full data of player statistics in JSON format, if available
   * @return {object} JSON of full player stats
   */
  async getPlayerFullStats() {
    const request = await get(`${this.baseUrl}/${this.playerID}/splits`)
    return request.body
  }
}
