const base = 'http://site.api.espn.com/apis/site/v2/sports/'

const get_sport = (league) => {
  let sport

  switch (league) {
    case 'college-football':
    case 'nfl':
      sport = 'football'
      break
    case 'mens-college-basketball':
    case 'womens-college-backetball':
    case 'nba':
    case 'wnba':
      sport = 'basketball'
      break
    case 'college-basketball':
    case 'mlb':
      sport = 'baseball'
      break
    case 'nhl':
      sport = 'hockey'
      break
    default:
      // * ASSUME SOCCER, sport = soccer
      sport = 'soccer'
  }

  return sport
}

const get_conference_id = (conference) => {
  //get conference id from a conference name/abbreviation
}

const get_news = (league) => {}

const get_scoreboard = (league) => {}

const get_team = (league, team) => {
  //'team' can be teamID or abbreviation
}

const get_team_schedule = (league, teamID) => {}

const get_game = (league, gameID) => {}

const get_game_probability = (league, gameID) => {}

const get_game_odds = (league, gameID) => {}

const get_rankings = (league) => {
  //'leaderboard' for things like golf, 'rankings' for team sports
}
