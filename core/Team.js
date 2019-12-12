const { get } = require('unirest')
const Game = require('./Game')

/**
 * Class and methods for ESPN team data
 */
module.exports = class Team {
  constructor(data) {
    this.teamID = data.teamID
    this.teamNickname = data.teamNickname || null
    this.league = data.league
    this.sport = data.sport
    this.baseUrl = data.baseUrl
    this.schedule = {}
    this.conferenceID = null
    this.subConferenceID = null
    this.statistics = {}
    this.record = {}
    this.teamLogoURL = null
  }

  /**
   * Convert team abbreviation into team ID
   * @return {number} Team ID
   */
  async getTeamIDFromName() {
    const teamInfo = await this.getJson(this.teamNickname.toLowerCase())
    this.teamID = teamInfo.team.id
    return this.teamID
  }

  /**
   * Gets team ID
   * @return {number} Team ID
   */
  async getTeamID() {
    return this.teamID
  }

  /**
   * Gets the information on a team in JSON format
   * @param {ID} Team ID or abbreviation
   * @return {object} JSON of team info
   */
  async getJson(ID) {
    const request = await get(`${this.baseUrl}/teams/${ID}`)
    return request.body
  }

  /**
   * Gets the schedule of the specified team
   * @return {JSON} Specified team schedule
   */
  async getTeamSchedule() {
    const request = await get(`${this.baseUrl}/teams/${this.teamID}/schedule`)
    const schedule = []
    for (const game of request.body.events) {
      const newGame = new Game(game.id, {
        league: this.league,
        sport: this.sport,
        baseUrl: this.baseUrl
      })
      //await newGame.getTeams()
      schedule.push(newGame)
    }
    /* this.schedule = request.body.events
    return this.schedule
    */
    return schedule
  }

  /**
   * Gets the specified teams record information
   * @return {object} JSON of team record infomation
   */
  async getTeamRecord() {
    const request = await this.getJson(this.teamID)
    this.record = request.record
    return this.record
  }

  /**
   * Gets the specified teams conference
   * @return {number} ID of team's conference
   */
  async getTeamConference() {
    const request = await this.getJson(this.teamID)
    if (request.groups) {
      this.subConferenceID = request.groups.id
      this.conferenceID = request.groups.parent.id
    }
    return this.conferenceID
  }

  /**
   * Gets the specified teams logo URL
   * @return {string} Url of team logo
   */
  async getTeamLogoURL() {
    const request = await this.getJson(this.teamID)
    this.teamLogoURL = request.team.logos[0].href
    return this.teamLogoURL
  }
}
