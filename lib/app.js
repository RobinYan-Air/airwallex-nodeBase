const FunseeApplication = require('./core/funsee')

class Application extends FunseeApplication {
  constructor(options) {
    options = options || {}

    super(options)

    this.app = this
    this.loader.load()
  }

  ready(callback) {
    // TODO check application status
    callback()
  }
}

module.exports = Application
