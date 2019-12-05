const { get } = require('unirest')

module.exports = class Team {
  constructor(data) {
    this.teamID = data.teamID || null
    this.teamNickname = data.teamNickname || null
    this.league = data.league
    this.sport = data.sport
    this.baseUrl = data.baseUrl
    this.schedule = {}
    this.conferenceID = null
    this.subConferenceID = null
    this.statistics = {}
    this.record = {}

    if (!this.teamID) {
      ;(async () => {
        this.teamID = await this.getTeamID()
      })()
    }
  }

  async getTeamID() {
    // convert team abbreviation into teamID
    const teamInfo = await this.getTeamInfo(this.teamNickname)
    return teamInfo.team.id
  }

  async getTeamInfo(ID) {
    // 'ID' can be teamID or abbreviation
    const request = await get(`${this.baseUrl}/teams/${ID}`)
    const teamInfo = request.body
    return teamInfo
  }

  async getTeamSchedule() {
    const request = await get(`${this.baseUrl}/teams/${this.teamID}/schedule`)
    this.schedule = request.body.events
    return this.schedule
  }

  async getTeamRecord() {
    const request = await this.getTeamInfo(this.teamID)
    this.record = request.record
    return this.record
  }

  async getTeamConference() {
    const request = await this.getTeamInfo(this.teamID)
    if (request.groups) {
      this.subConferenceID = request.groups.id
      this.conferenceID = request.groups.parent.id
    }
    return this.conferenceID
  }
}

// vars:
// teamId
// abbreviations
// schedule
// record
// other info from the API hit
