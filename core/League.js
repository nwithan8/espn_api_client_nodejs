/* eslint-disable max-classes-per-file */
const { get } = require('unirest')
const Team = require('./Team')
const Game = require('./Game')
const Player = require('./Player')

/**
 * Class and methods for ESPN League data
 */
module.exports = class League {
  constructor(leagueName) {
    this.league = leagueName
    this.sport = this.getSport(leagueName)
    this.teams = {}
    this.conferences = []
    this.baseUrl = `http://site.api.espn.com/apis/site/v2/sports/${this.sport}/${this.league}`
    this.currentGames = []
  }

  /**
   * Sets the sport based on the specified league
   * @param {league} league Leauge of the sport being requested
   * @return {string} The sport
   */
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

  /**
   * Fetches the team from the ID or abbreviation
   * @param {string} ID Team ID or abbreviation
   * @return {object} Team object
   */
  async Team(ID) {
    const request = await get(`${this.baseUrl}/teams/${ID.toLowerCase()}`)
    if (!request.body.code) {
      let team
      if (typeof ID === 'number') {
        team = new Team({
          teamID: ID,
          teamNickname: null,
          league: this.league,
          sport: this.sport,
          baseUrl: this.baseUrl
        })
      } else {
        team = new Team({
          teamID: await this.getTeamIDFromName(ID.toLowerCase()),
          teamNickname: ID,
          league: this.league,
          sport: this.sport,
          baseUrl: this.baseUrl
        })
      }
      return team
    }
  }

  /**
   * Fetches the game from the ID
   * @param {string} ID Game ID
   * @return {object} Game object
   */
  async Game(ID) {
    const game = new Game(ID, {
      league: this.league,
      sport: this.sport,
      baseUrl: this.baseUrl
    })
    return game
  }

  /**
   * Fetches the player from the ID
   * @param {string} ID Player ID
   * @return {object} Player object
   */
  async Player(ID) {
    const player = new Player(ID, {
      league: this.league,
      sport: this.sport
    })
    return player
  }

  async getTeamIDFromName(name) {
    const request = await get(`${this.baseUrl}/teams/${name}`)
    return request.body.team.id
  }

  /**
   * Fetches all teams in the specified league
   * @return {object} Array of all teams in league
   */
  async getTeams() {
    const response = await get(`${this.baseUrl}/teams`)
    const teamList = response.body.sports[0].leagues[0].teams
    return teamList
  }

  /**
   * Fetches the rankings of all teams in league
   * @return {object} JSON containing all rankings
   */
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

  /**
   * Fetches news items for the specified league
   * @return {object} JSON of league news
   */
  async getNews() {
    const request = await get(`${this.baseUrl}/news`)
    return request.body
  }

  /**
   * Fetches all current games in specified league
   * @return {object} Array of current games in league
   */
  async getCurrentGames() {
    const request = await get(`${this.baseUrl}/scoreboard`)

    for (const game of request.body.events) {
      const newGame = new Game(game.id, {
        league: this.league,
        sport: this.sport,
        baseUrl: this.baseUrl
      })
      // await newGame.getTeams()
      this.currentGames.push(newGame)
    }
    return this.currentGames
  }
}
