const { get } = require('unirest')
const Game = require('./Game')
const Player = require('./Player')
const Conference = require('./Conference')

/**
 * Class and methods for ESPN team data
 */
module.exports = class Team {
  constructor(data) {
    this.teamID = data.teamID // ex. 2
    this.league = data.league
    this.sport = data.sport
    this.baseUrl = data.baseUrl
    this.nickname = data.teamNickname || null // ex. Auburn
    this.abbreviation = null // ex. AUB
    this.location = null // ex. Auburn
    this.mascot = null // ex. Tigers
    this.displayName = null // ex. Auburn Tigers
    this.color = null
    this.teamLogoURL = null
    this.conference = null // Conference object
    this.links = null // {}
    this.schedule = null // [Game object, Game object, ...]
    this.statistics = null // {}
    this.record = null // {wins, losses, ties}
    this.roster = null // [{offense, defense, ...}]
  }

  /**
   * Convert team keyword into team ID, used internally when making object
   * @param {string} keyword ID or abbreviation
   * @return {number} Team ID
   */
  async getTeamIDFromName(keyword) {
    const request = await get(`${this.baseUrl}/teams/${keyword.toLowerCase()}`)
    this.teamID = request.body.teamInfo.team.id
    return this.teamID
  }

  /**
   * Gets the information on a team in JSON format
   * @return {object} JSON of team info
   */
  // eslint-disable-next-line no-dupe-class-members
  async getJson() {
    const request = await get(`${this.baseUrl}/teams/${this.teamID}`)
    return request.body
  }

  /**
   * Complete Team object, used internally
   */
  async makeTeam() {
    try {
      const json = await this.getJson()
      this.nickname = json.team.nickname || null
      this.abbreviation = json.team.abbreviation || null
      this.location = json.team.location || null
      this.mascot = json.team.name || null
      this.displayName = json.team.displayName || null
      this.color = json.team.color || null
      this.teamLogoURL = json.team.logos[0].href || null
      this.record =
        {
          wins: json.team.record.items[0].stats[1].value,
          losses: json.team.record.items[0].stats[2].value,
          ties: json.team.record.items[0].stats[5].value
        } || null
      this.statistics = json.team.record.items || null
      this.links = json.team.links || null
      await this.getTeamSchedule()
      await this.getTeamConference()
      await this.getTeamRoster()
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * Gets the schedule of the specified team
   * @return {object} Specified team schedule
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
        this.schedule = schedule
      }
      return this.schedule
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * Gets the specified team's conference
   * @return {object} {conferenceID, subConferenceID}
   */
  async getTeamConference() {
    try {
      if (!this.conferenceID) {
        const json = await this.getJson()
        this.conference = new Conference(json.groups.parent.id) || null
      }
      return this.conference
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
