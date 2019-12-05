const { get } = require('unirest')

const LeaugeClass = require('./core/League')

module.exports = class ESPN {
  League(leagueName) {
    return new LeaugeClass(leagueName)
  }
}
