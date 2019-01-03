const Loader = require('../loader/loader')

class ApplicationLoader extends Loader {
  constructor(options) {
    super(options)
  }

  load() {
    this.loadConfig()
    this.loadPlugin()
    this.loadMiddleware()
    this.loadService()
    this.loadController()
    this.loadRouter()
    this.loadSubscriber()
  }
}

module.exports = ApplicationLoader
