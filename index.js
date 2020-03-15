const Sport = require('./core/Sport')

module.exports = class ESPN {
  Sport(sportName) {
    try {
      const properSport = this.fixSportName(sportName)
      const sport = new Sport(properSport, {
        baseUrl: `https://site.api.espn.com/apis/site/v2/sports/${properSport}`
      })
      return sport
    } catch (e) {
      console.error(e)
    }
  }

  /**
   * Convert sport nicknames into API-compliant values
   * @param {string} sport
   * @return {string} proper sport name
   */
  fixSportName(sport) {
    if (['mixed martial arts'].includes(sport.toLowerCase())) {
      return 'mma'
    }
    if (['futbol'].includes(sport.toLowerCase())) {
      return 'soccer'
    }
    return sport.toLowerCase()
  }
}
