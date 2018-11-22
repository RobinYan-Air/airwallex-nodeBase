const KoaApplication = require('koa')

const Router = require('../utils/router')
const Logger = require('../utils/logger')

const FUNSEE_LOADER = Symbol('funsee#loader')
const FUNSEE_ROUTER = Symbol('funsee#router')
const FUNSEE_LOGGER = Symbol('funsee#logger')

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
}

module.exports = Funsee
