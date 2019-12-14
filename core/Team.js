const { get } = require('unirest')
const Game = require('./Game')
const Player = require('./Player')

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
    this.roster = null
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
   * Gets the information on a team in JSON format, used internally
   * @param {ID} Team ID or abbreviation
   * @return {object} JSON of team info
   */
  async getJson(ID) {
    const request = await get(`${this.baseUrl}/teams/${ID}`)
    return request.body
  }

  /**
   * Gets the information on a team in JSON format, used externally
   * @param {ID} Team ID or abbreviation
   * @return {object} JSON of team info
   */
  async getJson() {
    const request = await get(`${this.baseUrl}/teams/${this.teamID}`)
    return request.body
  }

  /**
   * Gets the schedule of the specified team
   * @return {JSON} Specified team schedule
   */
  async getTeamSchedule() {
    try {
      if (!this.schedule) {
        const request = await get(`${this.baseUrl}/teams/${this.teamID}/schedule`)
        const schedule = []
        for (const game of request.body.events) {
          const newGame = new Game(game.id, {
            league: this.league,
            sport: this.sport,
            baseUrl: this.baseUrl
          })
          // await newGame.getTeams()
          schedule.push(newGame)
        }
        /* this.schedule = request.body.events
        return this.schedule
        */
      }
      return this.schedule
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * Gets the specified team's record information
   * @return {object} JSON of team record infomation
   */
  async getTeamRecord() {
    try {
      if (!this.record) {
        const json = await this.getJson(this.teamID)
        this.record = json.record
      }
      return this.record
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * Gets the specified team's conference
   * @return {number} ID of team's conference
   */
  async getTeamConference() {
    try {
      if (!this.conferenceID) {
        const json = await this.getJson(this.teamID)
        if (json.groups) {
          this.subConferenceID = json.groups.id
          this.conferenceID = json.groups.parent.id
        }
      }
      return this.conferenceID
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * Gets the specified team's logo URL
   * @return {string} Url of team logo
   */
  async getTeamLogoURL() {
    try {
      if (!this.teamLogoURL) {
        const json = await this.getJson(this.teamID)
        this.teamLogoURL = json.team.logos[0].href
        return this.teamLogoURL
      }
      return this.teamLogoURL
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * Gets the specified team's roster
   * @return {object} Array of Player objects
   */
  async getTeamRoster() {
    try {
      if (!this.roster) {
        const request = await get(`${this.baseUrl}/teams/${this.teamID}/roster`)
        const roster = []
        for (const group of request.body.athletes) {
          const dict = { position: group.position, players: null }
          const players = []
          for (const player of group.items) {
            const newPlayer = new Player(player.id, {
              league: this.league,
              sport: this.sport
            })
            players.push(newPlayer)
          }
          dict.players = players
          roster.push(dict)
        }
        this.roster = roster
      }
      return this.roster
    } catch (e) {
      console.log(e)
    }
  }
}
