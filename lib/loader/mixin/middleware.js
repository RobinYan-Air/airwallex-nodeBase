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
      name: mid.split('$')[0],
      param: this.config[mid] || {},
      sort: mid.split('$')[1] || 9999
    }))
    .sort((a, b) => (a.sort - b.sort))

    for(const {name, param, sort} of midObjArr) {
      let filePath = this.resolveModule('middleware', name)

      if(filePath.path) {
        this.attachModuleToApp([filePath], 'middlewares', {
          inject: {
            app: this.app,
            param: param
          }
        })
        this.app.logger.silly(`loading middleware: ${sort} --- ${param.desc || name}`)
        this.app.use(this.app.middlewares[name])
        continue
      }

      filePath = require.resolve(name)

      if(filePath) {
        this.attachModuleToApp([{path:filePath, name}], 'middlewares', {
          inject: param
        })
        this.app.logger.silly(`loading middleware: ${sort} --- ${param.desc || name}`)
        this.app.use(this.app.middlewares[name])
        continue
      }

      throw Error(`Middleware<${name}> could not be found`)
    }
  }
}
