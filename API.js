const base = 'http://site.api.espn.com/apis/site/v2/sports/'

const get_sport = (league) => {
  // if league = college-football or nfl, sport = football
  // if league = mens-college-basketball, womens-college-basketball, nba or wnba, sport = basketball
  // if league = college-baseball or mlb, sport = baseball
  // if league = nhl, sport = hockey
  // else: ASSUME SOCCER, sport = soccer
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
