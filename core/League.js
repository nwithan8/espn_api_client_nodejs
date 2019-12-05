/* eslint-disable max-classes-per-file */
const { get } = require('unirest')
const TeamClass = require('./Team')
const GameClass = require('./Game')

module.exports = class League {
  constructor(leagueName) {
    this.league = leagueName
    this.sport = this.getSport(leagueName)
    this.teams = {}
    this.conferences = []
    this.baseUrl = `http://site.api.espn.com/apis/site/v2/sports/${this.sport}/${this.league}`
    this.currentGames = []
  }

  getSport(league) {
    let sport

    switch (league.toLowerCase()) {
      case 'college-football':
      case 'nfl':
        sport = 'football'
        break

      case 'mens-college-basketball':
      case 'womens-college-backetball':
        sport = 'basketball'
        break

      case 'nba':
      case 'wnba':
      case 'college-basketball':
        sport = 'basketball'
        break

      case 'mlb':
        sport = 'baseball'
        break

      case 'nhl':
        sport = 'hockey'
        break

      default:
        // ASSUME SOCCER OTHERWISE
        sport = 'soccer'
    }

    return sport
  }

  async Team(ID) {
    const request = await get(`${this.baseUrl}/teams/${ID.toLowerCase()}`)
    console.log(request.body.code)
    if (!request.body.code) {
      if (typeof ID === 'number') {
        return new TeamClass({
          teamID: ID,
          league: this.league,
          sport: this.sport,
          baseUrl: this.baseUrl
        })
      }
      return new TeamClass({
        teamNickname: ID,
        league: this.league,
        sport: this.sport,
        baseUrl: this.baseUrl
      })
    }
  }

  async getTeams() {
    const response = await get(`${this.baseUrl}/teams`)
    const teamList = response.body.sports[0].leagues[0].teams
    return teamList
  }

  async getRankings() {
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

  async getNews() {
    const request = await get(`${this.baseUrl}/news`)
    const news = request.body
    // ? do somehing else with news ??
    return news
  }

  async getCurrentGames() {
    const request = await get(`${this.baseUrl}/scoreboard`)

    for (const game of request.body.events) {
      this.currentGames.push(
        new GameClass(game.id, { league: this.league, sport: this.sport, baseUrl: this.baseUrl })
      )
    }
    return this.currentGames
  }
}
