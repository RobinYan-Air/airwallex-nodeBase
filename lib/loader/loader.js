const fs = require('fs')

const AppLoader = require('./AppLoader')

const LOADER_PATH = Symbol('loader#path')

const _resolveSingleModule = (filepath) => {
  try {
    return require.resolve(filepath);
  } catch (e) {
    return undefined;
  }
}

const _resolveModule = (folderPath, filename) => {
  if(filename) {
    return {
      path:_resolveSingleModule(`${folderPath}/${filename}`),
      name: filename.split('.')[0]
    }
  }

  return fs.existsSync(folderPath) ? fs.readdirSync(folderPath).map(filename => _resolveModule(folderPath, filename)) : []
}

class Loader {
  constructor(options) {
    this.options = options
    this.app = this.options.app

    this.env = this.app.serverEnv = this.getEnv()

    const Path = this[LOADER_PATH]
    this.path = new Path({
      baseDir: options.baseDir
    })
  }

  attachModuleToApp(files, type, options) {
    const target = this.app[type] = this.app[type] || {}
    const opt = Object.assign({}, {
      files,
      target
    }, options)

    new AppLoader(opt).load()
  }

  resolveModule(type, filename) {
    if (!this.path[type]) return undefined
    const folderPath = this.path[type]

    return _resolveModule(folderPath, filename)
  }

  get [LOADER_PATH]() {
    return require('../utils/path')
  }

  getEnv() {
    return process.env.FUNSEE_ENV || process.env.NODE_ENV || 'local'
  }
}

const loaders = [
  require('./mixin/config'),
  require('./mixin/controller'),
  require('./mixin/service'),
  require('./mixin/router'),
  require('./mixin/middleware'),
  require('./mixin/plugin')
]

for (const loader of loaders) {
  Object.assign(Loader.prototype, loader);
}

module.exports = Loader
