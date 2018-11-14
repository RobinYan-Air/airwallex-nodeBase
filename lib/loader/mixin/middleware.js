module.exports = {
  loadMiddleware() {
    this.app.logger.silly('load middlewares')

    const mids = this.config.middlewares
    if (!Array.isArray(mids)) {
      return
    }

    // middleware sort
    const midObjArr = mids
    .map(mid => ({
      name: mid,
      param: this.config[mid] || {}
    }))
    .sort((a, b) => (a.param.sort || 9999) - (b.param.sort || 9999))

    for(const {name, param} of midObjArr) {
      let filePath = this.resolveModule('middleware', name)

      if(filePath.path) {
        this.attachModuleToApp([filePath], 'middlewares', {
          inject: {
            app: this.app,
            param: param
          }
        })
        this.app.logger.silly(`loading middleware: ${param.sort || 9999} --- ${param.desc || name}`)
        this.app.use(this.app.middlewares[name])
        continue
      }

      filePath = require.resolve(name)

      if(filePath) {
        this.attachModuleToApp([{path:filePath, name}], 'middlewares', {
          inject: param
        })
        this.app.logger.silly(`loading middleware: ${param.sort || 9999} --- ${param.desc || name}`)
        this.app.use(this.app.middlewares[name])
        continue
      }

      throw Error(`Middleware<${name}> could not be found`)
    }
  }
}
