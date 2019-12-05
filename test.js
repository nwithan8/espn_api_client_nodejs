const ESPN = require('.')

const main = async () => {
  const espn = new ESPN()
  const league = espn.League('mens-college-basketball')
  const team = await league.Team('ucla')

  // const league = espn.League('nfl')
  // console.log(league)
  // const team = league.Team('patriots')
  // console.log(team)
}

main()
