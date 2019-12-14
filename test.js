const ESPN = require('.')

const main = async () => {
  const espn = new ESPN()
  const league = espn.League('college-football')
  const currentGames = await league.getCurrentGames()
  // await league.getTeams()
  // const SEC = await league.Conference('8')
  // console.log(await SEC.getTeams())


  // console.log(currentGames)
  const game = currentGames[0]
  // console.log(game)
  await game.makeGame()
  console.log(game)
  /* console.log(await game.getGameOdds())
  console.log(game.spread)
  console.log(team.teamID)
  console.log(await team.getTeamLogoURL()) */
  // console.log(await team.getJson())
  // console.log(await team.getTeamRoster())
  // await team.makeTeam()
  // console.log(team.schedule)
  // const schedule = await team.getTeamSchedule()
  // const game1 = schedule[0]
  // console.log(await game1.getJson())
  /* game = await league.Game('401128117')
  console.log(game)
  console.log(game.baseUrl)
  console.log(await game.getJson())
  const player = await league.Player('101')
  await player.updatePlayerInfo()
  console.log(player) */
}
main()
