const KoaApplication = require('koa')
const event = require('events')

const Router = require('../utils/router')
const Logger = require('../utils/logger')

const FUNSEE_LOADER = Symbol('funsee#loader')
const FUNSEE_ROUTER = Symbol('funsee#router')
const FUNSEE_LOGGER = Symbol('funsee#logger')
const FUNSEE_EVENTS = Symbol('funsee#events')

class Funsee extends KoaApplication {
  constructor(options) {
    super()
    options.baseDir = options.baseDir || process.cwd();

    this.options = options

    const Loader = this[FUNSEE_LOADER]
    this.loader = new Loader({
      app: this,
      baseDir: options.baseDir
    })
    this[FUNSEE_EVENTS] = new event.EventEmitter()
  }

  get [FUNSEE_LOADER]() {
    return require('./applicationLoader')
  }

  get logger() {
    if(this[FUNSEE_LOGGER]) return this[FUNSEE_LOGGER]

    const logger = this[FUNSEE_LOGGER] = new Logger(this)
    return logger
  }

  get router() {
    if(this[FUNSEE_ROUTER]) return this[FUNSEE_ROUTER]
    this.logger.silly('Server router attached', 'Core', 'Router')
    const router = this[FUNSEE_ROUTER] = new Router({
      // prefix: '/api'
    }, this)
    this.use(router.routes()).use(router.allowedMethods())
    return router
  }

  get config() {
    return this.loader ? this.loader.config : {}
  }

  get event() {
    return this[FUNSEE_EVENTS]
  }

  done(eventName, args) {
    this[FUNSEE_EVENTS].emit(eventName, args)
  }
}

module.exports = Funsee
