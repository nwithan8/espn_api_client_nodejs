const { get } = require('unirest')
const League = require('./League')
const Player = require('./Player')

/**
 * Class and methods for ESPN sport data
 */
module.exports = class Sport {
  constructor(sportName, data) {
    this.sport = sportName
    this.baseUrl = data.baseUrl
  }

  League(leagueName) {
    try {
        const properLeague = this.fixLeagueName(leagueName)
        const league = new League(properLeague, {
            sport: this.sport,
            baseUrl: `${this.baseUrl}/${properLeague}`
      })
      return league
    } catch (e) {
      console.error(e)
    }
  }

    /**
   * Convert league nicknames into API-compliant values
   * Use mostly for college sports (i.e. NCAAM or NCB?)
   * @param {string} league
   * @return {string} proper league name
   */
  fixLeagueName(league) {
    if (['college football', 'ncaaf', 'cfb'].includes(league.toLowerCase())) {
      return 'college-football'
    } else if (['ncaam', 'mcb', 'ncb', 'mens college basketball'].includes(league.toLowerCase())) {
      return 'mens-college-basketball'
    } else if (
      ['ncaaw', 'wcb', 'ncw', 'womens college basketball'].includes(league.toLowerCase())
    ) {
      return 'womens-college-basketball'
    } else {
      return league.toLowerCase()
    }
  }

  Player(playerID) {
    return new Player(playerID, {
        league: null,
        sport: this.sport,
        baseUrl: `http://sports.core.api.espn.com/v2/sports/${this.sport}/athletes`
      })
  }
}