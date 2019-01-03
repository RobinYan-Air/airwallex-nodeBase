const is = require('is-type-of')
const SubscriberLoader = require('./subscriberLoader')

const defaultOptions = {
  files: [],
  inject: null
}

class AppLoader {
  constructor(options) {
    this.options = Object.assign({}, defaultOptions, options)

    this.target = options.target
  }

  load() {
    this.options.files.forEach(file => {
      const Module = require(file.path)

      if(is.class(Module)) {
        this.target[file.name] = new Module(this.options.inject)
        return
      }

      if(is.function(Module)) {
        this.target[file.name] = Module(this.options.inject)
        return
      }

      if(is.object(Module) && typeof Module['subscriber'] === 'function') {
        this.target[file.name] = new SubscriberLoader(Module, this.options.app, this.options.inject).load()
        return
      }
    })
  }
}

module.exports = AppLoader
