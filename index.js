const urljoin = require('urljoin')
const { get } = require('unirest')

module.exports = class ESPN {
  constructor(league) {
    this.league = league
    this.sport = this.getSport()
    this.baseUrl = `http://site.api.espn.com/apis/site/v2/sports/${this.sport}/${league}`
    this.team = null
  }

  getSport() {
    switch (this.league) {
      case 'college-football':
      case 'nfl':
        return 'football'

      case 'mens-college-basketball':
      case 'womens-college-backetball':
      case 'nba':
      case 'wnba':
        return 'basketball'

      case 'college-basketball':
      case 'mlb':
        return 'baseball'

      case 'nhl':
        return 'hockey'

      default:
        // * ASSUME SOCCER, sport = soccer
        return 'soccer'
    }
  }

  async getConferenceID(conference) {
    // get conference id from a conference name/abbreviation
  }

  async getNews() {
    const request = await get(`${this.baseUrl}/news`)
    const news = request.body
    // ? do somehing else with news ??
    return news
  }

  async getScoreboard() {
    const request = await get(`${this.baseUrl}/scoreboard`)
    const scores = request.body
    // ? do somehing else with scoreboard ??
    return scores
  }

  async getTeam(team) {
    // 'team' can be teamID or abbreviation
  }

  async getTeamSchedule(teamID) {}

  async getGame(gameID) {}

  async getGameProbability(gameID) {}

  async getGameOdds(gameID) {}

  async getRankings(team) {
    switch (this.league) {
      default:
      // ? make some logic here to filter which rank/leaderboard to grab
    }
    // 'leaderboard' for things like golf, 'rankings' for team sports
    const request = await get(`${this.baseUrl}/rankings`)
    const rankings = request.body
    // ? do somehing else with rankings ??
    return rankings
  }
}
