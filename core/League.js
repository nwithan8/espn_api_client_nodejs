/* eslint-disable max-classes-per-file */
const { get } = require('unirest')
const Team = require('./Team')
const Game = require('./Game')
const Player = require('./Player')
const Conference = require('./Conference')

/**
 * Class and methods for ESPN League data
 */
module.exports = class League {
  constructor(leagueName) {
    this.league = leagueName
    this.sport = this.getSport(leagueName)
    this.teams = null // [Team object, Team object ...]
    this.conferences = null // []
    this.rankings = null // {}
    this.baseUrl = `http://site.api.espn.com/apis/site/v2/sports/${this.sport}/${this.league}`
    this.currentGames = null // [Game object, Game object, ...]
  }

  /**
   * Convert league nicknames into API-compliant values
   * Use mostly for college sports (i.e. NCAAM or NCB?)
   * @param {string} league
   */
  async fixLeagueName(league) {
    if (['college football', 'ncaaf', 'cfb'].includes(league.toLowerCase())) {
      this.leagueName = 'college-football'
    } else if (['ncaam', 'mcb', 'ncb', 'mens college basketball'].includes(league.toLowerCase())) {
      this.leagueName = 'mens-college-basketball'
    } else if (
      ['ncaaw', 'wcb', 'ncw', 'womens college basketball'].includes(league.toLowerCase())
    ) {
      this.leagueName = 'womens-college-basketball'
    } else {
      this.leagueName = league.toLowerCase()
    }
  }

  /**
   * Sets the sport based on the specified league
   * @param {string} league Leauge of the sport being requested
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
    try {
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
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * Helper function, convert team name into team ID
   * @param {string} name keyword to find team
   */
  async getTeamIDFromName(name) {
    try {
      const request = await get(`${this.baseUrl}/teams/${name}`)
      return request.body.team.id
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * Fetches the conference from the ID
   * @param {string} ID Conference ID
   * @return {object} Conference object
   */
  async Conference(ID) {
    try {
      const conference = new Conference(ID, {
        league: this.league,
        sport: this.sport,
        baseUrl: this.baseUrl
      })
      return conference
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * Fetches the game from the ID
   * @param {string} ID Game ID
   * @return {object} Game object
   */
  async Game(ID) {
    try {
      const game = new Game(ID, {
        league: this.league,
        sport: this.sport,
        baseUrl: this.baseUrl
      })
      return game
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * Fetches the player from the ID
   * @param {string} ID Player ID
   * @return {object} Player object
   */
  async Player(ID) {
    try {
      const player = new Player(ID, {
        league: this.league,
        sport: this.sport
      })
      return player
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * Fetches all teams in the specified league
   * @return {object} Array of all teams in league
   */
  async getTeams() {
    try {
      if (!this.teams) {
        this.teams = []
        const response = await get(`${this.baseUrl}/teams?limit=1000`)
        for (const team of response.body.sports[0].leagues[0].teams) {
          this.teams.push(await this.Team(team.team.id))
        }
      }
      return this.teams
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * Fetches the rankings of all teams in league
   * @return {object} JSON containing all rankings
   */
  async getRankings() {
    try {
      switch (this.league) {
        default:
        // ? make some logic here to filter which rank/leaderboard to grab
      }
      // 'leaderboard' for things like golf, 'rankings' for team sports
      const request = await get(`${this.baseUrl}/rankings`)
      this.rankings = request.body
      return this.rankings
      // ? do somehing else with rankings ??
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * Fetches news items for the specified league
   * @return {object} JSON of league news
   */
  async getNews() {
    try {
      const request = await get(`${this.baseUrl}/news`)
      return request.body
    } catch (e) {
      console.log(e)
    }
  }

  /**
   * Fetches all current games in specified league
   * @return {object} Array of current games in league
   */
  async getCurrentGames() {
    try {
      this.currentGames = []
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
    } catch (e) {
      console.log(e)
    }
  }
}
