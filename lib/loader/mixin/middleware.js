module.exports = {
  loadMiddleware() {
    this.app.logger.silly('load middlewares')

    const mids = this.config.middlewares
    if (!Array.isArray(mids)) {
      return
    }

    for(const mid of mids) {
      let filePath = this.resolveModule('middleware', mid)
      const midConfig = this.config[mid]

      if(filePath.path) {
        this.attachModuleToApp([filePath], 'middlewares', {
          inject: {
            app: this.app,
            param: midConfig
          }
        })
        this.app.use(this.app.middlewares[mid])
        continue
      }

      filePath = require.resolve(mid)

      if(filePath) {
        this.attachModuleToApp([{path:filePath, name: mid}], 'middlewares', {
          inject: midConfig
        })
        this.app.use(this.app.middlewares[mid])
        continue
      }

      throw Error(`Middleware<${mid}> could not be found`)
    }
  }
}
