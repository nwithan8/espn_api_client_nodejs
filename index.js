const urljoin = require('urljoin')
const { get } = require('unirest')

module.exports = class ESPN {
  constructor(league) {
    this.baseUrl = 'http://site.api.espn.com/apis/site/v2/sports'
    this.league = league
    this.sport = this.getSport(league)
  }

  getSport(league) {
    switch (league) {
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

  getConferenceID(conference) {
    //get conference id from a conference name/abbreviation
  }

  getNews(sport, league) {}

  getScoreboard(sport, league) {}

  getTeam(sport, league, team) {
    //'team' can be teamID or abbreviation
  }

  getTeamSchedule(sport, league, teamID) {}

  getGame(sport, league, gameID) {}

  getGameProbability(sport, league, gameID) {}

  getGameOdds(sport, league, gameID) {}

  getRankings(sport, league) {
    //'leaderboard' for things like golf, 'rankings' for team sports
  }
}
