const { get } = require('unirest')
const Team = require('./Team')

/**
 * Class and methods for ESPN conference data
 */
module.exports = class Conference {
  constructor(conferenceID, data) {
    console.log(new Team())
    this.conferenceID = conferenceID
    this.league = data.league
    this.sport = data.sport
    this.baseUrl = data.baseUrl
    this.name = null
    this.teams = null // [Team object, Team object, ...]
  }

  /**
   * Get all teams in a conference
   * @return {object} Array of Team objects
   */
  async getTeams() {
    try {
      if (!this.teams) {
        this.teams = []
        const request = await get(`${this.baseUrl}/teams?groups=${this.conferenceID}&limit=1000`)
        for (const team of request.body.sports[0].leagues[0].teams) {
          console.log(team)
          console.log(team.team.id)
          console.log(team.team.nickname.toLowerCase())
          const newTeam = new Team(team.team.id, {
            league: this.league,
            sport: this.sport,
            baseUrl: this.baseUrl,
            teamNickname: team.team.nickname.toLowerCase()
          })
          console.log(newTeam)
          this.teams.push(newTeam)
        }
      }
      return this.teams
    } catch (e) {
      this.teams = null
      console.error(e)
    }
  }
}
