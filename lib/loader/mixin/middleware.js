module.exports = {
  loadMiddleware() {
    this.app.logger.silly('Start loading middlewares...', 'Core', 'Middleware')

    const mids = this.config.middlewares
    if (!Array.isArray(mids)) {
      return
    }

    // middleware sort
    const midObjArr = mids
      .map(mid => {
        const name = mid.split('$')[0]
        const sort = mid.split('$')[1] || 9999
        const param = this.config[name] || {}
        return {
          name,
          param,
          sort
        }
      })
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
        this.app.logger.silly(`Loading middleware: ${sort} --- ${param.desc || name}`, 'Core', 'Middleware')
        this.app.use(this.app.middlewares[name])
        continue
      }

      filePath = require.resolve(name)

      if(filePath) {
        this.attachModuleToApp([{path:filePath, name}], 'middlewares', {
          inject: param
        })
        this.app.logger.silly(`Loading middleware: ${sort} --- ${param.desc || name}`, 'Core', 'Middleware')
        this.app.use(this.app.middlewares[name])
        continue
      }

      throw Error(`Middleware<${name}> could not be found`)
    }
  }
}
