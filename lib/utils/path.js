const { join } = require('path')

const BASE_DIR = Symbol('path#baseDir')
const APP_DIR = Symbol('path#appDir')
const ROUTER_DIR = Symbol('path#routerDir')
const CONTROLLER_DIR = Symbol('path#controllerDir')
const MIDDLEWARE_DIR = Symbol('path#middlewareDir')
const CONFIG_DIR = Symbol('path#config')
const PLUGIN_DIR = Symbol('path#pluginDir')
const SERVICE_DIR = Symbol('path#serviceDir')

class Path {
  constructor({baseDir}) {
    this[BASE_DIR] = baseDir || process.cwd()

    this._initPath()
  }

  _initPath() {
    this[APP_DIR] = join(this[BASE_DIR], 'app')
    this[ROUTER_DIR] = join(this[BASE_DIR], 'app', 'router')
    this[CONTROLLER_DIR] = join(this[BASE_DIR], 'app', 'controller')
    this[MIDDLEWARE_DIR] = join(this[BASE_DIR], 'middleware')
    this[CONFIG_DIR] = join(this[BASE_DIR], 'config')
    this[PLUGIN_DIR] = join(this[BASE_DIR], 'plugin')
    this[SERVICE_DIR] = join(this[BASE_DIR], 'app', 'service')
  }

  get base() {
    return this[BASE_DIR]
  }

  get app() {
    return this[APP_DIR]
  }

  get controller() {
    return this[CONTROLLER_DIR]
  }

  get router() {
    return this[ROUTER_DIR]
  }

  get config() {
    return this[CONFIG_DIR]
  }

  get middleware() {
    return this[MIDDLEWARE_DIR]
  }

  get plugin() {
    return this[PLUGIN_DIR]
  }

  get service() {
    return this[SERVICE_DIR]
  }
}

module.exports = Path
