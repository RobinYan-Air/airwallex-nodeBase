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

  handleStart() {
    this.event.emit('SEVER_START', this)
  }

  handleError() {
    this.event.emit('SEVER_ERROR', this)
  }

  handleClose() {
    this.event.emit('SEVER_CLOSE', this.app)
  }
}

module.exports = Application
